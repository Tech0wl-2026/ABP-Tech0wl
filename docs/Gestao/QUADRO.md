# Regras do quadro (Project) — como concluir uma issue

Combinado na [Retrospectiva da Sprint 2](../sprints/retrospectiva-sprint-2.md) (ação A2 e A3). Na Sprint 2 o board terminou com **0 de 30 itens em "Done"**, apesar de 24 entregas. A regra abaixo garante que o board mostre o que foi entregue de verdade.

Quadro: [Project 7](https://github.com/users/Tech0wl-2026/projects/7).

## Colunas

| Coluna | Quando o cartão está aqui | Quem move |
|---|---|---|
| Pronto pra iniciar | Issue planejada na sprint, com responsável | SM no planejamento |
| Em andamento | O responsável criou a branch `feat/issue-N-...` | Dono da issue |
| Em revisão | PR aberto para `develop` com `Closes #N` | Dono da issue |
| **Done** | Checklist da issue todo marcado **e** issue fechada | Automático ao fechar a issue |

## Regra de ouro: pronto no mesmo dia

Uma issue está pronta quando atende a [Definition of Done](DEFINITION_OF_DONE.md):

1. Todos os critérios de aceite marcados na issue.
2. PR aprovado por outro integrante, com o CI verde.
3. Evidência linkada na issue (PR, print ou arquivo em `docs/evidencias/`).

Com isso, **no mesmo dia**: fazer o merge do PR na `develop` e fechar a issue. O cartão vai sozinho para "Done".

> Atenção: `Closes #N` só fecha a issue sozinho quando o PR entra na branch padrão (`main`). Como os PRs vão para a `develop`, o dono **fecha a issue manualmente** logo depois do merge (botão "Close issue" → "Close as completed"). O `Closes #N` continua obrigatório: ele liga o PR à issue e fecha qualquer uma que tenha ficado esquecida quando a `develop` for para a `main`.

## Automação do Project (configurar uma vez)

No Project 7: **⋯ → Workflows** e ativar:

| Workflow | Ação |
|---|---|
| Item closed | Status → **Done** |
| Pull request merged | Status → **Done** |
| Item reopened | Status → **Em andamento** |
| Item added to project | Status → **Pronto pra iniciar** |

O repositório também tem a verificação [Conferir vínculo com issue](../../.github/workflows/verificar-pr.yml), que avisa no PR quando falta `Closes #N`.

## Conferência do board na Daily (SM, 2 minutos)

Ao fim de cada Daily, o Scrum Master confere e registra no arquivo da Daily a linha `Board conferido: OK` ou o que foi corrigido:

- [ ] Alguma issue com checklist completo ainda aberta? → fechar hoje.
- [ ] Algum cartão em "Em revisão" sem PR? → voltar para "Em andamento".
- [ ] Algum PR aberto há mais de 2 dias sem revisão? → indicar revisor.
- [ ] Algum cartão fechado fora de "Done"? → mover.
- [ ] Alguma issue da sprint sem responsável ou sem o campo Sprint? → corrigir.

Consulta rápida das issues prontas e ainda abertas:

```sh
gh issue list -R Tech0wl-2026/ABP-Tech0wl --state open --search "milestone:\"Sprint 3\""
```

O registro de cada fechamento conferido pelo SM fica em [fechamento-issues.md](fechamento-issues.md).

## No fim da sprint

- Nenhuma issue da sprint aberta sem decisão: ou fechada, ou movida para a próxima sprint com o motivo comentado.
- Print do board com a coluna "Done" anexado ao fechamento em `docs/sprints/sprint-N.md`.
- Burndown atualizado a partir das issues fechadas, e não mais reconstruído pelos commits.
