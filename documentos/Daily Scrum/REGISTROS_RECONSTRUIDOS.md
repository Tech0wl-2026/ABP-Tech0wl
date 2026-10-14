# Registros anteriores pendentes de validação

Arquivo de referência de 28/09 a 06/10. Contém sínteses sugeridas, não atas confirmadas. O escopo atualizado da Sprint 1 é somente protótipo e modelagem integral; consultar `../Gestao/SPRINTS.md` quando o texto antigo divergir.

```text
REGISTRO DE DAILY SCRUM DA ABP
Portal de Certificação em Metodologias Ágeis
Fatec Jacareí | 1º DSM | Segundo semestre de 2026
Período deste documento: 28/09/2026 a 06/10/2026
Data de referência: 06/10/2026, horário de Brasília

FINALIDADE E CONDIÇÃO DOS REGISTROS

Este arquivo reúne uma proposta de reconstrução das dailys desde o início
da ABP e um modelo para registrar as reuniões reais a partir de hoje.
O foco da Sprint 1 é concluir o protótipo Figma do sistema inteiro e a
modelagem completa do banco de dados, incluindo os RFs das Sprints 2 e 3.

Não foram fornecidas atas, presenças ou evidências diárias de execução.
Por isso, os assuntos de 28/09 a 05/10 estão distribuídos por data como
SÍNTESES SUGERIDAS A VALIDAR, com base no desafio e na Sprint Planning.
Essa distribuição não comprova que as reuniões aconteceram nessas datas
nem que as tarefas foram concluídas. A equipe deve ajustar o conteúdo ao
que efetivamente discutiu, decidiu e executou antes de utilizá-lo como ata.
Os dias de fim de semana estão incluídos sem presumir reunião realizada.

O registro de 06/10 contém os alinhamentos disponíveis nesta conversa e
uma pauta proposta. Horários, participantes, avanços, impedimentos e
decisões da reunião de hoje ainda precisam ser preenchidos pela equipe.

IDENTIFICAÇÃO DA EQUIPE

Referência da aba Sprints da planilha: TechOwl.
Product Owner: Abdi.
Scrum Master: Breno.
Developers: Gabriel A., Guilherme, Miguel, Sophia e Tiago.
Essa relação identifica a equipe na planilha; não representa presença
confirmada em qualquer daily. Atualizar se a composição tiver mudado.

FONTES CONSULTADAS

1. Desafio 1DSM - 2026-2 (1).pdf, versão do documento de 29/06/2026.
2. 20260928-SprintPlanning.xlsx, abas Sheet1 e Sprints.
3. Orientações desta conversa sobre a divisão em três Sprints e o foco
   integral do Figma e da modelagem na primeira Sprint.

CRONOGRAMA E FOCO DO TRABALHO

Cronograma oficial do desafio:
- Sprint 1: 28/09 a 22/10/2026.
- Sprint 2: 23/10 a 05/11/2026.
- Sprint 3: 06/11 a 25/11/2026.
- Apresentação final: 26/11/2026.

Divisão proposta nesta conversa, pendente de formalização no backlog:
- Sprint 1: RF01 a RF08 como base funcional, Figma de RF01 a RF21,
  modelagem integral, diagramas e estrutura inicial do projeto.
- Sprint 2: RF09 a RF15, implementação do motor da certificação e das
  regras de resposta, tempo, interrupção, retomada e não repetição.
- Sprint 3: RF16 a RF21, nota, certificado, QR Code, validação pública,
  histórico, progresso e integração final.

Dependências: salvar respostas e progresso é necessário já na Sprint 2
para a retomada funcionar. A Sprint 3 fecha suas telas e funcionalidades.
Docker, documentação, segurança e revisão das questões devem evoluir
durante o projeto; a validação final ocorre na Sprint 3.

Ponto para corrigir na planilha: a aba Sprints apresenta Sprint 0 de
28/09 a 01/10 e Sprint 1 de 02/10 a 22/10, enquanto o desafio inicia a
Sprint 1 em 28/09. Neste documento foi adotado o cronograma oficial.
Muitas tasks ainda constam como TBD ou sem Sprint; validar sua alocação.

COMO CONDUZIR E REGISTRAR CADA DAILY

Duração prevista: 15 minutos. Registrar o horário real após a reunião.
- Minutos 0 a 2: conferir a meta da Sprint e a situação do quadro.
- Minutos 2 a 10: compartilhar avanços, próximo trabalho e impedimentos.
- Minutos 10 a 15: ajustar o plano, responsáveis e próximos passos.

Discussões técnicas longas ficam para uma conversa posterior com os
envolvidos. A daily serve para inspecionar o progresso e adaptar o plano.
Não marcar uma tarefa como concluída sem a evidência correspondente.

REGISTRO 01 | 28/09/2026 | SEGUNDA-FEIRA
Assunto central: início da ABP e compreensão do desafio.
Situação: síntese sugerida a validar pela equipe.
Horário e participantes reais: [preencher].
Requisitos relacionados: RF01 a RF21, RNF05, RP01 a RP09.

Assuntos sugeridos para reconstrução:
- Leitura do desafio do Portal de Certificação em Metodologias Ágeis.
- Identificação do fluxo: cadastro, login, estudos, certificação,
  resultado, certificado e validação pública.
- Conferência das três Sprints e da apresentação final.

Alinhamentos propostos:
- Usar o documento oficial como referência para regras e critérios.
- Trabalhar com HTML, CSS e JavaScript sem frameworks no front-end,
  PostgreSQL no banco e aplicação em containers Docker.
- Priorizar Figma completo e modelagem integral na Sprint 1.

Próximo trabalho proposto: conferir o backlog e levantar dúvidas do escopo.
Avanços comprovados: [preencher; não inferir conclusão pela planilha].
Impedimentos reais: [preencher].
Ação acordada | responsável | prazo | evidência: [preencher].

REGISTRO 02 | 29/09/2026 | TERÇA-FEIRA
Assunto central: organização do backlog e critérios de pronto.
Situação: síntese sugerida a validar pela equipe.
Horário e participantes reais: [preencher].
Requisitos relacionados: RNF05, RNF06 e RF01 a RF21.

Assuntos sugeridos para reconstrução:
- Revisão das tasks de Figma, modelagem, Astah, banco, páginas e Docker.
- Análise das estimativas de esforço já presentes na Sprint Planning.
- Identificação de dependências entre telas, dados e regras de negócio.

Alinhamentos propostos:
- Vincular cada task ao requisito correto antes de distribuir responsáveis.
- Alocar na Sprint 1 todas as tasks de protótipo e modelagem, inclusive
  as associadas aos resultados e certificados.
- Definir critérios de pronto e registrar mudanças no Git e no backlog.

Ponto de revisão: as tasks 002, 003 e 004 possuem tags RF02, RF03 e RF04,
mas repetem a descrição do RF01. Conferir e corrigir esse vínculo.
Próximo trabalho proposto: revisar tags, dependências e alocação de Sprints.
Avanços comprovados e impedimentos reais: [preencher].
Ação acordada | responsável | prazo | evidência: [preencher].

REGISTRO 03 | 30/09/2026 | QUARTA-FEIRA
Assunto central: jornada inicial, cadastro e login no Figma.
Situação: síntese sugerida a validar pela equipe.
Horário e participantes reais: [preencher].
Requisitos relacionados: RF01, RF02, RF03, RF04 e RNF01.
Tasks de referência: 001 a 018, após revisão das tags.

Assuntos sugeridos para reconstrução:
- Estrutura da página inicial com descrição, objetivos e instruções.
- Ações para iniciar a certificação ou retornar posteriormente.
- Campos de cadastro e situações de erro dos formulários.

Alinhamentos propostos:
- Cadastro com CPF único, nome completo, e-mail e senha.
- Login exclusivamente com CPF e senha, conforme RF04.
- Prever telas e estados de validação para computador e celular.
- Modelar CPF como identificador único de negócio e prever armazenamento
  protegido da senha, sem utilizar senha em texto puro.

Próximo trabalho proposto: ligar os fluxos iniciais no Figma e revisar
os atributos da entidade de candidato.
Avanços comprovados e impedimentos reais: [preencher].
Ação acordada | responsável | prazo | evidência: [preencher].

REGISTRO 04 | 01/10/2026 | QUINTA-FEIRA
Assunto central: estrutura dos temas, questões e área de estudos.
Situação: síntese sugerida a validar pela equipe.
Horário e participantes reais: [preencher].
Requisitos relacionados: RF05, RF06, RF07, RF08, RNF08, RP06 e RP07.
Tasks de referência: 019 a 031 e 091.

Assuntos sugeridos para reconstrução:
- Seleção dos 12 temas utilizados na certificação e nos estudos.
- Organização do material didático e dos recursos visuais por tema.
- Estrutura da questão e sua representação no modelo de dados.

Alinhamentos propostos:
- Manter exatamente quatro questões por tema, totalizando 48 questões.
- Apresentar ao candidato uma questão sorteada para cada um dos 12 temas.
- Cada questão contém uma imagem, alternativas A, B, C e D e uma correta.
- Revisar tecnicamente questões e imagens antes de aprovar o conteúdo.

Ponto em aberto: o desafio sugere 16 temas, mas a prova exige 12. Confirmar
quais serão adotados; não tratar as sugestões como seleção já concluída.
Próximo trabalho proposto: definir os 12 temas e os vínculos entre temas,
conteúdos de estudo, questões, imagens e alternativas.
Avanços comprovados e impedimentos reais: [preencher].
Ação acordada | responsável | prazo | evidência: [preencher].

REGISTRO 05 | 02/10/2026 | SEXTA-FEIRA
Assunto central: modelagem completa e integridade dos dados.
Situação: síntese sugerida a validar pela equipe.
Horário e participantes reais: [preencher].
Requisitos relacionados: RP02, RP04, RF03 a RF08 e RF13 a RF21.
Tasks de referência: categoria 2-Modelagem BD e task 082.

Assuntos sugeridos para reconstrução:
- Entidades, relacionamentos, cardinalidades e chaves.
- Dados necessários para respostas, retomada, histórico e certificados.
- Modelos conceitual, lógico e físico e preparação do DDL PostgreSQL.

Alinhamentos propostos:
- Modelar o sistema inteiro, incluindo funcionalidades das próximas Sprints.
- Prever candidato, tema, conteúdo de estudo, questão, imagem,
  alternativa, certificação, resposta e certificado.
- Registrar a questão sorteada e o estado do tema para impedir repetição.
- Prever data e hora das respostas e da emissão do certificado.

Ponto em aberto: confirmar se o candidato poderá realizar uma nova
certificação no futuro e como a regra de responder cada tema uma única
vez se aplica. Não implementar tentativas adicionais sem alinhamento.
Próximo trabalho proposto: revisar o DER e confrontá-lo com todos os RFs.
Avanços comprovados e impedimentos reais: [preencher].
Ação acordada | responsável | prazo | evidência: [preencher].

REGISTRO 06 | 03/10/2026 | SÁBADO
Assunto central: previsão visual das regras da prova.
Situação: pauta sugerida; ocorrência de daily não confirmada.
Houve reunião? [sim / não]. Se não houve, manter como pauta de apoio.
Horário e participantes, se houve reunião: [preencher].
Requisitos relacionados: RF09 a RF15.
Tasks de referência: 032 a 045.

Assuntos sugeridos para reconstrução, se aplicáveis:
- Tela de questão com cronômetro regressivo visível de 150 segundos.
- Feedback da alternativa correta após responder ou esgotar o tempo.
- Ações para continuar, encerrar a sessão e retomar posteriormente.

Alinhamentos propostos:
- Tempo esgotado sem resposta encerra a questão e a considera incorreta.
- Interrupção durante a resolução encerra a questão, sem nova resposta.
- Retomada começa no próximo tema ainda não respondido.
- Prever esses estados no Figma e no modelo, mesmo com programação
  concentrada na Sprint 2.

Próximo trabalho proposto: revisar fluxos de expiração e interrupção,
incluindo como o back-end detectará e persistirá esses estados.
Avanços comprovados e impedimentos reais: [preencher, se aplicável].
Ação acordada | responsável | prazo | evidência: [preencher, se aplicável].

REGISTRO 07 | 04/10/2026 | DOMINGO
Assunto central: previsão dos resultados e certificados.
Situação: pauta sugerida; ocorrência de daily não confirmada.
Houve reunião? [sim / não]. Se não houve, manter como pauta de apoio.
Horário e participantes, se houve reunião: [preencher].
Requisitos relacionados: RF16 a RF21, RNF04 e RP08.
Tasks de referência: 046 a 071.

Assuntos sugeridos para reconstrução, se aplicáveis:
- Resultado final após encerrar os 12 temas.
- Emissão de certificado com aproveitamento igual ou superior a 65%.
- QR Code, validação pública, histórico e progresso.

Alinhamentos propostos:
- Prototipar também aprovação, reprovação e certificado inválido.
- Prever nome, CPF, e-mail, data e hora, nota, percentual e QR Code.
- Manter histórico independentemente de aprovação.
- Calcular e validar o resultado no back-end, evitando aceitar uma
  nota enviada pelo navegador como resultado oficial.

Pontos em aberto: confirmar a escala da nota e a política de exibição
de dados pessoais na validação pública. Para questões com peso igual,
8 acertos em 12 equivalem a 66,67%; 7 equivalem a 58,33%.
Próximo trabalho proposto: conferir se Figma e modelo cobrem RF16 a RF21.
Avanços comprovados e impedimentos reais: [preencher, se aplicável].
Ação acordada | responsável | prazo | evidência: [preencher, se aplicável].

REGISTRO 08 | 05/10/2026 | SEGUNDA-FEIRA
Assunto central: revisão de consistência do planejamento.
Situação: síntese sugerida a validar pela equipe.
Horário e participantes reais: [preencher].
Requisitos relacionados: RNF01, RNF04, RNF05, RNF06, RNF07 e RF21.
Tasks de referência: 065, 068, 072, 076, 077 a 090.

Assuntos sugeridos para reconstrução:
- Conferência da cobertura de RF01 a RF21 no Figma e na modelagem.
- Revisão de pendências, responsáveis e critérios de aceite.
- Planejamento de versionamento, documentação e ambiente Docker.

Alinhamentos propostos:
- Revisar as tasks 065 e 068: temas estudados ou visualizados não
  equivalem aos temas concluídos na certificação exigidos pelo RF21.
- Revisar a task 076: bloqueio em JavaScript não basta para proteger
  a nota; a validação precisa ocorrer também no back-end.
- Registrar decisões e mudanças no backlog para evitar retrabalho.

Próximo trabalho proposto: levantar lacunas do protótipo e do DER e
alinhar as datas da planilha com o cronograma oficial.
Avanços comprovados e impedimentos reais: [preencher].
Ação acordada | responsável | prazo | evidência: [preencher].

REGISTRO 09 | 06/10/2026 | TERÇA-FEIRA
Assunto central: iniciar o registro diário e ajustar o plano da Sprint 1.
Situação: registro aberto; pauta preparada para completar com a reunião.
Horário real: [início] a [fim]. Duração prevista: 15 minutos.
Participantes presentes e ausentes: [preencher].
Requisitos relacionados: RNF05, RNF06 e cobertura de RF01 a RF21.

Alinhamentos disponíveis nesta conversa:
- Breno confirmou o início da ABP em 28/09.
- Foi solicitado um documento editável das dailys até a data atual.
- A partir de hoje, as informações das reuniões de 15 minutos serão
  registradas diariamente.
- Foi solicitado foco no Figma pronto e na modelagem total do banco
  na primeira Sprint.

Pauta proposta para os 15 minutos:
1. Conferir o avanço real de cada frente e suas evidências.
2. Identificar telas e entidades faltantes para cobrir RF01 a RF21.
3. Revisar o backlog, as datas e as inconsistências apontadas acima.
4. Definir o trabalho até a próxima daily com responsável e prazo.

Avanços desde a última reunião:
- Figma e fluxo navegável: [telas concluídas, pendências e link].
- Modelagem do banco: [entidades revisadas, pendências e arquivo].
- Diagramas, código e documentação: [avanços e evidências].

Plano até a próxima daily:
- [ação específica] | [responsável] | [prazo] | [evidência esperada].
- [ação específica] | [responsável] | [prazo] | [evidência esperada].

Impedimentos reais e encaminhamentos:
- [impedimento] | [impacto] | [quem tratará] | [próxima ação].

Decisões efetivamente tomadas nesta reunião:
- [preencher após a daily; registrar RF/task afetado quando houver].

Responsável pelo registro: [preencher].
Validação do registro pela equipe: [pendente / validado em data].

CRITÉRIOS PROPOSTOS PARA ENCERRAMENTO DA SPRINT 1

[ ] Figma navegável cobrindo RF01 a RF21, incluindo erros e interrupções.
[ ] Principais telas previstas para computador e celular.
[ ] Modelo conceitual, lógico e físico cobrindo todo o sistema.
[ ] DDL PostgreSQL revisado e executável, com chaves e restrições.
[ ] Os 12 temas escolhidos e a estrutura das 48 questões definida.
[ ] Diagramas necessários revisados e coerentes com o modelo e o fluxo.
[ ] Tasks com RF correto, Sprint, responsável e critério de aceite.
[ ] Entregas funcionais acordadas para a Sprint demonstráveis.
[ ] Evidências, documentação e arquivos versionados.

Esses itens são uma proposta de critérios de pronto, não uma declaração
de tarefas concluídas. Validar com a equipe e o professor.

MODELO PARA AS PRÓXIMAS DAILYS

REGISTRO [número] | [dd/mm/aaaa] | [dia da semana]
Projeto: Portal de Certificação em Metodologias Ágeis.
Sprint: [número e período].
Meta da Sprint: [descrever].
Horário real: [início] a [fim]. Duração: [minutos].
Participantes presentes: [nomes].
Ausentes: [nomes].
Responsável pelo registro: [nome].
RFs e tasks relacionados: [identificadores].

Avanços desde a última daily:
- [pessoa ou frente] | [avanço concreto] | [evidência ou link].

Trabalho planejado até a próxima daily:
- [ação] | [responsável] | [prazo] | [resultado esperado].

Impedimentos:
- [problema] | [impacto] | [responsável por tratar] | [encaminhamento].
Se não houver impedimentos relatados, registrar essa informação após
confirmar com os participantes.

Assuntos abordados e decisões tomadas:
- [assunto] | [decisão real] | [justificativa] | [RF/task afetado].

Alterações no Sprint Backlog:
- [task] | [alteração de status, escopo ou responsável] | [motivo].

Discussões que continuarão após a daily:
- [assunto] | [envolvidos] | [quando será tratado].

Evidências: [links do Figma, DER, commits, issues ou documentos].
Próxima daily: [data e horário combinados].
Validação: [pendente / validado por e em data].

ORIENTAÇÃO PARA CONTINUIDADE

Duplicar o modelo para cada nova reunião e preencher logo após a daily.
Se não houver reunião em uma data, registrar “daily não realizada” e
o motivo, se conhecido. Preservar o histórico e registrar correções com
a data da alteração. Ao validar uma síntese antiga, substituir a proposta
pelo relato real e atualizar seu status.

```
