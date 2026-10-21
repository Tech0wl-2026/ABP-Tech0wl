# Dicionário de dados

Derivado do schema de referência. `?` representa nulabilidade no diagrama. Todos os horários usam `timestamptz`; exibir em America/Sao_Paulo sem perder o instante original. PK/FK/UNIQUE/CHECK são listados abaixo de cada tabela. Índices parciais e triggers complementam as restrições.

## Candidato (`candidato`)

| Coluna | Tipo | Obrigatória | Significado | Padrão / geração |
|---|---|---|---|---|
| `id` | bigint | Sim | Identificador gerado pelo banco | `IDENTITY` |
| `cpf` | character varying(11) | Sim | CPF normalizado, somente 11 dígitos; unicidade não valida dígitos verificadores | `—` |
| `nome_completo` | character varying(160) | Sim | Nome do titular | `—` |
| `email` | character varying(254) | Sim | Endereço eletrônico; aplicação deve validar formato completo | `—` |
| `senha_hash` | text | Sim | Hash da senha no modelo de referência; o algoritmo fica a cargo da API | `—` |
| `criado_em` | timestamp with time zone | Sim | Instante de cadastro com fuso | `CURRENT_TIMESTAMP` |

Restrições:

- `CHECK (((cpf)::text ~ '^[0-9]{11}$'::text))`
- `UNIQUE (cpf)`
- `NOT NULL cpf`
- `NOT NULL criado_em`
- `CHECK ((POSITION(('@'::text) IN (email)) > 1))`
- `NOT NULL email`
- `NOT NULL id`
- `CHECK ((length(TRIM(BOTH FROM nome_completo)) > 0))`
- `NOT NULL nome_completo`
- `PRIMARY KEY (id)`
- `CHECK ((length(senha_hash) >= 20))`
- `NOT NULL senha_hash`

## Tema (`tema`)

| Coluna | Tipo | Obrigatória | Significado | Padrão / geração |
|---|---|---|---|---|
| `id` | bigint | Sim | Identificador gerado pelo banco | `IDENTITY` |
| `nome` | character varying(120) | Sim | Nome único do tema | `—` |
| `ordem` | smallint | Sim | Posição 1–12 no currículo ou na tentativa | `—` |
| `selecionado` | boolean | Sim | Indica inclusão no currículo final | `false` |

Restrições:

- `NOT NULL id`
- `UNIQUE (nome)`
- `NOT NULL nome`
- `CHECK (((ordem >= 1) AND (ordem <= 12)))`
- `UNIQUE (ordem)`
- `NOT NULL ordem`
- `PRIMARY KEY (id)`
- `NOT NULL selecionado`

## Conteúdo de estudo (`conteudo_estudo`)

| Coluna | Tipo | Obrigatória | Significado | Padrão / geração |
|---|---|---|---|---|
| `id` | bigint | Sim | Identificador gerado pelo banco | `IDENTITY` |
| `tema_id` | bigint | Sim | Referência ao tema | `—` |
| `titulo` | character varying(180) | Sim | Título do material | `—` |
| `corpo_markdown` | text | Sim | Conteúdo didático versionado | `—` |
| `fontes` | text | Sim | Fontes do conteúdo | `—` |
| `versao` | integer | Sim | Versão positiva do conteúdo | `1` |
| `publicado` | boolean | Sim | Material aprovado para disponibilização | `false` |

Restrições:

- `NOT NULL corpo_markdown`
- `NOT NULL fontes`
- `NOT NULL id`
- `PRIMARY KEY (id)`
- `NOT NULL publicado`
- `FOREIGN KEY (tema_id) REFERENCES tema(id) ON DELETE RESTRICT`
- `NOT NULL tema_id`
- `UNIQUE (tema_id, titulo, versao)`
- `NOT NULL titulo`
- `CHECK ((versao > 0))`
- `NOT NULL versao`

## Questão versionada (`questao`)

