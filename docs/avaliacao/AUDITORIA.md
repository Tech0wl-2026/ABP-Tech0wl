# Auditoria integral da rubrica

Referência: [PDF recebido, sete páginas](../referencias/rubrica-sprints-2026-2.pdf). Revisão em 14/10/2026 (America/Sao_Paulo). Este relatório cobre os 25 critérios e os requisitos do desafio. Uma documentação completa não substitui produto, participação ou aceite reais. Não há nota oficial atribuída nesta auditoria.

## Diagnóstico e tratamento

| Achado no início da revisão | Alteração realizada | Dependência restante |
|---|---|---|
| Repositório tinha planejamento, duas imagens e Daily, sem aplicação executável | Página inicial HTML/CSS/JS, Docker Compose e testes | Backend, integração e jornada completa nas Sprints 2/3 |
| DDL, DER e dicionário eram diretórios reservados | Modelo conceitual/lógico, dicionário e DDL com testes | Revisão por Miguel/equipe e coerência com Astah/Figma reais |
| RP08 não estava explicitamente vinculado a tarefas no JSON de planejamento | Vinculado a T062/T063/T098, sem alterar sprints ou quantidade de atividades | Implementar e testar QR com destino à página real |
| Rubrica não estava ligada às entregas | Matriz dos 25 critérios, rastreabilidade e registros de fechamento | Confirmar critérios planejados e horário com professor |
| Link/versionamento do Figma ausente | Registro explícito de pendências e roteiro RF01–RF21 | URL navegável, autoria e exportação da versão entregue |
| Importador poderia substituir texto de issues refinadas | Configuração manual; preservação dos textos, responsáveis e milestones existentes | Refinar no Project conforme trabalho real |
| Dailys antigas continham atividades inventadas por solicitação anterior | Mantidas identificadas como rascunhos, fora da comprovação de participação | Registrar contribuições reais de todos |
| Não havia teste de integração do incremento | CI com PostgreSQL 17, Docker e navegador desktop/mobile | Consultar resultado do commit e completar cenários futuros |

## Cobertura critério por critério

