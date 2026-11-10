# Plano da Sprint 3

Definido em 06/11/2026 pelo Scrum Master (Breno) para distribuir as atividades da Sprint 3 entre os integrantes do time.

## Resumo

A Sprint 3 vai de 06/11 a 25/11 e a apresentação final é em 26/11. A meta é **ligar todas as telas ao servidor e fechar resultado, certificado com QR, validação pública, progresso e histórico**, com tudo testado e documentado.

O ponto mais importante: hoje as telas guardam tudo no navegador (localStorage, 38 usos nos scripts) e nenhuma chama a API, que já está pronta e testada. Isso trava sozinho DW03, DW05, DW06 e BD05, que somam 20 dos 100 pontos da rubrica. Por isso a integração vem primeiro.

Também pesam: ES09, participação individual (8 pontos, zera se alguém ficar sem contribuição registrada), e ES06, Review e Retrospectiva registradas de verdade (3 pontos).

## O que falta para completar a ABP

| Frente | Já está pronto | O que falta | Issues | Rubrica |
| --- | --- | --- | --- | --- |
| 1. Acesso ligado à API | Telas de cadastro e login; API com bcrypt, JWT e CPF único | Trocar o localStorage por `POST /api/candidatos` e `/api/login`, guardar o token e enviar nas rotas privadas; sair (logout); tirar a senha do navegador | #105, #76 | DW03, DW06 |
| 2. Prova ligada à API | Tela de questão, cronômetro, pausa e retomada; API de sorteio, resposta, prazo e interrupção | Usar `/temas/proximo`, `/questoes/sortear`, `/questoes/:id`, `/responder` e `/interromper`; cronômetro pelo prazo do servidor; feedback com a alternativa correta; bloquear tema encerrado; encerrar ao fechar a página | #105, #33, #44, #46, #97 | DW05, BD05 |
| 3. Resultado e certificado | Telas de resultado e certificado em PDF; API de resultado e certificado (≥ 65%) | Buscar a nota em `/candidatos/resultado` (nunca calcular no navegador); emitir pelo `/candidatos/certificado`; QR Code com o código de validação | #47, #49, #52, #56, #57, #58, #59, #77, #98 | DW05, DW06 |
| 4. Validação pública | Rota `GET /api/certificados/:hash` | Criar a página `validar.html` (certificado válido e inexistente, sem CPF ou e-mail) e apontar o QR para ela | #63, #64 | DW05 |
| 5. Progresso e histórico | Perfil com trilha; API de `/progresso` e `/historico` | Painel de temas concluídos e pendentes; tela de histórico com respostas, corretas e não respondidas | #66, #67, #69, #70, #107 | DW05, BD05 |
| 6. Conteúdo | 12 temas, 48 questões, 4 apostilas | Revisão pedagógica das 12 questões novas (XP, Ferramentas, Boas Práticas) e das imagens | #100 | DW04 |
| 7. Banco e modelagem | DER, lógico, dicionário e DDL do modelo de referência | Alinhar DER, lógico e dicionário ao schema `servidor` que a API usa, ou registrar a decisão | — | BD01–BD03 |
| 8. Design | Figma desktop e mobile das telas da Sprint 1 | Figma das telas novas (resultado, certificado, validação, progresso, histórico); exportar versão de entrega; teste de usabilidade com colegas registrado | — | DD01–DD04 |
| 9. Qualidade e infra | CI verde, 27 testes de interface, 13 do backend, Docker | Responsividade das telas do portal no celular; desempenho; teste do fluxo completo pela API; rodar do zero em máquina limpa | #74, #75, #89, #90, #99, #103 | DW02, DW07 |
| 10. Documentação | README, guia de instalação, API e funcionalidades | Atualizar API, funcionalidades e limitações no fim da sprint | #83, #84, #85 | ES08 |
| 11. Gestão Scrum | Backlog, burndown da Sprint 2, plano de entregas | Fechar issues entregues; tags `sprint-1`, `sprint-2` e `sprint-3`; Review e Retrospectiva reais; Dailies sem buracos; burndown da Sprint 3; participação de cada um | #104, #1, #86 | ES01–ES09 |

