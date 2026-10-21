# Backend

API do portal em Node.js e Express, com acesso ao PostgreSQL pelo driver `pg`.

| Pasta ou arquivo | Conteúdo |
|---|---|
| [src/server.js](src/server.js) | Inicialização da API e encerramento de questões expiradas. |
| [src/app.js](src/app.js) | Configuração do Express e tratamento de erros. |
| [src/routes](src/routes) | Rotas de cadastro, login, temas, questões e certificados. |
| [src/services](src/services) | Regras de autenticação e avaliação. |
| [src/config](src/config) | Conexão e transações com o PostgreSQL. |
| [src/middlewares](src/middlewares) | Validação do token JWT. |
| [assets/questoes](assets/questoes) | Imagens das 48 questões. |
| [scripts](scripts) | Preparação do banco sem apagar dados existentes. |
| [test](test) | Testes de conteúdo e dos fluxos HTTP. |
| [Dockerfile](Dockerfile) | Container do backend. |

[Instalação](../docs/Tecnico/INSTALACAO.md) · [Rotas](../docs/Tecnico/API.md) · [Orientação do professor](../docs/Tecnico/ORIENTACAO-BACKEND.md)
