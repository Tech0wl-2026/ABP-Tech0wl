# Interrupção da questão: detecção e política de encerramento

Requisito RF14: se o candidato fechar a página, perder a conexão ou abandonar a prova, a questão em andamento é encerrada e não pode ser respondida depois. Issue [#44](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/44).

## Princípio

**Quem decide o encerramento é o servidor, pelo relógio do PostgreSQL.** Eventos do navegador ajudam a encerrar mais cedo, mas não são confiáveis: uma aba pode travar, a bateria pode acabar, a rede pode cair antes de qualquer aviso. Por isso nenhuma regra depende só deles.

## Política

| Situação | Como é detectada | O que acontece |
|---|---|---|
| Candidato clica em "Pausar" ou sai da prova | A tela chama `POST /api/questoes/:id/interromper` | A questão fecha na hora, sem alternativa, como incorreta |
| Aba fechada, troca de página ou aplicativo em segundo plano | Eventos `pagehide` e `visibilitychange` da tela chamam `/interromper` | Igual ao anterior, quando a chamada chega ao servidor |
| Perda de conexão, travamento ou fechamento sem aviso | **Nenhum evento chega.** O servidor encerra pelo prazo | Ao passar 150 s do início, a questão é encerrada sem alternativa, como incorreta |
| Resposta enviada depois do prazo | O servidor compara com o `data_horario_inicio` gravado | Gravada sem alternativa e como incorreta, ou recusada com **409** se já foi encerrada |
| Tentativa de responder questão encerrada (pela tela ou chamada direta à API) | Linha da resposta já tem `data_horario_resposta` | Recusada com **409 "Esta questão já está encerrada."** |
| Candidato volta depois | `GET /api/temas/proximo` | Recebe o próximo tema pendente; o encerrado não volta |

## Onde está no código

| Mecanismo | Arquivo |
|---|---|
| Prazo de 150 s calculado no banco (`clock_timestamp()`); data enviada pelo cliente é ignorada | [avaliacao.js](../../backend/src/services/avaliacao.js) — `responder()` |
| Rotina que encerra questões vencidas a cada 5 s | [server.js](../../backend/src/server.js) e `expirar()` em [avaliacao.js](../../backend/src/services/avaliacao.js) |
| `expirar()` roda antes de sortear, buscar o próximo tema, resultado e certificado | [avaliacao.js](../../backend/src/services/avaliacao.js) |
| Uma única questão aberta por candidato e uma resposta por tema | Índice `uma_questao_aberta` e `UNIQUE (candidato_id, tema_id)` em [schema.sql](../../database/servidor/schema.sql) |
| Resposta encerrada não pode ser alterada nem apagada | Trigger `resposta_imutavel` em [schema.sql](../../database/servidor/schema.sql) |
| Eventos do navegador (`pagehide`, `visibilitychange`, `offline`) | [prova.js](../../frontend/src/js/prova.js) |

## Evidências

Testes da API com PostgreSQL real em [api.test.js](../../backend/test/api.test.js):

- **"interrupção encerra a questão e permite seguir ao próximo tema"**: interromper → 200; responder depois → 409; próximo tema é o 2.
- **"abandono sem aviso do navegador encerra a questão pelo prazo do servidor"**: nenhuma chamada a `/interromper`, só o tempo passando. A retomada já oferece o próximo tema; responder ou interromper depois → 409; resposta fora do prazo conta como incorreta e sem alternativa no histórico.
- Respostas concorrentes à mesma questão → uma 200 e uma 409 (teste de resposta única).

Como rodar: ver a seção de testes em [INSTALACAO.md](INSTALACAO.md). O CI roda esta suíte em todo push.

## Limites conhecidos

- Até a integração da prova com a API (issue #105), os eventos do [prova.js](../../frontend/src/js/prova.js) encerram a questão no estado do navegador, não no servidor. A regra do servidor já vale para qualquer cliente que use a API.
- Entre a queda e o encerramento podem passar até 150 s (mais até 5 s da rotina). Nesse intervalo, o candidato que voltar ainda vê a mesma questão com o tempo restante correto, porque o prazo vem do servidor.
- Um evento `pagehide` não garante que a chamada chegue. Por isso ele é só uma antecipação; a garantia é o prazo.
