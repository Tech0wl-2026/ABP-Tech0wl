# Configuração inicial do repositório

Registro de 13/10/2026. A estrutura de preparação foi transferida de `breesiqueiramkt/DSM-ABP-breno-` para o repositório oficial `Tech0wl-2026/ABP-Tech0wl`, com atualização dos links.

## Estrutura criada

- 31 arquivos de documentação e configuração.
- 107 issues: 91 atividades da planilha e 16 complementares, distribuídas em 50, 31 e 26 por sprint.
- Milestones com prazo em 22/10, 05/11 e 25/11/2026.
- Etiquetas de sprint, área, tipo e prioridade.
- Branches `main`, `develop` e uma branch para cada sprint.
- Modelos de issues e PRs, guia de contribuição, critérios de pronto e registros de Daily Scrum.

A Sprint 1 reúne protótipo Figma e modelagem completa, incluindo UML, DER, dicionário e DDL. A implementação do portal está distribuída entre as Sprints 2 e 3.

## Project

O [Project oficial](https://github.com/users/Tech0wl-2026/projects/7) foi vinculado ao repositório, com as 107 issues e seis visualizações: backlog, três quadros de sprint, atividades do usuário e roadmap.

Na configuração inicial, os itens ficaram em Backlog, sem responsáveis ou estimativas. Os campos Sprint, Área, Prioridade, Início e Prazo foram preenchidos. O andamento atual deve ser consultado no Project.

As iterações têm 25, 14 e 20 dias, nos períodos de 28/09–22/10, 23/10–05/11 e 06/11–25/11. A [execução de configuração](https://github.com/Tech0wl-2026/ABP-Tech0wl/actions/runs/38497740488) conferiu os itens e testou a reexecução sem duplicações. A [conferência das datas](https://github.com/Tech0wl-2026/ABP-Tech0wl/actions/runs/38495063921) também está registrada no Actions.

## Manutenção

O arquivo `.github/abp-backlog.json` guarda os dados de importação. Os workflows reconhecem as tasks pelo identificador e preservam alterações já feitas pela equipe. O workflow `verificar-project.yml` permite conferir o Project sem modificar seus dados.

Os segredos são usados apenas pelo Actions. Atribuições, estimativas e encerramento das atividades ficam a cargo da equipe. As proteções de branch devem ser verificadas na configuração do GitHub.

[Guia do Project](GITHUB_PROJECT.md) · [Como contribuir](../../CONTRIBUTING.md)
