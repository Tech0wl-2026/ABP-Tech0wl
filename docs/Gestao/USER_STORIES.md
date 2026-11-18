# Product Backlog — User Stories e Critérios de Aceitação
**Projeto:** ABP Tech0wl — Portal e Motor de Certificação (2026-2)  
**Rastreabilidade:** Vinculado a `docs/Gestao/BACKLOG.md` e Issues (`#1` a `#105`).

---

## 1. Requisitos Funcionais (RF01 a RF21)

### US01 — Página Inicial e Instruções (`RF01`)
* **Como** visitante do portal,
* **Quero** visualizar a página inicial com as instruções da certificação,
* **Para** entender as regras, o formato e os critérios da prova antes de iniciar.
* **Tasks Vinculadas:** `T001`, `T002`, `T003`, `T004`

**Critérios de Aceitação:**
* **Dado** que acesso a URL raiz da plataforma sem estar logado,
* **Quando** a página inicial é carregada,
* **Então** devo visualizar a apresentação da certificação, o tempo limite por questão (150s), a nota mínima para aprovação (65%) e botões visíveis para "Cadastrar" e "Entrar".

---

### US02 — Iniciar ou Retomar Certificação (`RF02`)
* **Como** candidato autenticado,
* **Quero** iniciar uma nova tentativa de certificação ou retomar uma avaliação em andamento,
* **Para** realizar a prova conforme a minha disponibilidade.
* **Tasks Vinculadas:** `T005`, `T006`, `T007`, `T008`

**Critérios de Aceitação:**
* **Cenário 1: Iniciar nova prova**
  * **Dado** que estou logado e não possuo certificação em aberto,
  * **Quando** clico em "Iniciar Certificação",
  * **Então** o sistema deve criar uma nova sessão de avaliação e carregar o primeiro tema.
* **Cenário 2: Retomar prova em andamento**
  * **Dado** que estou logado e possuo uma certificação interrompida anteriormente,
  * **Quando** acesso o painel do candidato,
  * **Então** o sistema deve exibir a opção "Retomar Certificação" direcionando para o próximo tema pendente.

---

### US03 — Cadastro de Candidato (`RF03`)
* **Como** candidato sem conta na plataforma,
* **Quero** me cadastrar informando CPF, nome completo, e-mail e senha,
* **Para** criar um perfil único e acessar o ambiente de estudos e certificação.
* **Tasks Vinculadas:** `T009`, `T010`, `T011`, `T012`, `T013`

**Critérios de Aceitação:**
* **Cenário 1: Cadastro realizado com sucesso**
  * **Dado** que estou na tela de cadastro e preencho um CPF válido e inédito, nome completo, e-mail válido e senha forte,
  * **Quando** submeto o formulário,
  * **Então** o sistema deve salvar meus dados com a senha criptografada e liberar o acesso ao login.
* **Cenário 2: Bloqueio de CPF duplicado**
  * **Dado** que o CPF informado já está registrado na base de dados,
  * **Quando** tento concluir o cadastro,
  * **Então** o sistema deve bloquear a operação e exibir a mensagem *"Este CPF já possui cadastro no sistema"*.
* **Cenário 3: Validação de campos obrigatórios e formato**
  * **Dado** que deixo algum campo vazio ou informo um CPF/e-mail inválido,
  * **Quando** tento enviar o formulário,
  * **Então** o sistema deve destacar os campos inválidos e impedir o envio.

---

### US04 — Autenticação e Sessão (`RF04`)
* **Como** candidato cadastrado,
* **Quero** fazer login informando meu CPF e senha,
* **Para** acessar minha área restrita de forma segura.
* **Tasks Vinculadas:** `T014`, `T015`, `T016`, `T017`, `T018`

**Critérios de Aceitação:**
* **Cenário 1: Login válido**
  * **Dado** que informo um CPF cadastrado e a senha correspondente correta,
  * **Quando** clico em "Entrar",
  * **Então** o sistema deve iniciar minha sessão autenticada e redirecionar para o painel do candidato.
* **Cenário 2: Credenciais inválidas**
  * **Dado** que informo um CPF inexistente ou senha incorreta,
  * **Quando** tento autenticar,
  * **Então** o sistema deve negar o acesso e exibir uma mensagem genérica de erro (*"CPF ou senha inválidos"*).

---

