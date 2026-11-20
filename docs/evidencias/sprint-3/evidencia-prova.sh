#!/usr/bin/env bash
# Evidência para a issue #97: sorteio, estrutura, histórico, duplicadas e concorrentes.
# Uso (na raiz do repositório, com os containers de pé):
#   bash ~/evidencia-prova.sh
# Não precisa recriar o banco: cada execução cria candidatos novos com CPF aleatório,
# e todas as consultas ao banco são filtradas por esses candidatos.
# Dados fictícios. Não altera nenhum arquivo do repositório.

set -u
BASE="${BASE_URL:-http://localhost:8080/api}"
SAIDA="${1:-$HOME/evidencia-prova.md}"
PAR="${PARALELAS:-6}"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
RESUMO=()

for c in curl python3 docker; do command -v "$c" >/dev/null || { echo "Falta o comando: $c"; exit 1; }; done
[ -f compose.yaml ] || { echo "Rode na raiz do repositório (onde fica o compose.yaml)."; exit 1; }

confere(){ RESUMO+=("$1|$2|$3|$4"); }   # criterio | verificacao | esperado | obtido
campo(){ python3 -c '
import json,sys
d=json.load(sys.stdin)
for k in sys.argv[1].split("."):
    d=d[int(k)] if isinstance(d,list) else d[k]
print("" if d is None else json.dumps(d) if isinstance(d,bool) else d)' "$1" 2>/dev/null; }
mostra(){ python3 -m json.tool < "$1" 2>/dev/null || cat "$1" 2>/dev/null || echo "(sem resposta)"; }
# Erros de SQL não podem sumir: um valor vazio viraria uma divergência enganosa.
sql(){ local out
  out="$(docker compose exec -T db sh -c "psql -v ON_ERROR_STOP=1 -U \"\$POSTGRES_USER\" -d \"\$POSTGRES_DB\" -tAc \"$1\"" 2>&1 | tr -d '\r')"
  case "$out" in
    *ERROR:*|*FATAL:*|*"could not"*) echo "ERRO SQL em [$1]: $out" >&2; printf 'erro-sql'; return 1;;
  esac
  printf '%s' "$out"; }

# novo_candidato APELIDO -> grava $TMP/tok_APELIDO e $TMP/cpf_APELIDO
novo_candidato(){
  local cpf nome st
  cpf="$(python3 -c 'import random;print("".join(random.choice("0123456789") for _ in range(11)))')"
  nome="Teste $(date +%H%M%S)$RANDOM"
  st="$(curl -s -o "$TMP/nc" -w '%{http_code}' -X POST "$BASE/candidatos" -H 'Content-Type: application/json' \
       --data-raw "{\"cpf\":\"$cpf\",\"nome\":\"$nome\",\"email\":\"t$cpf@exemplo.invalid\",\"senha\":\"senha-teste-123\"}")"
  [ "$st" = "201" ] || { echo "ERRO: cadastro devolveu $st: $(cat "$TMP/nc")" >&2; return 1; }
  st="$(curl -s -o "$TMP/nc" -w '%{http_code}' -X POST "$BASE/login" -H 'Content-Type: application/json' \
       --data-raw "{\"cpf\":\"$cpf\",\"senha\":\"senha-teste-123\"}")"
  [ "$st" = "200" ] || { echo "ERRO: login devolveu $st" >&2; return 1; }
  campo token < "$TMP/nc" > "$TMP/tok_$1"
  printf '%s' "$cpf" > "$TMP/cpf_$1"
  [ -s "$TMP/tok_$1" ] || { echo "ERRO: login não devolveu token" >&2; return 1; }
}
req(){ local a=(-s -o "$TMP/r" -w '%{http_code}' -X "$1" "$BASE$2")
  [ -n "${3:-}" ] && a+=(-H 'Content-Type: application/json' --data-raw "$3")
  [ -n "${4:-}" ] && a+=(-H "Authorization: Bearer $4")
  STATUS="$(curl "${a[@]}")"; RESP="$(cat "$TMP/r")"; }
gabarito(){ local g; g="$(sql "SELECT letra FROM servidor.alternativas WHERE questao_id=$1 AND correta" | tr -d '[:space:]')"
  case "$g" in A|B|C|D) printf '%s' "$g";; *) echo "ERRO: gabarito inesperado para a questão $1: '$g'" >&2; return 1;; esac; }

