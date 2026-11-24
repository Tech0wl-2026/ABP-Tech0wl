# Evidência — issue #97: prova, tempo, interrupção e retomada

- Gerado em: 20/11/2026 15:45:39 -0300
- Base: `http://localhost:8080/api`
- Commit: `68c973c` na branch `feat/home-edit`
- Candidatos fictícios criados por esta execução. As consultas ao banco são filtradas
  por esses candidatos, para não misturar com dados de outras execuções.

Cada seção indica o critério de aceite e os requisitos que exercita.

## A. Estrutura da base — critério 1 (RF05, RF06, RF08)

Consultas diretas ao schema `servidor` e uma chamada a `/api/imagens/:id` para cada
identificador existente na tabela de questões.

| Verificação | Esperado | Obtido |
|---|---|---|
| Temas | 12 | 12 |
| Questões | 48 | 48 |
| Temas sem exatamente 4 questões | 0 | 0 |
| Questões sem exatamente 4 alternativas | 0 | 0 |
| Questões sem exatamente 1 alternativa correta | 0 | 0 |
| Questões cujas letras não são A, B, C e D | 0 | 0 |
| Questões sem imagem associada | 0 | 0 |
| Imagens que não respondem 200 (de 48) | 0 | 0 |

## B. Sorteio concorrente — critérios 1 e 3 (RF06)

6 chamadas simultâneas a `POST /api/questoes/sortear` para o mesmo candidato,
recém-criado e sem nenhuma questão anterior.

| Verificação | Esperado | Obtido |
|---|---|---|
| Questões distintas devolvidas | 1 | 1 |
| Prazos distintos devolvidos | 1 | 1 |
| Questões abertas gravadas para este candidato | 1 | 1 |

Questão sorteada: `4`. Status das chamadas: 200 200 200 200 200 200 

## C. Resposta duplicada e concorrente — critério 3 (RF15)

6 envios simultâneos da mesma letra para a questão `4` do candidato da seção B.

| Verificação | Esperado | Obtido |
|---|---|---|
| Aceitas com 200 | 1 | 1 |
| Recusadas com 409 | 5 | 5 |
| Outros status | 0 | 0 |
| Respostas gravadas no banco para esta questão | 1 | 1 |
| Questões que seguem abertas | 0 | 0 |

Resposta aceita:

