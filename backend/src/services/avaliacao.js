import {randomBytes} from 'node:crypto';
import {transacao} from '../config/database.js';
import {falhar} from '../erros.js';

export async function expirar(db, candidatoId = null) {
  await db.query(`UPDATE respostas SET data_horario_resposta=clock_timestamp(), acertou=false
    WHERE data_horario_resposta IS NULL
    AND clock_timestamp() > data_horario_inicio + interval '150 seconds'
    AND ($1::integer IS NULL OR candidato_id=$1)`, [candidatoId]);
}

async function conferirBase(db) {
  const {rows} = await db.query(`SELECT
    (SELECT count(*) FROM temas)=12 AND
    NOT EXISTS(SELECT 1 FROM temas t WHERE (SELECT count(*) FROM questoes q WHERE q.tema_id=t.id)<>4) AND
    NOT EXISTS(SELECT 1 FROM questoes q WHERE
      (SELECT count(*) FROM alternativas a WHERE a.questao_id=q.id)<>4 OR
      (SELECT count(*) FROM alternativas a WHERE a.questao_id=q.id AND correta)<>1) AS pronta`);
  if (!rows[0].pronta) falhar(409, 'Base de certificação incompleta: são necessários 12 temas, quatro questões por tema e quatro alternativas com uma correta.');
}

export async function buscarQuestao(db, id) {
  const {rows} = await db.query(`SELECT q.id,q.tema_id,q.ordem,q.enunciado,
    '/api/imagens/' || q.id AS imagem_url,
    json_agg(json_build_object('id',a.id,'letra',a.letra,'texto',a.texto) ORDER BY a.letra) AS alternativas
    FROM questoes q JOIN alternativas a ON a.questao_id=q.id WHERE q.id=$1 GROUP BY q.id`, [id]);
  return rows[0];
}

async function resultadoAtual(db, candidatoId) {
  const {rows:[dados]} = await db.query(`SELECT count(*) FILTER(WHERE data_horario_resposta IS NOT NULL)::int AS total,
    count(*) FILTER(WHERE acertou AND valida)::int AS acertos FROM respostas WHERE candidato_id=$1`, [candidatoId]);
  const concluido = dados.total === 12;
  const percentual = concluido ? Math.round(dados.acertos * 10000 / 12) / 100 : null;
  const nota = concluido ? Math.round(dados.acertos * 1000 / 12) / 100 : null;
  if (concluido && percentual >= 65) {
    await db.query(`UPDATE candidatos SET certificado_hash=$2, certificado_emitido_em=clock_timestamp(),
      certificado_dados=jsonb_build_object('nome',nome,'cpf',cpf,'email',email,'total',12,'acertos',$3::int,
        'percentual',$4::numeric,'nota',$5::numeric)
      WHERE id=$1 AND certificado_hash IS NULL`, [candidatoId,randomBytes(32).toString('hex'),dados.acertos,percentual,nota]);
  }
  return {...dados,concluido,percentual,nota,aprovado:concluido && percentual>=65};
}

async function proximoTema(db, candidatoId) {
  const {rows} = await db.query(`SELECT t.id,t.nome,t.ordem FROM temas t WHERE
    EXISTS(SELECT 1 FROM respostas r WHERE r.candidato_id=$1 AND r.tema_id=t.id AND r.data_horario_resposta IS NULL)
    OR NOT EXISTS(SELECT 1 FROM respostas r WHERE r.candidato_id=$1 AND r.tema_id=t.id)
    ORDER BY t.ordem LIMIT 1`, [candidatoId]);
  return rows[0] || null;
}

export async function buscarProximoTema(pool, candidatoId) {
  return transacao(pool,candidatoId,async db => {
    await expirar(db,candidatoId);
    const tema = await proximoTema(db,candidatoId);
    await resultadoAtual(db,candidatoId);
    return {tema,concluido:tema===null};
  });
}

export async function sortear(pool, candidatoId) {
  return transacao(pool,candidatoId,async db => {
    await conferirBase(db);
    await expirar(db,candidatoId);
    let {rows:[atual]} = await db.query(`SELECT questao_id,data_horario_inicio,
      data_horario_inicio + interval '150 seconds' AS data_horario_limite
      FROM respostas WHERE candidato_id=$1 AND data_horario_resposta IS NULL`, [candidatoId]);
    if (!atual) {
      const tema = await proximoTema(db,candidatoId);
      if (!tema) {
        await resultadoAtual(db,candidatoId);
        return {questao:null,concluido:true};
      }
      const {rows:[sorteada]} = await db.query('SELECT id FROM questoes WHERE tema_id=$1 ORDER BY random() LIMIT 1', [tema.id]);
      const inserida = await db.query(`INSERT INTO respostas(candidato_id,questao_id,tema_id)
        VALUES($1,$2,$3) RETURNING questao_id,data_horario_inicio,
        data_horario_inicio + interval '150 seconds' AS data_horario_limite`, [candidatoId,sorteada.id,tema.id]);
      atual = inserida.rows[0];
    }
    return {questao:{questao:await buscarQuestao(db,atual.questao_id),
      data_horario_inicio:atual.data_horario_inicio,data_horario_limite:atual.data_horario_limite},concluido:false};
  });
}

