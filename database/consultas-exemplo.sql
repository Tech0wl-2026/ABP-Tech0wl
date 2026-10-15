-- Exemplos de contrato SQL para o futuro driver do backend. Não é uma API implementada.
-- Enviar parâmetros separadamente; nunca concatenar CPF ou IDs recebidos em SQL.
PREPARE candidato_por_cpf(varchar) AS
SELECT id, nome_completo, senha_hash FROM candidato WHERE cpf = $1;

PREPARE progresso_do_titular(bigint, bigint) AS
SELECT e.ordem, t.nome, e.estado
FROM etapa_avaliacao e JOIN tema t ON t.id = e.tema_id
JOIN tentativa a ON a.id = e.tentativa_id
WHERE a.id = $1 AND a.candidato_id = $2 ORDER BY e.ordem;

PREPARE historico_do_titular(bigint, bigint) AS
SELECT t.nome AS tema, q.enunciado, r.alternativa_escolhida,
       r.alternativa_correta, r.registrada_em, e.estado
FROM tentativa a JOIN etapa_avaliacao e ON e.tentativa_id = a.id
JOIN tema t ON t.id = e.tema_id JOIN questao q ON q.id = e.questao_id
LEFT JOIN resposta r ON r.etapa_id = e.id
WHERE a.id = $1 AND a.candidato_id = $2 ORDER BY e.ordem;

-- A futura validação pública deve retornar apenas os dados de conferência aprovados pela equipe.
PREPARE validar_certificado(uuid) AS
SELECT token_validacao, nome_titular, emitido_em, nota, percentual
FROM certificado WHERE token_validacao = $1;
DEALLOCATE ALL;
