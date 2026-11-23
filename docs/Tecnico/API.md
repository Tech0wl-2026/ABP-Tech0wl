# API do portal

Base local: `http://localhost:3001/api`. Pelo Nginx: `http://localhost:8080/api`.

Envie JSON com `Content-Type: application/json`. Rotas privadas exigem
`Authorization: Bearer TOKEN`. O token identifica o candidato; enviar outro
`candidato_id` no corpo não muda o titular da operação.

Os exemplos abaixo são respostas reais, registradas em 20/11/2026 com o ambiente do
Compose e contas fictícias. O registro completo, com 58 verificações, está em
[evidência das chamadas](../evidencias/sprint-3/evidencia-api-2026-11-20.md). Tokens
aparecem abreviados.

| Método e caminho | Acesso | Resposta |
|---|---|---|
| GET `/saude` | Público | Disponibilidade da API e do banco. |
| GET `/temas` | Público | Os 12 temas do grupo na ordem definida. |
| POST `/candidatos` | Público | Cadastro com CPF, nome, e-mail e senha. Retorna 201. |
| POST `/login` | Público | Token Bearer válido por uma hora e dados básicos do candidato. |
| GET `/temas/proximo` | Privado | Tema da questão aberta ou próximo tema pendente. |
| POST `/questoes/sortear` | Privado | Questão, alternativas sem gabarito, imagem, início e prazo. |
| GET `/questoes/:id` | Privado | Questão já sorteada para o titular, sem gabarito. |
| GET `/imagens/:id` | Público | SVG associado à questão. |
| POST `/questoes/:id/responder` | Privado | Grava a resposta e retorna gabarito, validade e resultado disponível. |
| POST `/questoes/:id/interromper` | Privado | Encerra a questão sem escolha, considerada incorreta. |
| GET `/candidatos/progresso` | Privado | Temas pendentes, em andamento e concluídos. |
| GET `/candidatos/historico` | Privado | Questões encerradas, escolhas, gabaritos e datas. |
| GET `/candidatos/resultado` | Privado | Contagem de temas/acertos; nota e percentual após os 12 temas. |
| POST `/candidatos/certificado` | Privado | Código e dados privados da emissão, somente com 12 temas e ≥65%. |
| GET `/certificados/:hash` | Público | Autenticidade, nome, percentual e data; sem CPF/e-mail. |

## Autenticação

O login devolve um JWT assinado em HS256, com validade de uma hora, `issuer`
`portal-certificacao-api` e `audience` `portal-certificacao`. O identificador do
candidato vai no campo `sub`; o token não carrega nome, e-mail nem permissões.

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Sem o cabeçalho, a API responde 401:

```json
{ "erro": "Use Authorization: Bearer TOKEN." }
```

Com token inválido, expirado ou com `sub` fora do formato, também 401:

```json
{ "erro": "Token inválido ou expirado." }
```

Não há renovação: terminada a hora, é preciso entrar de novo.

---

## Disponibilidade

### GET `/saude`

Consulta o banco antes de responder, por isso sustenta o healthcheck do container.

```json
{ "status": "ok" }
```

---

## Cadastro e login

### POST `/candidatos`

Requisição:

```json
{ "cpf": "11144477735", "nome": "Maria Teste",
  "email": "maria.teste@exemplo.invalid", "senha": "senha-teste-123" }
```

Resposta 201, sem senha e sem token:

```json
{ "id": 1, "cpf": "11144477735", "nome": "Maria Teste",
  "email": "maria.teste@exemplo.invalid", "criado_em": "2026-11-20T15:49:25.672Z" }
```

| Campo | Regra |
|---|---|
| `cpf` | String de 11 dígitos, sem pontuação. A API não confere os dígitos de controle; a tela de cadastro confere. |
| `nome` | De 1 a 100 caracteres. |
| `email` | Até 100 caracteres, no formato `nome@dominio`. |
| `senha` | No mínimo 6 caracteres e no máximo 72 bytes UTF-8, limite do bcrypt. |

CPF repetido responde 409:

```json
{ "erro": "Registro já existente." }
```

CPF fora do formato responde 400:

```json
{ "erro": "CPF deve conter 11 dígitos, sem pontuação." }
```

A senha é gravada como hash bcrypt de custo 12 e nunca é devolvida. Os identificadores
não são contínuos: uma tentativa de cadastro recusada também consome um número da
sequência do PostgreSQL.

