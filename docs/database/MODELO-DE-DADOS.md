# Modelagem integral de referência

Este documento descreve o modelo de referência em `public`: cadastro, estudos, questões, avaliação, histórico, resultado e certificado. A API usa o modelo de cinco tabelas em [database/servidor](../../database/servidor/README.md). O alinhamento dos dois modelos com o Astah e o Figma continua pendente.

| Artefato | Visualização | Fonte editável |
|---|---|---|
| Modelo conceitual / DER | [PNG](conceitual.png) | [DOT](conceitual.dot), [SVG](conceitual.svg) |
| Modelo lógico relacional | [PNG](logico.png) | [DOT](logico.dot), [SVG](logico.svg) |
| Dicionário completo | [Colunas, tipos, obrigatoriedade e restrições](dicionario.md) | [Metadados JSON](metadados.json) |
| Modelo físico | [DDL PostgreSQL](../../database/schema.sql) | SQL canônico, sem duplicação |
| Amostra e operações | [Seed](../../database/seed.sql) e [consultas preparadas](../../database/consultas-exemplo.sql) | SQL |
| Validação | [Testes em transação revertida](../../testes/database.sql) | SQL |

Nos diagramas, a cardinalidade de rascunho pode ser zero. Uma questão publicada exige quatro alternativas; o currículo pronto exige exatamente 12 temas selecionados e quatro questões publicadas em cada um. Essas invariantes globais não são representadas só pelas FKs. A view de prontidão deve ser exigida pela API antes de iniciar a prova.

## Entidades e relacionamentos

Candidato possui tentativas; Tema possui material de estudo e versões de questões; Questão possui alternativas. Uma Etapa liga tentativa, tema e versão sorteada, guardando ordem, estado e prazo. Resposta é única por etapa e preserva a escolha (ou ausência) e gabarito. Resultado exige 12 temas encerrados; Certificado é único por resultado aprovado e guarda os dados no instante de emissão.

A imagem é um atributo composto da versão de Questão: caminho, descrição e fonte. Não foi criada tabela de imagens sem necessidade de reutilização; um arquivo externo só será aceito se existir/for acessível e tiver crédito aprovado.

## Normalização e dados preservados

- **1FN:** cada célula guarda um valor; alternativas e etapas ficam em linhas, não em quatro colunas ou lista JSON. Conteúdo Markdown é um documento textual, não uma coleção de relacionamentos escondidos.
- **2FN:** em `alternativa`, texto/correta dependem da chave completa `(questao_id, letra)`. Demais entidades usam identificador ou chave natural composta apropriada.
- **3FN:** nome/CPF do candidato não são repetidos em cada etapa; dados do tema e questão são referenciados. Não armazenar saldo de progresso independente que possa divergir das etapas.
- **Snapshots:** gabarito em Resposta e dados do titular em Certificado são redundância intencional para rastreabilidade histórica; triggers validam a origem e bloqueiam alteração. Resultado materializa contagem conferida e gera nota/percentual. Esses registros preservam os dados da avaliação e da emissão, mesmo se o cadastro mudar depois.
- `questao_id` repetido em Resposta e `tema_id` em Etapa permitem FKs compostas que impedem associar alternativa/tema incorretos. A redundância é controlada por restrições, não por sincronização manual.

## Regras e limites

[Decisões D03–D05](../Gestao/DECISOES.md) permanecem pendentes: cálculo e arredondamento, interrupção e novas tentativas. O modelo aplica pesos iguais como proposta identificada, e unicidade de tema por tentativa. Se o professor exigir apenas uma tentativa por candidato, será necessário adaptar essa política.

As triggers cuidam das regras do banco. A API precisa cuidar também da autenticação, da titularidade, das consultas parametrizadas e das transações concorrentes. O schema inicial é para banco vazio; mudanças posteriores exigirão migrações versionadas sem apagar histórico. O token de certificado é referência para a URL de validação; a geração do QR ainda está pendente.

Os metadados foram extraídos do DDL em PGlite (PostgreSQL 18.6/WASM) para documentação. O CI executa o mesmo DDL e testes no PostgreSQL **17** real em container; conferir o resultado do commit entregue.
