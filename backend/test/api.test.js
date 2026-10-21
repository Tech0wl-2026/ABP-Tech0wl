import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {criarApp} from '../src/app.js';
import {criarPool} from '../src/config/database.js';
import jwt from 'jsonwebtoken';

// A suíte usa apenas um banco descartável, nunca o banco da aplicação.
test('fluxos HTTP da certificação no PostgreSQL', {skip:!process.env.API_TEST_DATABASE},async t => {
  assert.match(process.env.API_TEST_DATABASE,/_test$/);
  const pool=criarPool({...process.env,POSTGRES_DB:process.env.API_TEST_DATABASE});
  const segredo='segredo_de_teste_descartavel_com_mais_de_32_bytes';
  let server;
  try {
    await pool.query(await readFile(new URL('../../database/servidor/schema.sql',import.meta.url),'utf8'));
    await pool.query(await readFile(new URL('../../database/servidor/seed.sql',import.meta.url),'utf8'));
    const app=await criarApp(pool,segredo);
    server=app.listen(0,'127.0.0.1');
    await new Promise(r=>server.once('listening',r));
    const base=`http://127.0.0.1:${server.address().port}/api`;
    async function req(path,{method='GET',body,token}={}) {
      const res=await fetch(base+path,{method,headers:{...(body!==undefined?{'Content-Type':'application/json'}:{}),...(token?{Authorization:'Bearer '+token}:{})},body:body===undefined?undefined:JSON.stringify(body)});
      return {status:res.status,body:res.headers.get('content-type')?.includes('json')?await res.json():await res.text()};
    }
    async function candidato(cpf) {
      const novo=await req('/candidatos',{method:'POST',body:{cpf,nome:'Candidato de teste',email:'teste@example.invalid',senha:'senha_segura'}});
      assert.equal(novo.status,201);
      const entrada=await req('/login',{method:'POST',body:{cpf,senha:'senha_segura'}});
      assert.equal(entrada.status,200);
      return {id:novo.body.id,token:entrada.body.token,cpf};
    }
    const primeiro=await candidato('00000000001');
    const segundo=await candidato('00000000002');
    await t.test('cadastro valida dados, evita CPF repetido e não retorna senha',async () => {
      assert.equal((await req('/candidatos',{method:'POST',body:{cpf:primeiro.cpf,nome:'Outro',email:'outro@example.invalid',senha:'senha_segura'}})).status,409);
      assert.equal((await req('/candidatos',{method:'POST',body:{cpf:'inválido',nome:'Outro',email:'x',senha:'123'}})).status,400);
      const {rows:[linha]}=await pool.query('SELECT senha_hash FROM candidatos WHERE id=$1',[primeiro.id]);
      assert.match(linha.senha_hash,/^\$2[aby]\$12\$/);
      const entrada=await req('/login',{method:'POST',body:{cpf:primeiro.cpf,senha:'senha_segura'}});
      assert.doesNotMatch(JSON.stringify(entrada.body),/senha_hash|senha_segura/);
    });
    await t.test('login rejeita credenciais e tokens inválidos ou expirados',async () => {
      assert.equal((await req('/login',{method:'POST',body:{cpf:primeiro.cpf,senha:'senha_errada'}})).status,401);
      assert.equal((await req('/questoes/sortear',{method:'POST'})).status,401);
      assert.equal((await req('/questoes/sortear',{method:'POST',token:'inválido'})).status,401);
      const expirado=jwt.sign({sub:String(primeiro.id)},segredo,{expiresIn:-1,issuer:'portal-certificacao-api',audience:'portal-certificacao'});
      assert.equal((await req('/questoes/sortear',{method:'POST',token:expirado})).status,401);
    });
    let q;
    await t.test('sorteio concorrente mantém uma questão e o mesmo prazo',async () => {
      const respostas=await Promise.all(Array.from({length:4},()=>req('/questoes/sortear',{method:'POST',token:primeiro.token})));
      for (const resposta of respostas) assert.equal(resposta.status,200);
      assert.equal(new Set(respostas.map(r=>r.body.questao.questao.id)).size,1);
      assert.equal(new Set(respostas.map(r=>r.body.questao.data_horario_limite)).size,1);
      q=respostas[0].body.questao.questao;
      assert.equal(q.alternativas.length,4);
      assert.doesNotMatch(JSON.stringify(q),/correta|senha_hash/);
      const atual=respostas[0].body.questao;
      assert.equal(new Date(atual.data_horario_limite)-new Date(atual.data_horario_inicio),150000);
    });
    await t.test('questão alheia e identificador inválido não dão acesso',async () => {
      assert.equal((await req('/questoes/'+q.id,{token:segundo.token})).status,404);
      assert.equal((await req('/questoes/1 OR 1=1',{token:primeiro.token})).status,400);
      assert.equal((await req(`/questoes/${q.id}/responder`,{method:'POST',token:segundo.token,body:{letra_resposta:'A'}})).status,404);
    });
    await t.test('imagem é servida por ID sem expor arquivos locais',async () => {
      assert.equal((await req('/imagens/'+q.id)).status,200);
      assert.equal((await req('/imagens/99999')).status,404);
      assert.equal((await req('/imagens/NaN')).status,400);
      assert.equal((await req('/nao-existe')).status,404);
    });
    await t.test('duplo envio só grava uma resposta e devolve feedback',async () => {
      const {rows:[gabarito]}=await pool.query('SELECT letra FROM alternativas WHERE questao_id=$1 AND correta',[q.id]);
      const respostas=await Promise.all([0,1].map(()=>req(`/questoes/${q.id}/responder`,{method:'POST',token:primeiro.token,body:{letra_resposta:gabarito.letra,acertou:false,candidato_id:segundo.id}})));
      assert.deepEqual(respostas.map(r=>r.status).sort(),[200,409]);
      const resposta=respostas.find(r=>r.status===200).body;
      assert.equal(resposta.alternativa_correta,gabarito.letra);
      assert.equal(resposta.acertou,true);
      assert.equal((await req('/candidatos/certificado',{method:'POST',token:primeiro.token})).status,409);
    });
    await t.test('interrupção encerra a questão e permite seguir ao próximo tema',async () => {
      const sorteio=await req('/questoes/sortear',{method:'POST',token:segundo.token});
      const id=sorteio.body.questao.questao.id;
      const r=await req(`/questoes/${id}/interromper`,{method:'POST',token:segundo.token});
      assert.equal(r.status,200);assert.equal(r.body.acertou,false);assert.equal(r.body.letra_resposta,null);
      assert.equal((await req(`/questoes/${id}/responder`,{method:'POST',token:segundo.token,body:{letra_resposta:'A'}})).status,409);
      assert.equal((await req('/temas/proximo',{token:segundo.token})).body.tema.ordem,2);
    });
    await t.test('conclusão e emissão concorrente preservam certificado e dados',async () => {
      for (let i=1;i<12;i++) {
        const sorteio=await req('/questoes/sortear',{method:'POST',token:primeiro.token});
        const id=sorteio.body.questao.questao.id;
        const {rows:[a]}=await pool.query('SELECT letra FROM alternativas WHERE questao_id=$1 AND correta',[id]);
        assert.equal((await req(`/questoes/${id}/responder`,{method:'POST',token:primeiro.token,body:{letra_resposta:a.letra}})).status,200);
      }
      const resultado=await req('/candidatos/resultado',{token:primeiro.token});
      assert.equal(resultado.body.percentual,100);assert.equal(resultado.body.nota,10);
      const emitidos=await Promise.all([0,1,2].map(()=>req('/candidatos/certificado',{method:'POST',token:primeiro.token})));
      assert.equal(new Set(emitidos.map(r=>r.body.certificado_hash)).size,1);
      assert.equal(emitidos[0].body.dados.cpf,primeiro.cpf);
      const publico=await req('/certificados/'+emitidos[0].body.certificado_hash);
      assert.equal(publico.body.valido,true);
      assert.doesNotMatch(JSON.stringify(publico.body),/cpf|email|senha/);
      assert.equal((await req('/questoes/sortear',{method:'POST',token:primeiro.token})).body.concluido,true);
      assert.equal((await req('/candidatos/historico',{token:primeiro.token})).body.length,12);
    });
    await t.test('resposta atrasada ignora o relógio do cliente e vale zero',async () => {
      const atrasado=await candidato('00000000004');
      await pool.query(`INSERT INTO respostas(candidato_id,questao_id,tema_id,data_horario_inicio)
        VALUES($1,1,1,clock_timestamp()-interval '151 seconds')`,[atrasado.id]);
      const {rows:[a]}=await pool.query('SELECT letra FROM alternativas WHERE questao_id=1 AND correta');
      const resposta=await req('/questoes/1/responder',{method:'POST',token:atrasado.token,
        body:{letra_resposta:a.letra,data_horario_inicio:new Date().toISOString()}});
      assert.equal(resposta.status,200);assert.equal(resposta.body.valida,false);
      assert.equal(resposta.body.acertou,false);assert.equal(resposta.body.letra_resposta,null);
      assert.equal((await req('/temas/proximo',{token:atrasado.token})).body.tema.ordem,2);
    });
    await t.test('oito acertos geram certificado com 66,67%',async () => {
      const aprovado=await candidato('00000000005');
      for (let i=0;i<12;i++) {
        const sorteio=await req('/questoes/sortear',{method:'POST',token:aprovado.token});
        const id=sorteio.body.questao.questao.id;
        const {rows:[a]}=await pool.query('SELECT letra FROM alternativas WHERE questao_id=$1 AND correta=$2 ORDER BY letra LIMIT 1',[id,i<8]);
        await req(`/questoes/${id}/responder`,{method:'POST',token:aprovado.token,body:{letra_resposta:a.letra}});
      }
      const cert=await req('/candidatos/certificado',{method:'POST',token:aprovado.token});
      assert.equal(cert.status,200);assert.equal(cert.body.dados.percentual,66.67);
    });
    await t.test('sete acertos não geram certificado',async () => {
      const reprovado=await candidato('00000000003');
      for (let i=0;i<12;i++) {
        const sorteio=await req('/questoes/sortear',{method:'POST',token:reprovado.token});
        const id=sorteio.body.questao.questao.id;
        const {rows:[a]}=await pool.query('SELECT letra FROM alternativas WHERE questao_id=$1 AND correta=$2 ORDER BY letra LIMIT 1',[id,i<7]);
        await req(`/questoes/${id}/responder`,{method:'POST',token:reprovado.token,body:{letra_resposta:a.letra}});
      }
      const resultado=(await req('/candidatos/resultado',{token:reprovado.token})).body;
      assert.equal(resultado.acertos,7);assert.equal(resultado.percentual,58.33);
      assert.equal((await req('/candidatos/certificado',{method:'POST',token:reprovado.token})).status,409);
    });
  } finally {
    if (server) await new Promise(r=>server.close(r));
    await pool.end();
  }
});
