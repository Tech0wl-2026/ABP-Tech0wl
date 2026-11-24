# Apresentação final — 26/11/2026

Issue [#104](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/104). Preparado pelo Scrum Master (Breno) em 23/11/2026.

**Desenvolvimento encerra em 25/11.** Depois disso, só correção de erro que impeça a demonstração, com PR e CI verde.

## Antes de apresentar (25/11 à noite e 26/11)

- [ ] `develop` integrada à `main` com o CI verde; tag `sprint-3` no commit entregue.
- [ ] Ambiente da demonstração no ar, testado na véspera:
  - Docker local: `docker compose up --build` e abrir `http://localhost:8080`.
  - Render: abrir o site **5 minutos antes**, porque a API gratuita "dorme" e leva cerca de 1 minuto para acordar.
- [ ] Uma conta de demonstração já criada (dados fictícios) e outra para criar ao vivo.
- [ ] Figma aberto em outra aba nos links de [figma.md](../design/figma.md).
- [ ] Vídeo da Sprint 3 publicado e linkado no README (plano B se a internet falhar).
- [ ] Review e Retrospectiva da Sprint 3 registradas em [sprint-3.md](sprint-3.md).

## Roteiro (cerca de 12 minutos)

| Tempo | Parte | Quem | O que mostrar |
|---|---|---|---|
| 1 min | Abertura | Breno (SM) | Problema e proposta do portal; equipe e papéis |
| 1 min | Produto e backlog | Abdi (PO) | Requisitos, [user stories](../Gestao/USER_STORIES.md) e o que entrou em cada sprint |
| 1 min | Design | Guilherme | Protótipo no Figma (computador e celular) e [sistema visual](../design/sistema-visual.md) |
| 1 min | Banco e modelagem | Abdi | [DER, lógico e dicionário](../database/README.md); tabelas do schema `servidor` |
| 5 min | **Demonstração** | Tiago, Miguel, Sophia | Roteiro da tabela abaixo |
| 1 min | Conteúdo | Gabriel | 12 temas, 48 questões, apostilas e a [revisão das questões](../conteudo/questoes.md) |
| 1 min | Qualidade | Breno | CI, testes da API, [validação do MVP](../evidencias/sprint-3/validacao-mvp.md), [desempenho](../evidencias/sprint-3/desempenho.md) e Docker |
| 1 min | Processo | Breno | [Burndown](../Gestao/burndown/README.md), Dailies, [Retrospectiva da Sprint 2](retrospectiva-sprint-2.md) e o que melhorou |

### Demonstração ao vivo

| # | Passo | O que o professor deve ver |
|---|---|---|
| 1 | Cadastro com CPF fictício | Validação de nome, CPF e senha; conta criada |
| 2 | Login | Entrada no portal com token; senha não fica no navegador |
| 3 | Estudos | 12 temas em 4 módulos e o material de um tema |
| 4 | Prova | Questão com imagem, 4 alternativas e cronômetro de 150 s |
| 5 | Responder | Alternativa correta mostrada depois da resposta |
| 6 | Pausar e voltar | Retomada no próximo tema; tema encerrado não volta |
| 7 | Concluir | Resultado com nota e percentual (aprovado com 65% ou mais) |
| 8 | Certificado | Dados do candidato e emissão em PDF |
| 9 | Validação pública | QR Code ou código abre a página de validação sem CPF e e-mail |
| 10 | Histórico e progresso | Respostas, corretas e temas concluídos |
| 11 | Sair | Sessão encerrada; portal pede login |

Os passos 9 e 10 dependem das issues #64 e #107. Se não estiverem prontos em 25/11, **não demonstrar** e citar como pendência conhecida, sem improvisar.

## Evidências por critério

| Área | Onde está |
|---|---|
| Figma (DD01–DD04) | [figma.md](../design/figma.md), [fluxo de telas](../design/fluxo-de-telas.md), [usabilidade](../design/usabilidade.md), [protótipo](../Prototipo/README.md) |
| Modelos (BD01–BD03) | [docs/database](../database/README.md), [dicionário](../database/dicionario.md), [schema servidor](../../database/servidor/schema.sql) |
| UML | [docs/UML](../UML/README.md) |
| Código | [frontend](../../frontend/README.md), [backend](../../backend/README.md) |
| Testes | [api.test.js](../../backend/test/api.test.js), [frontend.spec.mjs](../../testes/frontend.spec.mjs), [validação do MVP](../evidencias/sprint-3/validacao-mvp.md) |
| Documentação (ES08) | [instalação](../Tecnico/INSTALACAO.md), [API](../Tecnico/API.md), [funcionalidades](../Tecnico/FUNCIONALIDADES.md), [interrupção](../Tecnico/INTERRUPCAO.md) |
| Docker (DW07) | [compose.yaml](../../compose.yaml), [integração dos containers](../evidencias/sprint-3/integracao-containers.md), [ambiente limpo](../evidencias/sprint-3/ambiente-limpo.md) |
| Gestão (ES01–ES09) | [backlog](../Gestao/BACKLOG.md), [DoR](../Gestao/DEFINITION_OF_READY.md), [DoD](../Gestao/DEFINITION_OF_DONE.md), [quadro](../Gestao/QUADRO.md), [burndown](../Gestao/burndown/README.md), [Dailies](../Daily%20Scrum/README.md), [plano da Sprint 3](plano-sprint-3.md) |

## Pendências conhecidas em 23/11

Atualizar esta lista em 25/11, depois do fechamento:

- Prova, resultado e retomada ainda ficam no navegador; a API está pronta e testada (#105).
- Páginas de histórico e de validação pública ainda não existem (#107, #64); QR Code no certificado (#56).
- Detalhes em [validacao-mvp.md](../evidencias/sprint-3/validacao-mvp.md).

## Review e Retrospectiva da Sprint 3 (25/11)

Registrar em [sprint-3.md](sprint-3.md), no mesmo modelo da [Retrospectiva da Sprint 2](retrospectiva-sprint-2.md):

1. Data, horário e presentes.
2. O que foi entregue e o que não foi, issue por issue.
3. Conferência das 10 ações da Retrospectiva da Sprint 2: aplicada, parcial ou não aplicada.
4. O que funcionou, o que não funcionou e o que levamos para os próximos projetos.
5. Feedback real do professor e do PO.
