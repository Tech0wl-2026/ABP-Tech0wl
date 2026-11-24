# Evidência de chamadas reais à API

- Gerado em: 20/11/2026 12:49:24 -0300
- Base: `http://localhost:8080/api` (pelo Nginx)
- Commit: `ee76835` na branch `feat/home-edit`
- Contas fictícias; tokens abreviados.

## 1. Disponibilidade, cadastro e login

### GET /saude

```http
GET /api/saude
```

Status: **200** (esperado 200)

```json
{
  "status": "ok"
}
```

### GET /temas

```http
GET /api/temas
```

Status: **200** (esperado 200)

```json
[
  {
    "id": 1,
    "nome": "Fundamentos da Agilidade",
    "ordem": 1
  },
  {
    "id": 2,
    "nome": "Introdução ao Scrum",
    "ordem": 2
  },
  {
    "id": 3,
    "nome": "Papéis do Scrum",
    "ordem": 3
  },
  {
    "id": 4,
    "nome": "Eventos do Scrum",
    "ordem": 4
  },
  {
    "id": 5,
    "nome": "Artefatos do Scrum",
    "ordem": 5
  },
  {
    "id": 6,
    "nome": "Gestão do Product Backlog",
    "ordem": 6
  },
  {
    "id": 7,
    "nome": "Kanban",
    "ordem": 7
  },
  {
    "id": 8,
    "nome": "Planejamento Ágil",
    "ordem": 8
  },
  {
    "id": 9,
    "nome": "Métricas Ágeis",
    "ordem": 9
  },
  {
    "id": 10,
    "nome": "Extreme Programming (XP)",
    "ordem": 10
  },
  {
    "id": 11,
    "nome": "Ferramentas para Equipes Ágeis",
    "ordem": 11
  },
  {
    "id": 12,
    "nome": "Boas Práticas em Projetos Ágeis",
    "ordem": 12
  }
]
```

### Cadastro

```http
POST /api/candidatos

{"cpf":"11144477735","nome":"Maria Teste","email":"maria.teste@exemplo.invalid","senha":"senha-teste-123"}
```

Status: **201** (esperado 201)

```json
{
  "id": 1,
  "cpf": "11144477735",
  "nome": "Maria Teste",
  "email": "maria.teste@exemplo.invalid",
  "criado_em": "2026-11-20T15:49:25.672Z"
}
```

### Cadastro repetido

```http
POST /api/candidatos

{"cpf":"11144477735","nome":"Maria Teste","email":"maria.teste@exemplo.invalid","senha":"senha-teste-123"}
```

Status: **409** (esperado 409)

```json
{
  "erro": "Registro já existente."
}
```

### Cadastro com CPF inválido

```http
POST /api/candidatos

{"cpf":"123","nome":"Maria Teste","email":"maria.teste@exemplo.invalid","senha":"senha-teste-123"}
```

Status: **400** (esperado 400)

```json
{
  "erro": "CPF deve conter 11 dígitos, sem pontuação."
}
```

### Corpo que não é JSON válido

```http
POST /api/candidatos

{"cpf":
```

Status: **400** (esperado 400)

```json
{
  "erro": "JSON inválido."
}
```

### Login com senha errada

```http
POST /api/login

{"cpf":"11144477735","senha":"senha-errada"}
```

Status: **401** (esperado 401)

```json
{
  "erro": "CPF ou senha incorretos."
}
```

### Login

```http
POST /api/login

{"cpf":"11144477735","senha":"senha-teste-123"}
```

Status: **200** (esperado 200)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "tipo": "Bearer",
  "expira_em": 3600,
  "candidato": {
    "id": 1,
    "nome": "Maria Teste",
    "email": "maria.teste@exemplo.invalid"
  }
}
```

## 2. Autenticação e prova

### Rota privada sem token

```http
GET /api/temas/proximo
```

Status: **401** (esperado 401)

```json
{
  "erro": "Use Authorization: Bearer TOKEN."
}
```

### Rota privada com token inválido

```http
GET /api/temas/proximo
Authorization: Bearer token-invalido...
```

Status: **401** (esperado 401)

```json
{
  "erro": "Token inválido ou expirado."
}
```

### Próximo tema

```http
GET /api/temas/proximo
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Status: **200** (esperado 200)

