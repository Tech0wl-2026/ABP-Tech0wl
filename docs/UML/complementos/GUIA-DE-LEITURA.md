# Guia de leitura dos diagramas de classes

## Classes e relações

- **ConteudoEstudo** se liga a **Temas** e reúne título, material, fontes, versão e publicação (RF07/RP07).
- **Tentativa** e **EtapaAvaliacao** representam sorteio por tema, prazo de 150 segundos, encerramento e retomada. Histórico e progresso são consultas das etapas.
- **Resultado** e **Certificado** representam o cálculo após os 12 temas, o aproveitamento mínimo de 65%, os dados da emissão e a URL de validação pública.

Os diagramas contêm cinco classes e duas enumerações. As caixas cinza com `<<referencia>>` representam Aluno, Temas, Questão e Resposta dos [projetos Astah](../README.md). Tentativa aparece em duas vistas como o mesmo elemento.

## Regras de leitura

`-` indica atributo privado; `+`, operação proposta; `/`, propriedade derivada; `[0..1]`, opcional. `Texto {tamanho=11}` é tamanho do CPF, não multiplicidade de onze CPFs. Os tipos são de análise, independentes de stack.

`0..12` permite uma tentativa parcial, mas a conclusão exige os 12 temas distintos encerrados. `0..1` Resposta permite uma etapa ainda aberta; depois do encerramento deve existir um registro, mesmo sem escolha no prazo. O gabarito e a versão sorteada precisam ser preservados para histórico. Etapa encerrada não pode ser reaberta.

Múltiplas tentativas por candidato, efeito de certas interrupções e cálculo/escala seguem as decisões D03/D04/D05 ainda a confirmar. A fórmula final deve ser confirmada com o professor. Certificado só com aproveitamento >=65%; QR deve apontar para uma página pública real usando o token. `urlValidacao` e `qrCode` são derivados, sem acrescentar colunas ao banco. Campos públicos dependem de D06.

As classes novas se ligam ao [schema de referência](../../../database/schema.sql) sem alterar DDL ou código. O nome `Aluno` é o usado no cadastro original e corresponde ao candidato do desafio/tabela `candidato`. Variações `aluno`/`Alunos` precisam de alinhamento pela equipe, sem renomeação automática dos arquivos existentes.

## Editar e levar ao Astah

Os `.puml` são fontes editáveis em PlantUML. A sintaxe foi conferida com PlantUML 1.2026.9 / Java 17 / Smetana. A importação para `.asta` ainda precisa ser conferida no Astah. Para incorporá-los, criar no mesmo modelo as cinco classes novas e os enums, reutilizar os elementos existentes nas outras vistas e conferir atributos, relações e multiplicidades. Evitar recriar Aluno/Temas/Questão/Resposta como classes diferentes.

[Review e pendências para a equipe](../REVISAO-CLASSES.md). O guia descreve a modelagem; a implementação está documentada na API.
