import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.BASE_URL || "http://localhost:8080";
await mkdir("test-results", { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH
    ? { executablePath: process.env.CHROMIUM_PATH }
    : {}),
});

const TAMANHOS = [
  ["desktop", 1440, 1000],
  ["tablet", 820, 1180],
  ["intermediario", 600, 900],
  ["mobile", 393, 852],
  ["estreito", 320, 760],
];

// Abre uma página e registra erros de JavaScript e arquivos que não carregaram.
async function abrir(context, arquivo) {
  const page = await context.newPage();
  const erros = [];
  page.on("pageerror", (e) => erros.push(e.message));
  page.on("response", (r) => {
    if (r.status() >= 400 && r.url().startsWith(base)) erros.push(`${r.status()} ${r.url()}`);
  });
  await page.goto(`${base}/${arquivo}`, { waitUntil: "networkidle" });
  return { page, erros };
}

const imagensCarregadas = (page) =>
  page.locator("img").evaluateAll((imgs) =>
    imgs.every((img) => img.loading === "lazy" || (img.complete && img.naturalWidth > 0)),
  );

try {
  // Páginas públicas: conteúdo básico e layout responsivo em cinco larguras.
  for (const [tamanho, width, height] of TAMANHOS) {
    for (const [arquivo, nome] of [
      ["index.html", "Home"],
      ["curso.html", "Curso"],
      ["sobre.html", "Sobre nós"],
    ]) {
      await test(`${nome}: conteúdo e layout em ${tamanho}`, async () => {
        const context = await browser.newContext({ viewport: { width, height }, locale: "pt-BR" });
        const { page, erros } = await abrir(context, arquivo);
        await page.evaluate(() => document.fonts.ready);
        assert.equal(await page.locator("html").getAttribute("lang"), "pt-BR");
        assert.equal(await page.locator("h1").count(), 1);
        assert.match(await page.title(), /Aprendizagem Ágil/);
        assert.ok(await page.locator("nav").count() > 0, "A página precisa de navegação");
        assert.ok(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          "Não pode haver rolagem horizontal",
        );
        assert.ok(await imagensCarregadas(page), "Todas as imagens devem carregar");
        assert.deepEqual(erros, []);
        if (tamanho === "desktop") await page.screenshot({ path: `test-results/${arquivo}.png`, fullPage: true });
        await context.close();
      });
    }
  }

  // Telas de acesso: abrem em português, com formulário e sem erros.
  for (const [arquivo, titulo] of [
    ["cadastro.html", /Cadastro/],
    ["login.html", /Login/],
    ["esqueci_senha.html", /Recuperar senha/],
    ["senha-nov.html", /Nova senha/],
  ]) {
    await test(`${arquivo}: tela de acesso disponível`, async () => {
      const context = await browser.newContext({ locale: "pt-BR" });
      const { page, erros } = await abrir(context, arquivo);
      assert.equal(await page.locator("html").getAttribute("lang"), "pt-BR");
      assert.match(await page.title(), titulo);
      assert.ok(await page.locator("form").count() > 0, "A tela precisa de formulário");
      assert.ok(await imagensCarregadas(page));
      assert.deepEqual(erros, []);
      await context.close();
    });
  }

  // Telas do portal exigem login.
  for (const arquivo of ["home.html", "curso-portal.html", "material.html", "questao.html", "resultado.html", "certificado.html", "perfil.html"]) {
    await test(`${arquivo}: sem login, redireciona para o login`, async () => {
      const context = await browser.newContext({ locale: "pt-BR" });
      const { page, erros } = await abrir(context, arquivo);
      await page.waitForURL(/login\.html/);
      assert.deepEqual(erros, []);
      await context.close();
    });
  }

  // Fluxo do candidato: validações do cadastro, cadastro, login e portal.
  await test("cadastro valida os campos, cadastra e permite entrar no portal", async () => {
    const context = await browser.newContext({ locale: "pt-BR" });
    const { page, erros } = await abrir(context, "cadastro.html");
    const preencher = async (nome, cpf, senha, confirmar) => {
      await page.fill("#nome", nome);
      await page.fill("#cpf", cpf);
      await page.fill("#email", "candidato.teste@example.com");
      await page.fill("#senha", senha);
      await page.fill("#confirmar", confirmar);
      await page.locator("#form-cadastro").evaluate((f) => f.requestSubmit());
    };

    await preencher("Candidato", "52998224725", "segura123", "segura123");
    await assert.doesNotReject(page.locator("#mensagem", { hasText: /nome e sobrenome/i }).waitFor());

    await preencher("Candidato Teste", "11111111111", "segura123", "segura123");
    await assert.doesNotReject(page.locator("#mensagem", { hasText: /CPF inválido/i }).waitFor());

    await preencher("Candidato Teste", "52998224725", "123", "123");
    await assert.doesNotReject(page.locator("#mensagem", { hasText: /6 caracteres/i }).waitFor());

    await preencher("Candidato Teste", "52998224725", "segura123", "outra123");
    await assert.doesNotReject(page.locator("#mensagem", { hasText: /não coincidem/i }).waitFor());

    await preencher("Candidato Teste", "52998224725", "segura123", "segura123");
    await page.waitForURL(/login\.html/);

    await page.fill("#cpf", "52998224725");
    await page.fill("#senha", "segura123");
    await page.locator("#form-login").evaluate((f) => f.requestSubmit());
    await page.waitForURL(/home\.html/);
    assert.ok(await page.locator("h1").count() > 0);
    assert.deepEqual(erros, []);
    await context.close();
  });
} finally {
  await browser.close();
}
