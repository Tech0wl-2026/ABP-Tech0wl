-- Modelo executável da orientação do professor de 21/10/2026.
-- O namespace separa esta implementação dos modelos de referência em public.
BEGIN;
CREATE SCHEMA servidor;
SET LOCAL search_path TO servidor;

CREATE TABLE candidatos (
  id SERIAL PRIMARY KEY,
  cpf CHAR(11) NOT NULL UNIQUE CHECK (cpf ~ '^[0-9]{11}$'),
  nome VARCHAR(100) NOT NULL CHECK (length(trim(nome)) > 0),
  email VARCHAR(100) NOT NULL,
  senha_hash TEXT NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  certificado_hash VARCHAR(96) UNIQUE,
  certificado_emitido_em TIMESTAMPTZ,
  certificado_dados JSONB
);
CREATE TABLE temas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  ordem INT NOT NULL UNIQUE CHECK (ordem BETWEEN 1 AND 12)
);
CREATE TABLE questoes (
  id SERIAL PRIMARY KEY,
  tema_id INT NOT NULL REFERENCES temas(id),
  ordem INT NOT NULL CHECK (ordem BETWEEN 1 AND 4),
  enunciado TEXT NOT NULL,
  imagem_url VARCHAR(200) NOT NULL,
  UNIQUE (tema_id, ordem),
  UNIQUE (id, tema_id)
);
CREATE TABLE alternativas (
  id SERIAL PRIMARY KEY,
  questao_id INT NOT NULL REFERENCES questoes(id),
  letra CHAR(1) NOT NULL CHECK (letra IN ('A','B','C','D')),
  texto TEXT NOT NULL,
  correta BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (questao_id, letra)
);
CREATE UNIQUE INDEX uma_correta_por_questao ON alternativas(questao_id) WHERE correta;
CREATE TABLE respostas (
  candidato_id INT NOT NULL REFERENCES candidatos(id),
  questao_id INT NOT NULL,
  tema_id INT NOT NULL,
  letra_resposta CHAR(1) CHECK (letra_resposta IN ('A','B','C','D')),
  data_horario_inicio TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  data_horario_resposta TIMESTAMPTZ,
  valida BOOLEAN GENERATED ALWAYS AS (
    data_horario_resposta - data_horario_inicio <= INTERVAL '150 seconds'
  ) STORED,
  acertou BOOLEAN,
  PRIMARY KEY (candidato_id, questao_id),
  UNIQUE (candidato_id, tema_id),
  FOREIGN KEY (questao_id, tema_id) REFERENCES questoes(id, tema_id),
  FOREIGN KEY (questao_id, letra_resposta) REFERENCES alternativas(questao_id, letra),
  CHECK (data_horario_resposta IS NULL OR data_horario_resposta >= data_horario_inicio),
  CHECK (data_horario_resposta IS NOT NULL OR (letra_resposta IS NULL AND acertou IS NULL))
);
CREATE UNIQUE INDEX uma_questao_aberta ON respostas(candidato_id) WHERE data_horario_resposta IS NULL;
CREATE INDEX respostas_expiracao ON respostas(data_horario_inicio) WHERE data_horario_resposta IS NULL;

CREATE FUNCTION proteger_resposta() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN RAISE EXCEPTION 'Respostas não podem ser excluídas'; END IF;
  IF OLD.data_horario_resposta IS NOT NULL OR
     ROW(NEW.candidato_id,NEW.questao_id,NEW.tema_id,NEW.data_horario_inicio)
     IS DISTINCT FROM ROW(OLD.candidato_id,OLD.questao_id,OLD.tema_id,OLD.data_horario_inicio) THEN
    RAISE EXCEPTION 'Resposta finalizada ou sorteio não podem ser alterados';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER resposta_imutavel BEFORE UPDATE OR DELETE ON respostas
  FOR EACH ROW EXECUTE FUNCTION proteger_resposta();
COMMIT;