```json
{
  "tema": {
    "id": 1,
    "nome": "Fundamentos da Agilidade",
    "ordem": 1
  },
  "concluido": false
}
```

### Sortear questão do tema 1

```http
POST /api/questoes/sortear
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Status: **200** (esperado 200)

```json
{
  "questao": {
    "questao": {
      "id": 3,
      "tema_id": 1,
      "ordem": 3,
      "enunciado": "Qual fundamento da agilidade é evidenciado pela sequência da imagem?",
      "imagem_url": "/api/imagens/3",
      "alternativas": [
        {
          "id": 9,
          "letra": "A",
          "texto": "Aprender com evidências e ajustar a solução em ciclos."
        },
        {
          "id": 10,
          "letra": "B",
          "texto": "Manter a decisão inicial para evitar retrabalho."
        },
        {
          "id": 11,
          "letra": "C",
          "texto": "Tratar uma hipótese da equipe como requisito validado."
        },
        {
          "id": 12,
          "letra": "D",
          "texto": "Medir o progresso apenas pela quantidade de telas desenhadas."
        }
      ]
    },
    "data_horario_inicio": "2026-11-20T15:49:28.493Z",
    "data_horario_limite": "2026-11-20T15:51:58.493Z"
  },
  "concluido": false
}
```

### Sortear de novo com a questão aberta (retomada)

```http
POST /api/questoes/sortear
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Status: **200** (esperado 200)

```json
{
  "questao": {
    "questao": {
      "id": 3,
      "tema_id": 1,
      "ordem": 3,
      "enunciado": "Qual fundamento da agilidade é evidenciado pela sequência da imagem?",
      "imagem_url": "/api/imagens/3",
      "alternativas": [
        {
          "id": 9,
          "letra": "A",
          "texto": "Aprender com evidências e ajustar a solução em ciclos."
        },
        {
          "id": 10,
          "letra": "B",
          "texto": "Manter a decisão inicial para evitar retrabalho."
        },
        {
          "id": 11,
          "letra": "C",
          "texto": "Tratar uma hipótese da equipe como requisito validado."
        },
        {
          "id": 12,
          "letra": "D",
          "texto": "Medir o progresso apenas pela quantidade de telas desenhadas."
        }
      ]
    },
    "data_horario_inicio": "2026-11-20T15:49:28.493Z",
    "data_horario_limite": "2026-11-20T15:51:58.493Z"
  },
  "concluido": false
}
```

### Consultar a questão sorteada

```http
GET /api/questoes/3
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Status: **200** (esperado 200)

```json
{
  "id": 3,
  "tema_id": 1,
  "ordem": 3,
  "enunciado": "Qual fundamento da agilidade é evidenciado pela sequência da imagem?",
  "imagem_url": "/api/imagens/3",
  "alternativas": [
    {
      "id": 9,
      "letra": "A",
      "texto": "Aprender com evidências e ajustar a solução em ciclos."
    },
    {
      "id": 10,
      "letra": "B",
      "texto": "Manter a decisão inicial para evitar retrabalho."
    },
    {
      "id": 11,
      "letra": "C",
      "texto": "Tratar uma hipótese da equipe como requisito validado."
    },
    {
      "id": 12,
      "letra": "D",
      "texto": "Medir o progresso apenas pela quantidade de telas desenhadas."
    }
  ]
}
```

### Imagem da questão

```http
GET /api/imagens/3
```

Status: **200** (esperado 200). Tamanho: 3239 bytes. Cabeçalhos relevantes:

```http
Content-Type: image/svg+xml
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; sandbox
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; font-src 'self' data: https://fonts.gstatic.com https://unpkg.com; img-src 'self' data:; connect-src 'self' https://api.emailjs.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'
```

### Resposta com letra inválida

```http
POST /api/questoes/3/responder
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{"letra_resposta":"X"}
```

Status: **400** (esperado 400)

```json
{
  "erro": "Informe letra_resposta como A, B, C ou D."
}
```

### Certificado antes de concluir

```http
POST /api/candidatos/certificado
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Status: **409** (esperado 409)