{ echo "# Evidência — issue #97: prova, tempo, interrupção e retomada"; echo
  echo "- Gerado em: $(date '+%d/%m/%Y %H:%M:%S %z')"
  echo "- Base: \`$BASE\`"
  echo "- Commit: \`$(git rev-parse --short HEAD 2>/dev/null || echo '?')\` na branch \`$(git branch --show-current 2>/dev/null || echo '?')\`"
  echo "- Candidatos fictícios criados por esta execução. As consultas ao banco são filtradas"
  echo "  por esses candidatos, para não misturar com dados de outras execuções."; echo
  echo "Cada seção indica o critério de aceite e os requisitos que exercita."; echo
} > "$SAIDA"

# ---------------------------------------------------------------- A. estrutura
echo "== A. Estrutura da base (RF05, RF06, RF08)"
T=$(sql "SELECT count(*) FROM servidor.temas")
Q=$(sql "SELECT count(*) FROM servidor.questoes")
QT=$(sql "SELECT count(*) FROM (SELECT tema_id FROM servidor.questoes GROUP BY tema_id HAVING count(*)<>4) x")
AQ=$(sql "SELECT count(*) FROM (SELECT questao_id FROM servidor.alternativas GROUP BY questao_id HAVING count(*)<>4) x")
CQ=$(sql "SELECT count(*) FROM (SELECT questao_id FROM servidor.alternativas GROUP BY questao_id HAVING count(*) FILTER (WHERE correta)<>1) x")
LT=$(sql "SELECT count(*) FROM (SELECT questao_id FROM servidor.alternativas GROUP BY questao_id HAVING string_agg(letra::text,'' ORDER BY letra)<>'ABCD') x")
SI=$(sql "SELECT count(*) FROM servidor.questoes WHERE imagem_url IS NULL OR btrim(imagem_url)=''")
QIDS=$(sql "SELECT id FROM servidor.questoes ORDER BY id")
NQ=$(printf '%s\n' "$QIDS" | grep -c .)
FI=0; for i in $QIDS; do
  [ "$(curl -s -o /dev/null -w '%{http_code}' "$BASE/imagens/$i")" = "200" ] || FI=$((FI+1)); done
confere 1 "Temas cadastrados" 12 "$T"
confere 1 "Questões cadastradas" 48 "$Q"
confere 1 "Temas sem exatamente 4 questões" 0 "$QT"
confere 1 "Questões sem exatamente 4 alternativas" 0 "$AQ"
confere 1 "Questões sem exatamente 1 correta" 0 "$CQ"
confere 1 "Questões cujas letras não são A–D" 0 "$LT"
confere 1 "Questões sem imagem" 0 "$SI"
confere 1 "Imagens que não abrem (de $NQ consultadas)" 0 "$FI"
{ echo "## A. Estrutura da base — critério 1 (RF05, RF06, RF08)"; echo
  echo "Consultas diretas ao schema \`servidor\` e uma chamada a \`/api/imagens/:id\` para cada"
  echo "identificador existente na tabela de questões."; echo
  echo "| Verificação | Esperado | Obtido |"; echo "|---|---|---|"
  echo "| Temas | 12 | $T |"; echo "| Questões | 48 | $Q |"
  echo "| Temas sem exatamente 4 questões | 0 | $QT |"
  echo "| Questões sem exatamente 4 alternativas | 0 | $AQ |"
  echo "| Questões sem exatamente 1 alternativa correta | 0 | $CQ |"
  echo "| Questões cujas letras não são A, B, C e D | 0 | $LT |"
  echo "| Questões sem imagem associada | 0 | $SI |"
  echo "| Imagens que não respondem 200 (de $NQ) | 0 | $FI |"; echo
} >> "$SAIDA"

# ------------------------------------------------- B. sorteio concorrente
echo "== B. Sorteio concorrente (RF06)"
novo_candidato a || exit 1
TK="$(cat "$TMP/tok_a")"; CPF_A="$(cat "$TMP/cpf_a")"
for i in $(seq 1 "$PAR"); do
  ( curl -s -X POST "$BASE/questoes/sortear" -H "Authorization: Bearer $TK" -o "$TMP/s$i" -w '%{http_code}' > "$TMP/sc$i" ) &