### POST `/login`

Requisição:

```json
{ "cpf": "11144477735", "senha": "senha-teste-123" }
```

Resposta 200:

```json
{ "token": "eyJhbGciOiJIUzI1NiIs...", "tipo": "Bearer", "expira_em": 3600,
  "candidato": { "id": 1, "nome": "Maria Teste", "email": "maria.teste@exemplo.invalid" } }
```

CPF inexistente e senha errada devolvem a mesma resposta 401:

```json
{ "erro": "CPF ou senha incorretos." }
```

Quando o CPF não existe, a comparação ocorre contra um hash fictício, para que o tempo
de resposta não revele quais contas existem.

Cadastro e login compartilham o limite de 30 chamadas por IP a cada 15 minutos; acima
disso a resposta é 429. No Compose local, as chamadas pelo Nginx chegam como um único
IP; uma implantação pública precisa configurar proxies confiáveis e um armazenamento
compartilhado do limitador.

```sh
curl -X POST http://localhost:8080/api/candidatos \
  -H 'Content-Type: application/json' \
  -d '{"cpf":"11144477735","nome":"Maria Teste","email":"maria.teste@exemplo.invalid","senha":"senha-teste-123"}'

curl -X POST http://localhost:8080/api/login \
  -H 'Content-Type: application/json' \
  -d '{"cpf":"11144477735","senha":"senha-teste-123"}'
```

---

## Temas

### GET `/temas`

Lista os 12 temas na ordem da certificação. Trecho dos primeiros itens:

```json
[ { "id": 1, "nome": "Fundamentos da Agilidade", "ordem": 1 },
  { "id": 2, "nome": "Introdução ao Scrum", "ordem": 2 },
  { "id": 3, "nome": "Papéis do Scrum", "ordem": 3 } ]
```

### GET `/temas/proximo` — privado

Devolve o tema da questão aberta ou o próximo tema ainda não respondido. É o ponto de
entrada da retomada.

```json
{ "tema": { "id": 1, "nome": "Fundamentos da Agilidade", "ordem": 1 }, "concluido": false }
```

Com os 12 temas encerrados:

```json
{ "tema": null, "concluido": true }
```

---

## Prova

### POST `/questoes/sortear` — privado

Sem corpo. Sorteia uma questão entre as quatro do próximo tema.

```json
{
  "questao": {
    "questao": {
      "id": 3, "tema_id": 1, "ordem": 3,
      "enunciado": "Qual fundamento da agilidade é evidenciado pela sequência da imagem?",
      "imagem_url": "/api/imagens/3",
      "alternativas": [
        { "id": 9,  "letra": "A", "texto": "Aprender com evidências e ajustar a solução em ciclos." },
        { "id": 10, "letra": "B", "texto": "Manter a decisão inicial para evitar retrabalho." },
        { "id": 11, "letra": "C", "texto": "Tratar uma hipótese da equipe como requisito validado." },
        { "id": 12, "letra": "D", "texto": "Medir o progresso apenas pela quantidade de telas desenhadas." }
      ]
    },
    "data_horario_inicio": "2026-11-20T15:49:28.493Z",
    "data_horario_limite": "2026-11-20T15:51:58.493Z"
  },
  "concluido": false
}
```

O limite é sempre o início mais 150 segundos. As alternativas nunca trazem o gabarito.

Se já houver questão aberta, chamar o sorteio de novo devolve a mesma questão com o
mesmo início e o mesmo limite, de modo que recarregar a página não troca a questão nem
reinicia o cronômetro. Ao terminar os 12 temas:

```json
{ "questao": null, "concluido": true }
```

O sorteio só acontece com a base completa: 12 temas, quatro questões por tema e quatro
alternativas com exatamente uma correta. Fora disso a resposta é 409 com
`Base de certificação incompleta: ...`.

### GET `/questoes/:id` — privado

Devolve a questão já sorteada para o titular, no mesmo formato do objeto `questao`
interno acima. Pedir uma questão que não foi sorteada para o titular responde 404:

```json
{ "erro": "Questão não encontrada para este candidato." }
```

### POST `/questoes/:id/responder` — privado

Requisição:

```json
{ "letra_resposta": "A" }
```

Resposta 200:

