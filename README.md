# Tech0wl · Portal de Certificação em Metodologias Ágeis

ABP do **1º DSM da Fatec Jacareí · 2026-2**. O produto previsto reúne estudos por tema, avaliação e certificado verificável.

**Estado atual:** planejamento, modelos de referência e primeiro incremento informativo. A página inicial funciona em HTML/CSS/JS; o PostgreSQL possui schema e amostra com quatro questões. Cadastro, login, prova e emissão/validação de certificado ainda serão implementados. O frontend estático e o banco não estão integrados por uma API.

[Project oficial](https://github.com/users/Tech0wl-2026/projects/7) · [Auditoria dos 25 critérios da rubrica](docs/avaliacao/AUDITORIA.md) · [Instalação](docs/Tecnico/INSTALACAO.md) · [Validação](testes/README.md)

## Executar o incremento

Requisitos: Docker e Docker Compose v2. Em uma cópia deste repositório:

```sh
cp .env.example .env
# Defina uma senha local no .env.
docker compose up --build -d --wait
```

Abrir **http://localhost:8080**. O banco é inicializado em volume vazio; dados persistem entre reinícios. Não existe conta de teste ou login nesta etapa. Consulte [instruções completas e limites](docs/Tecnico/INSTALACAO.md).

## Entregas

| Sprint | Período | Meta |
|---|---|---|
| [1](docs/sprints/sprint-1.md) | 28/09–22/10/2026 | Figma completo RF01–RF21, UML e modelagem integral; incremento inicial para DW01 |
| [2](docs/sprints/sprint-2.md) | 23/10–05/11/2026 | Portal, cadastro/login, estudos e motor da avaliação com persistência/retomada |
| [3](docs/sprints/sprint-3.md) | 06/11–25/11/2026 | Resultado, certificado/QR, validação pública, histórico/progresso e regressão |

Apresentação: **26/11/2026**. Hora de fechamento a confirmar. [Plano de cobertura da rubrica](docs/plano-de-entregas.md): ES01–ES09 e DW01 devem ser demonstrados nas três Sprints. Modelos publicados nesta revisão são propostas técnicas, sujeitas a revisão do grupo. Nenhuma tag final foi criada antecipadamente.

O Project organiza backlog, três quadros de Sprint, Minhas atividades e Roadmap. As milestones têm [50 atividades na Sprint 1](https://github.com/Tech0wl-2026/ABP-Tech0wl/milestone/1), [31 na Sprint 2](https://github.com/Tech0wl-2026/ABP-Tech0wl/milestone/2) e [26 na Sprint 3](https://github.com/Tech0wl-2026/ABP-Tech0wl/milestone/3). Estado e responsáveis reais devem ser consultados nas issues; alguns integrantes já assumiram tarefas. A existência de uma issue não representa entrega.

## Regras principais

- CPF único no cadastro; login por CPF/senha.
- Estudos nos mesmos 12 temas da avaliação; quatro questões por tema, total de 48.
- Uma questão sorteada por tema, imagem, A/B/C/D e uma correta.
- Prazo de 150 segundos validado pelo servidor; expiração sem envio é incorreta, com feedback.
- Questão interrompida é encerrada, sem reabertura; retomar no próximo tema pendente.
- Resultado após os 12 temas; certificado com aproveitamento ≥65%, campos obrigatórios e QR de validação pública.
- Histórico preservado e progresso dos temas. Ver [requisitos completos](docs/Requisitos/REQUISITOS.md) e [decisões pendentes](docs/Gestao/DECISOES.md).

## Estrutura e evidências

| Local | Conteúdo |
|---|---|
| [frontend](frontend/README.md) | HTML/CSS/JS sem framework, navegação mobile e busca |
| [backend](backend/README.md) | Limites e integração ainda pendente |
| [database](docs/database/README.md) | DER conceitual/lógico, fontes editáveis, dicionário, 3FN e DDL PostgreSQL |
| [Design e Figma](docs/design/figma.md) | Fluxos, referência visual, versão/exportações pendentes |
| [UML](docs/UML/README.md) | Orientações Astah, domínio editável e vínculo aos estados |
| [Gestão](docs/Gestao/GITHUB_PROJECT.md) | [Backlog](docs/Gestao/BACKLOG.md), [DoD](docs/Gestao/DEFINITION_OF_DONE.md), [rastreabilidade](docs/avaliacao/RASTREABILIDADE.md) |
| [Daily Scrum](docs/Daily%20Scrum/README.md) | Um arquivo por dia, apenas integrante/atividade; rascunhos identificados |
| [Testes](testes/README.md) | Integridade SQL, navegador e CI do incremento |
| [Conteúdo](docs/conteudo/questoes.md) | Amostra de quatro questões; completar/revisar 12 temas e 48 questões |

## Equipe

| Integrante | Papel planejado |
|---|---|
| Abdi | Product Owner |
| Breno | Scrum Master |
| Gabriel A. | Developer |
| Guilherme | Developer |
| Miguel | Developer |
| Sophia | Developer |
| Tiago | Developer |

Confirmar identidades GitHub antes de novas atribuições. [Como contribuir](CONTRIBUTING.md) e [participação verificável](docs/evidencias/sprint-1/participacao.md). As atividades inventadas nos primeiros registros de Daily não são evidência de reunião ou participação.

## Pendências para a entrega

Vincular o Figma real navegável e sua versão/exportações; revisar os modelos com a equipe; comprovar contribuições de todos; confirmar decisões de nota/tentativas e critérios planejados; realizar teste com colegas, Review e Retrospectiva reais. O CI verifica o incremento disponível e não certifica atendimento integral da rubrica.

Fontes: [rubrica recebida](docs/referencias/rubrica-sprints-2026-2.pdf), desafio 1DSM 2026-2 (29/06/2026), planejamento de 28/09 e escopo da Sprint 1 confirmado pelo grupo. Não há licença global definida; confirmar direitos com os autores antes de reutilização externa.