### US05 — Execução dos 12 Temas da Certificação (`RF05`)
* **Como** candidato em avaliação,
* **Quero** responder a uma questão para cada um dos 12 temas obrigatórios,
* **Para** ser avaliado integralmente em todo o conteúdo programático.
* **Tasks Vinculadas:** `T019`, `T020`, `T021`, `T022`, `T023`

**Critérios de Aceitação:**
* **Dado** que iniciei uma certificação,
* **Quando** avanço pelas etapas da avaliação,
* **Então** o sistema deve apresentar sequencialmente os 12 temas cadastrados, exibindo uma questão por tema na interface reutilizável de prova.

---

### US06 — Sorteio Aleatório de Questões (`RF06`)
* **Como** sistema de avaliação,
* **Quero** sortear aleatoriamente 1 questão dentre as 4 disponíveis para cada tema,
* **Para** garantir provas dinâmicas e evitar fraudes por memorização de gabarito.
* **Tasks Vinculadas:** `T024`, `T025`, `T026`

**Critérios de Aceitação:**
* **Dado** que o candidato acessa um tema durante a certificação,
* **Quando** o back-end prepara a questão daquele tema,
* **Então** o sistema deve selecionar aleatoriamente 1 das 4 questões vinculadas ao tema e vinculá-la à tentativa atual.

---

### US07 — Área de Estudos e Material Didático (`RF07`)
* **Como** candidato,
* **Quero** navegar pelos 12 temas na área de estudos e ler o material didático de cada um,
* **Para** me preparar adequadamente antes de iniciar a prova.
* **Tasks Vinculadas:** `T027`, `T028`, `T029`, `T030`, `T094`

**Critérios de Aceitação:**
* **Dado** que estou autenticado e acesso a seção "Estudos",
* **Quando** seleciono qualquer um dos 12 temas listados,
* **Então** o sistema deve carregar a página contendo o texto explicativo e os recursos didáticos referentes àquele tema.

---

### US08 — Estrutura das Questões e Alternativas (`RF08`)
* **Como** candidato respondendo à prova,
* **Quero** visualizar cada questão acompanhada de uma imagem ilustrativa e 4 alternativas (sendo apenas 1 correta),
* **Para** interpretar o cenário apresentado e selecionar minha resposta.
* **Tasks Vinculadas:** `T031`

**Critérios de Aceitação:**
* **Dado** que uma questão é carregada na tela de prova,
* **Quando** o conteúdo é renderizado,
* **Então** ela deve conter obrigatoriamente enunciado, imagem de apoio válida e 4 opções de escolha, das quais exatamente 1 está marcada como correta no banco de dados.

---

### US09 — Feedback Imediato da Resposta (`RF09`)
* **Como** candidato,
* **Quero** receber feedback imediato logo após confirmar minha alternativa,
* **Para** saber se acertei ou errei a questão e visualizar qual era a resposta certa.
* **Tasks Vinculadas:** `T032`, `T033`, `T034`, `T035`, `T036`, `T037`

**Critérios de Aceitação:**
* **Dado** que selecionei uma alternativa e cliquei em "Confirmar Resposta" dentro do tempo limite,
* **Quando** o back-end registra minha resposta,
* **Então** a interface deve destacar visualmente se acertei ou errei e indicar qual era a alternativa correta.

---

### US10 — Cronômetro Regressivo de 150 Segundos (`RF10`)
* **Como** candidato em avaliação,
* **Quero** visualizar um cronômetro regressivo de 150 segundos durante a resolução de cada questão,
* **Para** gerenciar meu tempo de resposta.
* **Tasks Vinculadas:** `T038`

**Critérios de Aceitação:**
* **Dado** que uma questão foi exibida na tela,
* **Quando** a contagem inicia,
* **Então** o cronômetro deve regredir segundo a segundo a partir de `02:30` (150s), mantendo sincronia com o timestamp registrado no back-end.

---

### US11 — Encerramento Automático por Tempo Esgotado (`RF11`)
* **Como** sistema de avaliação,
* **Quero** encerrar automaticamente a questão caso os 150 segundos expirem sem envio de resposta,
* **Para** assegurar o cumprimento rigoroso do tempo máximo permitido.
* **Tasks Vinculadas:** `T039`