```json
{
  "questao_id": 3,
  "letra_resposta": "A",
  "data_horario_inicio": "2026-11-20T15:49:28.493Z",
  "data_horario_resposta": "2026-11-20T15:49:29.292Z",
  "valida": true,
  "acertou": true,
  "alternativa_correta": "A",
  "resultado": { "total": 1, "acertos": 1, "concluido": false,
                 "percentual": null, "nota": null, "aprovado": false }
}
```

| Campo | Significado |
|---|---|
| `valida` | Coluna gerada pelo banco: verdadeira quando a questão foi encerrada dentro dos 150 segundos. |
| `acertou` | Verdadeira apenas quando a letra confere com o gabarito dentro do prazo. |
| `alternativa_correta` | Gabarito, devolvido somente depois do encerramento da questão. |
| `resultado` | Resultado parcial. `percentual` e `nota` ficam em `null` até o 12º tema. |

Só são aceitas as letras A, B, C ou D:

```json
{ "erro": "Informe letra_resposta como A, B, C ou D." }
```

Reenvio da mesma questão, inclusive em chamadas simultâneas, grava uma única resposta e
devolve 409:

```json
{ "erro": "Esta questão já está encerrada." }
```

O prazo é contado pelo relógio do PostgreSQL; datas, nota ou `acertou` enviados pelo
cliente são ignorados. Uma resposta que chega depois dos 150 segundos tem dois desfechos
possíveis: se a rotina de expiração já encerrou a questão, recebe o 409 acima; se a
resposta chega antes da rotina, é gravada sem letra e como incorreta. Como a rotina roda
a cada cinco segundos, o 409 é o caso comum.

### POST `/questoes/:id/interromper` — privado

Sem corpo. Encerra a questão aberta sem escolha. A resposta tem o mesmo formato de
`/responder`:

```json
{
  "questao_id": 7,
  "letra_resposta": null,
  "data_horario_inicio": "2026-11-20T15:49:29.452Z",
  "data_horario_resposta": "2026-11-20T15:49:29.779Z",
  "valida": true,
  "acertou": false,
  "alternativa_correta": "B",
  "resultado": { "total": 2, "acertos": 1, "concluido": false,
                 "percentual": null, "nota": null, "aprovado": false }
}
```

A questão interrompida conta como respondida e incorreta; `valida` fica verdadeira
porque o encerramento ocorreu dentro do prazo. Depois disso, `/temas/proximo` e
`/questoes/sortear` seguem para o próximo tema pendente.

```sh
curl -X POST http://localhost:8080/api/questoes/sortear \
  -H 'Authorization: Bearer SEU_TOKEN'

curl -X POST http://localhost:8080/api/questoes/3/responder \
  -H 'Authorization: Bearer SEU_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"letra_resposta":"A"}'

curl -X POST http://localhost:8080/api/questoes/7/interromper \
  -H 'Authorization: Bearer SEU_TOKEN'
```

Use o identificador recebido no sorteio, que varia a cada candidato.

---

## Progresso, histórico e resultado

### GET `/candidatos/progresso` — privado

Situação de cada um dos 12 temas, junto do resultado parcial. Trecho da resposta depois
de três temas encerrados:

```json
{
  "resultado": { "total": 3, "acertos": 1, "concluido": false,
                 "percentual": null, "nota": null, "aprovado": false },
  "temas": [
    { "id": 1, "nome": "Fundamentos da Agilidade", "ordem": 1, "questao_id": 3, "estado": "CONCLUIDO" },
    { "id": 2, "nome": "Introdução ao Scrum", "ordem": 2, "questao_id": 7, "estado": "CONCLUIDO" },
    { "id": 3, "nome": "Papéis do Scrum", "ordem": 3, "questao_id": 9, "estado": "CONCLUIDO" },
    { "id": 4, "nome": "Eventos do Scrum", "ordem": 4, "questao_id": null, "estado": "PENDENTE" }
  ]
}
```

`estado` assume `PENDENTE` (tema sem sorteio), `EM_ANDAMENTO` (questão sorteada e ainda
aberta) ou `CONCLUIDO` (questão encerrada, por resposta, interrupção ou prazo).

### GET `/candidatos/historico` — privado

Lista apenas as questões já encerradas, na ordem dos temas, com tema, questão sorteada,
resposta escolhida, resposta correta e horários. Trecho com os três primeiros temas:

