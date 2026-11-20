#!/usr/bin/env bash
# Exercita a API do portal com chamadas reais e grava as respostas como evidência.
# Uso (na raiz do repositório, com os containers de pé):
#   bash ~/evidencia-api.sh                 # grava em ~/evidencia-api.md
#   SEM_PRAZO=1 bash ~/evidencia-api.sh     # pula a espera de 155 s do prazo
# Contas e dados são fictícios. Rode com o banco recém-criado (docker compose down -v).

set -u
BASE="${BASE_URL:-http://localhost:8080/api}"
SAIDA="${1:-$HOME/evidencia-api.md}"
TMP="$(mktemp)"; HDR="$(mktemp)"
trap 'rm -f "$TMP" "$HDR"' EXIT
RESUMO=()

for cmd in curl python3 docker; do
  command -v "$cmd" >/dev/null || { echo "Falta o comando: $cmd"; exit 1; }
done
[ -f compose.yaml ] || { echo "Rode na raiz do repositório (onde fica o compose.yaml)."; exit 1; }

bonito() { python3 -c '
import json,sys
t=sys.stdin.read()
try: d=json.loads(t)
except Exception: print(t); sys.exit()
def corta(o):
    if isinstance(o,dict): return {k:(v[:20]+"..." if k=="token" and isinstance(v,str) else corta(v)) for k,v in o.items()}
    if isinstance(o,list): return [corta(x) for x in o]
    return o
print(json.dumps(corta(d),ensure_ascii=False,indent=2))'; }

campo() { python3 -c '
import json,sys
d=json.load(sys.stdin)
for k in sys.argv[1].split("."):
    d=d[int(k)] if isinstance(d,list) else d[k]
print("" if d is None else json.dumps(d) if isinstance(d,bool) else d)' "$1" 2>/dev/null; }

# requisicao METODO CAMINHO [CORPO] [TOKEN]  -> preenche STATUS e RESP
requisicao() {
  local args=(-s -o "$TMP" -w '%{http_code}' -X "$1" "$BASE$2")
  [ -n "${3:-}" ] && args+=(-H 'Content-Type: application/json' --data-raw "$3")
  [ -n "${4:-}" ] && args+=(-H "Authorization: Bearer $4")
  STATUS="$(curl "${args[@]}")"; RESP="$(cat "$TMP")"
}

# registra TITULO ESPERADO METODO CAMINHO [CORPO] [TOKEN]  -> chama e grava no relatório
registra() {
  local titulo="$1" esperado="$2" metodo="$3" caminho="$4" corpo="${5:-}" token="${6:-}"
  requisicao "$metodo" "$caminho" "$corpo" "$token"
  confere "$titulo" "$esperado" "$STATUS"
  {
    echo "### $titulo"; echo
    echo '```http'; echo "$metodo /api$caminho"
    [ -n "$token" ] && echo "Authorization: Bearer ${token:0:20}..."
    [ -n "$corpo" ] && { echo; echo "$corpo"; }
    echo '```'; echo
    echo "Status: **$STATUS** (esperado $esperado)"; echo
    echo '```json'; echo "$RESP" | bonito; echo '```'; echo
  } >> "$SAIDA"
}

confere() { RESUMO+=("$1|$2|$3"); }

gabarito() {
  docker compose exec -T db sh -c "psql -U \"\$POSTGRES_USER\" -d \"\$POSTGRES_DB\" -tAc \"SELECT letra FROM servidor.alternativas WHERE questao_id=$1 AND correta\"" | tr -d '[:space:]'
}
errada() { for l in A B C D; do [ "$l" != "$1" ] && { echo "$l"; return; }; done; }

# ---------------------------------------------------------------------------
{
  echo "# Evidência de chamadas reais à API"; echo
  echo "- Gerado em: $(date '+%d/%m/%Y %H:%M:%S %z')"
  echo "- Base: \`$BASE\` (pelo Nginx)"
  echo "- Commit: \`$(git rev-parse --short HEAD 2>/dev/null || echo '?')\` na branch \`$(git branch --show-current 2>/dev/null || echo '?')\`"
  echo "- Contas fictícias; tokens abreviados."; echo
} > "$SAIDA"

echo "== Parte 1: disponibilidade, cadastro e login"
echo "## 1. Disponibilidade, cadastro e login" >> "$SAIDA"; echo >> "$SAIDA"
registra "GET /saude" 200 GET /saude
registra "GET /temas" 200 GET /temas
C1='{"cpf":"11144477735","nome":"Maria Teste","email":"maria.teste@exemplo.invalid","senha":"senha-teste-123"}'
registra "Cadastro" 201 POST /candidatos "$C1"
if [ "$STATUS" = "409" ]; then
  echo "A conta de teste já existe. Recrie o banco (docker compose down -v && docker compose up -d --wait) e rode de novo."
  exit 1
fi
[ "$STATUS" = "201" ] || { echo "Cadastro falhou ($STATUS). Confira se a API está de pé em $BASE."; exit 1; }
registra "Cadastro repetido" 409 POST /candidatos "$C1"
registra "Cadastro com CPF inválido" 400 POST /candidatos '{"cpf":"123","nome":"Maria Teste","email":"maria.teste@exemplo.invalid","senha":"senha-teste-123"}'
registra "Corpo que não é JSON válido" 400 POST /candidatos '{"cpf":'
registra "Login com senha errada" 401 POST /login '{"cpf":"11144477735","senha":"senha-errada"}'
registra "Login" 200 POST /login '{"cpf":"11144477735","senha":"senha-teste-123"}'
T1="$(echo "$RESP" | campo token)"
[ -n "$T1" ] || { echo "Não veio token no login."; exit 1; }

echo "== Parte 2: prova"
echo "## 2. Autenticação e prova" >> "$SAIDA"; echo >> "$SAIDA"
registra "Rota privada sem token" 401 GET /temas/proximo
registra "Rota privada com token inválido" 401 GET /temas/proximo "" "token-invalido"
registra "Próximo tema" 200 GET /temas/proximo "" "$T1"
registra "Sortear questão do tema 1" 200 POST /questoes/sortear "" "$T1"
Q1="$(echo "$RESP" | campo questao.questao.id)"; LIM1="$(echo "$RESP" | campo questao.data_horario_limite)"
registra "Sortear de novo com a questão aberta (retomada)" 200 POST /questoes/sortear "" "$T1"
Q1b="$(echo "$RESP" | campo questao.questao.id)"; LIM1b="$(echo "$RESP" | campo questao.data_horario_limite)"
[ "$Q1" = "$Q1b" ] && [ "$LIM1" = "$LIM1b" ] && confere "Retomada mantém questão e prazo" "igual" "igual" || confere "Retomada mantém questão e prazo" "igual" "diferente"
registra "Consultar a questão sorteada" 200 GET "/questoes/$Q1" "" "$T1"

curl -s -D "$HDR" -o "$TMP" -w '%{http_code}' "$BASE/imagens/$Q1" > "$TMP.st"; ST="$(cat "$TMP.st")"; rm -f "$TMP.st"
confere "Imagem da questão" 200 "$ST"
{
  echo "### Imagem da questão"; echo
  echo '```http'; echo "GET /api/imagens/$Q1"; echo '```'; echo
  echo "Status: **$ST** (esperado 200). Tamanho: $(wc -c < "$TMP") bytes. Cabeçalhos relevantes:"; echo
  echo '```http'; grep -iE '^(content-type|content-security-policy|x-content-type-options):' "$HDR" | tr -d '\r'; echo '```'; echo
} >> "$SAIDA"

registra "Resposta com letra inválida" 400 POST "/questoes/$Q1/responder" '{"letra_resposta":"X"}' "$T1"
registra "Certificado antes de concluir" 409 POST /candidatos/certificado "" "$T1"
G1="$(gabarito "$Q1")"
registra "Responder tema 1 (letra correta)" 200 POST "/questoes/$Q1/responder" "{\"letra_resposta\":\"$G1\"}" "$T1"
registra "Responder a mesma questão de novo" 409 POST "/questoes/$Q1/responder" "{\"letra_resposta\":\"$G1\"}" "$T1"

echo "== Parte 3: temas 2 a 12"
echo "## 3. Temas 2 a 12" >> "$SAIDA"; echo >> "$SAIDA"
LINHAS=()
for n in $(seq 2 12); do
  requisicao POST /questoes/sortear "" "$T1"; confere "Sortear tema $n" 200 "$STATUS"
  Q="$(echo "$RESP" | campo questao.questao.id)"; G="$(gabarito "$Q")"
  [ "$n" = 5 ] && Q5="$Q"
  if [ "$n" = 2 ]; then
    registra "Interromper a questão do tema 2" 200 POST "/questoes/$Q/interromper" "" "$T1"
    LINHAS+=("$n|$Q|(interrompida)|$G|$(echo "$RESP" | campo acertou)|$STATUS")
  elif [ "$n" = 3 ]; then
    L="$(errada "$G")"
    registra "Responder tema 3 (letra errada)" 200 POST "/questoes/$Q/responder" "{\"letra_resposta\":\"$L\"}" "$T1"
    LINHAS+=("$n|$Q|$L|$G|$(echo "$RESP" | campo acertou)|$STATUS")
    registra "Progresso depois do tema 3" 200 GET /candidatos/progresso "" "$T1"
  else
    requisicao POST "/questoes/$Q/responder" "{\"letra_resposta\":\"$G\"}" "$T1"
    confere "Responder tema $n" 200 "$STATUS"
    LINHAS+=("$n|$Q|$G|$G|$(echo "$RESP" | campo acertou)|$STATUS")
  fi
done
{
  echo "### Resumo das respostas dos temas 2 a 12"; echo
  echo "| Tema | Questão | Letra enviada | Gabarito | acertou | Status |"; echo "|---|---|---|---|---|---|"
  for l in "${LINHAS[@]}"; do echo "| ${l//|/ | } |"; done; echo
} >> "$SAIDA"

echo "== Parte 4: resultado e certificado"
echo "## 4. Conclusão, histórico, resultado e certificado" >> "$SAIDA"; echo >> "$SAIDA"
registra "Sortear depois dos 12 temas" 200 POST /questoes/sortear "" "$T1"
registra "Próximo tema depois dos 12 temas" 200 GET /temas/proximo "" "$T1"
registra "Histórico" 200 GET /candidatos/historico "" "$T1"
registra "Resultado" 200 GET /candidatos/resultado "" "$T1"
registra "Emitir certificado" 200 POST /candidatos/certificado "" "$T1"
H="$(echo "$RESP" | campo certificado_hash)"
requisicao POST /candidatos/certificado "" "$T1"
[ "$(echo "$RESP" | campo certificado_hash)" = "$H" ] && confere "Segunda emissão mantém o código" "igual" "igual" || confere "Segunda emissão mantém o código" "igual" "diferente"
registra "Validação pública do certificado" 200 GET "/certificados/$H"
registra "Validação com código em formato inválido" 404 GET /certificados/abc
registra "Rota inexistente" 404 GET /rota-que-nao-existe

echo "== Parte 5: segundo candidato"
echo "## 5. Segundo candidato: isolamento e prazo" >> "$SAIDA"; echo >> "$SAIDA"
registra "Cadastro do segundo candidato" 201 POST /candidatos '{"cpf":"52998224725","nome":"Joao Teste","email":"joao.teste@exemplo.invalid","senha":"senha-teste-456"}'
registra "Login do segundo candidato" 200 POST /login '{"cpf":"52998224725","senha":"senha-teste-456"}'
T2="$(echo "$RESP" | campo token)"
registra "Sortear (segundo candidato)" 200 POST /questoes/sortear "" "$T2"
Q2="$(echo "$RESP" | campo questao.questao.id)"
registra "Consultar questão de outro candidato" 404 GET "/questoes/$Q5" "" "$T2"
if [ "${SEM_PRAZO:-0}" != "1" ]; then
  echo "   aguardando 155 s para o prazo de 150 s vencer..."
  sleep 155
  registra "Responder depois do prazo" 409 POST "/questoes/$Q2/responder" '{"letra_resposta":"A"}' "$T2"
  registra "Histórico com questão expirada" 200 GET /candidatos/historico "" "$T2"
fi

# ---------------------------------------------------------------------------
OK=0; TOTAL=${#RESUMO[@]}
{
  echo "## Conferência"; echo
  echo "| Verificação | Esperado | Obtido | |"; echo "|---|---|---|---|"
  for r in "${RESUMO[@]}"; do
    IFS='|' read -r t e o <<< "$r"
    if [ "$e" = "$o" ]; then m="OK"; OK=$((OK+1)); else m="DIVERGENTE"; fi
    echo "| $t | $e | $o | $m |"
  done
  echo; echo "**$OK de $TOTAL verificações conferem.**"
} >> "$SAIDA"
echo; echo "$OK de $TOTAL verificações conferem. Relatório: $SAIDA"