**Critérios de Aceitação:**
* **Dado** que o cronômetro de uma questão atingiu `00:00` sem que o candidato confirmasse uma alternativa,
* **Quando** o tempo expira,
* **Então** o back-end deve bloquear qualquer submissão tardia, marcar a questão como encerrada/não respondida (incorreta) e liberar o avanço.

---

### US12 — Continuidade ou Encerramento de Sessão (`RF12`)
* **Como** candidato,
* **Quero** escolher entre continuar para o próximo tema ou encerrar a sessão após visualizar o feedback de uma questão,
* **Para** poder pausar a prova sem perder o que já respondi.
* **Tasks Vinculadas:** `T040`

**Critérios de Aceitação:**
* **Dado** que visualizo a tela de feedback após responder (ou expirar o tempo de) uma questão,
* **Quando** avalio minhas opções de navegação,
* **Então** devo visualizar os botões "Próxima Questão" e "Salvar e Sair (Encerrar Sessão)", mantendo todo o progresso salvo caso opte por sair.

---

### US13 — Retomada pelo Próximo Tema Pendente (`RF13`)
* **Como** candidato que pausou uma avaliação,
* **Quero** retomar a certificação exatamente a partir do próximo tema ainda não respondido,
* **Para** concluir a prova de onde parei.
* **Tasks Vinculadas:** `T041`, `T042`

**Critérios de Aceitação:**
* **Dado** que já respondi a $N$ temas em uma tentativa em andamento (onde $N < 12$),
* **Quando** retorno ao sistema e clico em "Retomar Certificação",
* **Então** o sistema deve carregar diretamente o tema de número $N + 1$, sem exibir novamente os temas anteriores.

---

### US14 — Encerramento por Queda de Conexão ou Fechamento (`RF14`)
* **Como** sistema de avaliação,
* **Quero** encerrar a questão ativa caso o candidato feche a aba, atualize a página ou perca a conexão durante a resolução,
* **Para** impedir tentativas de burlar o cronômetro de 150 segundos.
* **Tasks Vinculadas:** `T043`

**Critérios de Aceitação:**
* **Dado** que uma questão já foi sorteada e iniciada para o candidato,
* **Quando** ocorre abandono da página, desconexão ou expiração do prazo no servidor sem resposta salva,
* **Então** o sistema deve considerar aquele tema como encerrado, permitindo que na próxima conexão o candidato avance apenas para o tema seguinte.

---

### US15 — Bloqueio de Repetição de Tema Encerrado (`RF15`)
* **Como** sistema de avaliação,
* **Quero** impedir que um tema já respondido ou encerrado seja aberto ou submetido novamente na mesma tentativa,
* **Para** garantir a integridade da pontuação e evitar múltiplas tentativas na mesma questão.
* **Tasks Vinculadas:** `T044`, `T045`

**Critérios de Aceitação:**
* **Cenário 1: Bloqueio de nova submissão no back-end**
  * **Dado** que um tema já possui status de respondido ou encerrado na certificação atual,
  * **Quando** uma nova requisição de resposta é enviada para a API referente àquele mesmo tema,
  * **Então** o back-end deve rejeitar a submissão (retornando erro HTTP 403 ou 409) e manter inalterada a resposta original registrada.
* **Cenário 2: Bloqueio de reabertura e navegação na interface**
  * **Dado** que o candidato já finalizou um tema na tentativa em andamento,
  * **Quando** tenta acessar novamente a tela daquele tema (seja pelo botão "Voltar" do navegador ou pela URL direta),
  * **Então** o front-end deve desabilitar os controles de resposta e redirecionar o candidato para o próximo tema pendente ou para o painel da certificação.
* **Cenário 3: Exibição de aviso de tema encerrado**
  * **Dado** que o candidato tenta interagir com um tema já concluído,
  * **Quando** o bloqueio é acionado,
  * **Então** o sistema deve exibir uma mensagem clara informando que este tema já foi encerrado e não pode ser respondido novamente.

---

### US16 — Cálculo da Nota Final (`RF16`)
* **Como** sistema de avaliação,
* **Quero** calcular automaticamente a nota final no back-end assim que os 12 temas forem concluídos,
* **Para** determinar o percentual de aproveitamento do candidato.
* **Tasks Vinculadas:** `T048`, `T049`, `T050`

**Critérios de Aceitação:**
* **Dado** que o candidato finalizou o 12º tema da certificação,
* **Quando** o último status é persistido,
* **Então** o back-end deve calcular a porcentagem de acertos ($\frac{\text{Acertos}}{12} \times 100$), salvar o resultado final e marcar a tentativa como concluída.

