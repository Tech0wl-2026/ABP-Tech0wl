import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

const banco = JSON.parse(await readFile(new URL('../../database/servidor/questoes.json',import.meta.url),'utf8'));

test('banco usa os 12 temas selecionados, com 48 questões e 192 alternativas',async () => {
  assert.equal(banco.temas.length,12);
  assert.equal(banco.questoes.length,48);
  assert.equal(new Set(banco.questoes.map(q=>q.id)).size,48);
  for (const tema of banco.temas) {
    const questoes=banco.questoes.filter(q=>q.tema_id===tema.ordem);
    assert.deepEqual(questoes.map(q=>q.ordem),[1,2,3,4]);
    for (const q of questoes) {
      assert.deepEqual(q.alternativas.map(a=>a.letra),['A','B','C','D']);
      assert.equal(q.alternativas.filter(a=>a.correta).length,1);
      const nome=q.imagem_url.split('/').at(-1);
      const svg=await readFile(new URL('../assets/questoes/'+nome,import.meta.url),'utf8');
      assert.match(svg,/<svg/);
      assert.doesNotMatch(svg,/<script|<foreignObject|onload=|javascript:/i);
      assert.ok(fileURLToPath(new URL('../assets/questoes/'+nome,import.meta.url)));
    }
  }
  assert.equal(banco.questoes.filter(q=>q.origem.startsWith('Questão')).length,36);
  assert.equal(banco.questoes.filter(q=>q.revisao.includes('pendente')).length,12);
});
