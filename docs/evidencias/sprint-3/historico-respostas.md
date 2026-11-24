# Evidência: histórico completo de respostas da certificação

Issue [#65](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/65) — RF20. Registro de 23/11/2026, pelo Scrum Master (Breno).

## O que é gravado

Cada questão sorteada vira uma linha em `servidor.respostas` ([schema.sql](../../../database/servidor/schema.sql)). A rota privada `GET /api/candidatos/historico` devolve, só para o titular do token ([avaliacao.js](../../../backend/src/services/avaliacao.js), `consultarAvaliacao`):

| Campo | Critério da issue |
|---|---|
| `tema_id`, `tema` | Tema |
| `questao_id`, `enunciado` | Questão sorteada |
| `letra_resposta` | Resposta escolhida (`null` quando não houve escolha) |
| `alternativa_correta` | Correta |
| `data_horario_inicio`, `data_horario_resposta` | Data e hora |
| `acertou`, `valida` | Resultado e se foi dentro dos 150 s |

As respostas encerradas não podem ser alteradas nem apagadas (trigger `resposta_imutavel`), então o histórico também vale para avaliações reprovadas.

## Testes que comprovam

Em [api.test.js](../../../backend/test/api.test.js), com PostgreSQL real, executados pelo CI em todo push:

| Teste | O que verifica |
|---|---|
| "histórico registra cada resposta, reprovação e questão sem alternativa" | Candidato interrompe a 1ª questão e erra as outras 11: 12 linhas, uma por tema, cada uma com tema, questão, enunciado, correta (A–D) e data/hora; exatamente uma sem alternativa; resultado **reprovado** com 0 acertos |
| "abandono sem aviso do navegador encerra a questão pelo prazo do servidor" | Questões abandonadas e respondidas fora do prazo aparecem no histórico sem alternativa e como incorretas |
| "questão alheia e identificador inválido não dão acesso" | Um candidato não vê dados de outro |

Execução local em 23/11/2026: **15 testes aprovados, 0 falhas** (PostgreSQL 16).

## Situações cobertas

- ✔ Resposta certa e errada
- ✔ Questão interrompida pelo candidato (sem alternativa)
- ✔ Questão com tempo esgotado (sem alternativa)
- ✔ Avaliação reprovada
- ✔ Isolamento entre candidatos

## Limite

A tela de histórico (issue #107) ainda lê o `localStorage`. A integração com esta rota está na etapa C do plano de correção (Sophia).