done; wait
IDS=""; LIMS=""
for i in $(seq 1 "$PAR"); do
  IDS="$IDS$(campo questao.questao.id < "$TMP/s$i")\n"
  LIMS="$LIMS$(campo questao.data_horario_limite < "$TMP/s$i")\n"
done
UQ=$(printf "%b" "$IDS" | sort -u | grep -c .); ULIM=$(printf "%b" "$LIMS" | sort -u | grep -c .)
QA=$(printf "%b" "$IDS" | grep -m1 '^[0-9][0-9]*$' || true)
[ -n "$QA" ] || { echo "ERRO: nenhum sorteio devolveu questão. Status: $(for i in $(seq 1 $PAR); do printf '%s ' "$(cat "$TMP/sc$i")"; done)"; exit 1; }
ABERTAS=$(sql "SELECT count(*) FROM servidor.respostas r JOIN servidor.candidatos c ON c.id=r.candidato_id WHERE c.cpf='$CPF_A' AND r.data_horario_resposta IS NULL")
confere 1 "Questões distintas em $PAR sorteios simultâneos" 1 "$UQ"
confere 1 "Prazos distintos em $PAR sorteios simultâneos" 1 "$ULIM"
confere 3 "Questões abertas no banco para este candidato" 1 "$ABERTAS"
{ echo "## B. Sorteio concorrente — critérios 1 e 3 (RF06)"; echo
  echo "$PAR chamadas simultâneas a \`POST /api/questoes/sortear\` para o mesmo candidato,"
  echo "recém-criado e sem nenhuma questão anterior."; echo
  echo "| Verificação | Esperado | Obtido |"; echo "|---|---|---|"
  echo "| Questões distintas devolvidas | 1 | $UQ |"
  echo "| Prazos distintos devolvidos | 1 | $ULIM |"
  echo "| Questões abertas gravadas para este candidato | 1 | $ABERTAS |"; echo
  echo "Questão sorteada: \`$QA\`. Status das chamadas: $(for i in $(seq 1 $PAR); do printf '%s ' "$(cat "$TMP/sc$i")"; done)"; echo
} >> "$SAIDA"

# ------------------------------------------- C. resposta duplicada concorrente
echo "== C. Resposta duplicada e concorrente (RF15)"
G="$(gabarito "$QA")" || exit 1
for i in $(seq 1 "$PAR"); do
  ( curl -s -X POST "$BASE/questoes/$QA/responder" -H "Authorization: Bearer $TK" \
      -H 'Content-Type: application/json' -d "{\"letra_resposta\":\"$G\"}" \
      -o "$TMP/d$i" -w '%{http_code}' > "$TMP/dc$i" ) &
done; wait
N200=0; N409=0; OUTRO=0
for i in $(seq 1 "$PAR"); do case "$(cat "$TMP/dc$i")" in 200) N200=$((N200+1));; 409) N409=$((N409+1));; *) OUTRO=$((OUTRO+1));; esac; done
GRAVADAS=$(sql "SELECT count(*) FROM servidor.respostas r JOIN servidor.candidatos c ON c.id=r.candidato_id WHERE c.cpf='$CPF_A' AND r.questao_id=$QA AND r.data_horario_resposta IS NOT NULL")
AINDA=$(sql "SELECT count(*) FROM servidor.respostas r JOIN servidor.candidatos c ON c.id=r.candidato_id WHERE c.cpf='$CPF_A' AND r.data_horario_resposta IS NULL")
confere 3 "Respostas aceitas (200) em $PAR envios simultâneos" 1 "$N200"
confere 3 "Respostas recusadas (409)" "$((PAR-1))" "$N409"
confere 3 "Respostas com outro status" 0 "$OUTRO"
confere 3 "Respostas gravadas para este candidato nesta questão" 1 "$GRAVADAS"
confere 3 "Questões que seguem abertas para este candidato" 0 "$AINDA"
{ echo "## C. Resposta duplicada e concorrente — critério 3 (RF15)"; echo
  echo "$PAR envios simultâneos da mesma letra para a questão \`$QA\` do candidato da seção B."; echo
  echo "| Verificação | Esperado | Obtido |"; echo "|---|---|---|"
  echo "| Aceitas com 200 | 1 | $N200 |"
  echo "| Recusadas com 409 | $((PAR-1)) | $N409 |"
  echo "| Outros status | 0 | $OUTRO |"
  echo "| Respostas gravadas no banco para esta questão | 1 | $GRAVADAS |"
  echo "| Questões que seguem abertas | 0 | $AINDA |"; echo
  ACEITA=""; RECUSADA=""
  for i in $(seq 1 "$PAR"); do
    [ -z "$ACEITA" ] && [ "$(cat "$TMP/dc$i")" = "200" ] && ACEITA="$TMP/d$i"
    [ -z "$RECUSADA" ] && [ "$(cat "$TMP/dc$i")" = "409" ] && RECUSADA="$TMP/d$i"
  done
  echo "Resposta aceita:"; echo; echo '```json'
  if [ -n "$ACEITA" ]; then mostra "$ACEITA"; else echo "(nenhuma resposta aceita)"; fi
  echo '```'; echo
  echo "Resposta recusada:"; echo; echo '```json'
  if [ -n "$RECUSADA" ]; then mostra "$RECUSADA"; else echo "(nenhuma resposta recusada)"; fi
  echo '```'; echo
} >> "$SAIDA"