| ID | Pontos | Critério | Evidência/referência | Situação e limite |
|---|---:|---|---|---|
| ES01 | 4 | Product Backlog | [artefato](../../docs/Gestao/BACKLOG.md) | 107 atividades vinculadas a requisitos; refinamento e prioridade exigem acompanhamento. |
| ES02 | 4 | Planejamento da Sprint | [artefato](../../docs/plano-de-entregas.md) | Metas e períodos registrados; horário de fechamento e aceite do plano com professor pendentes. |
| ES03 | 2 | Critérios de aceite | [artefato](../../docs/Gestao/BACKLOG_PLANEJADO.json) | Critérios estão nas issues; conclusão depende de demonstrar cada critério. |
| ES04 | 3 | Rastreabilidade | [artefato](../../docs/avaliacao/RASTREABILIDADE.md) | Mapa requisito → issues → artefatos → validação, sem converter planejamento em conclusão. |
| ES05 | 2 | Entrega incremental | [artefato](../../frontend/index.html) | Primeiro incremento informativo e banco de referência; validar evolução em cada fechamento. |
| ES06 | 3 | Review e Retrospectiva | [artefato](../../docs/sprints/sprint-1.md) | Sem ata real de Review/Retrospectiva ou feedback do professor; preencher após reunião. |
| ES07 | 2 | Definition of Done | [artefato](../../docs/Gestao/DEFINITION_OF_DONE.md) | Proposta publicada; registrar adoção e aplicação pela equipe. |
| ES08 | 2 | Documentação e execução | [artefato](../../docs/Tecnico/INSTALACAO.md) | Comandos reproduzíveis e limitações publicados; registrar execução no ambiente de entrega. |
| ES09 | 8 | Participação individual | [artefato](../../docs/evidencias/sprint-1/participacao.md) | Atas inventadas não são evidência; faltam vínculos verificáveis de todos os integrantes. |
| DW01 | 3 | HTML, CSS e JavaScript sem framework | [artefato](../../frontend/index.html) | Página inicial real com menu e busca; frontend não possui framework. |
| DW02 | 4 | Responsividade, semântica e validação | [artefato](../../testes/frontend.spec.mjs) | Página informativa responsiva; formulários reais de cadastro/login ainda não existem. |
| DW03 | 5 | Backend HTTP e PostgreSQL | [artefato](../../docs/Tecnico/ARQUITETURA.md) | Backend e integração HTTP não implementados. |
| DW04 | 5 | Estudos e base de 48 questões | [artefato](../../docs/conteudo/questoes.md) | Somente amostra com 1 tema e 4 questões; faltam seleção dos 12 temas e conteúdo completo. |
| DW05 | 6 | Motor completo de certificação | [artefato](../../database/schema.sql) | Restrições de referência e testes SQL; falta fluxo real no servidor/interface. |
| DW06 | 4 | Autenticação e integridade no servidor | [artefato](../../docs/Tecnico/API.md) | CPF único e hash no modelo; autenticação, autorização e hash real ainda não implementados. |
| DW07 | 3 | Docker Compose reproduzível | [artefato](../../compose.yaml) | Incremento estático e PostgreSQL em containers; API futura precisará ser integrada. |
| BD01 | 5 | Modelo conceitual e DER | [artefato](../../docs/database/conceitual.png) | Diagrama e fonte editável publicados como proposta técnica para revisão do grupo. |
| BD02 | 5 | Modelo lógico e normalização | [artefato](../../docs/database/logico.png) | Chaves, dicionário e justificativa de 3FN; validar com responsável de modelagem. |
| BD03 | 5 | Modelo físico e DDL PostgreSQL | [artefato](../../database/schema.sql) | DDL executável e suíte em banco vazio; validação no PostgreSQL 17 via CI. |
| BD04 | 5 | DML e consultas parametrizadas | [artefato](../../database/consultas-exemplo.sql) | Seed e PREPARE demonstram SQL; execução pelo driver da futura API está pendente. |
| BD05 | 5 | Persistência e histórico consistente | [artefato](../../testes/database.sql) | Restrições e testes de histórico presentes; integração ponta a ponta pendente. |
| DD01 | 4 | Fluxos e wireframes | [artefato](../../docs/design/fluxo-de-telas.md) | Fluxos de referência publicados; faltam wireframes completos revisados e vínculo ao Figma. |
| DD02 | 4 | Figma navegável e evidências | [artefato](../../docs/design/figma.md) | URL real, navegação, versão e exportações ainda não disponibilizadas. |
| DD03 | 4 | Consistência e recursos visuais | [artefato](../../docs/design/sistema-visual.md) | Referência de cores, tipografia e créditos; falta comparação com Figma aprovado. |
| DD04 | 3 | Mobile/desktop e usabilidade | [artefato](../../docs/design/usabilidade.md) | Verificação técnica responsiva prevista; teste com colegas e comparação com Figma pendentes. |

## Como avaliar sem inflar a nota

A avaliação é cumulativa: mudanças futuras devem preservar o que já funcionava. Somente critérios planejados para a Sprint entram no denominador, conforme acordo com professor. Atendimento parcial vale metade dos pontos; ausência de evidência não equivale a atendimento. A classificação de um item como não avaliável deve ser confirmada pelo professor.

Fórmula: `nota = 10 × pontos obtidos / pontos previstos`. O exemplo do PDF com 45 obtidos e 55 previstos resulta em **8,18/10** (81,82%), e não em 81,81/10. Confirmar a apresentação da escala com o professor; nenhuma nota foi calculada para esta equipe.

ES09 exige participação relevante e verificável de todos. O número de commits, um nome em uma tabela ou uma ata reconstruída não demonstra, por si só, contribuição. Revisão automática pela própria conta não é revisão independente de colega.

## Critérios de conclusão desta revisão técnica

Executar os comandos de [validação](../../testes/README.md), conferir o resultado do CI do commit e revisar o diff antes de integrar. As pendências pedagógicas acima permanecem abertas, mesmo com CI aprovado. Os registros de [Sprint](../sprints/sprint-1.md) devem receber evidências reais no fechamento.

## Resultado observado nesta revisão

O [registro de execução real](../evidencias/sprint-1/validacao-2026-10-14/README.md) conserva hash, CI aprovado, PostgreSQL 17.11, resultado dos 24 testes SQL e capturas dos quatro testes de navegador. As limitações de produto e evidência listadas acima permanecem. RP08 foi acrescentado às issues T062/T063/T098, preservando seus textos e estados.
