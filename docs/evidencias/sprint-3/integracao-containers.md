# Integração da aplicação com o banco nos containers

Evidência da issue [#89](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/89), registrada em 09/11/2026.

## Execução conferida

- CI **Validar incremento e documentação**, [execução 42723188055](https://github.com/Tech0wl-2026/ABP-Tech0wl/actions/runs/42723188055), commit `0abf5bb` da `main`, aprovada em 09/11/2026.
- O workflow sobe o projeto com `bash iniciar.sh`, que usa o [compose.yaml](../../../compose.yaml) com três serviços: `db` (PostgreSQL 17), `backend` (API Node.js/Express) e `frontend` (Nginx).

## O que comprova

| Verificação | Resultado no CI |
|---|---|
| Containers sobem e passam no healthcheck | `abp-tech0wl-db-1`, `abp-tech0wl-backend-1` e `abp-tech0wl-frontend-1` ficam **Healthy** |
| API acessível pelo site, na mesma origem | `curl --fail http://localhost:8080/api/saude` retorna `{"status":"ok"}` |
| API lê dados do PostgreSQL pela rede dos containers | `curl --fail http://localhost:8080/api/temas` retorna os 12 temas, de "Fundamentos da Agilidade" a "Boas Práticas em Projetos Ágeis" |
| Fluxos da API gravando e lendo no banco | 13 testes do backend aprovados (cadastro, login, sorteio, resposta, resultado, certificado) |

## Como a comunicação funciona

1. O Nginx recebe `/api/...` na porta 8080 e encaminha para `http://backend:3001` ([nginx.conf](../../../frontend/nginx.conf)).
2. O backend conecta no host `db`, porta 5432, com as variáveis do `.env` (`POSTGRES_HOST: db` no compose).
3. O `backend` só inicia depois que o `db` está saudável (`depends_on: condition: service_healthy`).

## Como reproduzir

```sh
bash iniciar.sh
curl http://localhost:8080/api/saude
curl http://localhost:8080/api/temas
```

## Revisão e aceite

Em 09/11/2026 o Scrum Master (Breno) refez o roteiro acima na máquina local, conferiu os três critérios da issue #89 e marcou o checklist. Evidência do CI na `main`: run 42723188055 (commit `0abf5bb`).