# ------------------------------------------ D. prova completa sem repetir temas
echo "== D. Prova completa sem repetir temas (RF05, RF09, RF13, RF15, RF20)"
novo_candidato b || exit 1
TK2="$(cat "$TMP/tok_b")"; CPF_B="$(cat "$TMP/cpf_b")"
TEMAS=""; ERROS=0; INTERROMPIDA=""; TEMA_INT=""; GAB_INFO=""
for n in $(seq 1 12); do
  req POST /questoes/sortear "" "$TK2"; [ "$STATUS" = "200" ] || ERROS=$((ERROS+1))
  QID="$(echo "$RESP" | campo questao.questao.id)"; TID="$(echo "$RESP" | campo questao.questao.tema_id)"
  case "$QID" in ''|*[!0-9]*) echo "ERRO: sorteio $n não devolveu questão (status $STATUS)"; exit 1;; esac
  TEMAS="$TEMAS$TID\n"
  if [ "$n" = 4 ]; then
    req POST "/questoes/$QID/interromper" "" "$TK2"; [ "$STATUS" = "200" ] || ERROS=$((ERROS+1))
    INTERROMPIDA="$QID"; TEMA_INT="$TID"
  else
    GG="$(gabarito "$QID")" || exit 1
    req POST "/questoes/$QID/responder" "{\"letra_resposta\":\"$GG\"}" "$TK2"
    [ "$STATUS" = "200" ] || ERROS=$((ERROS+1))
    [ "$n" = 1 ] && GAB_INFO="$(echo "$RESP" | campo alternativa_correta)"
  fi