```json
[
  { "tema_id": 1, "tema": "Fundamentos da Agilidade", "questao_id": 3,
    "enunciado": "Qual fundamento da agilidade é evidenciado pela sequência da imagem?",
    "letra_resposta": "A",
    "data_horario_inicio": "2026-11-20T15:49:28.493Z",
    "data_horario_resposta": "2026-11-20T15:49:29.292Z",
    "acertou": true, "valida": true, "alternativa_correta": "A" },
  { "tema_id": 2, "tema": "Introdução ao Scrum", "questao_id": 7,
    "enunciado": "Qual afirmação sobre a Sprint é compatível com o cenário e com o Scrum?",
    "letra_resposta": null,
    "data_horario_inicio": "2026-11-20T15:49:29.452Z",
    "data_horario_resposta": "2026-11-20T15:49:29.779Z",
    "acertou": false, "valida": true, "alternativa_correta": "B" },
  { "tema_id": 3, "tema": "Papéis do Scrum", "questao_id": 9,
    "enunciado": "Qual responsabilidade do Scrum é exercida por Marina no cenário?",
    "letra_resposta": "B",
    "data_horario_inicio": "2026-11-20T15:49:29.911Z",
    "data_horario_resposta": "2026-11-20T15:49:30.225Z",
    "acertou": false, "valida": true, "alternativa_correta": "A" }
]
```

O primeiro item é um acerto, o segundo uma interrupção e o terceiro uma resposta errada.
Uma questão encerrada pelo prazo aparece sem letra e com `valida` falsa; no registro,
ela foi fechada pela rotina 150,8 segundos após o início:

```json
{ "tema_id": 1, "tema": "Fundamentos da Agilidade", "questao_id": 3,
  "enunciado": "Qual fundamento da agilidade é evidenciado pela sequência da imagem?",
  "letra_resposta": null,
  "data_horario_inicio": "2026-11-20T15:49:36.196Z",
  "data_horario_resposta": "2026-11-20T15:52:06.962Z",
  "acertou": false, "valida": false, "alternativa_correta": "A" }
```

Cada candidato enxerga apenas o próprio histórico; o filtro vem do token, não de
parâmetro na chamada.

### GET `/candidatos/resultado` — privado

Resultado depois dos 12 temas, com 10 acertos:

```json
{ "total": 12, "acertos": 10, "concluido": true,
  "percentual": 83.33, "nota": 8.33, "aprovado": true }
```

O percentual é `acertos / 12 * 100` e a nota de apresentação é `acertos / 12 * 10`,
ambos com duas casas decimais. A aprovação começa em 65%, o que exige pelo menos oito
acertos. Enquanto os 12 temas não terminam, `percentual` e `nota` ficam em `null` e
`concluido` fica falso. Só contam como acerto as respostas com `acertou` e `valida`
verdadeiros.

---

## Certificado

### POST `/candidatos/certificado` — privado

Sem corpo. O código é gerado no momento em que o candidato conclui o 12º tema com
aprovação; esta rota devolve os dados da emissão.

```json
{
  "certificado_hash": "9b15cfe35e7b9b89b3c4a540505c31777c36585c0b3dbb8c87e1ebd1ada11ecc",
  "emitido_em": "2026-11-20T15:49:33.890Z",
  "dados": { "cpf": "11144477735", "nome": "Maria Teste", "nota": 8.33,
             "email": "maria.teste@exemplo.invalid",
             "total": 12, "acertos": 10, "percentual": 83.33 }
}
```

São 32 bytes aleatórios guardados em 64 caracteres hexadecimais. Chamadas repetidas,
inclusive simultâneas, devolvem o mesmo código, o mesmo instante e os mesmos dados.

Antes dos 12 temas, responde 409:

```json
{ "erro": "Conclua os 12 temas antes de emitir o certificado." }
```

Com aproveitamento abaixo de 65%, responde 409 com
`É necessário aproveitamento de pelo menos 65% para emitir o certificado.`.

### GET `/certificados/:hash`

Rota pública de validação, sem autenticação.

```json
{ "valido": true,
  "certificado_hash": "9b15cfe35e7b9b89b3c4a540505c31777c36585c0b3dbb8c87e1ebd1ada11ecc",
  "emitido_em": "2026-11-20T15:49:33.890Z",
  "nome": "Maria Teste",
  "percentual": 83.33 }
```

Não devolve CPF nem e-mail. Os dados ficam gravados no momento da emissão e não são
recalculados nas consultas seguintes. A API não permite refazer a prova: cada tema
aceita uma única resposta por candidato.

