# GitHub Project da ABP

**Project oficial:** [ABP Tech0wl | 2026-2](https://github.com/users/Tech0wl-2026/projects/7)

O Project reúne as 107 issues do repositório oficial. Cada item tem sprint, área, prioridade e janela planejada de execução. O título da issue mantém os identificadores da task e dos requisitos.

## Sprints e entregas

| Sprint | Período de 2026 | Atividades | Entrega |
|---|---|---|---|
| Sprint 1 | 28/09–22/10 | 50 | Figma completo dos RF01–21; UML; modelo conceitual, lógico e físico; DER; dicionário; DDL PostgreSQL |
| Sprint 2 | 23/10–05/11 | 31 | Portal, cadastro/login, estudos e motor da certificação com persistência |
| Sprint 3 | 06/11–25/11 | 26 | Resultados, certificado, QR Code, validação pública, histórico, testes e documentação final |

O campo **Sprint** usa iterações com as durações exatas de 25, 14 e 20 dias. As milestones continuam vinculadas às mesmas issues e com os mesmos prazos. A implementação funcional está planejada nas Sprints 2 e 3.

## Campos

| Campo | Uso |
|---|---|
| Status | Backlog → Pronto para iniciar → Em andamento → Em revisão → Concluído |
| Sprint | Iteração correspondente à sprint oficial |
| Assignees | Responsáveis reais da própria issue |
| Área | Gestão, Figma, Modelagem, UML, Front-end, Back-end, Conteúdo, Infra ou Testes |
| Prioridade | Alta ou Normal, conforme a etiqueta da issue |
| Estimativa | Número a definir com a equipe; permanece vazio até estimativa real |
| Início | Primeiro dia da janela planejada da sprint |
| Prazo | Último dia da janela planejada da sprint |

Início e Prazo são as datas planejadas. Atualize o Status conforme o trabalho avançar e preencha a estimativa depois da conversa com a equipe.

## Visualizações

- **Backlog geral**: tabela.
- [**Quadro da Sprint 1**](https://github.com/users/Tech0wl-2026/projects/7/views/2): atividades da primeira sprint, em colunas por Status.
- [**Quadro da Sprint 2**](https://github.com/users/Tech0wl-2026/projects/7/views/3): atividades da segunda sprint.
- [**Quadro da Sprint 3**](https://github.com/users/Tech0wl-2026/projects/7/views/4): atividades da terceira sprint.
- **Minhas atividades**: tabela; filtro `assignee:@me`.
- **Roadmap por Sprint**: roadmap.

## Como assumir uma atividade

1. Abra o quadro da sprint e escolha uma issue sem responsável.
2. Confira critérios de aceite, requisitos e dependências descritos na issue.
3. Atribua a issue a si em **Assignees**.
4. Atualize o **Status** para Em andamento e crie a branch a partir de `develop`, conforme CONTRIBUTING.md.
5. Abra o Pull Request, vincule a issue e as evidências; passe para Em revisão.
6. Use Concluído após revisão e validação da Definition of Done. Feche a issue com o PR quando aplicável.

A leitura pública do Project não concede edição. Para assumir issues, o integrante precisa das permissões necessárias no repositório; para editar campos e status do Project, precisa também de acesso de escrita ao Project. Confirmar os usuários GitHub antes de convites.

## Daily Scrum

Reunião de até 15 minutos. Conforme orientação do professor, registrar a data e uma tabela com integrante e atividade do dia em `docs/Daily Scrum/AAAA-MM-DD.md`, usando o [modelo simples](../Daily%20Scrum/TEMPLATE.md). Preencha com os relatos da reunião. Os registros reconstruídos continuam identificados na pasta.

## Automação e verificação

A [conferência da configuração inicial](https://github.com/Tech0wl-2026/ABP-Tech0wl/actions/runs/38497866302) confirmou, em 13/10, os 107 itens em Backlog, sem responsáveis, com os seis campos e as datas das sprints preenchidos. Consulte o Project para ver os estados e as atribuições atuais. Os três quadros usam colunas por Status.

A configuração foi executada por [Configurar Project oficial da ABP](https://github.com/Tech0wl-2026/ABP-Tech0wl/actions/runs/38497740488), usando o segredo `ABP_PROJECT_TOKEN` sem registrar seu valor.

O script em `.github/scripts/configurar-project.py` verifica os identificadores das tasks, adiciona cada issue uma única vez e preenche apenas os campos vazios dos itens. Reexecuções preservam os estados e responsáveis existentes. Não há encerramento automático de issues nem estimativas automáticas.

Para reexecutar, abrir Actions → Configurar Project oficial da ABP → Run workflow. O token precisa estar válido. O segredo pode ser removido e o token revogado quando a configuração não precisar ser executada novamente.

O agrupamento de tabelas e a seleção de campos do eixo temporal do Roadmap não são configuráveis pelos parâmetros expostos pela API usada. Os campos Início e Prazo estão preenchidos; ajustes de apresentação podem ser feitos nas opções da visualização no GitHub.