export async function questaoDoCandidato(pool,candidatoId,id) {
  const {rowCount} = await pool.query('SELECT 1 FROM respostas WHERE candidato_id=$1 AND questao_id=$2', [candidatoId,id]);
  if (!rowCount) falhar(404,'Questão não encontrada para este candidato.');
  return buscarQuestao(pool,id);
}

async function feedback(db,candidatoId,id) {
  const {rows:[resposta]} = await db.query(`SELECT r.questao_id,r.letra_resposta,r.data_horario_inicio,r.data_horario_resposta,
    r.valida,r.acertou,a.letra AS alternativa_correta
    FROM respostas r JOIN alternativas a ON a.questao_id=r.questao_id AND a.correta
    WHERE r.candidato_id=$1 AND r.questao_id=$2`, [candidatoId,id]);
  return resposta;
}

export async function responder(pool,candidatoId,id,letra,interromper=false) {
  if (!interromper && (typeof letra !== 'string' || !/^[ABCD]$/.test(letra))) falhar(400,'Informe letra_resposta como A, B, C ou D.');
  return transacao(pool,candidatoId,async db => {
    const {rows:[atual]} = await db.query('SELECT * FROM respostas WHERE candidato_id=$1 AND questao_id=$2 FOR UPDATE', [candidatoId,id]);
    if (!atual) falhar(404,'Questão não sorteada para este candidato.');
    if (atual.data_horario_resposta) falhar(409,'Esta questão já está encerrada.');
    // O relógio do PostgreSQL decide o prazo; datas enviadas pelo cliente são ignoradas.
    const {rows:[gravada]} = await db.query(`WITH instante AS MATERIALIZED (SELECT clock_timestamp() AS agora)
      UPDATE respostas r SET
      data_horario_resposta=instante.agora,
      letra_resposta=CASE WHEN $4::boolean OR instante.agora>data_horario_inicio+interval '150 seconds' THEN NULL ELSE $3 END,
      acertou=CASE WHEN $4::boolean OR instante.agora>data_horario_inicio+interval '150 seconds' THEN false
        ELSE (SELECT correta FROM alternativas WHERE questao_id=r.questao_id AND letra=$3) END
      FROM instante WHERE candidato_id=$1 AND questao_id=$2 AND data_horario_resposta IS NULL RETURNING r.*`, [candidatoId,id,interromper?null:letra,interromper]);
    if (!gravada) falhar(409,'Esta questão já está encerrada.');
    const resultado = await resultadoAtual(db,candidatoId);
    return {...await feedback(db,candidatoId,id),resultado};
  });
}

export async function consultarAvaliacao(pool,candidatoId) {
  return transacao(pool,candidatoId,async db => {
    await expirar(db,candidatoId);
    const resultado = await resultadoAtual(db,candidatoId);
    const {rows:temas} = await db.query(`SELECT t.id,t.nome,t.ordem,r.questao_id,
      CASE WHEN r.data_horario_resposta IS NOT NULL THEN 'CONCLUIDO'
        WHEN r.questao_id IS NOT NULL THEN 'EM_ANDAMENTO' ELSE 'PENDENTE' END AS estado
      FROM temas t LEFT JOIN respostas r ON r.tema_id=t.id AND r.candidato_id=$1 ORDER BY t.ordem`,[candidatoId]);
    const {rows:historico} = await db.query(`SELECT r.tema_id,t.nome AS tema,r.questao_id,q.enunciado,
      r.letra_resposta,r.data_horario_inicio,r.data_horario_resposta,r.acertou,r.valida,a.letra AS alternativa_correta
      FROM respostas r JOIN temas t ON t.id=r.tema_id JOIN questoes q ON q.id=r.questao_id
      JOIN alternativas a ON a.questao_id=r.questao_id AND a.correta
      WHERE r.candidato_id=$1 AND r.data_horario_resposta IS NOT NULL ORDER BY t.ordem`,[candidatoId]);
    return {resultado,temas,historico};
  });
}

export async function certificado(pool,candidatoId) {
  return transacao(pool,candidatoId,async db => {
    await expirar(db,candidatoId);
    const resultado = await resultadoAtual(db,candidatoId);
    if (!resultado.concluido) falhar(409,'Conclua os 12 temas antes de emitir o certificado.');
    if (!resultado.aprovado) falhar(409,'É necessário aproveitamento de pelo menos 65% para emitir o certificado.');
    const {rows:[dados]} = await db.query(`SELECT certificado_hash,certificado_emitido_em AS emitido_em,
      certificado_dados AS dados FROM candidatos WHERE id=$1`,[candidatoId]);
    return dados;
  });
}
