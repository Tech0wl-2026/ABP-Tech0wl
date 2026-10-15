-- Executar após schema.sql e seed.sql. Todas as fixtures são revertidas.
BEGIN;
SET LOCAL tech0wl.testes = '0';
CREATE FUNCTION pg_temp.verificar(condicao boolean, mensagem text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
    IF condicao IS DISTINCT FROM true THEN RAISE EXCEPTION 'FALHA: %', mensagem; END IF;
    PERFORM set_config('tech0wl.testes', (current_setting('tech0wl.testes')::int + 1)::text, true);
END $$;
CREATE FUNCTION pg_temp.esperar_erro(comando text, estado text, fragmento text DEFAULT '') RETURNS void LANGUAGE plpgsql AS $$
DECLARE codigo text; mensagem text;
BEGIN
    BEGIN
        EXECUTE comando;
    EXCEPTION WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS codigo = RETURNED_SQLSTATE, mensagem = MESSAGE_TEXT;
        IF codigo <> estado OR position(fragmento in mensagem) = 0 THEN
            RAISE EXCEPTION 'Erro inesperado [%] %; esperado [%] %', codigo, mensagem, estado, fragmento;
        END IF;
        PERFORM pg_temp.verificar(true, 'Erro esperado');
        RETURN;
    END;
    RAISE EXCEPTION 'FALHA: comando deveria ser recusado: %', comando;
END $$;

CREATE FUNCTION pg_temp.criar_tentativa(acertos_esperados integer, titular bigint) RETURNS bigint LANGUAGE plpgsql AS $$
DECLARE tentativa_nova bigint; tema_atual bigint; questao_atual bigint; etapa_atual bigint; instante timestamptz; i integer;
BEGIN
    INSERT INTO tentativa(candidato_id) VALUES (titular) RETURNING id INTO tentativa_nova;
    FOR i IN 1..12 LOOP
        SELECT id INTO tema_atual FROM tema WHERE ordem = i;
        IF tema_atual IS NULL THEN
            INSERT INTO tema(nome,ordem) VALUES ('Fixture de teste ' || i, i) RETURNING id INTO tema_atual;
        END IF;
        SELECT id INTO questao_atual FROM questao WHERE tema_id = tema_atual AND publicada ORDER BY numero LIMIT 1;
        IF questao_atual IS NULL THEN
            INSERT INTO questao(tema_id,numero,enunciado,imagem_caminho,imagem_descricao,imagem_fonte,justificativa,fonte_conteudo)
            VALUES (tema_atual,1,'Fixture de teste','/assets/questoes/demo-01.svg','Fixture','Teste','Teste','Teste') RETURNING id INTO questao_atual;
            INSERT INTO alternativa(questao_id,letra,texto,correta)
              SELECT questao_atual, letra, 'Fixture ' || letra, letra='A' FROM unnest(ARRAY['A','B','C','D']) letra;
            UPDATE questao SET publicada = true WHERE id = questao_atual;
        END IF;
        instante := clock_timestamp() - interval '1 second';
        INSERT INTO etapa_avaliacao(tentativa_id,tema_id,questao_id,ordem,estado,apresentada_em,prazo_em)
          VALUES(tentativa_nova,tema_atual,questao_atual,i,'EM_ANDAMENTO',instante,instante + interval '150 seconds') RETURNING id INTO etapa_atual;
        INSERT INTO resposta(etapa_id,questao_id,alternativa_escolhida,alternativa_correta)
          VALUES(etapa_atual,questao_atual,CASE WHEN i <= acertos_esperados THEN 'A' ELSE 'B' END,'A');
        UPDATE etapa_avaliacao SET estado='RESPONDIDA',encerrada_em=clock_timestamp() WHERE id=etapa_atual;
    END LOOP;
    UPDATE tentativa SET estado='CONCLUIDA',concluida_em=clock_timestamp() WHERE id=tentativa_nova;
    INSERT INTO resultado(tentativa_id,acertos) VALUES(tentativa_nova,acertos_esperados);
    RETURN tentativa_nova;
END $$;

DO $$
DECLARE titular bigint; incompleta bigint; aprovada bigint; reprovada bigint; tema_atual bigint; questao_atual bigint; etapa_atual bigint; instante timestamptz; q_rascunho bigint;
BEGIN
    PERFORM pg_temp.verificar((SELECT count(*)=4 FROM questao), 'Amostra contém quatro questões');
    PERFORM pg_temp.verificar((SELECT count(*)=16 FROM alternativa), 'Quatro alternativas por questão');
    PERFORM pg_temp.verificar((SELECT NOT pronta_para_certificacao FROM v_prontidao_base), 'Amostra não deve habilitar uma certificação de 12/48');
    INSERT INTO candidato(cpf,nome_completo,email,senha_hash)
      VALUES('00000000000','Candidato fictício de teste','teste@exemplo.invalid','hash_fixture_nao_autenticavel') RETURNING id INTO titular;
    PERFORM pg_temp.esperar_erro('INSERT INTO candidato(cpf,nome_completo,email,senha_hash) VALUES (''00000000000'',''Duplicado'',''x@exemplo.invalid'',''hash_fixture_nao_autenticavel'')','23505');
    PERFORM pg_temp.esperar_erro('INSERT INTO candidato(cpf,nome_completo,email,senha_hash) VALUES (''abc'',''Inválido'',''x@exemplo.invalid'',''hash_fixture_nao_autenticavel'')','23514');
    PERFORM pg_temp.esperar_erro('INSERT INTO candidato(cpf,nome_completo,email,senha_hash) VALUES (''11111111111'',NULL,''x@exemplo.invalid'',''hash_fixture_nao_autenticavel'')','23502');
    SELECT id INTO tema_atual FROM tema WHERE ordem=1;
    SELECT id INTO questao_atual FROM questao WHERE tema_id=tema_atual AND numero=1;
    INSERT INTO questao(tema_id,numero,versao,enunciado,imagem_caminho,imagem_descricao,imagem_fonte,justificativa,fonte_conteudo)
      VALUES(tema_atual,1,2,'Rascunho','/assets/questoes/demo-01.svg','Teste','Teste','Teste','Teste') RETURNING id INTO q_rascunho;
    PERFORM pg_temp.esperar_erro(format('UPDATE questao SET publicada=true WHERE id=%s',q_rascunho),'P0001','quatro alternativas');
    INSERT INTO alternativa VALUES(q_rascunho,'A','Primeira',true);
    PERFORM pg_temp.esperar_erro(format('INSERT INTO alternativa VALUES(%s,''B'',''Segunda'',true)',q_rascunho),'23505');
    PERFORM pg_temp.esperar_erro(format('INSERT INTO alternativa VALUES(%s,''E'',''Inválida'',false)',q_rascunho),'23514');
    PERFORM pg_temp.esperar_erro(format('UPDATE alternativa SET texto=''Adulterado'' WHERE questao_id=%s AND letra=''A''',questao_atual),'P0001','imutáveis');
    INSERT INTO tentativa(candidato_id) VALUES(titular) RETURNING id INTO incompleta;
    PERFORM pg_temp.esperar_erro(format('INSERT INTO resultado(tentativa_id,acertos) VALUES(%s,0)',incompleta),'P0001','12 temas');
    instante := clock_timestamp() - interval '151 seconds';
    INSERT INTO etapa_avaliacao(tentativa_id,tema_id,questao_id,ordem,estado,apresentada_em,prazo_em)
      VALUES(incompleta,tema_atual,questao_atual,1,'EM_ANDAMENTO',instante,instante + interval '150 seconds') RETURNING id INTO etapa_atual;
    PERFORM pg_temp.esperar_erro(format('INSERT INTO etapa_avaliacao(tentativa_id,tema_id,questao_id,ordem) VALUES(%s,%s,%s,2)',incompleta,tema_atual,questao_atual),'23505');
    PERFORM pg_temp.esperar_erro(format('INSERT INTO resposta(etapa_id,questao_id,alternativa_escolhida,alternativa_correta) VALUES(%s,%s,''A'',''A'')',etapa_atual,questao_atual),'P0001','Prazo encerrado');
    PERFORM pg_temp.esperar_erro(format('INSERT INTO resposta(etapa_id,questao_id,alternativa_correta) VALUES(%s,%s,''B'')',etapa_atual,questao_atual),'P0001','Gabarito inconsistente');
    INSERT INTO resposta(etapa_id,questao_id,alternativa_correta) VALUES(etapa_atual,questao_atual,'A');
    UPDATE etapa_avaliacao SET estado='EXPIRADA',encerrada_em=clock_timestamp() WHERE id=etapa_atual;
    PERFORM pg_temp.verificar((SELECT alternativa_escolhida IS NULL AND NOT acertou FROM resposta WHERE etapa_id=etapa_atual),'Sem resposta não vira alternativa inventada');
    PERFORM pg_temp.esperar_erro(format('UPDATE etapa_avaliacao SET estado=''EM_ANDAMENTO'',encerrada_em=NULL WHERE id=%s',etapa_atual),'P0001','não pode ser reaberta');
    PERFORM pg_temp.esperar_erro(format('UPDATE resposta SET alternativa_escolhida=''A'' WHERE etapa_id=%s',etapa_atual),'P0001','imutável');
    PERFORM pg_temp.esperar_erro(format('UPDATE questao SET enunciado=''Alterado'' WHERE id=%s',questao_atual),'P0001','imutável');
    UPDATE questao SET publicada=false WHERE id=questao_atual;
    PERFORM pg_temp.esperar_erro(format('UPDATE alternativa SET texto=''Alterado'' WHERE questao_id=%s AND letra=''A''',questao_atual),'P0001','imutáveis');
    UPDATE questao SET publicada=true WHERE id=questao_atual;
    aprovada := pg_temp.criar_tentativa(8,titular);
    PERFORM pg_temp.verificar((SELECT percentual=66.67 AND nota=6.67 FROM resultado WHERE tentativa_id=aprovada),'Cálculo proposto: oito acertos em doze');
    INSERT INTO certificado(tentativa_id) VALUES(aprovada);
    PERFORM pg_temp.verificar((SELECT nome_titular='Candidato fictício de teste' AND percentual=66.67 FROM certificado WHERE tentativa_id=aprovada),'Certificado recupera dados oficiais do resultado');
    PERFORM pg_temp.esperar_erro(format('INSERT INTO certificado(tentativa_id) VALUES(%s)',aprovada),'23505');
    reprovada := pg_temp.criar_tentativa(7,titular);
    PERFORM pg_temp.esperar_erro(format('INSERT INTO certificado(tentativa_id) VALUES(%s)',reprovada),'P0001','insuficiente');
    PERFORM pg_temp.esperar_erro(format('UPDATE resultado SET acertos=12 WHERE tentativa_id=%s',reprovada),'P0001','imutável');
END $$;
SELECT current_setting('tech0wl.testes')::integer AS verificacoes_de_integridade;
ROLLBACK;
