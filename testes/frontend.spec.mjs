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
try {
  for (const [size, width, height] of [
    ["desktop", 1440, 1000],
    ["tablet", 820, 1180],
    ["intermediario", 600, 900],
    ["mobile", 393, 852],
    ["estreito", 320, 760],
  ]) {
    for (const [file, label] of [
      ["index.html", "Home"],
      ["curso.html", "Curso"],
      ["sobre.html", "Sobre nós"],
    ]) {
      await test(`${label}: navegação e conteúdo em ${size}`, async () => {
        const context = await browser.newContext({
          viewport: { width, height },
          locale: "pt-BR",
        });
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (e) => errors.push(e.message));
        page.on("response", (r) => {
          if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
        });
        await page.goto(`${base}/${file}`, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        assert.equal(await page.locator("html").getAttribute("lang"), "pt-BR");
        assert.equal(await page.locator("h1").count(), 1);
        assert.match(await page.title(), /Tech0wl/);
        assert.equal(
          await page
            .getByRole("navigation")
            .locator('[aria-current="page"]')
            .innerText(),
          label,
        );
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          "Não pode haver rolagem horizontal",
        );
        assert.ok(
          await page
            .locator("img")
            .evaluateAll((imgs) =>
              imgs.every((img) => img.complete && img.naturalWidth > 0),
            ),
          "Todas as imagens locais precisam carregar",
        );
        assert.ok(
          await page.evaluate(
            () =>
              document.fonts.check("16px Joan") &&
              document.fonts.check("16px Kulim"),
          ),
        );
        assert.equal(
          await page.getByRole("navigation").getByRole("link").count(),
          3,
        );
        for (const href of await page
          .locator("a[href]")
          .evaluateAll((links) => links.map((a) => a.getAttribute("href")))) {
          const url = new URL(href, `${base}/${file}`);
          assert.equal((await page.request.get(url.href)).status(), 200, href);
        }
        if (file === "index.html") {
          assert.equal(await page.locator(".teacher").count(), 3);
          const portraits = await page
            .locator(".teacher")
            .evaluateAll((items) =>
              items.map((el) => ({
                height: el.clientHeight,
                width: el.clientWidth,
                bg: getComputedStyle(el).backgroundImage,
              })),
            );
          assert.ok(
            portraits.every(
              (x) =>
                x.height > 250 &&
                x.width > 150 &&
                x.bg.includes("docentes.png"),
            ),
          );
        }
        if (file === "curso.html") {
          assert.equal(await page.locator(".module").count(), 4);
          const boxes = await page.evaluate(() => ({
            moduleEnd: document
              .querySelector(".module:last-child")
              .getBoundingClientRect().bottom,
            feedbackStart: document
              .querySelector(".feedback")
              .getBoundingClientRect().top,
            previewEnd: document
              .querySelector(".certificate-preview")
              .getBoundingClientRect().bottom,
            detailStart: document
              .querySelector(".certificate-detail")
              .getBoundingClientRect().top,
          }));
          assert.ok(
            boxes.moduleEnd <= boxes.feedbackStart,
            "Os módulos não podem sobrepor os depoimentos",
          );
          if (width <= 760)
            assert.ok(
              boxes.previewEnd <= boxes.detailStart,
              "O certificado não pode sobrepor a descrição",
            );
          await page.locator("summary").click();
          assert.ok(
            (await page.locator("details").getAttribute("open")) !== null,
          );
          assert.ok(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          );
          await page.locator("summary").click();
        }
        await page.keyboard.press("Tab");
        // As ligações de navegação precisam chegar à página e atualizar o item ativo.
        await page
          .getByRole("navigation")
          .getByRole("link", { name: "Sobre nós", exact: true })
          .click();
        assert.match(page.url(), /sobre\.html$/);
        assert.equal(
          await page
            .getByRole("navigation")
            .locator("[aria-current]")
            .innerText(),
          "Sobre nós",
        );
        await page.goto(`${base}/${file}`, { waitUntil: "networkidle" });
        await page.screenshot({
          path: `test-results/${size}-${file.replace(".html", "")}.png`,
          fullPage: true,
        });
        assert.deepEqual(errors, []);
        await context.close();
      });
    }
  }
  await test("Páginas e botões disponíveis sem JavaScript", async () => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 393, height: 852 },
    });
    const page = await context.newPage();
    await page.goto(base);
    await page.getByRole("link", { name: "Começar" }).click();
    assert.match(page.url(), /curso\.html#curso$/);
    await page.locator("summary").click();
    assert.ok((await page.locator("details").getAttribute("open")) !== null);
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Home", exact: true })
      .click();
    await page.getByRole("link", { name: "Matricula-se" }).click();
    assert.match(page.url(), /curso\.html#certificacao$/);
    assert.ok(
      await page.getByRole("heading", { name: /Termine o curso/ }).isVisible(),
    );
    await context.close();
  });
} finally {
  await browser.close();
}