Código inexistente ou fora do formato de 64 caracteres hexadecimais recebe a mesma
resposta 404, sem revelar se o código existe:

```json
{ "erro": "Certificado não encontrado." }
```

---

## Imagens das questões

### GET `/imagens/:id`

Entrega o SVG da questão pelo identificador, em vez de expor o caminho do arquivo.
Cabeçalhos registrados pelo Nginx:

```http
Content-Type: image/svg+xml
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; sandbox
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; ...
```

A primeira política vem da API e impede que o SVG execute script ou busque recursos
externos. A segunda é a política geral do site, que o Nginx acrescenta a todas as
respostas. Com duas políticas, o navegador aplica ambas e prevalece a mais restritiva.
Identificador sem imagem correspondente responde 404 com `Imagem não encontrada.`.

---

## Erros

Toda falha responde em JSON no formato `{ "erro": "mensagem" }`.

| Código | Quando ocorre | Mensagens |
|---|---|---|
| 400 | Entrada inválida | `Informe os dados em JSON.` · `CPF deve conter 11 dígitos, sem pontuação.` · `Senha deve ter pelo menos 6 caracteres e no máximo 72 bytes.` · `Nome deve ter de 1 a 100 caracteres.` · `E-mail inválido.` · `Informe letra_resposta como A, B, C ou D.` · `Identificador inválido.` · `JSON inválido.` |
| 401 | Credenciais ou token | `CPF ou senha incorretos.` · `Use Authorization: Bearer TOKEN.` · `Token inválido ou expirado.` · `Candidato não encontrado.` |
| 404 | Recurso ausente para o titular | `Questão não encontrada para este candidato.` · `Questão não sorteada para este candidato.` · `Imagem não encontrada.` · `Certificado não encontrado.` · `Rota desconhecida.` |
| 409 | Conflito de estado | `Registro já existente.` · `Esta questão já está encerrada.` · `Base de certificação incompleta: ...` · `Conclua os 12 temas antes de emitir o certificado.` · `É necessário aproveitamento de pelo menos 65% para emitir o certificado.` |
| 413 | Corpo acima de 16 KB | `Corpo da requisição muito grande.` |
| 429 | Limite de chamadas em cadastro e login | `Muitas tentativas. Aguarde alguns minutos.` |
| 500 | Falha interna | `Não foi possível concluir a operação.` |

A resposta 500 é sempre genérica: não traz SQL, segredos nem stack trace. O servidor
registra apenas o código ou o nome do erro.

Os casos 400 de CPF e de JSON malformado, 401 de credenciais e de token, 404 de questão
alheia, certificado e rota, e 409 de cadastro repetido, reenvio, certificado antecipado
e resposta fora do prazo foram exercitados no registro de 20/11/2026. Os demais estão
descritos a partir do código; o 429 não foi provocado para não bloquear o ambiente por
15 minutos.

## Garantias de concorrência

Sorteio, resposta e emissão do certificado rodam dentro de uma transação que trava a
linha do candidato, e a resposta ainda trava a própria linha da questão. Isso serializa
chamadas simultâneas do mesmo candidato.

O banco reforça as mesmas regras: a tabela de respostas tem chave primária
`(candidato_id, questao_id)` e restrição `UNIQUE (candidato_id, tema_id)`, de modo que
nenhum candidato responde o mesmo tema duas vezes, mesmo que a aplicação falhe.

Além das verificações feitas a cada chamada, uma rotina no servidor encerra questões
vencidas a cada cinco segundos, para que o tempo esgotado não dependa de o candidato
voltar à tela.

## Limitações conhecidas

- A interface ainda não consome estas rotas na prova, no resultado nem no certificado;
  ver [Funcionalidades](FUNCIONALIDADES.md).
- Não há rota de recuperação de senha.
- A API não detecta de imediato o fechamento do navegador ou a perda de conexão: a
  questão é encerrada pelo prazo, na rotina de expiração ou na chamada seguinte.
- A escala 0–10 da nota de apresentação ainda precisa de confirmação.

[Funcionalidades](FUNCIONALIDADES.md) · [Arquitetura](ARQUITETURA.md) ·
[Instalação](INSTALACAO.md) · [Acesso pela API no frontend](Acesso-API.md) ·
[Modelo de dados](../database/MODELO-DE-DADOS.md)