```json
{
  "erro": "Conclua os 12 temas antes de emitir o certificado."
}
```

### Responder tema 1 (letra correta)

```http
POST /api/questoes/3/responder
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{"letra_resposta":"A"}
```

Status: **200** (esperado 200)

```json
{
  "questao_id": 3,
  "letra_resposta": "A",
  "data_horario_inicio": "2026-11-20T15:49:28.493Z",
  "data_horario_resposta": "2026-11-20T15:49:29.292Z",
  "valida": true,
  "acertou": true,
  "alternativa_correta": "A",
  "resultado": {
    "total": 1,
    "acertos": 1,
    "concluido": false,
    "percentual": null,
    "nota": null,
    "aprovado": false
  }
}
```

### Responder a mesma questão de novo

```http
POST /api/questoes/3/responder
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{"letra_resposta":"A"}
```

Status: **409** (esperado 409)

```json
{
  "erro": "Esta questão já está encerrada."
}
```

## 3. Temas 2 a 12

### Interromper a questão do tema 2

```http
POST /api/questoes/7/interromper
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Status: **200** (esperado 200)

```json
{
  "questao_id": 7,
  "letra_resposta": null,
  "data_horario_inicio": "2026-11-20T15:49:29.452Z",
  "data_horario_resposta": "2026-11-20T15:49:29.779Z",
  "valida": true,
  "acertou": false,
  "alternativa_correta": "B",
  "resultado": {
    "total": 2,
    "acertos": 1,
    "concluido": false,
    "percentual": null,
    "nota": null,
    "aprovado": false
  }
}
```

### Responder tema 3 (letra errada)

```http
POST /api/questoes/9/responder
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{"letra_resposta":"B"}
```

Status: **200** (esperado 200)

```json
{
  "questao_id": 9,
  "letra_resposta": "B",
  "data_horario_inicio": "2026-11-20T15:49:29.911Z",
  "data_horario_resposta": "2026-11-20T15:49:30.225Z",
  "valida": true,
  "acertou": false,
  "alternativa_correta": "A",
  "resultado": {
    "total": 3,
    "acertos": 1,
    "concluido": false,
    "percentual": null,
    "nota": null,
    "aprovado": false
  }
}
```

### Progresso depois do tema 3

```http
GET /api/candidatos/progresso
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Status: **200** (esperado 200)

```json
{
  "resultado": {
    "total": 3,
    "acertos": 1,
    "concluido": false,
    "percentual": null,
    "nota": null,
    "aprovado": false
  },
  "temas": [
    {
      "id": 1,
      "nome": "Fundamentos da Agilidade",
      "ordem": 1,
      "questao_id": 3,
      "estado": "CONCLUIDO"
    },
    {
      "id": 2,
      "nome": "Introdução ao Scrum",
      "ordem": 2,
      "questao_id": 7,
      "estado": "CONCLUIDO"
    },
    {
      "id": 3,
      "nome": "Papéis do Scrum",
      "ordem": 3,
      "questao_id": 9,
      "estado": "CONCLUIDO"
    },
    {
      "id": 4,
      "nome": "Eventos do Scrum",
      "ordem": 4,
      "questao_id": null,
      "estado": "PENDENTE"
    },
    {
      "id": 5,
      "nome": "Artefatos do Scrum",
      "ordem": 5,
      "questao_id": null,
      "estado": "PENDENTE"
    },
    {
      "id": 6,
      "nome": "Gestão do Product Backlog",
      "ordem": 6,
      "questao_id": null,
      "estado": "PENDENTE"
    },
    {
      "id": 7,
      "nome": "Kanban",
      "ordem": 7,
      "questao_id": null,
      "estado": "PENDENTE"
    },
    {
      "id": 8,
      "nome": "Planejamento Ágil",
      "ordem": 8,
      "questao_id": null,
      "estado": "PENDENTE"
    },
    {
      "id": 9,
      "nome": "Métricas Ágeis",
      "ordem": 9,
      "questao_id": null,
      "estado": "PENDENTE"
    },
    {
      "id": 10,
      "nome": "Extreme Programming (XP)",
      "ordem": 10,
      "questao_id": null,
      "estado": "PENDENTE"
    },
    {
      "id": 11,
      "nome": "Ferramentas para Equipes Ágeis",
      "ordem": 11,
      "questao_id": null,
      "estado": "PENDENTE"
    },
    {
      "id": 12,
      "nome": "Boas Práticas em Projetos Ágeis",
      "ordem": 12,
      "questao_id": null,
      "estado": "PENDENTE"
    }
  ]
}
```

