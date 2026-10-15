-- Modelo físico de referência da Sprint 1. PostgreSQL 17+.
-- Banco vazio: executar uma vez. Regras pendentes: docs/Gestao/DECISOES.md.
BEGIN;

CREATE TABLE candidato (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cpf varchar(11) NOT NULL UNIQUE CHECK (cpf ~ '^[0-9]{11}$'),
    nome_completo varchar(160) NOT NULL CHECK (length(trim(nome_completo)) > 0),
    email varchar(254) NOT NULL CHECK (position('@' in email) > 1),
    senha_hash text NOT NULL CHECK (length(senha_hash) >= 20),
    criado_em timestamptz NOT NULL DEFAULT current_timestamp
);

CREATE TABLE tema (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome varchar(120) NOT NULL UNIQUE,
    ordem smallint NOT NULL UNIQUE CHECK (ordem BETWEEN 1 AND 12),
    selecionado boolean NOT NULL DEFAULT false
);

CREATE TABLE conteudo_estudo (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tema_id bigint NOT NULL REFERENCES tema(id) ON DELETE RESTRICT,
    titulo varchar(180) NOT NULL,
    corpo_markdown text NOT NULL,
    fontes text NOT NULL,
    versao integer NOT NULL DEFAULT 1 CHECK (versao > 0),
    publicado boolean NOT NULL DEFAULT false,
    UNIQUE (tema_id, titulo, versao)
);

CREATE TABLE questao (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tema_id bigint NOT NULL REFERENCES tema(id) ON DELETE RESTRICT,
    numero smallint NOT NULL CHECK (numero BETWEEN 1 AND 4),
    versao integer NOT NULL DEFAULT 1 CHECK (versao > 0),
    enunciado text NOT NULL CHECK (length(trim(enunciado)) > 0),
    imagem_caminho text NOT NULL CHECK (length(trim(imagem_caminho)) > 0),
    imagem_descricao text NOT NULL,
    imagem_fonte text NOT NULL,
    justificativa text NOT NULL,
    fonte_conteudo text NOT NULL,
    publicada boolean NOT NULL DEFAULT false,
    UNIQUE (tema_id, numero, versao),
    UNIQUE (id, tema_id)
);
CREATE UNIQUE INDEX questao_slot_publicado ON questao(tema_id, numero) WHERE publicada;

CREATE TABLE alternativa (
    questao_id bigint NOT NULL REFERENCES questao(id) ON DELETE RESTRICT,
    letra char(1) NOT NULL CHECK (letra IN ('A', 'B', 'C', 'D')),
    texto text NOT NULL CHECK (length(trim(texto)) > 0),
    correta boolean NOT NULL DEFAULT false,
    PRIMARY KEY (questao_id, letra)
);
CREATE UNIQUE INDEX alternativa_uma_correta ON alternativa(questao_id) WHERE correta;

CREATE TABLE tentativa (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    candidato_id bigint NOT NULL REFERENCES candidato(id) ON DELETE RESTRICT,
    estado varchar(16) NOT NULL DEFAULT 'EM_ANDAMENTO'
      CHECK (estado IN ('EM_ANDAMENTO', 'PAUSADA', 'CONCLUIDA')),
    iniciada_em timestamptz NOT NULL DEFAULT current_timestamp,
    concluida_em timestamptz,
    versao_regra text NOT NULL DEFAULT 'peso-igual-v1-proposta',
    CHECK ((estado = 'CONCLUIDA' AND concluida_em IS NOT NULL)
        OR (estado <> 'CONCLUIDA' AND concluida_em IS NULL)),
    CHECK (concluida_em IS NULL OR concluida_em >= iniciada_em)
);

