import {readFile} from 'node:fs/promises';
import {criarPool} from '../src/config/database.js';

const pool = criarPool();
const db = await pool.connect();
try {
  await db.query("SELECT pg_advisory_lock(hashtext('tech0wl-servidor-v1'))");
  const {rows:[atual]} = await db.query("SELECT to_regclass('servidor.candidatos') AS tabela");
  if (!atual.tabela) {
    await db.query('BEGIN');
    try {
      for (const arquivo of ['schema.sql','seed.sql']) {
        const sql=await readFile(new URL('../../database/servidor/'+arquivo,import.meta.url),'utf8');
        await db.query(sql.replace(/^BEGIN;\s*$/mg,'').replace(/^COMMIT;\s*$/mg,''));
      }
      await db.query('COMMIT');
    } catch (erro) {
      await db.query('ROLLBACK');
      throw erro;
    }
    console.log('Banco do servidor preparado com os 12 temas do grupo.');
  } else {
    const {rows:[base]} = await db.query('SELECT count(*)::int AS total FROM temas');
    if (base.total !== 12) throw new Error('Schema existente sem os 12 temas; confira o banco antes de carregar dados.');
    console.log('Banco já preparado. Os dados existentes foram mantidos.');
  }
} finally {
  await db.query("SELECT pg_advisory_unlock(hashtext('tech0wl-servidor-v1'))");
  db.release();
  await pool.end();
}
