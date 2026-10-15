import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
const base=process.env.BASE_URL||'http://localhost:8080';
const results='test-results';
await mkdir(results,{recursive:true});
let launch={headless:true};
const browser=await chromium.launch(launch);
try {
  for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['mobile-estreito',320,760]]){
    await test(`Navegação, semântica e busca: ${name}`,async()=>{
      const context=await browser.newContext({viewport:{width,height},locale:'pt-BR'});
      const page=await context.newPage();const errors=[];
      page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
      await page.goto(base,{waitUntil:'networkidle'});
      assert.equal(await page.locator('html').getAttribute('lang'),'pt-BR');
      assert.equal(await page.locator('h1').count(),1);
      assert.match(await page.title(),/Tech0wl/);
      assert.ok(await page.getByRole('heading',{name:'Como funciona a avaliação'}).isVisible());
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Sem rolagem horizontal');
      if(width<640){
        const menu=page.getByRole('button',{name:'Menu'});
        assert.ok(await menu.isVisible());
        await menu.click();assert.equal(await menu.getAttribute('aria-expanded'),'true');
        await page.keyboard.press('Escape');assert.equal(await menu.getAttribute('aria-expanded'),'false');
        assert.equal(await menu.evaluate(el=>el===document.activeElement),true);
        await menu.click();await page.getByRole('navigation').getByRole('link',{name:'Como funciona'}).click();
        assert.equal(await menu.getAttribute('aria-expanded'),'false');
      }else assert.equal(await page.getByRole('button',{name:'Menu'}).isVisible(),false);
      const search=page.getByRole('searchbox',{name:'Buscar uma dúvida'});
      await search.fill('RETOMAR');assert.equal(await page.locator('.faq-list details:visible').count(),1);
      await page.locator('.faq-list details:visible summary').click();assert.equal(await page.locator('.faq-list details[open]:visible').count(),1);
      await search.fill('questoes');assert.equal(await page.locator('.faq-list details:visible').count(),1);
      await search.fill('zzzinexistente');assert.equal(await page.locator('.faq-list details:visible').count(),0);
      assert.match(await page.locator('[role=status]').innerText(),/Nenhuma dúvida/);
      await search.fill('');assert.equal(await page.locator('.faq-list details:visible').count(),4);
      await page.locator('details[open]').evaluateAll(items=>items.forEach(el=>el.open=false));
      for(const asset of ['demo-01.svg','demo-02.svg','demo-03.svg','demo-04.svg']) assert.equal((await page.request.get(base+'/assets/questoes/'+asset)).status(),200);
      await page.evaluate(()=>scrollTo(0,0));
      await page.screenshot({path:`${results}/${name}.png`,fullPage:true});
      assert.deepEqual(errors,[]);await context.close();
    });
  }
  await test('Conteúdo acessível com JavaScript desativado',async()=>{
    const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const page=await context.newPage();await page.goto(base);assert.ok(await page.getByRole('navigation').getByRole('link',{name:'Como funciona'}).isVisible());assert.equal(await page.locator('details').count(),4);await context.close();
  });
} finally {await browser.close();}