### Resumo das respostas dos temas 2 a 12

| Tema | Questão | Letra enviada | Gabarito | acertou | Status |
|---|---|---|---|---|---|
| 2 | 7 | (interrompida) | B | false | 200 |
| 3 | 9 | B | A | false | 200 |
| 4 | 14 | A | A | true | 200 |
| 5 | 20 | C | C | true | 200 |
| 6 | 21 | C | C | true | 200 |
| 7 | 26 | B | B | true | 200 |
| 8 | 29 | C | C | true | 200 |
| 9 | 35 | A | A | true | 200 |
| 10 | 37 | A | A | true | 200 |
| 11 | 42 | A | A | true | 200 |
| 12 | 48 | C | C | true | 200 |

## 4. Conclusão, histórico, resultado e certificado

### Sortear depois dos 12 temas

```http
POST /api/questoes/sortear
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Status: **200** (esperado 200)

```json
{
  "questao": null,
  "concluido": true
}
```

### Próximo tema depois dos 12 temas

```http
GET /api/temas/proximo
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Status: **200** (esperado 200)

```json
{
  "tema": null,
  "concluido": true
}
```

### Histórico

```http
GET /api/candidatos/historico
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Status: **200** (esperado 200)

```json
[
  {
    "tema_id": 1,
    "tema": "Fundamentos da Agilidade",
    "questao_id": 3,
    "enunciado": "Qual fundamento da agilidade é evidenciado pela sequência da imagem?",
    "letra_resposta": "A",
    "data_horario_inicio": "2026-11-20T15:49:28.493Z",
    "data_horario_resposta": "2026-11-20T15:49:29.292Z",
    "acertou": true,
    "valida": true,
    "alternativa_correta": "A"
  },
  {
    "tema_id": 2,
    "tema": "Introdução ao Scrum",
    "questao_id": 7,
    "enunciado": "Qual afirmação sobre a Sprint é compatível com o cenário e com o Scrum?",
    "letra_resposta": null,
    "data_horario_inicio": "2026-11-20T15:49:29.452Z",
    "data_horario_resposta": "2026-11-20T15:49:29.779Z",
    "acertou": false,
    "valida": true,
    "alternativa_correta": "B"
  },
  {
    "tema_id": 3,
    "tema": "Papéis do Scrum",
    "questao_id": 9,
    "enunciado": "Qual responsabilidade do Scrum é exercida por Marina no cenário?",
    "letra_resposta": "B",
    "data_horario_inicio": "2026-11-20T15:49:29.911Z",
    "data_horario_resposta": "2026-11-20T15:49:30.225Z",
    "acertou": false,
    "valida": true,
    "alternativa_correta": "A"
  },
  {
    "tema_id": 4,
    "tema": "Eventos do Scrum",
    "questao_id": 14,
    "enunciado": "Qual é a finalidade do evento apresentado?",
    "letra_resposta": "A",
    "data_horario_inicio": "2026-11-20T15:49:30.440Z",
    "data_horario_resposta": "2026-11-20T15:49:30.763Z",
    "acertou": true,
    "valida": true,
    "alternativa_correta": "A"
  },
  {
    "tema_id": 5,
    "tema": "Artefatos do Scrum",
    "questao_id": 20,
    "enunciado": "Qual resultado pode integrar um Incremento, segundo as informações da imagem?",
    "letra_resposta": "C",
    "data_horario_inicio": "2026-11-20T15:49:30.840Z",
    "data_horario_resposta": "2026-11-20T15:49:31.148Z",
    "acertou": true,
    "valida": true,
    "alternativa_correta": "C"
  },
  {
    "tema_id": 6,
    "tema": "Gestão do Product Backlog",
    "questao_id": 21,
    "enunciado": "Qual decisão de ordenação é mais adequada ao contexto apresentado?",
    "letra_resposta": "C",
    "data_horario_inicio": "2026-11-20T15:49:31.233Z",
    "data_horario_resposta": "2026-11-20T15:49:31.542Z",
    "acertou": true,
    "valida": true,
    "alternativa_correta": "C"
  },
  {
    "tema_id": 7,
    "tema": "Kanban",
    "questao_id": 26,
    "enunciado": "Qual ação tende a melhorar o fluxo no cenário?",
    "letra_resposta": "B",
    "data_horario_inicio": "2026-11-20T15:49:31.620Z",
    "data_horario_resposta": "2026-11-20T15:49:31.923Z",
    "acertou": true,
    "valida": true,
    "alternativa_correta": "B"
  },
  {
    "tema_id": 8,
    "tema": "Planejamento Ágil",
    "questao_id": 29,
    "enunciado": "Como a equipe deve usar as informações para planejar a próxima Sprint?",
    "letra_resposta": "C",
    "data_horario_inicio": "2026-11-20T15:49:32.006Z",
    "data_horario_resposta": "2026-11-20T15:49:32.320Z",
    "acertou": true,
    "valida": true,
    "alternativa_correta": "C"
  },
  {
    "tema_id": 9,
    "tema": "Métricas Ágeis",
    "questao_id": 35,
    "enunciado": "Qual é o tempo de ciclo, medido do início do trabalho à conclusão?",
    "letra_resposta": "A",
    "data_horario_inicio": "2026-11-20T15:49:32.400Z",
    "data_horario_resposta": "2026-11-20T15:49:32.703Z",
    "acertou": true,
    "valida": true,
    "alternativa_correta": "A"
  },
  {
    "tema_id": 10,
    "tema": "Extreme Programming (XP)",
    "questao_id": 37,
    "enunciado": "Qual prática de XP corresponde à forma de trabalho mostrada na imagem?",
    "letra_resposta": "A",
    "data_horario_inicio": "2026-11-20T15:49:32.785Z",
    "data_horario_resposta": "2026-11-20T15:49:33.099Z",
    "acertou": true,
    "valida": true,
    "alternativa_correta": "A"
  },
  {
    "tema_id": 11,
    "tema": "Ferramentas para Equipes Ágeis",
    "questao_id": 42,
    "enunciado": "Qual é o papel do pull request no fluxo mostrado?",
    "letra_resposta": "A",
    "data_horario_inicio": "2026-11-20T15:49:33.182Z",
    "data_horario_resposta": "2026-11-20T15:49:33.493Z",
    "acertou": true,
    "valida": true,
    "alternativa_correta": "A"
  },
  {
    "tema_id": 12,
    "tema": "Boas Práticas em Projetos Ágeis",
    "questao_id": 48,
    "enunciado": "Qual prática de melhoria contínua está representada nesse encadeamento?",
    "letra_resposta": "C",
    "data_horario_inicio": "2026-11-20T15:49:33.573Z",
    "data_horario_resposta": "2026-11-20T15:49:33.888Z",
    "acertou": true,
    "valida": true,
    "alternativa_correta": "C"
  }
]
```

### Resultado

```http
GET /api/candidatos/resultado
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Status: **200** (esperado 200)

