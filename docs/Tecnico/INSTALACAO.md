# Instalação do incremento atual

Requisitos: Git, Docker Engine/Desktop e plugin Docker Compose v2 com suporte a `--wait`. Não é necessário Node para executar os containers. O PostgreSQL usado é 17; Nginx serve apenas o frontend estático. Não há API nem login disponíveis.

```sh
git clone https://github.com/Tech0wl-2026/ABP-Tech0wl.git
cd ABP-Tech0wl
git switch develop
cp .env.example .env
# Escolha uma senha local em .env antes de subir.
docker compose config --quiet
docker compose up --build -d --wait
```

Abra `http://localhost:8080`. Os valores padrão de portas podem ser alterados no `.env`. Banco: localhost:5432, apenas interface local. O arquivo `.env.example` tem valores fictícios de desenvolvimento e não deve ser usado em produção.

## Banco e persistência

Em um volume vazio, o Postgres executa `database/schema.sql` e depois `database/seed.sql`. São **scripts iniciais**, não migrações idempotentes. O seed fornece um tema não selecionado e quatro questões de demonstração, sem candidatos/senhas de acesso e sem 48 questões finais.

```sh
docker compose exec -T db sh -c 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < testes/database.sql
docker compose exec -T db sh -c 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < database/consultas-exemplo.sql
docker compose ps
docker compose logs --tail=60
docker compose down
```

Os testes usam transação revertida. `down` preserva o volume nomeado; subir novamente conserva dados. Para testar instalação limpa, use um **nome de projeto diferente e portas livres** em um ambiente descartável. Não apagar o volume de trabalho para aplicar mudanças de schema. Migrações serão necessárias após a primeira implantação.

## Frontend sem Docker, para desenvolvimento

Com Node 22+:

```sh
npm ci
npm run serve
```

Abrir `http://localhost:8080`. Esse servidor local só serve arquivos do frontend; não inicia o banco. Para os testes de navegador, consulte [testes/README](../../testes/README.md).

## Limitações

A credencial local cria o banco e não representa a futura credencial restrita da API. Não usar este Compose para produção. As imagens seguem séries estáveis (`postgres:17-alpine`, `nginx:stable-alpine`); no fechamento registrar versões/digests efetivamente testados no CI. Configuração de produção, backend e dados finais continuam pendentes.
