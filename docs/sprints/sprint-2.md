# Sprint 2 — Portal, estudos e motor da avaliação

**Período:** 23/10–05/11/2026, America/Sao_Paulo. **Fechamento:** no último dia do período, em horário a combinar. O encerramento será registrado após o aceite.

## Escopo e critérios

Meta: Portal, estudos e motor da avaliação. [Atividades e critérios de aceite](https://github.com/Tech0wl-2026/ABP-Tech0wl/milestone/2); [plano de avaliação](../plano-de-entregas.md).

Critérios propostos: ES01, ES02, ES03, ES04, ES05, ES06, ES07, ES08, ES09, DW01, DW02, DW03, DW04, DW05, DW06, DW07, BD01, BD02, BD03, BD04, BD05, DD01, DD02, DD03, DD04. Confirmar plano com professor antes da avaliação.

## Entregas e evidências

Apresentação em vídeo: [Sprint 2 no YouTube](https://youtu.be/6RZt1Ui2A2o). Andamento das atividades: [burndown da Sprint 2](../Gestao/burndown/README.md).

| Entrega | Onde está |
|---|---|
| Cadastro com validação de nome e sobrenome, CPF e senha; login; recuperação e nova senha | [cadastro.html](../../frontend/cadastro.html), [login.html](../../frontend/login.html), [esqueci_senha.html](../../frontend/esqueci_senha.html), [src/js](../../frontend/src/js) |
| Home do portal com andamento da prova, pausa e retomada | [home.html](../../frontend/home.html), [provahome.js](../../frontend/src/js/provahome.js) |
| Área de estudos com 12 temas em 4 módulos | [curso-portal.html](../../frontend/curso-portal.html), [material.html](../../frontend/material.html), [apostilas](../conteudo) |
| Prova com questão, imagem, quatro alternativas e cronômetro de 150 s | [questao.html](../../frontend/questao.html), [prova.js](../../frontend/src/js/prova.js) |
| Resultado, certificado em PDF, perfil com progresso e feedback | [resultado.html](../../frontend/resultado.html), [certificado.html](../../frontend/certificado.html), [perfil.html](../../frontend/perfil.html), [feedback.html](../../frontend/feedback.html) |
| Banco com 12 temas e 48 questões; API com sorteio, prazo e resultado | [database/servidor](../../database/servidor), [backend](../../backend/README.md) |
| Diagrama de atividades do caminho de certificação | [UML](../UML/README.md) |
| Docker Compose com site, API e banco | [compose.yaml](../../compose.yaml), [como abrir](../../COMECAR-AQUI.md) |
| Testes de interface atualizados para as telas da Sprint 2 | [frontend.spec.mjs](../../testes/frontend.spec.mjs) |

Não entregue nesta sprint, previsto para a Sprint 3: ligar as telas à API (hoje elas guardam os dados no navegador), QR code com validação pública do certificado e histórico de respostas na interface.

## Registro de fechamento

| Campo | Estado atual |
|---|---|
| Data/hora real e fuso de entrega | Pendente de fechamento |
| Commit/hash completo e tag `sprint-2` | Tag ainda não criada |
| Escopo entregue / não entregue | Registrar contra cada issue e critério de aceite |
| Demonstrações e roteiro executado | Registrar passos, resultado esperado/obtido e evidência |
| Ambiente e testes | Vincular CI do hash entregue e registrar teste manual com colega |
| Protótipo e modelagem | Exportar versão datada, link e arquivos editáveis |
| Snapshot das issues | Registrar responsáveis, estado e evidências no commit de entrega |
| Participação de cada integrante | Vincular os arquivos, commits ou revisões de cada integrante |
| Review | Data, presentes, feedback real do professor/PO e decisões |
| Retrospectiva | Data, aprendizado e melhoria realmente acordada |
| Melhoria da Sprint anterior | Verificar aplicação e resultado da melhoria acordada na Sprint anterior |
| Próxima ação e responsável | Preencher a partir da reunião real |

Preencha o fechamento com os resultados da entrega e das reuniões realizadas.