```json
{
  "total": 12,
  "acertos": 10,
  "concluido": true,
  "percentual": 83.33,
  "nota": 8.33,
  "aprovado": true
}
```

### Emitir certificado

```http
POST /api/candidatos/certificado
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Status: **200** (esperado 200)

```json
{
  "certificado_hash": "9b15cfe35e7b9b89b3c4a540505c31777c36585c0b3dbb8c87e1ebd1ada11ecc",
  "emitido_em": "2026-11-20T15:49:33.890Z",
  "dados": {
    "cpf": "11144477735",
    "nome": "Maria Teste",
    "nota": 8.33,
    "email": "maria.teste@exemplo.invalid",
    "total": 12,
    "acertos": 10,
    "percentual": 83.33
  }
}
```

### Validação pública do certificado

```http
GET /api/certificados/9b15cfe35e7b9b89b3c4a540505c31777c36585c0b3dbb8c87e1ebd1ada11ecc
```

Status: **200** (esperado 200)

```json
{
  "valido": true,
  "certificado_hash": "9b15cfe35e7b9b89b3c4a540505c31777c36585c0b3dbb8c87e1ebd1ada11ecc",
  "emitido_em": "2026-11-20T15:49:33.890Z",
  "nome": "Maria Teste",
  "percentual": 83.33
}
```

### Validação com código em formato inválido

```http
GET /api/certificados/abc
```

Status: **404** (esperado 404)

```json
{
  "erro": "Certificado não encontrado."
}
```

### Rota inexistente

```http
GET /api/rota-que-nao-existe
```

Status: **404** (esperado 404)

```json
{
  "erro": "Rota desconhecida."
}
```

## 5. Segundo candidato: isolamento e prazo

### Cadastro do segundo candidato

```http
POST /api/candidatos