```json
{
    "questao_id": 4,
    "letra_resposta": "C",
    "data_horario_inicio": "2026-11-20T18:45:44.181Z",
    "data_horario_resposta": "2026-11-20T18:45:45.424Z",
    "valida": true,
    "acertou": true,
    "alternativa_correta": "C",
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

Resposta recusada:

```json
{
    "erro": "Esta quest\u00e3o j\u00e1 est\u00e1 encerrada."
}
```

## D. Prova completa sem repetir temas — critérios 1, 2 e 3

Segundo candidato percorre os 12 temas; o 4º é interrompido em vez de respondido.

| Verificação | Esperado | Obtido |
|---|---|---|
| Erros HTTP durante a prova | 0 | 0 |
| Temas distintos nos 12 sorteios (RF05, RF15) | 12 | 12 |
| Temas com mais de uma resposta no banco (RF15) | 0 | 0 |
| `concluido` no sorteio seguinte | true | true |
| Registros no histórico (RF20) | 12 | 12 |
| Temas distintos no histórico | 12 | 12 |
| Registros sem algum campo exigido pelo RF20 | 0 | 0 |
| Registros sem gabarito informado (RF09) | 0 | 0 |
| Questão interrompida sem letra e incorreta (RF13) | ok | ok |

Questão interrompida: `13` (tema 4). Gabarito devolvido no tema 1: `C`.

Histórico completo:

```json
[
    {
        "tema_id": 1,
        "tema": "Fundamentos da Agilidade",
        "questao_id": 4,
        "enunciado": "Qual pr\u00e1tica de melhoria est\u00e1 representada na imagem?",
        "letra_resposta": "C",
        "data_horario_inicio": "2026-11-20T18:45:47.528Z",
        "data_horario_resposta": "2026-11-20T18:45:47.893Z",
        "acertou": true,
        "valida": true,
        "alternativa_correta": "C"
    },
    {
        "tema_id": 2,
        "tema": "Introdu\u00e7\u00e3o ao Scrum",
        "questao_id": 8,
        "enunciado": "Qual conclus\u00e3o \u00e9 correta sobre os itens X e Y?",
        "letra_resposta": "D",
        "data_horario_inicio": "2026-11-20T18:45:47.970Z",
        "data_horario_resposta": "2026-11-20T18:45:48.333Z",
        "acertou": true,
        "valida": true,
        "alternativa_correta": "D"
    },
    {
        "tema_id": 3,
        "tema": "Pap\u00e9is do Scrum",
        "questao_id": 12,
        "enunciado": "Quem permanece respons\u00e1vel pela ordena\u00e7\u00e3o do Product Backlog, mesmo ouvindo os demais?",
        "letra_resposta": "D",
        "data_horario_inicio": "2026-11-20T18:45:48.359Z",
        "data_horario_resposta": "2026-11-20T18:45:48.731Z",
        "acertou": true,
        "valida": true,
        "alternativa_correta": "D"
    },
    {
        "tema_id": 4,
        "tema": "Eventos do Scrum",
        "questao_id": 13,
        "enunciado": "Qual evento do Scrum est\u00e1 representado?",
        "letra_resposta": null,
        "data_horario_inicio": "2026-11-20T18:45:48.757Z",
        "data_horario_resposta": "2026-11-20T18:45:48.884Z",
        "acertou": false,
        "valida": true,
        "alternativa_correta": "D"
    },
    {
        "tema_id": 5,
        "tema": "Artefatos do Scrum",
        "questao_id": 20,
        "enunciado": "Qual resultado pode integrar um Incremento, segundo as informa\u00e7\u00f5es da imagem?",
        "letra_resposta": "C",
        "data_horario_inicio": "2026-11-20T18:45:48.909Z",
        "data_horario_resposta": "2026-11-20T18:45:49.284Z",
        "acertou": true,
        "valida": true,
        "alternativa_correta": "C"
    },
    {
        "tema_id": 6,
        "tema": "Gest\u00e3o do Product Backlog",
        "questao_id": 22,
        "enunciado": "Qual atividade de gest\u00e3o do Product Backlog est\u00e1 ilustrada?",
        "letra_resposta": "A",
        "data_horario_inicio": "2026-11-20T18:45:49.310Z",
        "data_horario_resposta": "2026-11-20T18:45:49.675Z",
        "acertou": true,
        "valida": true,
        "alternativa_correta": "A"
    },
    {
        "tema_id": 7,
        "tema": "Kanban",
        "questao_id": 25,
        "enunciado": "Qual a\u00e7\u00e3o respeita a pol\u00edtica de WIP da imagem?",
        "letra_resposta": "D",
        "data_horario_inicio": "2026-11-20T18:45:49.700Z",
        "data_horario_resposta": "2026-11-20T18:45:50.062Z",
        "acertou": true,
        "valida": true,
        "alternativa_correta": "D"
    },
    {
        "tema_id": 8,
        "tema": "Planejamento \u00c1gil",
        "questao_id": 29,
        "enunciado": "Como a equipe deve usar as informa\u00e7\u00f5es para planejar a pr\u00f3xima Sprint?",
        "letra_resposta": "C",
        "data_horario_inicio": "2026-11-20T18:45:50.088Z",
        "data_horario_resposta": "2026-11-20T18:45:50.445Z",
        "acertou": true,
        "valida": true,
        "alternativa_correta": "C"
    },
    {
        "tema_id": 9,
        "tema": "M\u00e9tricas \u00c1geis",
        "questao_id": 33,
        "enunciado": "Qual foi a velocidade da equipe nessa Sprint, segundo a regra apresentada?",
        "letra_resposta": "B",
        "data_horario_inicio": "2026-11-20T18:45:50.473Z",
        "data_horario_resposta": "2026-11-20T18:45:50.832Z",
        "acertou": true,
        "valida": true,
        "alternativa_correta": "B"
    },
    {
        "tema_id": 10,
        "tema": "Extreme Programming (XP)",
        "questao_id": 40,
        "enunciado": "Qual objetivo da refatora\u00e7\u00e3o \u00e9 mostrado nessa compara\u00e7\u00e3o?",
        "letra_resposta": "D",
        "data_horario_inicio": "2026-11-20T18:45:50.858Z",
        "data_horario_resposta": "2026-11-20T18:45:51.202Z",
        "acertou": true,
        "valida": true,
        "alternativa_correta": "D"
    },
    {
        "tema_id": 11,
        "tema": "Ferramentas para Equipes \u00c1geis",
        "questao_id": 43,
        "enunciado": "Qual \u00e9 a a\u00e7\u00e3o mais adequada diante do resultado apresentado pelo pipeline?",
        "letra_resposta": "D",
        "data_horario_inicio": "2026-11-20T18:45:51.228Z",
        "data_horario_resposta": "2026-11-20T18:45:51.533Z",
        "acertou": true,
        "valida": true,
        "alternativa_correta": "D"
    },
    {
        "tema_id": 12,
        "tema": "Boas Pr\u00e1ticas em Projetos \u00c1geis",
        "questao_id": 46,
        "enunciado": "Por que separar essa corre\u00e7\u00e3o em uma mudan\u00e7a pequena favorece a revis\u00e3o?",
        "letra_resposta": "B",
        "data_horario_inicio": "2026-11-20T18:45:51.557Z",
        "data_horario_resposta": "2026-11-20T18:45:51.934Z",
        "acertou": true,
        "valida": true,
        "alternativa_correta": "B"
    }
]
```

## E. Emissão concorrente do certificado — critério 3

6 chamadas simultâneas a `POST /api/candidatos/certificado` para o candidato da seção D.

| Verificação | Esperado | Obtido |
|---|---|---|
| Códigos distintos devolvidos | 1 | 1 |
| Códigos gravados no banco | 1 | 1 |

Código emitido: `b3345a69d2d54573b4b9d7dbb9ae4c5327aff99ba1d685655a4d6eb507490449`

## Conferência por critério de aceite

| Critério | Verificação | Esperado | Obtido | |
|---|---|---|---|---|
| 1 | Temas cadastrados | 12 | 12 | OK |
| 1 | Questões cadastradas | 48 | 48 | OK |
| 1 | Temas sem exatamente 4 questões | 0 | 0 | OK |
| 1 | Questões sem exatamente 4 alternativas | 0 | 0 | OK |
| 1 | Questões sem exatamente 1 correta | 0 | 0 | OK |
| 1 | Questões cujas letras não são A–D | 0 | 0 | OK |
| 1 | Questões sem imagem | 0 | 0 | OK |
| 1 | Imagens que não abrem (de 48 consultadas) | 0 | 0 | OK |
| 1 | Questões distintas em 6 sorteios simultâneos | 1 | 1 | OK |
| 1 | Prazos distintos em 6 sorteios simultâneos | 1 | 1 | OK |
| 3 | Questões abertas no banco para este candidato | 1 | 1 | OK |
| 3 | Respostas aceitas (200) em 6 envios simultâneos | 1 | 1 | OK |
| 3 | Respostas recusadas (409) | 5 | 5 | OK |
| 3 | Respostas com outro status | 0 | 0 | OK |
| 3 | Respostas gravadas para este candidato nesta questão | 1 | 1 | OK |
| 3 | Questões que seguem abertas para este candidato | 0 | 0 | OK |
| 1 | Erros HTTP durante a prova completa | 0 | 0 | OK |
| 3 | Temas distintos em 12 sorteios | 12 | 12 | OK |
| 3 | Temas com mais de uma resposta no banco | 0 | 0 | OK |
| 1 | Sorteio após os 12 temas | true | true | OK |
| 1 | Registros no histórico | 12 | 12 | OK |
| 3 | Temas distintos no histórico | 12 | 12 | OK |
| 1 | Registros sem algum campo do RF20 | 0 | 0 | OK |
| 1 | Registros sem gabarito informado | 0 | 0 | OK |
| 2 | Questão interrompida: sem letra e incorreta | ok | ok | OK |
| 3 | Códigos distintos em 6 emissões simultâneas | 1 | 1 | OK |
| 3 | Códigos gravados no banco para este candidato | 1 | 1 | OK |

**27 de 27 verificações conferem.**

Legenda: 1 = sorteio, estrutura e histórico; 2 = tempo, interrupção e retomada;
3 = duplicadas e concorrentes.
