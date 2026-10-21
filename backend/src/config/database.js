import pg from 'pg';

export function criarPool(env = process.env) {
  const pool = new pg.Pool({
    host: env.POSTGRES_HOST || '127.0.0.1',
    port: Number(env.POSTGRES_PORT || env.DB_PORT || 5432),
    database: env.POSTGRES_DB,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    options: '-c search_path=servidor,public',
    max: 10,
    connectionTimeoutMillis: 5000,
    statement_timeout: 10000,
  });
  pool.on('error', () => console.error('Conexão ociosa do banco foi encerrada.'));
  return pool;
}

export async function transacao(pool, candidatoId, tarefa) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const {rowCount} = await client.query('SELECT id FROM candidatos WHERE id=$1 FOR UPDATE', [candidatoId]);
    if (!rowCount) {
      const erro = new Error('Candidato não encontrado.');
      erro.status = 401;
      throw erro;
    }
    const resposta = await tarefa(client);
    await client.query('COMMIT');
    return resposta;
  } catch (erro) {
    await client.query('ROLLBACK');
    throw erro;
  } finally {
    client.release();
  }
}