{"cpf":"52998224725","nome":"Joao Teste","email":"joao.teste@exemplo.invalid","senha":"senha-teste-456"}
```

Status: **201** (esperado 201)

```json
{
  "id": 3,
  "cpf": "52998224725",
  "nome": "Joao Teste",
  "email": "joao.teste@exemplo.invalid",
  "criado_em": "2026-11-20T15:49:35.316Z"
}
```

### Login do segundo candidato

```http
POST /api/login

{"cpf":"52998224725","senha":"senha-teste-456"}
```

Status: **200** (esperado 200)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "tipo": "Bearer",
  "expira_em": 3600,
  "candidato": {
    "id": 3,
    "nome": "Joao Teste",
    "email": "joao.teste@exemplo.invalid"
  }
}
```

### Sortear (segundo candidato)

```http
POST /api/questoes/sortear
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Status: **200** (esperado 200)

```json
{
  "questao": {
    "questao": {
      "id": 3,
      "tema_id": 1,
      "ordem": 3,
      "enunciado": "Qual fundamento da agilidade é evidenciado pela sequência da imagem?",
      "imagem_url": "/api/imagens/3",
      "alternativas": [
        {
          "id": 9,
          "letra": "A",
          "texto": "Aprender com evidências e ajustar a solução em ciclos."
        },
        {
          "id": 10,
          "letra": "B",
          "texto": "Manter a decisão inicial para evitar retrabalho."
        },
        {
          "id": 11,
          "letra": "C",
          "texto": "Tratar uma hipótese da equipe como requisito validado."
        },
        {
          "id": 12,
          "letra": "D",
          "texto": "Medir o progresso apenas pela quantidade de telas desenhadas."
        }
      ]
    },
    "data_horario_inicio": "2026-11-20T15:49:36.196Z",
    "data_horario_limite": "2026-11-20T15:52:06.196Z"
  },
  "concluido": false
}
```

### Consultar questão de outro candidato

```http
GET /api/questoes/20
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Status: **404** (esperado 404)

```json
{
  "erro": "Questão não encontrada para este candidato."
}
```

### Responder depois do prazo

```http
POST /api/questoes/3/responder
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{"letra_resposta":"A"}
```

Status: **409** (esperado 409)

```json
{
  "erro": "Esta questão já está encerrada."
}
```

### Histórico com questão expirada

