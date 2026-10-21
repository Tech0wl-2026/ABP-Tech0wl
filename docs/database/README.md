# Modelagem do banco de dados

Esta pasta reúne os modelos conceitual e lógico do portal, o dicionário de dados e as fontes dos diagramas.

| Arquivo | Conteúdo |
|---|---|
| [conceitual.png](conceitual.png) · [conceitual.svg](conceitual.svg) | Diagrama de entidades e relacionamentos. |
| [conceitual.dot](conceitual.dot) | Fonte editável do modelo conceitual. |
| [logico.png](logico.png) · [logico.svg](logico.svg) | Modelo lógico relacional. |
| [logico.dot](logico.dot) | Fonte editável do modelo lógico. |
| [dicionario.md](dicionario.md) | Tabelas, colunas, tipos e restrições. |
| [metadados.json](metadados.json) | Estrutura do banco em JSON. |
| [MODELO-DE-DADOS.md](MODELO-DE-DADOS.md) | Entidades, normalização, regras e limites do modelo. |

Os scripts SQL ficam em [database](../../database): [schema](../../database/schema.sql), [dados de exemplo](../../database/seed.sql) e [consultas](../../database/consultas-exemplo.sql). Os testes estão em [testes/database.sql](../../testes/database.sql).

O modelo executável usado pela API fica em [database/servidor](../../database/servidor/README.md), separado destas referências.
