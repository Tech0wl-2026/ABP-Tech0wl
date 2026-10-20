# Sequências revisadas

Referência corrigida de interação entre interface, controlador e PostgreSQL. São modelos para implementação: não comprovam API, autenticação ou certificação funcionando.

| Vista | Ler | Editar |
|---|---|---|
| 01-cadastro | [SVG](imagens/01-cadastro.svg) / [PNG](imagens/01-cadastro.png) | [PlantUML](fontes/01-cadastro.puml) |
| 02-login | [SVG](imagens/02-login.svg) / [PNG](imagens/02-login.png) | [PlantUML](fontes/02-login.puml) |
| 03-questao | [SVG](imagens/03-questao.svg) / [PNG](imagens/03-questao.png) | [PlantUML](fontes/03-questao.puml) |
| 04-retomada | [SVG](imagens/04-retomada.svg) / [PNG](imagens/04-retomada.png) | [PlantUML](fontes/04-retomada.puml) |
| 05-resultado-certificado | [SVG](imagens/05-resultado-certificado.svg) / [PNG](imagens/05-resultado-certificado.png) | [PlantUML](fontes/05-resultado-certificado.puml) |
| 06-validacao-publica | [SVG](imagens/06-validacao-publica.svg) / [PNG](imagens/06-validacao-publica.png) | [PlantUML](fontes/06-validacao-publica.puml) |

## Correções

- Cadastro retorna do banco ao controlador e depois à tela. CPF duplicado e entrada inválida têm caminhos próprios.
- Login verifica credenciais no controlador e prevê falha genérica; hash/senha não retornam à interface.
- A questão sorteada e o prazo de 150s são persistidos. Resposta, expiração, interrupção, feedback e não repetição estão representados.
- Retomada segue o próximo tema pendente. O loop usa condição explícita, com pausa e encerramento após 12 temas.
- Resultado respeita as 12 etapas; certificado depende de aproveitamento >=65%, com snapshot e QR para validação pública.
- Decisões D03–D07 continuam sinalizadas como pendentes; os diagramas não anunciam aprovação de fórmulas, sessão ou tratamento de conexão.

## Astah e autoria

O projeto de caso de uso da main foi preservado no caminho original. A atualização de Abdi com DS01/DS02 foi preservada em [rascunhos](../rascunhos/README.md). Ela contém os pontos identificados no review e não é a versão corrigida das sequências.

As correções desta pasta estão em **PlantUML**, com imagens verificáveis. Não foram gravadas nos projetos `.asta`: falta incorporar/revisar estes fluxos no Astah da equipe. Não foi feita validação de abertura no editor Astah. Essa pendência impede considerar encerradas as issues UML que exigem o formato nativo ou aceite do grupo.

Os cinco diagramas de classes de Thiago não foram alterados. As fontes PlantUML são editáveis e não substituem a autoria dos modelos anteriores.