---

### US17 — Elegibilidade para Emissão de Certificado (`RF17`)
* **Como** sistema de certificação,
* **Quero** liberar a emissão do certificado apenas para candidatos que atingirem aproveitamento mínimo de 65%,
* **Para** assegurar que somente candidatos aprovados recebam o documento.
* **Tasks Vinculadas:** `T051`, `T053`

**Critérios de Aceitação:**
* **Cenário 1: Aprovação ($\ge 65\%$)**
  * **Dado** que o candidato concluiu a prova com 8 ou mais acertos ($\ge 66,6\%$),
  * **Quando** acessa a tela de resultado,
  * **Então** o sistema deve exibir o status "Aprovado" e habilitar o botão para gerar/visualizar o certificado.
* **Cenário 2: Reprovação ($< 65\%$)**
  * **Dado** que o candidato concluiu a prova com 7 ou menos acertos ($\le 58,3\%$),
  * **Quando** acessa a tela de resultado,
  * **Então** o sistema deve exibir o status "Não Aprovado", ocultar a emissão de certificado e permitir uma nova tentativa futura.

---

### US18 — Geração, Exibição e Exportação do Certificado (`RF18`)
* **Como** candidato aprovado,
* **Quero** visualizar meu certificado eletrônico contendo meus dados, nota, data de emissão, código identificador e QR Code, além de poder exportá-lo,
* **Para** comprovar minha certificação profissionalmente.
* **Tasks Vinculadas:** `T055`, `T056`, `T057`, `T058`, `T059`, `T061`

**Critérios de Aceitação:**
* **Dado** que sou um candidato aprovado na certificação,
* **Quando** acesso a visualização do meu certificado,
* **Então** devo ver meu nome completo, CPF (mascarado conforme LGPD), percentual de acerto, data de conclusão, hash/código único de validação, QR Code apontando para a URL pública de verificação e opção de impressão/exportação em PDF.

---

### US19 — Validação Pública do Certificado (`RF19`)
* **Como** recrutador ou terceiro interessado,
* **Quero** acessar uma página pública e consultar a autenticidade de um certificado através do seu código identificador (ou QR Code),
* **Para** confirmar se o documento apresentado pelo candidato é verdadeiro.
* **Tasks Vinculadas:** `T062`, `T063`, `T093`

**Critérios de Aceitação:**
* **Cenário 1: Certificado autêntico**
  * **Dado** que acesso a página pública de validação e informo um código válido (ou escaneio o QR Code),
  * **Quando** realizo a consulta,
  * **Então** o sistema deve exibir que o certificado é válido, mostrando o nome do candidato, data de emissão e nota obtida.
* **Cenário 2: Código inexistente**
  * **Dado** que informo um identificador inválido ou adulterado,
  * **Quando** submeto a consulta,
  * **Então** o sistema deve informar que nenhum certificado foi encontrado para o código informado.

---

### US20 — Registro de Histórico de Respostas (`RF20`)
* **Como** candidato,
* **Quero** que o sistema grave o histórico detalhado das minhas respostas em cada certificação realizada,
* **Para** poder consultar meu desempenho por tema posteriormente.
* **Tasks Vinculadas:** `T064`, `T093`, `T107`

**Critérios de Aceitação:**
* **Dado** que finalizei ou estou realizando uma certificação,
* **Quando** acesso a área de "Histórico",
* **Então** devo visualizar a lista de tentativas realizadas com data, pontuação obtida e o detalhamento de quais temas acertei ou errei.

---

### US21 — Acompanhamento de Progresso na Certificação (`RF21`)
* **Como** candidato em avaliação,
* **Quero** visualizar claramente quais dos 12 temas já foram concluídos e quais ainda estão pendentes,
* **Para** acompanhar meu avanço ao longo da prova.
* **Tasks Vinculadas:** `T065`, `T068`, `T069`, `T070`, `T071`

**Critérios de Aceitação:**
* **Dado** que estou no painel da certificação em andamento,
* **Quando** visualizo a barra ou lista de progresso,
* **Então** o sistema deve distinguir visualmente os temas já concluídos (respondidos/encerrados) dos temas pendentes, exibindo o contador (ex: `5 de 12 temas concluídos`).

---
