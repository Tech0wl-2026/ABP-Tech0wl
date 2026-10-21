# Instalação

Requisitos: Git, Docker e Docker Compose v2 com suporte a `--wait`. Para rodar fora dos containers, use também Node.js 24 e PostgreSQL 17 ou superior.

## Inicialização rápida

No ZIP ou checkout completo, execute `bash iniciar.sh` no Linux/macOS ou `powershell -NoProfile -ExecutionPolicy Bypass -File .\iniciar.ps1` no Windows. Esses scripts geram um segredo local quando necessário e sobem os três serviços. Veja [Começar aqui](../../COMECAR-AQUI.md).

## Com Docker, manualmente

```sh
git clone https://github.com/Tech0wl-2026/ABP-Tech0wl.git
cd ABP-Tech0wl
git switch develop
cp .env.example .env
```

Edite a senha do banco no `.env`. Gere um segredo JWT local; não use o valor do documento de exemplo do professor:

```sh
docker run --rm node:24-alpine node -e "console.log('JWT_SECRET='+require('node:crypto').randomBytes(32).toString('hex'))" >> .env
docker compose config --quiet
docker compose up --build -d --wait --wait-timeout 120
```

A última definição de `JWT_SECRET` no arquivo deve conter o valor gerado. O `.env` não deve ser enviado ao Git.

- Site: `http://localhost:8080`.
- API direta: `http://localhost:3001/api`.
- API pelo site: `http://localhost:8080/api`.
- Banco local: `localhost:5432`.

As portas podem ser alteradas por WEB_PORT, APP_PORT e DB_PORT no `.env`. Dentro do container o backend usa 3001 e o PostgreSQL usa 5432.

Não há conta pronta. Faça um cadastro usando a [API](API.md) e entre com o mesmo CPF/senha. A página inicial ainda não oferece as telas que consomem essas rotas.

## Banco e reinício

O Postgres inicializa o modelo de referência em `public` pelos scripts `database/schema.sql` e `database/seed.sql`, como antes. O backend prepara separadamente o schema `servidor`, com as cinco tabelas do modelo do professor e os 12 temas escolhidos pelo grupo. São 48 questões, 192 alternativas e 48 imagens. Veja [os arquivos do servidor](../../database/servidor/README.md).

A preparação do backend é executada no início do container. Ela usa transação e lock, não apaga dados e não repete o seed quando o schema existe. Reiniciar conserva candidatos, respostas e códigos de certificado. Alterações futuras de estrutura precisam de migrações; não remova o volume de trabalho para atualizar o projeto.

```sh
docker compose ps
docker compose logs --tail=60 backend
docker compose restart backend
docker compose down
```

`down` preserva o volume nomeado. Para testar uma instalação limpa, use outro nome de projeto e portas livres, em ambiente descartável.

## Backend fora do Docker

Com PostgreSQL acessível e o `.env` configurado na raiz:

```sh
cd backend
npm ci --ignore-scripts
npm run db:prepare
npm run dev
```

Os comandos leem `../.env`. Para a porta do banco, o backend aceita POSTGRES_PORT; na ausência dela utiliza DB_PORT. POSTGRES_HOST é `127.0.0.1` fora do Compose.

## Testes

```sh
cd backend
npm test
```

Esse comando verifica o conteúdo. A suíte HTTP só roda se API_TEST_DATABASE apontar para um banco descartável cujo nome termina em `_test`. Ela cria as tabelas desse banco, portanto use uma base nova por execução. O CI cria `tech0wl_api_test` e executa os fluxos HTTP contra PostgreSQL real.

O passo completo usado no CI, com os containers em funcionamento:

```sh
docker compose exec -T db sh -c 'createdb -U "$POSTGRES_USER" tech0wl_api_test'
docker compose exec -T -e API_TEST_DATABASE=tech0wl_api_test backend npm test
```

A suíte anterior de SQL e navegador continua em [testes](../../testes/README.md). Para produção ainda faltam HTTPS, credencial restrita do banco, backups e ajuste do limitador para a infraestrutura utilizada.
