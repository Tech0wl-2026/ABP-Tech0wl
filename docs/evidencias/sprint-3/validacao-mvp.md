# Validação integral do MVP — 23/11/2026

Issue [#99](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/99). Executada pelo Scrum Master (Breno) na `develop` de 23/11/2026, com a API e o PostgreSQL rodando de verdade (não é simulação).

## Ambiente

- API Node/Express da `develop` com PostgreSQL 16, banco preparado por `scripts/preparar-banco.js` (12 temas, 48 questões).
- Site servido com `/api` encaminhado para a API, como faz o Nginx do Docker.
- Navegador Chromium (Playwright), em dois perfis:
  - **Computador:** janela de 1366 × 850.
  - **Celular:** emulação do iPhone 13 (390 × 844, toque).
- Uma conta nova em cada perfil, com dados fictícios.

## Resultado por etapa

| Etapa | Computador | Celular | Como funciona hoje |
|---|:--:|:--:|---|
| Página inicial | ✅ | ✅ | Estática |
| Cadastro | ✅ | ✅ | **API** — `POST /api/candidatos` → 201, gravado no PostgreSQL |
| Login | ✅ | ✅ | **API** — `POST /api/login` → 200, token na sessão |
| Estudos (temas e material) | ✅ | ✅ | Estático no navegador |
| Prova: questão, 4 alternativas e cronômetro | ✅ | ✅ | Questões fixas no `prova.js` |
| Prova: responder e ver a alternativa correta | ✅ | ✅ | No navegador |
| Prova: pausar | ✅ | ✅ | No navegador |
| Retomada pela home | ✅ | ✅ | `localStorage` |
| Prova: concluir os 12 temas | ✅ | ✅ | No navegador |
| Resultado (aprovado/reprovado, 65%) | ✅ | ✅ | Nota calculada no navegador |
| Certificado | ⚠️ | ⚠️ | Mostra "0 de 4 temas concluídos · prova pendente" mesmo depois da prova concluída |
| Histórico | ❌ | ❌ | Página `historico.html` não existe (404); o script `historico.js` existe, sem tela |
| Progresso (perfil) | ✅ | ✅ | Trilha de estudos no navegador; nome corrigido nesta validação |
| Validação pública do certificado | ❌ | ❌ | Página `validar.html` não existe (404); a rota `GET /api/certificados/:hash` está pronta |
| Sair | ✅ | ✅ | Apaga a sessão; a home volta para o login |
| Rolagem lateral | ✅ | ✅ | Nenhuma página com rolagem horizontal |
| Erros de JavaScript | ✅ | ✅ | Nenhum; só os dois 404 acima |

**Gravação no banco depois do fluxo completo:** 2 candidatos e **0 respostas**. A prova inteira ficou no navegador.

## Bug corrigido nesta validação

| Bug | Correção | Commit |
|---|---|---|
| O perfil mostrava o nome de exemplo da tela ("Zandora Colombani") e, no mesmo navegador, os dados salvos por outra conta | O perfil usa o nome e o CPF de quem fez login e só reaproveita dados salvos do mesmo CPF | "Mostra no perfil o nome e o CPF de quem fez login" |

## Bugs e pendências encontrados (para os responsáveis)

| # | Problema | Impacto | Responsável | Issue |
|---|---|---|---|---|
| 1 | Prova, resultado e retomada não usam a API: nada é gravado em `respostas` | DW03, DW04, DW05, BD05 — a regra de 150 s e a nota não vêm do servidor | Miguel e Sophia | #105, #33, #36, #46, #47 |
| 2 | `historico.html` não existe | RF20 sem tela | Sophia | #107 |
| 3 | `validar.html` não existe e o certificado não tem QR | RF18 e RF19 | Guilherme | #56, #64 |
| 4 | Certificado mostra "0 de 4 temas · prova pendente" depois da prova concluída | Informação errada na tela | Guilherme | #57 |
| 5 | O teste de interface de cadastro (`testes/frontend.spec.mjs`) espera o cadastro no navegador e falha sem a API | CI da interface | Breno | #97 |

O backend que essas telas precisam está pronto e testado: 15 testes aprovados com PostgreSQL, incluindo histórico, abandono e certificado.

## Capturas

| Etapa | Computador | Celular |
|---|---|---|
| Cadastro | [computador-cadastro.jpg](mvp/computador-cadastro.jpg) | [celular-cadastro.jpg](mvp/celular-cadastro.jpg) |
| Login e home | [computador-login-home.jpg](mvp/computador-login-home.jpg) | [celular-login-home.jpg](mvp/celular-login-home.jpg) |
| Estudos | [computador-estudos.jpg](mvp/computador-estudos.jpg) | [celular-estudos.jpg](mvp/celular-estudos.jpg) |
| Questão e correta | [computador-questao-correta.jpg](mvp/computador-questao-correta.jpg) | [celular-questao-correta.jpg](mvp/celular-questao-correta.jpg) |
| Retomada | [computador-retomada.jpg](mvp/computador-retomada.jpg) | [celular-retomada.jpg](mvp/celular-retomada.jpg) |
| Resultado | [computador-resultado.jpg](mvp/computador-resultado.jpg) | [celular-resultado.jpg](mvp/celular-resultado.jpg) |
| Certificado | [computador-certificado.jpg](mvp/computador-certificado.jpg) | [celular-certificado.jpg](mvp/celular-certificado.jpg) |
| Perfil | [computador-perfil.jpg](mvp/computador-perfil.jpg) | [celular-perfil.jpg](mvp/celular-perfil.jpg) |

## Repetir em 25/11

Depois que as etapas de integração entrarem, repetir este roteiro pela interface, no `docker compose up --build`, e conferir no banco:

```sql
SELECT count(*) FROM servidor.respostas;   -- deve ser 12 por candidato que concluiu
```

## Repetição em 23/11/2026, 22h (depois da integração da prova)

Mesmo roteiro, na `develop` com os commits de integração de 22 e 23/11 (`prova.js` ligado a `/questoes/sortear`, `/responder` e `/interromper`; `validar.html`; certificado com QR). API com 15 testes aprovados.

| Etapa | Antes (23/11, 19h) | Agora (23/11, 22h) |
|---|---|---|
| Prova grava no banco | 0 respostas | **12 respostas por candidato** (`POST /api/questoes/:id/responder` → 200) |
| Pausa e abandono | Só no navegador | Chamam `POST /api/questoes/:id/interromper` (`pagehide`, `visibilitychange`, `offline`) |
| Certificado | Só no navegador | **Emitido pela API** (`certificado_hash` gravado) |
| Validação pública | 404 | `validar.html` existe: código válido → `GET /api/certificados/:hash` 200; código inexistente → 404 tratado na tela |
| Histórico | 404 | Continua 404 (`historico.html` não existe) |

### Bug impeditivo encontrado — questão da tela diferente da questão do servidor

A tela mostra as questões fixas do `prova.js` (vetor `QUESTOES`, com o gabarito no JavaScript), mas envia a letra escolhida para a questão **sorteada pelo servidor**, que é outra. Resultado: **a nota da tela e a nota do servidor não batem**.

Evidência no teste do celular: escolhendo a letra correta da questão do servidor em cada tema, a API registrou **12 acertos e emitiu o certificado**, enquanto a tela de resultado mostrou **"reprovado — 2 de 12"**, calculada com o gabarito local.

| Onde | Problema | Correção necessária |
|---|---|---|
| `prova.js` | Renderiza `QUESTOES[estado.atual]` em vez de `res.dados.questao.questao` | Mostrar enunciado, imagem (`imagem_url`) e alternativas que vêm de `/questoes/sortear`; apagar o vetor `QUESTOES` com gabarito |
| `prova.js` | Feedback da correta vem do gabarito local | Usar `alternativa_correta` da resposta de `/responder` |
| `resultado.js` | Nota calculada no navegador | Ler `GET /api/candidatos/resultado` |

Responsáveis: Miguel e Tiago (#105), com apoio do Abdi. Até essa correção, a demonstração da prova deve ser feita sabendo que **a nota oficial é a do servidor**.

### Outros pontos

- No computador, depois de pausar, ao abrir `questao.html` de novo a tela não mostrou as alternativas da próxima questão. Reproduzir manualmente antes da apresentação.
- O certificado ainda mostra "0 de 4 temas concluídos · prova pendente" no topo, embora a parte da API mostre 12 de 12.
