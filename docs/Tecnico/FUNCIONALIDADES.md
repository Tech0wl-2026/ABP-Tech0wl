# Funcionalidades disponíveis

Revisão de 20/11/2026 sobre a branch `develop`. Cada item foi conferido no código do
repositório e traz o arquivo que serve de evidência. O que ainda não está ligado está
na seção "Limitações e pendências" e não deve ser lido como pronto.

## Como o sistema está montado

Três containers no Compose: Nginx servindo as páginas estáticas, API em Node/Express e
PostgreSQL 17. O Nginx encaminha `/api/` para o backend, de modo que o navegador fala com
a API pela mesma origem (`frontend/nginx.conf`, `compose.yaml`).

A API trabalha no schema `servidor` do PostgreSQL, carregado por
`backend/scripts/preparar-banco.js` com trava de concorrência (`pg_advisory_lock`) para
que duas subidas simultâneas não dupliquem a carga.

## API de certificação

Implementada em `backend/src/` e coberta por testes de integração contra um PostgreSQL
real (`backend/test/api.test.js`).

| Recurso | Situação |
|---|---|
| Cadastro e login | `POST /api/candidatos` e `POST /api/login`. CPF de 11 dígitos, senha de 6 a 72 bytes e e-mail validado. A senha é gravada com bcrypt de custo 12 e nunca volta na resposta. |
| Sessão | JWT HS256 com validade de uma hora, `issuer` e `audience` próprios. As rotas privadas exigem `Authorization: Bearer`. |
| Proteção de acesso | Limite de 30 tentativas por 15 minutos em cadastro e login. Quando o CPF não existe, a comparação ocorre contra um hash fictício, para que o tempo de resposta não revele quais contas existem. |
| Sorteio | `POST /api/questoes/sortear` tira uma questão entre as quatro do próximo tema. Se já houver questão aberta, devolve a mesma questão com o mesmo prazo. |
| Conferência da base | O sorteio só acontece com 12 temas, quatro questões por tema e quatro alternativas com uma correta; fora disso a API responde 409. |
| Prazo de 150 segundos | O prazo é contado pelo relógio do PostgreSQL. Datas enviadas pelo cliente são ignoradas e a resposta fora do prazo é gravada como incorreta. |
| Resposta e gabarito | `POST /api/questoes/:id/responder` aceita apenas A, B, C ou D e devolve a alternativa correta junto do resultado parcial. |
| Tema respondido uma única vez | Envio repetido ou concorrente responde 409 e grava uma única resposta, com trava de linha `FOR UPDATE`. |
| Interrupção | `POST /api/questoes/:id/interromper` encerra a questão aberta. A retomada segue no próximo tema ainda não respondido, por `GET /api/temas/proximo`. |
| Resultado | Depois dos 12 temas: acertos, percentual e nota em escala de 0 a 10. A aprovação começa em 65%. |
| Certificado | Emitido na aprovação, com código de 64 caracteres hexadecimais. Nome, CPF, e-mail, acertos, percentual e nota ficam congelados no momento da emissão. |
| Validação pública | `GET /api/certificados/:hash` confirma o certificado sem devolver CPF nem e-mail. |
| Histórico e progresso | `GET /api/candidatos/historico`, `/progresso` e `/resultado` trazem tema, questão sorteada, resposta escolhida, gabarito e horários, apenas do candidato autenticado. |
| Imagens das questões | `GET /api/imagens/:id` entrega o arquivo pelo identificador, sem expor caminhos locais e com `Content-Security-Policy` restritiva. |
| Verificação de saúde | `GET /api/saude` consulta o banco e sustenta o healthcheck do container. |

## Conteúdo da certificação

12 temas, 48 questões (quatro por tema), 192 alternativas com exatamente uma correta por
questão e 48 imagens em SVG, em `database/servidor/questoes.json` e
`backend/assets/questoes/`. As contagens são verificadas por `backend/test/conteudo.test.js`.

## Páginas

