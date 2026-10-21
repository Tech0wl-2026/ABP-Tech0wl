# Validação reproduzível

## Estrutura e documentação

```sh
python3 scripts/validar-repositorio.py
python3 -m unittest discover -s testes -p 'test_*.py'
node --check frontend/js/app.js
```

O teste de regressão do importador confirma que uma issue refinada/encerrada, com responsável e milestone modificados, não é restaurada ao snapshot antigo. A verificação estrutural confere links locais, 25 critérios/100 pontos, cobertura transversal ES01–ES09/DW01, tarefas/requisitos rastreáveis, imagens do seed e sintaxe dos workflows. Não concede nota nem transforma pendências em atendimento.

## Banco vazio — PostgreSQL 17

Subir o ambiente conforme [instalação](../docs/Tecnico/INSTALACAO.md). O CI usa volume novo e executa DDL + seed; depois:

```sh
docker compose exec -T db sh -c 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < testes/database.sql
docker compose exec -T db sh -c 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < database/consultas-exemplo.sql
```

A suíte reverte seus dados com ROLLBACK. Verifica 24 condições: amostra/prontidão incompleta, CPF único/formato, publicação A/B/C/D, gabarito, prazo, resposta nula por expiração, preservação de questão/resposta, não reabertura, resultado com 12 etapas, certificado somente acima do limiar e snapshots. Não é teste de autenticação, driver HTTP ou concorrência entre sessões.

Como verificação local auxiliar, o mesmo SQL foi executado em PGlite 0.5.10 (PostgreSQL 18.6/WASM). Esse resultado não substitui a execução no PostgreSQL 17 do CI.

## Navegador

Com o frontend em `http://localhost:8080`:

```sh
npm ci --ignore-scripts
npx playwright install --with-deps chromium
npm test
```

Playwright verifica as três páginas em 1440, 820, 600, 393 e 320 pixels, navegação, imagens, fontes locais, ausência de sobreposição nas seções do curso, botões e conteúdo sem JavaScript (16 testes). Capturas ficam em `test-results/`; no GitHub Actions são artifacts por hash, com retenção de 30 dias. No fechamento da Sprint, conservar as evidências importantes no commit de entrega; artifacts temporários não são o único registro final.

O CI [Validar incremento e documentação](../.github/workflows/validar-projeto.yml) também sobe containers limpos, prepara consultas e registra versões/imagens. A suíte HTTP do backend está em backend/test e roda no CI em banco PostgreSQL descartável. QR e usabilidade com colegas continuam pendentes.
