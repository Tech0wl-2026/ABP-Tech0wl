import express from 'express';
import bcrypt from 'bcryptjs';
import {randomBytes} from 'node:crypto';
import {rateLimit} from 'express-rate-limit';
import {criarRotas} from './routes/index.js';
import {tratarErro} from './erros.js';

export async function criarApp(pool,segredo) {
  if (typeof segredo !== 'string' || Buffer.byteLength(segredo) < 32) throw new Error('Configure JWT_SECRET com pelo menos 32 bytes aleatórios.');
  const app = express();
  app.disable('x-powered-by');
  // Render e Nginx ficam na frente da API: usa o IP real do visitante no limite de tentativas.
  app.set('trust proxy', 1);
  // Site publicado em outro endereço (ex.: Render) chama a API direto: libera só as origens configuradas.
  const origens = String(process.env.CORS_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
  if (origens.length) app.use((req,res,next) => {
    const origem = req.get('Origin');
    if (origem && origens.includes(origem)) {
      res.set('Access-Control-Allow-Origin', origem);
      res.set('Vary', 'Origin');
      res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.set('Access-Control-Max-Age', '600');
    }
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });
  app.use((req,res,next) => {
    res.set('X-Content-Type-Options','nosniff');
    res.set('Cache-Control','no-store');
    next();
  });
  app.use(express.json({limit:'16kb'}));
  const limiteLogin = rateLimit({windowMs:15*60*1000,limit:30,standardHeaders:'draft-8',legacyHeaders:false,
    message:{erro:'Muitas tentativas. Aguarde alguns minutos.'}});
  // O mesmo custo de bcrypt é usado quando o CPF não existe.
  const hashFicticio = await bcrypt.hash(randomBytes(32).toString('hex'),12);
  app.use('/api',criarRotas(pool,segredo,hashFicticio,limiteLogin));
  app.use((req,res) => res.status(404).json({erro:'Rota desconhecida.'}));
  app.use(tratarErro);
  return app;
}