done
UT=$(printf "%b" "$TEMAS" | sort -u | grep -c .)
req POST /questoes/sortear "" "$TK2"; CONC="$(echo "$RESP" | campo concluido)"
req GET /candidatos/historico "" "$TK2"; printf '%s' "$RESP" > "$TMP/hist.json"
le(){ python3 -c "
import json,sys
d=json.load(open('$TMP/hist.json'))
obrig=['tema_id','tema','questao_id','enunciado','letra_resposta','data_horario_inicio','data_horario_resposta','acertou','valida','alternativa_correta']
modo=sys.argv[1]; qi=int(sys.argv[2])
if   modo=='n': print(len(d))
elif modo=='t': print(len({x['tema_id'] for x in d}))
elif modo=='c': print(sum(1 for x in d if any(k not in x for k in obrig)))
elif modo=='g': print(sum(1 for x in d if not x.get('alternativa_correta')))
elif modo=='int':
    x=[i for i in d if i['questao_id']==qi]
    print('ok' if x and x[0]['letra_resposta'] is None and x[0]['acertou'] is False else 'nao')
" "$1" "${INTERROMPIDA:-0}" 2>/dev/null; }
HN=$(le n); HT=$(le t); HC=$(le c); HG=$(le g); HINT=$(le int)
REPETIDOS=$(sql "SELECT count(*) FROM (SELECT r.tema_id FROM servidor.respostas r JOIN servidor.candidatos c ON c.id=r.candidato_id WHERE c.cpf='$CPF_B' GROUP BY r.tema_id HAVING count(*)>1) x")
confere 1 "Erros HTTP durante a prova completa" 0 "$ERROS"
confere 3 "Temas distintos em 12 sorteios" 12 "$UT"
confere 3 "Temas com mais de uma resposta no banco" 0 "$REPETIDOS"
confere 1 "Sorteio após os 12 temas" true "$CONC"
confere 1 "Registros no histórico" 12 "$HN"
confere 3 "Temas distintos no histórico" 12 "$HT"
confere 1 "Registros sem algum campo do RF20" 0 "$HC"
confere 1 "Registros sem gabarito informado" 0 "$HG"
confere 2 "Questão interrompida: sem letra e incorreta" ok "$HINT"
{ echo "## D. Prova completa sem repetir temas — critérios 1, 2 e 3"; echo
  echo "Segundo candidato percorre os 12 temas; o 4º é interrompido em vez de respondido."; echo
  echo "| Verificação | Esperado | Obtido |"; echo "|---|---|---|"
  echo "| Erros HTTP durante a prova | 0 | $ERROS |"
  echo "| Temas distintos nos 12 sorteios (RF05, RF15) | 12 | $UT |"
  echo "| Temas com mais de uma resposta no banco (RF15) | 0 | $REPETIDOS |"
  echo "| \`concluido\` no sorteio seguinte | true | $CONC |"
  echo "| Registros no histórico (RF20) | 12 | $HN |"
  echo "| Temas distintos no histórico | 12 | $HT |"
  echo "| Registros sem algum campo exigido pelo RF20 | 0 | $HC |"
  echo "| Registros sem gabarito informado (RF09) | 0 | $HG |"
  echo "| Questão interrompida sem letra e incorreta (RF13) | ok | $HINT |"; echo
  echo "Questão interrompida: \`$INTERROMPIDA\` (tema $TEMA_INT). Gabarito devolvido no tema 1: \`$GAB_INFO\`."; echo
  echo "Histórico completo:"; echo; echo '```json'; mostra "$TMP/hist.json"; echo '```'; echo
} >> "$SAIDA"

# --------------------------------------------- E. certificado concorrente
echo "== E. Emissão concorrente do certificado"
for i in $(seq 1 "$PAR"); do
  ( curl -s -X POST "$BASE/candidatos/certificado" -H "Authorization: Bearer $TK2" \
      -o "$TMP/c$i" -w '%{http_code}' > "$TMP/cc$i" ) &
done; wait
HS=""; for i in $(seq 1 "$PAR"); do HS="$HS$(campo certificado_hash < "$TMP/c$i")\n"; done
UH=$(printf "%b" "$HS" | sort -u | grep -c .)
NO_BANCO=$(sql "SELECT count(DISTINCT certificado_hash) FROM servidor.candidatos WHERE cpf='$CPF_B' AND certificado_hash IS NOT NULL")
confere 3 "Códigos distintos em $PAR emissões simultâneas" 1 "$UH"
confere 3 "Códigos gravados no banco para este candidato" 1 "$NO_BANCO"
{ echo "## E. Emissão concorrente do certificado — critério 3"; echo
  echo "$PAR chamadas simultâneas a \`POST /api/candidatos/certificado\` para o candidato da seção D."; echo
  echo "| Verificação | Esperado | Obtido |"; echo "|---|---|---|"
  echo "| Códigos distintos devolvidos | 1 | $UH |"
  echo "| Códigos gravados no banco | 1 | $NO_BANCO |"; echo
  echo "Código emitido: \`$(printf "%b" "$HS" | grep -m1 . || echo '(nenhum)')\`"; echo
} >> "$SAIDA"

# --------------------------------------------------------------- conferência
OK=0; TOTAL=${#RESUMO[@]}
{ echo "## Conferência por critério de aceite"; echo
  echo "| Critério | Verificação | Esperado | Obtido | |"; echo "|---|---|---|---|---|"
  for r in "${RESUMO[@]}"; do IFS='|' read -r c t e o <<< "$r"
    if [ "$e" = "$o" ]; then m="OK"; OK=$((OK+1)); else m="DIVERGENTE"; fi
    echo "| $c | $t | $e | $o | $m |"; done
  echo; echo "**$OK de $TOTAL verificações conferem.**"; echo
  echo "Legenda: 1 = sorteio, estrutura e histórico; 2 = tempo, interrupção e retomada;"
  echo "3 = duplicadas e concorrentes."
} >> "$SAIDA"
echo; echo "$OK de $TOTAL verificações conferem. Relatório: $SAIDA"
