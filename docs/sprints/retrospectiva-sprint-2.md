# Review e Retrospectiva da Sprint 2

**Sprint:** 23/10–05/11/2026 (encerramento considerado pelo professor: 06/11/2026, America/Sao_Paulo).
**Registro:** 10/11/2026, conduzido pelo Scrum Master (Breno).
**Base:** os dois pareceres de avaliação da Sprint 2 — [parecer técnico por critério](#1-review--o-que-a-avaliação-mostrou) (07/11, 69,5 de 100) e [relatório de avaliação individual](#avaliação-individual) (08/11).

| Campo | Registro |
|---|---|
| Data da reunião | 10/11/2026 |
| Participantes | Abdi (PO), Breno (SM), Gabriel, Guilherme, Miguel, Tiago, Sophia — **confirmar presença na Daily e ajustar esta linha** |
| Duração | Até 30 minutos |
| Formato | O que funcionou / O que não funcionou / O que vamos mudar, com responsável e prazo |

## 1. Review — o que a avaliação mostrou

**Resultado da Sprint 2:** 69,5 de 100 pontos (nota sugerida 6,95).

| Área | Pontos | Máximo |
|---|---:|---:|
| Engenharia de Software (ES) | 24 | 30 |
| Desenvolvimento Web (DW) | 18 | 30 |
| Banco de Dados (BD) | 20 | 25 |
| Design Digital (DD) | 7,5 | 15 |

**Atendidos:** ES01, ES03, ES04, ES05, ES08, ES09, DW01, DW07, BD03, BD04, BD05.
**Parciais:** ES02, ES07, DW02–DW06, BD01, BD02, DD01–DD04.
**Não atendido:** ES06 (Review e retrospectiva) — este documento corrige esse item.

Feedback principal do professor:

1. **As telas não usam a API.** O backend funciona e passou em 13 testes com PostgreSQL, mas `auth.js` e `prova.js` guardam contas, sessão, questões e resultado no `localStorage`, e o gabarito está no JavaScript. Isso derrubou DW03, DW04, DW05 e DW06 para parcial.
2. **Dois modelos de banco.** O schema `public` (referência) e o `servidor` (usado pela API) não estão sincronizados no DER e no lógico (BD01, BD02).
3. **Figma incompleto.** Falta exportação datada da Sprint 2, telas de erro, tempo esgotado e retomada, e o teste de usabilidade com colegas (DD01–DD04).
4. **Fechamento da sprint vazio.** `sprint-2.md` ficou com campos "Pendente", sem Review nem Retrospectiva (ES02, ES06, ES07).
5. **Board sem conclusão.** 0 de 30 issues fechadas e nada em "Done", embora o burndown mostre 24 entregues.

### Avaliação individual

| Integrante | Papel | Nota S1 | Nota S2 | Variação |
|---|---|---:|---:|:--:|
| Sophia | Dev | 6,8 | 8,8 | ▲ 2,0 |
| Breno | SM | 9,3 | 8,6 | ▼ 0,7 |
| Miguel | Dev | 5,2 | 7,3 | ▲ 2,1 |
| Gabriel | Dev | 5,9 | 6,7 | ▲ 0,8 |
| Tiago | Dev | 5,7 | 6,4 | ▲ 0,7 |
| Abdi | PO | 7,8 | 6,3 | ▼ 1,5 |
| Guilherme | Dev | 6,1 | 5,6 | ▼ 0,5 |

## 2. Melhorias combinadas na Sprint 1 — foram aplicadas?

| Melhoria da Sprint 1 | Resultado na Sprint 2 |
|---|---|
| Distribuir o trabalho no Git | ✅ Aplicada — os 7 integrantes commitaram trabalho próprio |
| Miguel versionar o próprio trabalho | ✅ Aplicada — `questao.js`, `certificado.js` e `auth.js` |
| Criar o burndown | ✅ Aplicada — [burndown da Sprint 2](../Gestao/burndown/README.md) |
| Identificar o grupo no README | ✅ Aplicada |
| Registrar as Dailies na hora | ⚠️ Piorou — só 03/11 e 04/11 registradas |
| Comentar e revisar o trabalho dos colegas | ❌ Não aplicada — 1 review, nenhum comentário entre integrantes |
| Usar branches `feature/*` e PR por tarefa | ❌ Não aplicada — 3 PRs na sprint, quase tudo direto na branch |
| Fechar os itens no board | ❌ Piorou — 0 de 30 fechadas |
| Fazer a Retrospectiva | ❌ Não aplicada — corrigida com este documento |

## 3. Retrospectiva

### O que funcionou

- Volume de entrega: telas, área de estudos, prova com cronômetro, 48 questões, 4 apostilas, API, Docker e testes.
- Todo o time contribuiu com algo identificável (ES09 com nota máxima).
- Sophia e Miguel tiveram a maior evolução, seguindo a orientação da Sprint 1.
- Burndown, README e documentação de execução resolveram pendências antigas.
- Backend sólido: bcrypt, JWT, SQL parametrizado, regras de prazo e testes com banco real.

### O que não funcionou

- Frontend e backend foram feitos em paralelo e nunca foram ligados.
- O trabalho se concentrou nos últimos dias (03 a 05/11), sem Daily registrada antes disso.
- Os cartões andaram no board, mas nenhum foi concluído nem fechado.
- Commits direto nas branches principais quebraram o Docker duas vezes (03/11 e 05/11).
- Ninguém revisava o PR do colega; não houve comentários nas issues.
- O fechamento da sprint ficou para depois e não foi feito.

### O que vamos mudar na Sprint 3

| # | Ação | Responsável | Prazo | Como saber que funcionou |
|---|---|---|---|---|
| A1 | Ligar todas as telas à API antes de criar telas novas; acesso até 10/11 | Tiago e Miguel, com apoio do Abdi | 10/11 (acesso), 15/11 (prova) | Nenhum `localStorage` com conta, senha, questão ou gabarito |
| A2 | **Fechar a issue no mesmo dia em que ela fica pronta**, pelo PR com `Closes #N`, e o cartão ir para "Done" | Cada dono da issue; SM confere | Toda Daily | Nenhuma issue com checklist completo aberta; ver [regras do quadro](../Gestao/QUADRO.md) |
| A3 | Conferência do board ao fim de cada Daily (2 minutos) | Breno (SM) | Toda Daily | Registro "Board conferido" no arquivo da Daily |
| A4 | Uma branch `feat/issue-N-...` e um PR por issue; nada direto na `main` | Todos | Sempre | CI verde em todo PR; ≥ 1 PR por pessoa por semana |
| A5 | Todo PR revisado e comentado por outro integrante antes do merge | Todos | Sempre | Cada PR com pelo menos 1 aprovação ou comentário |
| A6 | Daily registrada no mesmo dia em `docs/Daily Scrum/AAAA-MM-DD.md` | Guilherme | Todo dia útil | Nenhum dia útil sem arquivo de 06/11 a 25/11 |
| A7 | Alinhar DER, lógico e dicionário ao schema `servidor` | Abdi | 20/11 | BD01 e BD02 sem divergência |
| A8 | Figma das telas novas, exportação datada e teste de usabilidade com colegas | Guilherme e Gabriel | 22/11 | Exportação em `docs/design/` e resultado em `usabilidade.md` |
| A9 | User Stories no formato "Como…, quero…, para…" no backlog | Abdi (PO) | 13/11 | Backlog com user story em cada RF |
| A10 | Review e Retrospectiva da Sprint 3 feitas em 25/11, antes da entrega | Breno (SM) | 25/11 | `sprint-3.md` sem campo "Pendente" |

Estas ações entram como pauta fixa: na Retrospectiva da Sprint 3 o time confere cada uma (aplicada, parcial ou não aplicada), como foi feito na seção 2.

**Aprovado pela equipe em:** ____/11/2026 (preencher na Daily em que o time validar estas ações).