| Coluna | Tipo | Obrigatória | Significado | Padrão / geração |
|---|---|---|---|---|
| `id` | bigint | Sim | Identificador gerado pelo banco | `IDENTITY` |
| `tema_id` | bigint | Sim | Referência ao tema | `—` |
| `numero` | smallint | Sim | Slot 1–4 da questão no tema | `—` |
| `versao` | integer | Sim | Versão positiva do conteúdo | `1` |
| `enunciado` | text | Sim | Texto da questão | `—` |
| `imagem_caminho` | text | Sim | Caminho/URL da imagem, validado pela aplicação | `—` |
| `imagem_descricao` | text | Sim | Texto alternativo para a imagem | `—` |
| `imagem_fonte` | text | Sim | Autoria/licença/fonte da imagem | `—` |
| `justificativa` | text | Sim | Explicação pedagógica do gabarito | `—` |
| `fonte_conteudo` | text | Sim | Referência técnica da questão | `—` |
| `publicada` | boolean | Sim | Questão disponível para sorteio | `false` |

Restrições:

- `CHECK ((length(TRIM(BOTH FROM enunciado)) > 0))`
- `NOT NULL enunciado`
- `NOT NULL fonte_conteudo`
- `NOT NULL id`
- `UNIQUE (id, tema_id)`
- `CHECK ((length(TRIM(BOTH FROM imagem_caminho)) > 0))`
- `NOT NULL imagem_caminho`
- `NOT NULL imagem_descricao`
- `NOT NULL imagem_fonte`
- `NOT NULL justificativa`
- `CHECK (((numero >= 1) AND (numero <= 4)))`
- `NOT NULL numero`
- `PRIMARY KEY (id)`
- `NOT NULL publicada`
- `FOREIGN KEY (tema_id) REFERENCES tema(id) ON DELETE RESTRICT`
- `NOT NULL tema_id`
- `UNIQUE (tema_id, numero, versao)`
- `CHECK ((versao > 0))`
- `NOT NULL versao`

## Alternativa (`alternativa`)

| Coluna | Tipo | Obrigatória | Significado | Padrão / geração |
|---|---|---|---|---|
| `questao_id` | bigint | Sim | Referência à versão da questão | `—` |
| `letra` | character(1) | Sim | Alternativa A, B, C ou D | `—` |
| `texto` | text | Sim | Texto da alternativa | `—` |
| `correta` | boolean | Sim | Identifica a única alternativa correta | `false` |

Restrições:

- `NOT NULL correta`
- `CHECK ((letra = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar, 'D'::bpchar])))`
- `NOT NULL letra`
- `PRIMARY KEY (questao_id, letra)`
- `FOREIGN KEY (questao_id) REFERENCES questao(id) ON DELETE RESTRICT`
- `NOT NULL questao_id`
- `CHECK ((length(TRIM(BOTH FROM texto)) > 0))`
- `NOT NULL texto`

## Tentativa (`tentativa`)

| Coluna | Tipo | Obrigatória | Significado | Padrão / geração |
|---|---|---|---|---|
| `id` | bigint | Sim | Identificador gerado pelo banco | `IDENTITY` |
| `candidato_id` | bigint | Sim | Titular da tentativa | `—` |
| `estado` | character varying(16) | Sim | Estado controlado da tentativa ou etapa | `'EM_ANDAMENTO'::character varying` |
| `iniciada_em` | timestamp with time zone | Sim | Início da tentativa | `CURRENT_TIMESTAMP` |
| `concluida_em` | timestamp with time zone | Não | Conclusão da tentativa | `—` |
| `versao_regra` | text | Sim | Regra de cálculo identificada; proposta ainda não aprovada | `'peso-igual-v1-proposta'::text` |

Restrições:

- `FOREIGN KEY (candidato_id) REFERENCES candidato(id) ON DELETE RESTRICT`
- `NOT NULL candidato_id`
- `CHECK (((((estado)::text = 'CONCLUIDA'::text) AND (concluida_em IS NOT NULL)) OR (((estado)::text <> 'CONCLUIDA'::text) AND (concluida_em IS NULL))))`
- `CHECK (((concluida_em IS NULL) OR (concluida_em >= iniciada_em)))`
- `CHECK (((estado)::text = ANY ((ARRAY['EM_ANDAMENTO'::character varying, 'PAUSADA'::character varying, 'CONCLUIDA'::character varying])::text[])))`
- `NOT NULL estado`
- `NOT NULL id`
- `NOT NULL iniciada_em`
- `PRIMARY KEY (id)`
- `NOT NULL versao_regra`

## Etapa da avaliação (`etapa_avaliacao`)