CREATE TABLE etapa_avaliacao (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tentativa_id bigint NOT NULL REFERENCES tentativa(id) ON DELETE RESTRICT,
    tema_id bigint NOT NULL REFERENCES tema(id) ON DELETE RESTRICT,
    questao_id bigint NOT NULL,
    ordem smallint NOT NULL CHECK (ordem BETWEEN 1 AND 12),
    estado varchar(16) NOT NULL DEFAULT 'PENDENTE'
      CHECK (estado IN ('PENDENTE', 'EM_ANDAMENTO', 'RESPONDIDA', 'EXPIRADA', 'INTERROMPIDA')),
    apresentada_em timestamptz,
    prazo_em timestamptz,
    encerrada_em timestamptz,
    UNIQUE (tentativa_id, tema_id),
    UNIQUE (tentativa_id, ordem),
    UNIQUE (id, questao_id),
    FOREIGN KEY (questao_id, tema_id) REFERENCES questao(id, tema_id) ON DELETE RESTRICT,
    CHECK ((estado = 'PENDENTE' AND apresentada_em IS NULL AND prazo_em IS NULL AND encerrada_em IS NULL)
        OR (estado = 'EM_ANDAMENTO' AND apresentada_em IS NOT NULL AND prazo_em IS NOT NULL AND encerrada_em IS NULL)
        OR (estado IN ('RESPONDIDA', 'EXPIRADA', 'INTERROMPIDA') AND apresentada_em IS NOT NULL AND prazo_em IS NOT NULL AND encerrada_em IS NOT NULL)),
    CHECK (prazo_em IS NULL OR prazo_em = apresentada_em + interval '150 seconds'),
    CHECK (encerrada_em IS NULL OR encerrada_em >= apresentada_em)
);
CREATE UNIQUE INDEX etapa_uma_questao_ativa ON etapa_avaliacao(tentativa_id) WHERE estado = 'EM_ANDAMENTO';

CREATE TABLE resposta (
    etapa_id bigint PRIMARY KEY,
    questao_id bigint NOT NULL,
    alternativa_escolhida char(1),
    alternativa_correta char(1) NOT NULL,
    registrada_em timestamptz NOT NULL DEFAULT clock_timestamp(),
    acertou boolean GENERATED ALWAYS AS
      (alternativa_escolhida IS NOT NULL AND alternativa_escolhida = alternativa_correta) STORED,
    FOREIGN KEY (etapa_id, questao_id) REFERENCES etapa_avaliacao(id, questao_id) ON DELETE RESTRICT,
    FOREIGN KEY (questao_id, alternativa_escolhida) REFERENCES alternativa(questao_id, letra) ON DELETE RESTRICT,
    FOREIGN KEY (questao_id, alternativa_correta) REFERENCES alternativa(questao_id, letra) ON DELETE RESTRICT
);

