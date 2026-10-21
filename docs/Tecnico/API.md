# API do portal

Base local: `http://localhost:3001/api`. Pelo Nginx: `http://localhost:8080/api`.

Envie JSON com `Content-Type: application/json`. Rotas privadas exigem `Authorization: Bearer TOKEN`. O token identifica o candidato; enviar outro `candidato_id` não muda o titular.

| Método e caminho | Acesso | Resposta |
|---|---|---|
| GET `/saude` | Público | Disponibilidade da API e do banco. |
| GET `/temas` | Público | Os 12 temas do grupo na ordem definida. |
| POST `/candidatos` | Público | Cadastro com CPF, nome, e-mail e senha. Retorna 201. |
| POST `/login` | Público | Token Bearer válido por uma hora e dados básicos do candidato. |
| GET `/temas/proximo` | Privado | Tema da questão aberta ou próximo tema pendente. |
| POST `/questoes/sortear` | Privado | Questão, alternativas sem gabarito, imagem, início e prazo. |
| GET `/questoes/:id` | Privado | Questão já sorteada para o titular, sem gabarito. |
| GET `/imagens/:id` | Público | SVG associado à questão. |
| POST `/questoes/:id/responder` | Privado | Grava a resposta e retorna gabarito, validade e resultado disponível. |
| POST `/questoes/:id/interromper` | Privado | Encerra a questão sem escolha, considerada incorreta. |
| GET `/candidatos/progresso` | Privado | Temas pendentes, em andamento e concluídos. |
| GET `/candidatos/historico` | Privado | Questões encerradas, escolhas, gabaritos e datas. |
| GET `/candidatos/resultado` | Privado | Contagem de temas/acertos; nota e percentual após os 12 temas. |
| POST `/candidatos/certificado` | Privado | Código e dados privados da emissão, somente com 12 temas e ≥65%. |
| GET `/certificados/:hash` | Público | Autenticidade, nome, percentual e data; sem CPF/e-mail. |

## Cadastro e login

```sh
curl -X POST http://localhost:3001/api/candidatos \
  -H 'Content-Type: application/json' \
  -d '{"cpf":"12345678904","nome":"Candidato de exemplo","email":"candidato@example.com","senha":"senha_de_exemplo"}'

curl -X POST http://localhost:3001/api/login \
  -H 'Content-Type: application/json' \
  -d '{"cpf":"12345678904","senha":"senha_de_exemplo"}'
```

CPF é uma string com 11 dígitos sem pontuação, como no material do professor. Não há verificação de dígitos de controle do CPF. A senha tem no mínimo seis caracteres e no máximo 72 bytes UTF-8, limite do bcrypt. Senha e hash nunca são devolvidos pela API.

Cadastro e login compartilham o limite de 30 chamadas por IP a cada 15 minutos. No Compose local, chamadas pelo Nginx aparecem como um único IP; uma implantação pública precisa configurar proxies confiáveis e um armazenamento compartilhado do limitador.

## Avaliação

```sh
curl -X POST http://localhost:3001/api/questoes/sortear \
  -H 'Authorization: Bearer SEU_TOKEN'

curl -X POST http://localhost:3001/api/questoes/1/responder \
  -H 'Authorization: Bearer SEU_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"letra_resposta":"A"}'
```

Use o ID recebido no sorteio, que pode ser diferente de 1. O formato acompanha o professor: `{questao: {questao: {...}, data_horario_inicio, data_horario_limite}, concluido: false}`. Ao terminar: `{questao: null, concluido: true}`.

Cada candidato responde uma única questão por tema, sem reiniciar a certificação. Repetir o sorteio enquanto a questão está aberta mantém a questão e o prazo. O PostgreSQL controla os 150 segundos; datas, nota e `acertou` enviados pelo cliente são ignorados. As transações bloqueiam o candidato para serializar sorteio, resposta e emissão. Envio repetido de resposta retorna 409.

A rotina de expiração roda a cada cinco segundos e as operações de avaliação também encerram questões vencidas. O limite de resposta continua sendo 150 segundos. O histórico mostra o gabarito após o encerramento.

A pausa durante a resolução usa `/interromper` e a retomada segue para o próximo tema. Como no código de apoio, recarregar uma questão aberta mantém o prazo original. A API não detecta imediatamente fechamento do navegador ou perda de conexão: a integração da interface com esse encerramento continua pendente.

## Resultado e código do certificado

Percentual: `acertos / 12 * 100`. Nota de apresentação: `acertos / 12 * 10`. Ambos têm duas casas decimais. A escala 0–10 ainda precisa de confirmação do professor. O limiar de 65% exige pelo menos oito acertos.

Ao concluir pela API, o código do certificado é gerado para o candidato aprovado. São 32 bytes aleatórios, armazenados em 64 caracteres hexadecimais. Consultas repetidas preservam código, instante e dados da emissão.

Esta entrega gera código e dados, conforme o último exemplo do professor. Ainda faltam o documento eletrônico/PDF do candidato, QR Code e página visual de validação. A rota pública retorna JSON com dados mínimos; a definição final desses campos depende da equipe.

## Erros

400: entrada inválida; 401: credenciais/token inválidos; 404: recurso não encontrado para o titular; 409: conflito de estado ou certificado indisponível; 413: corpo acima de 16 KB; 429: limite de chamadas; 500: falha interna sem SQL, segredos ou stack trace na resposta.