| Coluna | Tipo | Obrigatória | Significado | Padrão / geração |
|---|---|---|---|---|
| `id` | bigint | Sim | Identificador gerado pelo banco | `IDENTITY` |
| `tentativa_id` | bigint | Sim | Referência à tentativa | `—` |
| `tema_id` | bigint | Sim | Referência ao tema | `—` |
| `questao_id` | bigint | Sim | Referência à versão da questão | `—` |
| `ordem` | smallint | Sim | Posição 1–12 no currículo ou na tentativa | `—` |
| `estado` | character varying(16) | Sim | Estado controlado da tentativa ou etapa | `'PENDENTE'::character varying` |
| `apresentada_em` | timestamp with time zone | Não | Início da janela da questão | `—` |
| `prazo_em` | timestamp with time zone | Não | Prazo fixo de apresentação +150 segundos | `—` |
| `encerrada_em` | timestamp with time zone | Não | Instante de encerramento da etapa | `—` |

Restrições:

- `CHECK (((((estado)::text = 'PENDENTE'::text) AND (apresentada_em IS NULL) AND (prazo_em IS NULL) AND (encerrada_em IS NULL)) OR (((estado)::text = 'EM_ANDAMENTO'::text) AND (apresentada_em IS NOT NULL) AND (prazo_em IS NOT NULL) AND (encerrada_em IS NULL)) OR (((estado)::text = ANY ((ARRAY['RESPONDIDA'::character varying, 'EXPIRADA'::character varying, 'INTERROMPIDA'::character varying])::text[])) AND (apresentada_em IS NOT NULL) AND (prazo_em IS NOT NULL) AND (encerrada_em IS NOT NULL))))`
- `CHECK (((prazo_em IS NULL) OR (prazo_em = (apresentada_em + '00:02:30'::interval))))`
- `CHECK (((encerrada_em IS NULL) OR (encerrada_em >= apresentada_em)))`
- `CHECK (((estado)::text = ANY ((ARRAY['PENDENTE'::character varying, 'EM_ANDAMENTO'::character varying, 'RESPONDIDA'::character varying, 'EXPIRADA'::character varying, 'INTERROMPIDA'::character varying])::text[])))`
- `NOT NULL estado`
- `NOT NULL id`
- `UNIQUE (id, questao_id)`
- `CHECK (((ordem >= 1) AND (ordem <= 12)))`
- `NOT NULL ordem`
- `PRIMARY KEY (id)`
- `NOT NULL questao_id`
- `FOREIGN KEY (questao_id, tema_id) REFERENCES questao(id, tema_id) ON DELETE RESTRICT`
- `FOREIGN KEY (tema_id) REFERENCES tema(id) ON DELETE RESTRICT`
- `NOT NULL tema_id`
- `FOREIGN KEY (tentativa_id) REFERENCES tentativa(id) ON DELETE RESTRICT`
- `NOT NULL tentativa_id`
- `UNIQUE (tentativa_id, ordem)`
- `UNIQUE (tentativa_id, tema_id)`

## Resposta (`resposta`)

| Coluna | Tipo | Obrigatória | Significado | Padrão / geração |
|---|---|---|---|---|
| `etapa_id` | bigint | Sim | Referência única à etapa respondida | `—` |
| `questao_id` | bigint | Sim | Referência à versão da questão | `—` |
| `alternativa_escolhida` | character(1) | Não | Letra enviada; nula em encerramento sem resposta | `—` |
| `alternativa_correta` | character(1) | Sim | Snapshot do gabarito validado por trigger | `—` |
| `registrada_em` | timestamp with time zone | Sim | Instante real do registro no servidor do banco | `clock_timestamp()` |
| `acertou` | boolean | Não | Gerado: escolha não nula igual ao gabarito | `Gerada: ((alternativa_escolhida IS NOT NULL) AND (alternativa_escolhida = alternativa_correta))` |

Restrições:

- `NOT NULL alternativa_correta`
- `NOT NULL etapa_id`
- `FOREIGN KEY (etapa_id, questao_id) REFERENCES etapa_avaliacao(id, questao_id) ON DELETE RESTRICT`
- `PRIMARY KEY (etapa_id)`
- `FOREIGN KEY (questao_id, alternativa_correta) REFERENCES alternativa(questao_id, letra) ON DELETE RESTRICT`
- `FOREIGN KEY (questao_id, alternativa_escolhida) REFERENCES alternativa(questao_id, letra) ON DELETE RESTRICT`
- `NOT NULL questao_id`
- `NOT NULL registrada_em`

