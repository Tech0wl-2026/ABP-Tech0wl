import {Router} from 'express';
import {resolve, basename} from 'node:path';
import {fileURLToPath} from 'node:url';
import {autenticacao} from '../middlewares/autenticacao.js';
import {idValido,falhar} from '../erros.js';
import {cadastrarCandidato,login} from '../services/candidatos.js';
import {buscarProximoTema,sortear,questaoDoCandidato,responder,consultarAvaliacao,certificado} from '../services/avaliacao.js';

const pastaImagens = fileURLToPath(new URL('../../assets/questoes/',import.meta.url));

export function criarRotas(pool,segredo,hashFicticio,limiteLogin) {
  const rotas = Router();
  const privado = autenticacao(segredo);
  rotas.get('/saude',async (req,res) => {
    await pool.query('SELECT 1 FROM candidatos LIMIT 1');
    res.json({status:'ok'});
  });
  rotas.post('/candidatos',limiteLogin,async (req,res) => res.status(201).json(await cadastrarCandidato(pool,req.body)));
  rotas.post('/login',limiteLogin,async (req,res) => res.json(await login(pool,req.body,segredo,hashFicticio)));
  rotas.get('/temas',async (req,res) => res.json((await pool.query('SELECT id,nome,ordem FROM temas ORDER BY ordem')).rows));
  rotas.get('/temas/proximo',privado,async (req,res) => res.json(await buscarProximoTema(pool,req.candidatoId)));
  rotas.get('/imagens/:id',async (req,res) => {
    const id = idValido(req.params.id);
    const {rows:[questao]} = await pool.query('SELECT imagem_url FROM questoes WHERE id=$1',[id]);
    if (!questao || !/^\/assets\/questoes\/questao\d{2}\.svg$/.test(questao.imagem_url)) falhar(404,'Imagem não encontrada.');
    res.set('Content-Security-Policy',"default-src 'none'; style-src 'unsafe-inline'; sandbox");
    res.sendFile(resolve(pastaImagens,basename(questao.imagem_url)),erro => {
      if (erro && !res.headersSent) res.status(404).json({erro:'Imagem não encontrada.'});
    });
  });
  rotas.use('/questoes',privado);
  rotas.post('/questoes/sortear',async (req,res) => res.json(await sortear(pool,req.candidatoId)));
  rotas.get('/questoes/:id',async (req,res) => res.json(await questaoDoCandidato(pool,req.candidatoId,idValido(req.params.id))));
  rotas.post('/questoes/:id/responder',async (req,res) => res.json(await responder(pool,req.candidatoId,idValido(req.params.id),req.body?.letra_resposta)));
  rotas.post('/questoes/:id/interromper',async (req,res) => res.json(await responder(pool,req.candidatoId,idValido(req.params.id),null,true)));
  rotas.get('/candidatos/progresso',privado,async (req,res) => {
    const {resultado,temas} = await consultarAvaliacao(pool,req.candidatoId);
    res.json({resultado,temas});
  });
  rotas.get('/candidatos/historico',privado,async (req,res) => res.json((await consultarAvaliacao(pool,req.candidatoId)).historico));
  rotas.get('/candidatos/resultado',privado,async (req,res) => res.json((await consultarAvaliacao(pool,req.candidatoId)).resultado));
  rotas.post('/candidatos/certificado',privado,async (req,res) => res.json(await certificado(pool,req.candidatoId)));
  rotas.get('/certificados/:hash',async (req,res) => {
    if (!/^[a-f0-9]{64}$/.test(req.params.hash)) falhar(404,'Certificado não encontrado.');
    const {rows:[dados]} = await pool.query(`SELECT certificado_hash,certificado_emitido_em AS emitido_em,
      certificado_dados->>'nome' AS nome,certificado_dados->'percentual' AS percentual
      FROM candidatos WHERE certificado_hash=$1`,[req.params.hash]);
    if (!dados) falhar(404,'Certificado não encontrado.');
    res.json({valido:true,...dados});
  });
  return rotas;
}
