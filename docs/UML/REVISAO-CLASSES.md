# Review dos diagramas de classes - 19/10/2026

## Verificação antes da publicação

Foram verificadas as cinco branches remotas disponíveis. `develop` estava em `5b8992f0c689b54f12f43a3798477ddfaaa72b63`; `main`, em `40beab55c78411b683bfd7b6169498a4c27afd1f`; Sprint 1, em `60d22bdf5ef2b5e27d829c6315ca1b78a01a4100`. Sprints 2 e 3 não tinham diagramas de classes publicados.

**Já existiam cinco arquivos Astah de Tiago Oliveira**, publicados em 16/10. Os arquivos da main e da Sprint 1 têm conteúdo binário idêntico, embora os caminhos antigos da Sprint 1 ainda usem `documentos/`. Eles não estavam em develop. Foram preservados com os mesmos bytes, nomes e crédito de autoria.

A revisão inspecionou os elementos do `EntityStore` serializado, sem execução de classes Java, e comparou com o desafio oficial e o schema. Não foi feita abertura/renderização dos cinco projetos no Astah; disposição visual e comportamento específico do editor devem ser conferidos pela equipe. O [inventário](INVENTARIO-CLASSES-EXISTENTES.json) registra nomes, atributos, operações e hashes extraídos.

| Arquivo existente | Elementos encontrados | Decisão |
|---|---|---|
| Cadastro | FormularioCadastro e Aluno, com CPF, nome, email, senha_hash e cadastro | Preservar; não criar novo diagrama de cadastro |
| Login | FormularioLogin, Aluno/aluno, CPF/senha e envio de login | Preservar; não criar novo diagrama de login |
| Questionário | Temas, Questão e Alternativa, imagem e sorteio | Preservar; não redesenhar o questionário |
| Resposta | Questão, Resposta e Aluno; escolha, horários, acerto e prazo | Preservar; não redesenhar a resposta |
| Emissão | Resposta e Alunos; certificado_hash e emitirCertificado | Preservar a emissão; acrescentar apenas estrutura de dados de resultado/certificado ainda ausente |

## Lacunas encontradas e complementos publicados

Nos elementos extraídos não foram encontradas as classes **ConteudoEstudo, Tentativa, EtapaAvaliacao, Resultado e Certificado**. Foram adicionadas apenas três vistas:

1. [Área de estudos](complementos/imagens/01-area-estudos.svg), RF07/RP07, usando Temas como referência.
2. [Ciclo da avaliação](complementos/imagens/02-tentativa-retomada-historico.svg), com prazo, estados, retomada, histórico e progresso. Reutiliza as classes de Thiago como referências.
3. [Resultado e dados do certificado](complementos/imagens/03-resultado-validacao.svg), RF16-RF19/RP08, sem substituir a operação de emissão existente.

A proposta anterior de oito vistas completas não foi publicada. Os complementos não acrescentam um segundo fluxo de cadastro/login/questionário, nem serviços/controllers/repositórios extras.

## Pontos para revisão com Thiago/equipe

- Unificar o conceito de candidato representado por `Aluno`, `aluno` e `Alunos`, sem trocar os nomes dos originais automaticamente.
- Confirmar que `senha` no login é entrada temporária; persistência deve usar hash seguro, como no cadastro. O diagrama não comprova armazenamento de senha em texto puro.
- Alinhar `certificado_hash` do original com o identificador/token e com o snapshot dos campos obrigatórios do Certificado. Hash e UUID não foram tratados como sinônimos.
- Conferir multiplicidades, unicidade por tema/tentativa e os limites de 12 temas, quatro questões publicadas por tema e quatro alternativas com uma correta.
- Detalhar preservação de gabarito e versão sorteada no histórico, encerramento sem escolha e não reabertura. Não modificar a questão já usada de modo a alterar histórico.
- Confirmar decisões D03/D04/D05/D06/D07: nota, interrupção, novas tentativas, dados públicos e reconexão. O complemento não declara essas decisões aprovadas.
- Revisar os três complementos antes de incorporá-los aos arquivos Astah e antes de solicitar PR.

## Escopo da publicação

Somente `develop`, pela conta `breesiqueiramkt`. Os cinco arquivos de Thiago são trazidos de main com os mesmos blobs, sem reautoria do conteúdo. O commit original de Thiago permanece em main e é referenciado nesta documentação. Não serão alteradas main ou as branches de Sprint, não haverá PR nem merge nesta tarefa. Outros trabalhos de main, como o Daily preenchido e o certificado V2, permanecem fora desta alteração de classes.

## Verificações

Fontes novas verificadas pelo PlantUML, imagens decodificadas e inspecionadas, links relativos conferidos. Os cinco `.asta` foram comparados byte a byte com os blobs da main. O projeto de caso de uso existente também foi preservado. Isso é revisão técnica assistida; a revisão independente e o aceite ficam com o grupo.