## Resultado (`resultado`)

| Coluna | Tipo | Obrigatória | Significado | Padrão / geração |
|---|---|---|---|---|
| `tentativa_id` | bigint | Sim | Referência à tentativa | `—` |
| `acertos` | smallint | Sim | Contagem real de respostas corretas nos 12 temas | `—` |
| `total_temas` | smallint | Sim | Denominador fixo de 12 temas | `12` |
| `percentual` | numeric(5,2) | Não | Aproveitamento em percentual; cálculo proposto com pesos iguais | `Gerada: round((((acertos)::numeric * 100.0) / (12)::numeric), 2)` |
| `nota` | numeric(4,2) | Não | Nota 0–10 calculada ou copiada na emissão, proposta D03 | `Gerada: round((((acertos)::numeric * 10.0) / (12)::numeric), 2)` |
| `calculado_em` | timestamp with time zone | Sim | Instante do resultado | `clock_timestamp()` |

Restrições:

- `CHECK (((acertos >= 0) AND (acertos <= 12)))`
- `NOT NULL acertos`
- `NOT NULL calculado_em`
- `PRIMARY KEY (tentativa_id)`
- `FOREIGN KEY (tentativa_id) REFERENCES tentativa(id) ON DELETE RESTRICT`
- `NOT NULL tentativa_id`
- `CHECK ((total_temas = 12))`
- `NOT NULL total_temas`

## Certificado (`certificado`)

| Coluna | Tipo | Obrigatória | Significado | Padrão / geração |
|---|---|---|---|---|
| `id` | uuid | Sim | Identificador gerado pelo banco | `gen_random_uuid()` |
| `tentativa_id` | bigint | Sim | Referência à tentativa | `—` |
| `token_validacao` | uuid | Sim | UUID opaco para futura URL pública/QR; não é o próprio QR | `gen_random_uuid()` |
| `nome_titular` | character varying(160) | Sim | Snapshot do nome na emissão | `—` |
| `cpf_titular` | character varying(11) | Sim | Snapshot do CPF na emissão, documento privado | `—` |
| `email_titular` | character varying(254) | Sim | Snapshot do e-mail na emissão, documento privado | `—` |
| `nota` | numeric(4,2) | Sim | Nota 0–10 calculada ou copiada na emissão, proposta D03 | `—` |
| `percentual` | numeric(5,2) | Sim | Aproveitamento em percentual; cálculo proposto com pesos iguais | `—` |
| `emitido_em` | timestamp with time zone | Sim | Instante da emissão preenchido no banco | `clock_timestamp()` |

Restrições:

- `NOT NULL cpf_titular`
- `NOT NULL email_titular`
- `NOT NULL emitido_em`
- `NOT NULL id`
- `NOT NULL nome_titular`
- `NOT NULL nota`
- `CHECK (((percentual >= (65)::numeric) AND (percentual <= (100)::numeric)))`
- `NOT NULL percentual`
- `PRIMARY KEY (id)`
- `FOREIGN KEY (tentativa_id) REFERENCES resultado(tentativa_id) ON DELETE RESTRICT`
- `UNIQUE (tentativa_id)`
- `NOT NULL tentativa_id`
- `UNIQUE (token_validacao)`
- `NOT NULL token_validacao`

## Índices parciais e regras entre linhas

- `questao_slot_publicado`: apenas uma versão publicada por tema/posição.
- `alternativa_uma_correta`: no máximo uma correta; trigger de publicação exige exatamente quatro alternativas e uma correta.
- `etapa_uma_questao_ativa`: uma questão em andamento por tentativa.
- Triggers validam prazo do servidor, gabarito, estado, fechamento e resultado; impedem editar/excluir resposta, resultado e certificado e reabrir etapa encerrada.
- Questão e alternativas utilizadas são preservadas para histórico. Nova versão exige despublicar a anterior sem editar seu conteúdo usado.
- View `v_prontidao_base`: verifica a prontidão do modelo de referência. A API usa o schema `servidor`, com suas próprias verificações.
- CPF e e-mail têm validação básica no banco; validação completa, hash seguro, autorização e privacidade também são responsabilidade da API.

Consultar o [DDL canônico](../../database/schema.sql) para as funções/triggers completas e [decisões pendentes](../Gestao/DECISOES.md) para D03–D05.