CREATE TABLE resultado (
    tentativa_id bigint PRIMARY KEY REFERENCES tentativa(id) ON DELETE RESTRICT,
    acertos smallint NOT NULL CHECK (acertos BETWEEN 0 AND 12),
    total_temas smallint NOT NULL DEFAULT 12 CHECK (total_temas = 12),
    percentual numeric(5,2) GENERATED ALWAYS AS (round(acertos * 100.0 / 12, 2)) STORED,
    nota numeric(4,2) GENERATED ALWAYS AS (round(acertos * 10.0 / 12, 2)) STORED,
    calculado_em timestamptz NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE certificado (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tentativa_id bigint NOT NULL UNIQUE REFERENCES resultado(tentativa_id) ON DELETE RESTRICT,
    token_validacao uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    nome_titular varchar(160) NOT NULL,
    cpf_titular varchar(11) NOT NULL,
    email_titular varchar(254) NOT NULL,
    nota numeric(4,2) NOT NULL,
    percentual numeric(5,2) NOT NULL CHECK (percentual >= 65 AND percentual <= 100),
    emitido_em timestamptz NOT NULL DEFAULT clock_timestamp()
);

CREATE INDEX tentativa_candidato ON tentativa(candidato_id);
CREATE INDEX conteudo_tema ON conteudo_estudo(tema_id);
CREATE INDEX etapa_questao ON etapa_avaliacao(questao_id);

CREATE FUNCTION validar_publicacao_questao() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE quantidade integer; corretas integer;
BEGIN
    IF TG_OP = 'UPDATE' AND EXISTS (SELECT 1 FROM etapa_avaliacao WHERE questao_id = OLD.id)
       AND (to_jsonb(NEW) - 'publicada') IS DISTINCT FROM (to_jsonb(OLD) - 'publicada') THEN
        RAISE EXCEPTION 'Questão utilizada é imutável; criar uma nova versão';
    END IF;
    IF NEW.publicada THEN
        SELECT count(*), count(*) FILTER (WHERE correta) INTO quantidade, corretas
          FROM alternativa WHERE questao_id = NEW.id;
        IF quantidade <> 4 OR corretas <> 1 THEN
            RAISE EXCEPTION 'Publicação exige quatro alternativas e exatamente uma correta';
        END IF;
    END IF;
    RETURN NEW;
END $$;
CREATE TRIGGER questao_publicacao BEFORE INSERT OR UPDATE ON questao
  FOR EACH ROW EXECUTE FUNCTION validar_publicacao_questao();

CREATE FUNCTION proteger_alternativa_publicada() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    PERFORM 1 FROM questao WHERE id IN (NEW.questao_id, OLD.questao_id) FOR UPDATE;
    IF EXISTS (SELECT 1 FROM questao q WHERE q.id IN (NEW.questao_id, OLD.questao_id)
      AND (q.publicada OR EXISTS (SELECT 1 FROM etapa_avaliacao e WHERE e.questao_id = q.id))) THEN
        RAISE EXCEPTION 'Alternativas de questão publicada são imutáveis';
    END IF;
    RETURN COALESCE(NEW, OLD);
END $$;
CREATE TRIGGER alternativa_publicada BEFORE INSERT OR UPDATE OR DELETE ON alternativa
  FOR EACH ROW EXECUTE FUNCTION proteger_alternativa_publicada();

CREATE FUNCTION validar_registro_resposta() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE etapa etapa_avaliacao; gabarito char(1);
BEGIN
    SELECT * INTO STRICT etapa FROM etapa_avaliacao WHERE id = NEW.etapa_id FOR UPDATE;
    IF etapa.estado <> 'EM_ANDAMENTO' THEN RAISE EXCEPTION 'Questão não está em resolução'; END IF;
    SELECT letra INTO STRICT gabarito FROM alternativa WHERE questao_id = etapa.questao_id AND correta;
    IF NEW.alternativa_correta <> gabarito THEN RAISE EXCEPTION 'Gabarito inconsistente'; END IF;
    NEW.registrada_em := clock_timestamp();
    IF NEW.alternativa_escolhida IS NOT NULL AND NEW.registrada_em > etapa.prazo_em THEN
        RAISE EXCEPTION 'Prazo encerrado; registrar encerramento sem resposta';
    END IF;
    RETURN NEW;
END $$;
CREATE TRIGGER resposta_consistente BEFORE INSERT ON resposta
  FOR EACH ROW EXECUTE FUNCTION validar_registro_resposta();

CREATE FUNCTION impedir_alteracao_historico() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'Histórico finalizado é imutável'; END $$;
CREATE TRIGGER resposta_imutavel BEFORE UPDATE OR DELETE ON resposta
  FOR EACH ROW EXECUTE FUNCTION impedir_alteracao_historico();
CREATE TRIGGER resultado_imutavel BEFORE UPDATE OR DELETE ON resultado
  FOR EACH ROW EXECUTE FUNCTION impedir_alteracao_historico();
CREATE TRIGGER certificado_imutavel BEFORE UPDATE OR DELETE ON certificado
  FOR EACH ROW EXECUTE FUNCTION impedir_alteracao_historico();

CREATE FUNCTION validar_estado_etapa() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE registro resposta;
BEGIN
    IF TG_OP = 'DELETE' THEN RAISE EXCEPTION 'Etapa não pode ser excluída'; END IF;
    IF TG_OP = 'UPDATE' AND OLD.estado IN ('RESPONDIDA', 'EXPIRADA', 'INTERROMPIDA') AND NEW IS DISTINCT FROM OLD THEN
        RAISE EXCEPTION 'Questão encerrada não pode ser reaberta ou alterada';
    END IF;
    IF TG_OP = 'UPDATE' AND OLD.estado <> 'PENDENTE'
       AND ROW(NEW.tentativa_id, NEW.tema_id, NEW.questao_id, NEW.ordem, NEW.apresentada_em, NEW.prazo_em)
           IS DISTINCT FROM ROW(OLD.tentativa_id, OLD.tema_id, OLD.questao_id, OLD.ordem, OLD.apresentada_em, OLD.prazo_em) THEN
        RAISE EXCEPTION 'Sorteio e prazo iniciados são imutáveis';
    END IF;
    IF NEW.estado IN ('RESPONDIDA', 'EXPIRADA', 'INTERROMPIDA') THEN
        SELECT * INTO STRICT registro FROM resposta WHERE etapa_id = NEW.id;
        IF (NEW.estado = 'RESPONDIDA') <> (registro.alternativa_escolhida IS NOT NULL) THEN
            RAISE EXCEPTION 'Estado diverge da resposta registrada';
        END IF;
        IF NEW.estado = 'EXPIRADA' AND clock_timestamp() < NEW.prazo_em THEN
            RAISE EXCEPTION 'Prazo da questão ainda não expirou';
        END IF;
    END IF;
    IF NEW.estado = 'EM_ANDAMENTO' AND NOT EXISTS (SELECT 1 FROM questao WHERE id = NEW.questao_id AND publicada) THEN
        RAISE EXCEPTION 'Questão deve estar publicada antes da resolução';
    END IF;
    RETURN NEW;
END $$;
CREATE TRIGGER etapa_estado BEFORE INSERT OR UPDATE OR DELETE ON etapa_avaliacao
  FOR EACH ROW EXECUTE FUNCTION validar_estado_etapa();

CREATE FUNCTION validar_resultado() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE finalizadas integer; corretas integer;
BEGIN
    PERFORM 1 FROM tentativa WHERE id = NEW.tentativa_id FOR UPDATE;
    SELECT count(*), count(*) FILTER (WHERE r.acertou) INTO finalizadas, corretas
      FROM etapa_avaliacao e JOIN resposta r ON r.etapa_id = e.id
      WHERE e.tentativa_id = NEW.tentativa_id AND e.estado IN ('RESPONDIDA', 'EXPIRADA', 'INTERROMPIDA');
    IF finalizadas <> 12 OR NEW.acertos <> corretas THEN RAISE EXCEPTION 'Resultado exige 12 temas encerrados e contagem real de acertos'; END IF;
    RETURN NEW;
END $$;
CREATE TRIGGER resultado_consistente BEFORE INSERT ON resultado
  FOR EACH ROW EXECUTE FUNCTION validar_resultado();

CREATE FUNCTION preencher_certificado() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE dados record;
BEGIN
    SELECT c.nome_completo, c.cpf, c.email, r.nota, r.percentual INTO STRICT dados
      FROM resultado r JOIN tentativa t ON t.id = r.tentativa_id
      JOIN candidato c ON c.id = t.candidato_id WHERE r.tentativa_id = NEW.tentativa_id;
    IF dados.percentual < 65 THEN RAISE EXCEPTION 'Aproveitamento insuficiente para certificado'; END IF;
    NEW.nome_titular := dados.nome_completo; NEW.cpf_titular := dados.cpf;
    NEW.email_titular := dados.email; NEW.nota := dados.nota; NEW.percentual := dados.percentual;
    NEW.emitido_em := clock_timestamp();
    RETURN NEW;
END $$;
CREATE TRIGGER certificado_dados BEFORE INSERT ON certificado
  FOR EACH ROW EXECUTE FUNCTION preencher_certificado();

CREATE VIEW v_prontidao_base AS
SELECT count(*)::integer AS temas_selecionados,
       (count(*) = 12 AND bool_and(
         (SELECT count(*) FROM questao q WHERE q.tema_id = t.id AND q.publicada) = 4
         AND EXISTS (SELECT 1 FROM conteudo_estudo c WHERE c.tema_id = t.id AND c.publicado)
       )) AS pronta_para_certificacao
FROM tema t WHERE t.selecionado;

COMMENT ON TABLE candidato IS 'Titular da avaliação; CPF único. Hash gerado pelo futuro backend, nunca senha em texto puro.';
COMMENT ON TABLE tema IS 'Até 12 posições curriculares; seleção final depende de validação da equipe.';
COMMENT ON TABLE conteudo_estudo IS 'Material versionado dos mesmos temas da avaliação; fontes registradas.';
COMMENT ON TABLE questao IS 'Questão versionada. Quatro slots publicados por tema; completar todos antes de iniciar prova.';
COMMENT ON TABLE alternativa IS 'Alternativas em linhas A/B/C/D, evitando colunas repetidas.';
COMMENT ON TABLE tentativa IS 'Uma certificação de um candidato. Novas tentativas dependem de decisão do professor.';
COMMENT ON TABLE etapa_avaliacao IS 'Sorteio persistido e janela de 150 segundos por tema. Uma etapa por tema/tentativa.';
COMMENT ON TABLE resposta IS 'Registro imutável; alternativa escolhida nula representa encerramento sem envio.';
COMMENT ON TABLE resultado IS 'Resultado imutável. Pesos iguais e nota 0–10 são proposta técnica pendente de validação.';
COMMENT ON TABLE certificado IS 'Snapshot do titular e resultado no momento de emissão. Token opaco para futura URL/QR.';
COMMIT;
