# Configuração do GitHub Project

**Situação deste documento:** especificação de configuração. Não representa um Project já criado. As issues, branches e arquivos já foram publicados. O Project visual ainda não foi criado.

Nome proposto: **ABP Tech0wl | 2026-2**. Vincular ao repositório ABP-Tech0wl e manter a visibilidade pública existente.

## Campos

| Campo | Valores ou tipo |
|---|---|
| Status | Backlog; Pronto para iniciar; Em andamento; Em revisão; Concluído |
| Sprint | Sprint 1; Sprint 2; Sprint 3 |
| Assignees | Responsáveis reais da issue |
| Área | Gestão; Figma; Modelagem; UML; Front-end; Back-end; Conteúdo; Infra; Testes |
| Prioridade | Alta; Normal |
| Estimativa | Número a validar com a equipe |
| Início | Data |
| Prazo | Data |

Usar o campo Sprint junto às datas oficiais. Caso sejam usadas iterações, configurar separadamente as durações de cada Sprint para respeitar 28/09–22/10, 23/10–05/11 e 06/11–25/11.

## Views

- Backlog geral em tabela, agrupado por Sprint.
- Quadro da Sprint 1, filtrado por Sprint 1 e agrupado por Status.
- Quadro da Sprint 2, filtrado por Sprint 2 e agrupado por Status.
- Quadro da Sprint 3, filtrado por Sprint 3 e agrupado por Status.
- Minhas atividades com responsável `@me`.
- Roadmap com início e prazo de cada Sprint.

## Milestones

As três milestones e a associação das 107 issues foram configuradas com sucesso por `.github/workflows/configurar-abp.yml`, com prazo final em 22/10, 05/11 e 25/11/2026. A distribuição confirmada é 50/31/26. Preservar o início no texto de cada milestone. Associar cada issue à milestone e ao campo Sprint correspondente.

## Fluxo de trabalho

Issue sem responsável fica disponível para autoatribuição. Depois de conferir dependências e critérios, o integrante se atribui e move para Em andamento. PR aberto vai para Em revisão. Concluído exige critérios de pronto e revisão real.

## Automações sugeridas

Adicionar novas issues deste repositório ao Project, preencher status inicial e atualizar itens fechados após validação. Só ativar uma automação que possa ser verificada; não marcar trabalho como concluído pela simples criação da issue.

## Compartilhamento

Confirmar nomes de usuário e permissões de colaboradores antes de convites ou concessão de acesso. Os nomes pessoais da planilha não são identificadores GitHub. Não presumir que todos já têm acesso ao repositório privado.
