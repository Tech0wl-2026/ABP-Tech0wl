import {criarApp} from './app.js';
import {criarPool} from './config/database.js';
import {expirar} from './services/avaliacao.js';

const pool = criarPool();
const app = await criarApp(pool,process.env.JWT_SECRET);
await pool.query('SELECT 1 FROM candidatos LIMIT 1');
const porta = Number(process.env.APP_PORT || 3001);
const server = app.listen(porta,'0.0.0.0',() => console.log(`API disponível na porta ${porta}.`));
let executando = false;
const timer = setInterval(async () => {
  if (executando) return;
  executando = true;
  try { await expirar(pool); }
  catch (erro) { console.error('Falha ao encerrar questões expiradas:',erro.code || erro.name); }
  finally { executando = false; }
},5000);
timer.unref();

for (const sinal of ['SIGTERM','SIGINT']) process.on(sinal,() => {
  clearInterval(timer);
  server.close(async () => { await pool.end(); process.exit(0); });
  setTimeout(() => process.exit(1),10000).unref();
});