```http
GET /api/candidatos/historico
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Status: **200** (esperado 200)

```json
[
  {
    "tema_id": 1,
    "tema": "Fundamentos da Agilidade",
    "questao_id": 3,
    "enunciado": "Qual fundamento da agilidade é evidenciado pela sequência da imagem?",
    "letra_resposta": null,
    "data_horario_inicio": "2026-11-20T15:49:36.196Z",
    "data_horario_resposta": "2026-11-20T15:52:06.962Z",
    "acertou": false,
    "valida": false,
    "alternativa_correta": "A"
  }
]
```

## Conferência

| Verificação | Esperado | Obtido | |
|---|---|---|---|
| GET /saude | 200 | 200 | OK |
| GET /temas | 200 | 200 | OK |
| Cadastro | 201 | 201 | OK |
| Cadastro repetido | 409 | 409 | OK |
| Cadastro com CPF inválido | 400 | 400 | OK |
| Corpo que não é JSON válido | 400 | 400 | OK |
| Login com senha errada | 401 | 401 | OK |
| Login | 200 | 200 | OK |
| Rota privada sem token | 401 | 401 | OK |
| Rota privada com token inválido | 401 | 401 | OK |
| Próximo tema | 200 | 200 | OK |
| Sortear questão do tema 1 | 200 | 200 | OK |
| Sortear de novo com a questão aberta (retomada) | 200 | 200 | OK |
| Retomada mantém questão e prazo | igual | igual | OK |
| Consultar a questão sorteada | 200 | 200 | OK |
| Imagem da questão | 200 | 200 | OK |
| Resposta com letra inválida | 400 | 400 | OK |
| Certificado antes de concluir | 409 | 409 | OK |
| Responder tema 1 (letra correta) | 200 | 200 | OK |
| Responder a mesma questão de novo | 409 | 409 | OK |
| Sortear tema 2 | 200 | 200 | OK |
| Interromper a questão do tema 2 | 200 | 200 | OK |
| Sortear tema 3 | 200 | 200 | OK |
| Responder tema 3 (letra errada) | 200 | 200 | OK |
| Progresso depois do tema 3 | 200 | 200 | OK |
| Sortear tema 4 | 200 | 200 | OK |
| Responder tema 4 | 200 | 200 | OK |
| Sortear tema 5 | 200 | 200 | OK |
| Responder tema 5 | 200 | 200 | OK |
| Sortear tema 6 | 200 | 200 | OK |
| Responder tema 6 | 200 | 200 | OK |
| Sortear tema 7 | 200 | 200 | OK |
| Responder tema 7 | 200 | 200 | OK |
| Sortear tema 8 | 200 | 200 | OK |
| Responder tema 8 | 200 | 200 | OK |
| Sortear tema 9 | 200 | 200 | OK |
| Responder tema 9 | 200 | 200 | OK |
| Sortear tema 10 | 200 | 200 | OK |
| Responder tema 10 | 200 | 200 | OK |
| Sortear tema 11 | 200 | 200 | OK |
| Responder tema 11 | 200 | 200 | OK |
| Sortear tema 12 | 200 | 200 | OK |
| Responder tema 12 | 200 | 200 | OK |
| Sortear depois dos 12 temas | 200 | 200 | OK |
| Próximo tema depois dos 12 temas | 200 | 200 | OK |
| Histórico | 200 | 200 | OK |
| Resultado | 200 | 200 | OK |
| Emitir certificado | 200 | 200 | OK |
| Segunda emissão mantém o código | igual | igual | OK |
| Validação pública do certificado | 200 | 200 | OK |
| Validação com código em formato inválido | 404 | 404 | OK |
| Rota inexistente | 404 | 404 | OK |
| Cadastro do segundo candidato | 201 | 201 | OK |
| Login do segundo candidato | 200 | 200 | OK |
| Sortear (segundo candidato) | 200 | 200 | OK |
| Consultar questão de outro candidato | 404 | 404 | OK |
| Responder depois do prazo | 409 | 409 | OK |
| Histórico com questão expirada | 200 | 200 | OK |

**58 de 58 verificações conferem.**
