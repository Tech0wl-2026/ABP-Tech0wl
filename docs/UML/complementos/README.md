# Diagramas complementares de classes

Estas são **somente as partes não localizadas nos cinco diagramas Astah existentes de Thiago**. Cadastro, login, questionário, resposta e emissão continuam nos arquivos originais. Não foi publicado um segundo conjunto completo concorrente.

| Complemento | Visualizar | Editar |
|---|---|---|
| Área de estudos | [SVG](imagens/01-area-estudos.svg) / [PNG](imagens/01-area-estudos.png) | [PlantUML](fontes/01-area-estudos.puml) |
| Tentativa, retomada, histórico e progresso | [SVG](imagens/02-tentativa-retomada-historico.svg) / [PNG](imagens/02-tentativa-retomada-historico.png) | [PlantUML](fontes/02-tentativa-retomada-historico.puml) |
| Resultado e dados do certificado | [SVG](imagens/03-resultado-validacao.svg) / [PNG](imagens/03-resultado-validacao.png) | [PlantUML](fontes/03-resultado-validacao.puml) |

## O que foi acrescentado

- **ConteudoEstudo**, ligado a **Temas**: título, material, fontes, versão e publicação, para RF07/RP07.
- **Tentativa** e **EtapaAvaliacao**, com estados: uma questão sorteada por tema, prazo de 150 segundos, encerramento, retomada e consulta de histórico/progresso. Histórico e progresso são consultas das etapas, sem tabelas duplicadas.
- **Resultado** e **Certificado**: contagem e cálculo após os 12 temas, aproveitamento mínimo de 65%, snapshot dos dados obrigatórios e URL para validação via QR.

São **cinco classes novas** e **duas enumerações**. As caixas cinza com `<<referencia>>` apenas reutilizam Aluno, Temas, Questão e Resposta dos modelos de Thiago. A classe Tentativa também aparece em duas vistas como o mesmo elemento. Não é uma nova versão de cadastro, login ou resposta.

## Regras de leitura

`-` indica atributo privado; `+`, operação proposta; `/`, propriedade derivada; `[0..1]`, opcional. `Texto {tamanho=11}` é tamanho do CPF, não multiplicidade de onze CPFs. Os tipos são de análise, independentes de stack.

`0..12` permite uma tentativa parcial, mas a conclusão exige os 12 temas distintos encerrados. `0..1` Resposta permite uma etapa ainda aberta; depois do encerramento deve existir um registro, mesmo sem escolha no prazo. O gabarito e a versão sorteada precisam ser preservados para histórico. Etapa encerrada não pode ser reaberta.

Múltiplas tentativas por candidato, efeito de certas interrupções e cálculo/escala seguem as decisões D03/D04/D05 ainda a confirmar. Não foi imposta fórmula como regra oficial. Certificado só com aproveitamento >=65%; QR deve apontar para uma página pública real usando o token. `urlValidacao` e `qrCode` são derivados, sem acrescentar colunas ao banco. Campos públicos dependem de D06.

As classes novas se ligam ao [schema de referência](../../../database/schema.sql) sem alterar DDL ou código. O nome `Aluno` é o usado no cadastro original e corresponde ao candidato do desafio/tabela `candidato`. Variações `aluno`/`Alunos` precisam de alinhamento pela equipe, sem renomeação automática dos arquivos existentes.

## Editar e levar ao Astah

Os `.puml` são fontes editáveis em PlantUML. A sintaxe foi conferida com PlantUML 1.2026.9 / Java 17 / Smetana. Não são projetos `.asta`, nem importação testada no Astah. Para incorporá-los, criar no mesmo modelo as cinco classes novas e os enums, reutilizar os elementos existentes nas outras vistas e conferir atributos, relações e multiplicidades. Evitar recriar Aluno/Temas/Questão/Resposta como classes diferentes.

[Review e pendências para a equipe](../REVISAO-CLASSES.md). Modelagem proposta, sem declaração de implementação ou aceite pedagógico.
