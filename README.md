# DSM ABP — TechOwl

## Portal de Certificação em Metodologias Ágeis

Projeto de Aprendizagem Baseada em Projetos do **1º DSM da Fatec Jacareí**, semestre **2026-2**. O portal reúne estudo por tema, avaliação de conhecimentos sobre metodologias ágeis e emissão de certificado verificável.

**Situação:** planejamento e organização inicial do repositório. O código da aplicação ainda será desenvolvido; este README não declara o sistema implementado.

## Entregas e cronograma

| Sprint | Período | Entrega |
|---|---|---|
| 1 | 28/09 a 22/10/2026 | Figma completo de RF01 a RF21; UML; modelos conceitual, lógico e físico; DER; dicionário de dados; DDL PostgreSQL |
| 2 | 23/10 a 05/11/2026 | Portal, cadastro/login, estudos e motor da prova com sorteio, cronômetro, feedback, interrupção, retomada e persistência |
| 3 | 06/11 a 25/11/2026 | Resultado, certificado, QR Code, validação pública, histórico/progresso, validação integral e documentação final |

**Apresentação final:** 26/11/2026. A Sprint 1 segue o escopo confirmado pelo grupo: protótipo e modelagem integral, incluindo os requisitos programados nas próximas Sprints.

## Atividades por Sprint

- [Sprint 1 — 50 atividades](https://github.com/Tech0wl-2026/ABP-Tech0wl/milestone/1)
- [Sprint 2 — 31 atividades](https://github.com/Tech0wl-2026/ABP-Tech0wl/milestone/2)
- [Sprint 3 — 26 atividades](https://github.com/Tech0wl-2026/ABP-Tech0wl/milestone/3)

As 107 issues estão abertas, sem atribuição e vinculadas às milestones. Consultar o [backlog](documentos/Gestao/BACKLOG.md) para critérios e dependências.

## Regras principais do portal

- Cadastro com CPF único, nome completo, e-mail e senha; login por CPF e senha.
- Área de estudos organizada pelos mesmos **12 temas** da avaliação.
- **4 questões por tema**, totalizando **48**; uma questão sorteada por tema para cada candidato.
- Cada questão tem imagem, alternativas A/B/C/D e uma única correta.
- Cronômetro visível de **150 segundos**; sem resposta no prazo, a questão encerra como incorreta e mostra a correta.
- Questão interrompida é encerrada e não pode ser respondida novamente. Retomada no próximo tema pendente.
- Nota após os 12 temas; certificado apenas com aproveitamento **≥65%**.
- Certificado com nome, CPF, e-mail, data/hora, nota, percentual e QR Code; validação pública.
- Histórico de todas as avaliações e acompanhamento de temas concluídos/pendentes.

## Tecnologias e restrições

| Camada | Diretriz do desafio |
|---|---|
| Protótipo | Figma navegável |
| Modelagem | UML e modelos conceitual, lógico e físico completos |
| Front-end | HTML, CSS e JavaScript, **sem frameworks** |
| Back-end | Tecnologia Web a definir com a equipe; API e regras no servidor |
| Banco | PostgreSQL com DDL e DML |
| Execução | Aplicação e banco em Docker, orquestrados com Docker Compose |
| Gestão | Scrum, Git, backlog, Sprints e critérios de pronto |

## Navegação da documentação

- [Requisitos oficiais transcritos](documentos/Requisitos/REQUISITOS.md)
- [Backlog e atividades](documentos/Gestao/BACKLOG.md)
- [Planejamento das Sprints](documentos/Gestao/SPRINTS.md)
- [Como contribuir e assumir uma atividade](CONTRIBUTING.md)
- [Definition of Done](documentos/Gestao/DEFINITION_OF_DONE.md)
- [Daily Scrum](documentos/Daily%20Scrum/README.md)
- [Figma](documentos/Prototipo/README.md)
- [Modelagem do banco](documentos/Modelagem/README.md)
- [UML](documentos/UML/README.md)
- [Configuração planejada do GitHub Project](documentos/Gestao/GITHUB_PROJECT.md)

## Equipe

| Integrante | Papel registrado no planejamento |
|---|---|
| Abdi | Product Owner |
| Breno | Scrum Master |
| Gabriel A. | Developer |
| Guilherme | Developer |
| Miguel | Developer |
| Sophia | Developer |
| Tiago | Developer |

Os nomes de usuário GitHub dos integrantes serão confirmados antes de atribuições e convites. As issues começam sem responsáveis, disponíveis para autoatribuição por colaboradores com as permissões necessárias.

## Execução

A aplicação ainda está em desenvolvimento. As instruções validadas serão mantidas em [INSTALACAO.md](documentos/Tecnico/INSTALACAO.md). Não há comando de execução funcional publicado nesta etapa.

## Fontes

Desafio 1DSM 2026-2, versão 29/06/2026; Sprint Planning de 28/09/2026; escopo da Sprint 1 confirmado pelo grupo em 13/10/2026.