| Parte | Situação |
|---|---|
| Site público | Home, Curso e Sobre nós em HTML, CSS e JavaScript, com layout desktop e mobile. A Home apresenta a equipe com link para o perfil de cada integrante. |
| Acesso | Cadastro e login estão ligados à API: validam os campos, criam a conta, guardam o token da sessão e levam ao portal. O CPF também é conferido pelos dígitos verificadores no navegador. Páginas protegidas voltam ao login quando não há sessão válida ou quando a API responde 401 (`frontend/src/js/auth.js`). |
| Portal do candidato | Home do portal com andamento, material de estudo, questão com cronômetro, resultado, certificado em PDF, perfil e feedback. Nesta etapa o conteúdo da prova vem do próprio JavaScript e o andamento fica no navegador; veja as limitações. |

## Infraestrutura e segurança

| Item | Situação |
|---|---|
| Containers | `db`, `backend` e `frontend` com verificação de saúde e ordem de subida encadeada. As portas são publicadas apenas em 127.0.0.1. |
| Configuração | Variáveis em `.env` a partir de `.env.example`. O Compose recusa subir sem `POSTGRES_PASSWORD` e `JWT_SECRET`, e a API exige segredo de no mínimo 32 bytes. |
| Cabeçalhos | `Content-Security-Policy`, `X-Content-Type-Options` e `Referrer-Policy` no Nginx; `no-store` e `nosniff` na API, que também omite o servidor e não devolve detalhes de erro interno. |
| Banco | Pool com tempo limite de conexão e de instrução, e transações com trava por candidato. |

## Verificações automatizadas

| Comando | O que cobre |
|---|---|
| `npm test` em `backend/` | Fluxos HTTP contra PostgreSQL: cadastro, login, sorteio concorrente, envio duplicado, acesso a questão alheia, entrega de imagem, interrupção, resposta atrasada, emissão concorrente do certificado, aprovação e reprovação, histórico. Inclui a conferência de 12 temas, 48 questões e 192 alternativas. |
| `npm test` na raiz | Cadastro e entrada no portal pelo front-end (`testes/frontend.spec.mjs`). |
| `npm run check` na raiz | `scripts/validar-repositorio.py`: links locais, critérios, tarefas e requisitos. |
| GitHub Actions | Validação do projeto e conferência dos pull requests, em `.github/workflows/`. |

Há roteiros adicionais em `frontend/test/` que ainda não estão ligados aos scripts de
`npm` e, por isso, não rodam na integração contínua.

## Limitações e pendências

Os itens abaixo **não** estão prontos. Ficam listados para não serem confundidos com o
que já funciona.

- **A prova no navegador ainda não usa a API.** `frontend/src/js/prova.js` traz 12 questões
  fixas no próprio arquivo e grava o andamento no `localStorage`. O sorteio entre as quatro
  questões, o prazo pelo relógio do servidor, o histórico e o resultado existem na API, mas
  nenhuma tela os consome. Acompanhado pela issue #105.
- **Duas bases de questões convivem.** A API usa 48 questões com 48 imagens em SVG; a tela
  usa 12 questões com 12 imagens em PNG. Enquanto a integração não acontece, o que o
  candidato responde não é o que está no banco.
- **Resultado, certificado, histórico e perfil leem o `localStorage`** em vez das rotas
  `/api/candidatos/...`. O PDF do certificado é montado no navegador a partir de uma imagem
  modelo, sem passar por `POST /api/candidatos/certificado`.
- **Não existe página pública de validação do certificado.** A rota da API está pronta, mas
  o QR Code aponta para um endereço de exemplo em `frontend/src/js/certificado.js`.
  Acompanhado pela issue #64.
- **A recuperação de senha não funciona.** `frontend/src/js/esqueci-senha.js` procura contas
  na chave `usuarios` do `localStorage`, que o `auth.js` apaga ao carregar, e as credenciais
  do serviço de e-mail são valores de exemplo. Também não há rota de recuperação na API.
- **O banco do container e o banco da API são diferentes.** O Compose carrega
  `database/schema.sql` e `database/seed.sql`, que são a amostra técnica de um tema e quatro
  questões; a base de 12 temas usada pela API fica em `database/servidor/` e é carregada pelo
  backend. A unificação ainda não foi decidida.
- **UML, DER e dicionário de dados ainda não foram alinhados** ao modelo executável.

## Referências

[Rotas e exemplos](API.md) · [Arquitetura](ARQUITETURA.md) · [Instalação](INSTALACAO.md) ·
[Diferenças em relação ao material de apoio](ORIENTACAO-BACKEND.md) ·
[Requisitos](../Requisitos/REQUISITOS.md) · [Modelo de dados](../database/MODELO-DE-DADOS.md)