Várias issues de backend (#49, #58, #59, #63, #69, #70) já estão atendidas pela API desde 21/10. Basta conferir o critério de aceite e fechar.

## Divisão das atividades

A divisão segue o que cada um já fez no repositório, para ninguém começar do zero. Todo mundo tem entrega de código ou documento própria, o que garante a ES09.

| Pessoa | Frente principal | Issues | Entrega esperada | Por quê |
| --- | --- | --- | --- | --- |
| **Tiago** (dev) | 1. Acesso ligado à API | #105 (parte de acesso), #76 | `auth.js`, cadastro, login e logout usando a API e o token; sem senha no navegador | Fez o `auth.js`, o login e o perfil na Sprint 2 |
| **Miguel** (dev) | 2. Prova ligada à API | #105 (parte da prova), #33, #44, #46 | `prova.js` e `questao.js` usando sorteio, resposta e interrupção; feedback; bloqueio de tema; encerrar ao fechar a página | Trabalhou no `questao.js` e no `auth.js` |
| **Sophia** (dev) | 3 e 5. Resultado, progresso e histórico | #47, #52, #57, #66, #67, #107, #74 | Resultado e certificado pela API; painel de progresso; tela de histórico nova; telas do portal responsivas no celular | Fez a maior parte das telas e conhece o CSS |
| **Guilherme** (dev) | 3 e 4. QR Code, validação e design | #56, #64, DD01–DD04 | QR no certificado apontando para `validar.html`; página de validação; Figma das telas novas e versão de entrega exportada | Fez o modelo do certificado e cuida das Dailies |
| **Gabriel** (dev) | 6 e 10. Conteúdo e documentação | #100, #83, #84, #85 | Revisão das 12 questões novas; API, funcionalidades e instalação atualizadas; teste de usabilidade com colegas | Fez as 4 apostilas, as questões e o diagrama de atividades |
| **Abdi** (PO) | 7. Banco e backend | #49, #58, #59, #63, #69, #70, #77, #98 | Conferir e fechar as issues de backend; apoiar Tiago e Miguel nas rotas; alinhar DER, lógico e dicionário ao schema `servidor`; aceite das entregas como PO | Fez a modelagem do banco e o método de entrar |
| **Breno** (SM) | 9 e 11. Qualidade, infra e gestão | #89, #90, #99, #103, #75, #104 | Teste do fluxo completo pela API no CI; rodar do zero; Dailies, burndown, Review, Retrospectiva e tags; roteiro da apresentação | Organizou o repositório, o Docker e o CI |

**Dependências:** Miguel e Sophia dependem do token que o Tiago vai guardar, então o acesso precisa estar pronto até **10/11**. O QR do Guilherme depende do certificado da Sophia vir da API.

## Itens herdados da Sprint 2 (revisão de 09/11)

Na revisão do Project, o quadro da Sprint 3 tinha 8 itens vindos da Sprint 2 que não estavam neste plano. Eles já estão atendidos pela API e foram trazidos para conferência e fechamento.

| Issue | Atividade | Responsável | O que falta |
| --- | --- | --- | --- |
| #14 | Persistência e validação do cadastro | Abdi | Conferir os critérios de aceite com a API e fechar; a tela entra junto com a #105 (Tiago) |
| #25 | Sorteio de uma questão entre quatro por tema | Abdi | Conferir com os testes da API e fechar |
| #36 | Persistir respostas e estado da certificação | Sophia | Ligar a tela à resposta da API, junto com a #105 (Miguel) |
| #40 | Encerrar questão não respondida ao esgotar o tempo | Gabriel | Conferir o prazo de 150 s pelo servidor e registrar evidência |
| #41 | Continuar ou encerrar após cada resposta | Abdi | Conferir com a tela de questão e fechar |
| #42 | Persistir a retomada pelo próximo tema pendente | Guilherme e Sophia | Ligar a retomada da home à API (`/temas/proximo`) |
| #45 | Impedir nova resposta a um tema encerrado | Abdi | Conferir com os testes da API e fechar; o bloqueio na tela é a #46 (Miguel) |
| #88 | Docker Compose com aplicação e PostgreSQL | Breno | Checklist completo; fechar com o CI verde |

Para a Sprint 3 ficar completa no quadro, as issues #1, #33, #44, #46, #86 e #100, que estão neste plano, precisam ter o campo **Sprint** do Project trocado para Sprint 3.

## Cronograma

| Período | Foco | Pronto quando |
| --- | --- | --- |
| **06/11 a 10/11** | Acesso pela API (Tiago); Abdi confere as issues de backend; Guilherme começa o Figma das telas novas; fechamento da Sprint 2 | Cadastro e login gravam no PostgreSQL e o portal usa o token |
| **11/11 a 15/11** | Prova pela API (Miguel); resultado e certificado pela API (Sophia); página de validação (Guilherme); revisão das questões (Gabriel) | Um candidato faz os 12 temas pela interface e a nota vem do servidor |
| **16/11 a 20/11** | QR Code, progresso e histórico; responsividade no celular; alinhamento do DER (Abdi); teste do fluxo completo no CI (Breno) | Certificado com QR abre a validação pública; CI cobre o fluxo inteiro |
| **21/11 a 24/11** | Correções; rodar do zero em máquina limpa; documentação; teste de usabilidade; Figma de entrega | Nenhuma issue da Sprint 3 aberta sem decisão |
| **25/11** | Review, Retrospectiva, tag `sprint-3`, burndown e vídeo | Tudo registrado em [sprint-3.md](sprint-3.md) |
| **26/11** | Apresentação final | Demonstração do fluxo completo, do cadastro ao certificado validado |

Combinado de PR: cada pessoa trabalha numa branch `feature/...`, abre PR para a `develop` citando a issue (`Closes #N`), e a `develop` vai para a `main` no fim de cada semana com o CI verde.

## Fazer já (até 08/11)

- [ ] Registrar a Review e a Retrospectiva da Sprint 2 em [sprint-2.md](sprint-2.md), com o feedback real do professor e a melhoria combinada
- [ ] Fechar no GitHub as 24 issues da Sprint 2 marcadas como Entregue no [burndown](../Gestao/burndown/README.md) e mover as 6 pendentes para a Sprint 3
- [ ] Fechar as 21 issues com checklist completo e ainda abertas (revisão de 09/11): Sprint 1 #5, #9, #13, #24, #27, #38, #51, #54, #61, #71, #78, #79, #80, #82, #94, #106; Sprint 2 #2 e #88; Sprint 3 #83, #85 e #90. As outras 31 da Sprint 1 têm critérios pendentes de Figma (DD) e UML/modelagem (BD) e entram nas frentes 7 e 8
- [ ] Criar as tags `sprint-1` e `sprint-2` nos commits apresentados
- [ ] Atribuir cada issue da Sprint 3 ao responsável no GitHub, conforme a divisão acima
- [ ] Publicar o quadro da Sprint 3 no Project e colocar o link no README
- [ ] Combinar com o professor se a biblioteca de QR Code pode ser usada (a rubrica pede JavaScript sem framework)
- [ ] Voltar a registrar as Dailies todo dia em [Daily Scrum](../Daily%20Scrum/README.md)

## Riscos e combinados

| Risco | Como evitar |
| --- | --- |
| Integração com a API atrasar e travar prova, resultado e certificado | Acesso pronto até 10/11; Abdi pareia com Tiago e Miguel nas rotas |
| Arquivos apagados ou movidos quebrarem o Docker, como em 03/11 e 05/11 | Nada vai direto para a `main`; todo PR passa pelo CI antes do merge |
| Trabalho concentrado no fim, como na Sprint 2 | Uma entrega por pessoa a cada semana, cobrada na Daily |
| Site da Vercel só tem o frontend, sem API e sem banco | Apresentar pelo Docker local; se quiser o site público funcionando, decidir até 15/11 onde hospedar a API |
| Recuperação de senha sem envio real (chaves de exemplo do EmailJS) | Configurar as chaves do grupo ou deixar claro na documentação que é uma limitação |
| Alguém sem contribuição registrada zerar a ES09 | Cada pessoa abre pelo menos um PR próprio por semana com a issue citada |
