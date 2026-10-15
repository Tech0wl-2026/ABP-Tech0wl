# Plano de entregas e cobertura da rubrica

Plano técnico proposto após leitura da rubrica. Preserva as metas acordadas pelo grupo; a equipe deve confirmar com o professor quais critérios entram na avaliação de cada Sprint. Não é ata de aprovação.

| Sprint | Período / fechamento | Meta e demonstração |
|---|---|---|
| 1 | 28/09–22/10/2026; hora a confirmar, America/Sao_Paulo | Figma RF01–RF21, modelagem completa e UML; demonstrar página inicial informativa e DDL como incremento transversal |
| 2 | 23/10–05/11/2026; hora a confirmar | Cadastro/login, estudos completos, motor da prova, persistência/retomada e Compose integrado |
| 3 | 06/11–25/11/2026; hora a confirmar | Resultado, certificado/QR, validação pública, histórico/progresso e regressão integral |

Apresentação: 26/11/2026. O horário de entrega não foi fornecido; não inferir 23h59.

## Critérios propostos por Sprint

- Sprint 1: ES01, ES02, ES03, ES04, ES05, ES06, ES07, ES08, ES09, DW01, BD01, BD02, BD03, DD01, DD02, DD03, DD04.
- Sprint 2: ES01, ES02, ES03, ES04, ES05, ES06, ES07, ES08, ES09, DW01, DW02, DW03, DW04, DW05, DW06, DW07, BD01, BD02, BD03, BD04, BD05, DD01, DD02, DD03, DD04.
- Sprint 3: ES01, ES02, ES03, ES04, ES05, ES06, ES07, ES08, ES09, DW01, DW02, DW03, DW04, DW05, DW06, DW07, BD01, BD02, BD03, BD04, BD05, DD01, DD02, DD03, DD04.

ES01–ES09 e DW01 são transversais às três Sprints. BD/DD construídos na primeira continuam sujeitos a revisão cumulativa. DD04 na Sprint 1 exige teste real do protótipo; a comparação integral entre design e sistema acontece com a implementação. O planejamento do item não declara atendimento integral. DW07 já possui infraestrutura para o incremento inicial, mas sua demonstração completa inclui a futura API.

A página inicial antecipa uma parte de T001/RF01 para permitir demonstrar HTML/CSS/JS na primeira Sprint, como exige DW01. A issue de implementação na Sprint 2 continua aberta para integração, revisão visual e aceite, sem redistribuir as 107 atividades silenciosamente.

## Fechamento reproduzível

1. Atualizar o [registro da Sprint](sprints/sprint-1.md), com escopo entregue e não entregue, resultados de testes e feedback real.
2. Incluir exportações e versão do Figma e contribuições individuais; não depender de um link externo mutável como única evidência.
3. Copiar o estado das issues relevantes (status, responsáveis, aceite e evidências) para o registro ou um snapshot datado. O Project continua sendo a fonte operacional, sem um segundo backlog manual.
4. Executar CI e revisar o commit a entregar. Registrar horário real, hash completo, pendências e mudança desde a Sprint anterior.
5. Somente no fechamento aprovado, criar tag imutável `sprint-1`, `sprint-2` ou `sprint-3` no commit entregue. Não mover a tag depois; correções recebem novo commit/tag suplementar e explicação.
6. Registrar Review e Retrospectiva reais. Levar a melhoria acordada à próxima Sprint e demonstrar se foi aplicada.

Nenhuma tag final de Sprint foi criada antecipadamente por esta revisão.
