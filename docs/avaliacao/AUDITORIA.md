# Acompanhamento da rubrica

Situação em 21/10/2026, com base na [rubrica do professor](../referencias/rubrica-sprints-2026-2.pdf). A tabela reúne os 25 critérios, as referências do projeto e as pendências de avaliação. A nota será definida pelo professor.

## Entrega disponível

O repositório tem três páginas públicas baseadas no Figma, API Node.js/Express, PostgreSQL e execução pelo Docker Compose. O [CI da versão revisada](https://github.com/Tech0wl-2026/ABP-Tech0wl/actions/runs/39694104651) passou pelos testes de instalação, SQL, backend e navegador. Após a revisão do grupo, o [PR #120](https://github.com/Tech0wl-2026/ABP-Tech0wl/pull/120) integrou as páginas e os atalhos das sprints à main.

O [review da Sprint 1](../sprints/review-sprint-1-2026-10-21.md) detalha as pendências de protótipo, modelagem e fechamento. A [lista de funcionalidades](../Tecnico/FUNCIONALIDADES.md) explica o que já funciona e o que ainda precisa de integração.

## Critérios

| ID | Pontos | Critério | Referência | Situação |
|---|---:|---|---|---|
| ES01 | 4 | Product Backlog | [artefato](../../docs/Gestao/BACKLOG.md) | 107 atividades no backlog; prioridade e refinamento acompanhados pelo Project. |
| ES02 | 4 | Planejamento da Sprint | [artefato](../../docs/plano-de-entregas.md) | Metas e períodos registrados; horário de fechamento e critérios de avaliação a confirmar. |
| ES03 | 2 | Critérios de aceite | [artefato](../../docs/Gestao/BACKLOG_PLANEJADO.json) | Checklists nas issues; revisão dos critérios e evidências registrada em Gestão. |
| ES04 | 3 | Rastreabilidade | [artefato](../../docs/avaliacao/RASTREABILIDADE.md) | Matriz com os 38 requisitos, issues e referências atualizadas. |
| ES05 | 2 | Entrega incremental | [artefato](../../frontend/index.html) | Páginas públicas, banco e API disponíveis. Conferir a evolução no fechamento de cada sprint. |
| ES06 | 3 | Review e Retrospectiva | [artefato](../../docs/sprints/sprint-1.md) | Breno confirmou a revisão das páginas e dos atalhos com o grupo. Atas de Review, Retrospectiva e feedback do professor ainda precisam de registro. |
| ES07 | 2 | Definition of Done | [artefato](../../docs/Gestao/DEFINITION_OF_DONE.md) | Critérios de pronto publicados; adoção pela equipe pendente na issue #1. |
| ES08 | 2 | Documentação e execução | [artefato](../../docs/Tecnico/INSTALACAO.md) | Instalação e testes documentados, com execução do Compose no CI. |
| ES09 | 8 | Participação individual | [artefato](../../docs/evidencias/sprint-1/participacao.md) | Contribuições precisam de vínculos individuais. Os registros reconstruídos de Daily continuam identificados. |
| DW01 | 3 | HTML, CSS e JavaScript sem framework | [artefato](../../frontend/index.html) | Três páginas públicas em HTML/CSS/JavaScript, sem framework. |
| DW02 | 4 | Responsividade, semântica e validação | [artefato](../../testes/frontend.spec.mjs) | 16 testes de navegador em cinco larguras. Cadastro e login ainda precisam ser ligados à interface. |
| DW03 | 5 | Backend HTTP e PostgreSQL | [artefato](../../docs/Tecnico/ARQUITETURA.md) | API Node/Express e PostgreSQL funcionando em containers, com 13 testes do backend. |
| DW04 | 5 | Estudos e base de 48 questões | [artefato](../../docs/conteudo/questoes.md) | 12 temas, 48 questões e imagens no banco da API. Faltam a área de estudos e a revisão pedagógica das 12 questões novas. |
| DW05 | 6 | Motor completo de certificação | [artefato](../../database/schema.sql) | API com sorteio, prazo, resposta, retomada e resultado. A jornada pela interface ainda está pendente. |
| DW06 | 4 | Autenticação e integridade no servidor | [artefato](../../docs/Tecnico/API.md) | CPF único, bcrypt, JWT e regras no servidor. Falta integrar as telas e fechar a política de interrupção por perda de conexão. |
| DW07 | 3 | Docker Compose reproduzível | [artefato](../../compose.yaml) | Frontend, API e PostgreSQL pelo Compose; scripts de inicialização conferidos no CI. |
| BD01 | 5 | Modelo conceitual e DER | [artefato](../../docs/database/conceitual.png) | Modelo conceitual e DER disponíveis; alinhar com o modelo executável da API. |
| BD02 | 5 | Modelo lógico e normalização | [artefato](../../docs/database/logico.png) | Modelo lógico, chaves e dicionário disponíveis. Diferenças entre public e servidor precisam de alinhamento. |
| BD03 | 5 | Modelo físico e DDL PostgreSQL | [artefato](../../database/schema.sql) | DDL e seed executados em banco vazio, no PostgreSQL 17 do CI. |
| BD04 | 5 | DML e consultas parametrizadas | [artefato](../../database/consultas-exemplo.sql) | DML, consultas PREPARE de referência e queries parametrizadas pelo driver pg disponíveis. |
| BD05 | 5 | Persistência e histórico consistente | [artefato](../../testes/database.sql) | Persistência e histórico testados no backend. A conferência do fluxo pelas telas ainda está pendente. |
| DD01 | 4 | Fluxos e wireframes | [artefato](../../docs/design/fluxo-de-telas.md) | Roteiro de fluxos e arquivos Figma disponíveis; conferir todos os estados internos da avaliação. |
| DD02 | 4 | Figma navegável e evidências | [artefato](../../docs/design/figma.md) | Links desktop e mobile acessíveis. Versão de entrega e revisão integral de RF01–RF21 ainda precisam de registro. |
| DD03 | 4 | Consistência e recursos visuais | [artefato](../../docs/design/sistema-visual.md) | Páginas públicas ajustadas ao Figma e revisadas pelo grupo. Substituições visuais documentadas. |
| DD04 | 3 | Mobile/desktop e usabilidade | [artefato](../../docs/design/usabilidade.md) | Comparação das páginas públicas e testes responsivos feitos. Registrar tarefas, dispositivos e resultados do teste de usabilidade. |

## Cálculo e fechamento

A avaliação é cumulativa. Os critérios considerados em cada sprint devem ser combinados com o professor. Pela rubrica, atendimento parcial vale metade dos pontos.

A fórmula é `nota = 10 × pontos obtidos / pontos previstos`. No exemplo de 45 pontos obtidos em 55, a nota é **8,18/10**, equivalente a 81,82%. A escala de apresentação deve ser confirmada com o professor.

Para ES09, vincule arquivos, commits ou revisões às contribuições de cada integrante. Os registros reconstruídos de Daily permanecem identificados; o levantamento está em [participação](../evidencias/sprint-1/participacao.md).

No fechamento, registre a versão entregue, o CI, o feedback e as reuniões no [documento da sprint](../sprints/sprint-1.md). As [evidências de 14/10](../evidencias/sprint-1/validacao-2026-10-14/README.md) conservam os testes daquela versão.
