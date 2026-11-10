# Execução do projeto em ambiente limpo

Evidência da issue [#103](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/103), registrada em 09/11/2026.

## Ambiente usado

O CI do GitHub Actions é um ambiente limpo a cada execução: máquina Ubuntu nova, sem `.env`, sem imagens e sem volume de banco. Execução conferida: [42723188055](https://github.com/Tech0wl-2026/ABP-Tech0wl/actions/runs/42723188055), commit `0abf5bb` da `main`, aprovada em 09/11/2026.

## Passos executados do zero

| Etapa | Comando | O que valida |
|---|---|---|
| 1. Clonar | `actions/checkout` | Só o que está no repositório, sem arquivos locais |
| 2. Configuração | `bash iniciar.sh` | Cria o `.env` a partir do `.env.example` e gera um `JWT_SECRET` aleatório |
| 3. Containers e rede | `docker compose up --build --wait` | Constrói as imagens e sobe `db`, `backend` e `frontend` na mesma rede, todos saudáveis |
| 4. DDL e seed | Inicialização do PostgreSQL 17 com volume vazio | `database/schema.sql` e `database/seed.sql` rodam em banco vazio |
| 5. DML e integridade | `psql -v ON_ERROR_STOP=1 < testes/database.sql` | Restrições, chaves e consultas preparadas (`PREPARE`); qualquer falha interrompe o CI |
| 6. Persistência | `npm test` no backend, em banco descartável | 13 testes gravam e leem candidatos, respostas, resultado e certificado |
| 7. Interface | Testes do navegador | 27 testes das telas em cinco larguras |
| 8. Limpeza | `docker compose down` | Encerra e descarta o ambiente |

## Como repetir numa máquina

1. Instalar o Docker e deixar as portas 8080, 3001 e 5432 livres. Se a 5432 estiver ocupada, use `DB_PORT=5433` no `.env`.
2. `git clone https://github.com/Tech0wl-2026/ABP-Tech0wl.git` e entrar na pasta.
3. `bash iniciar.sh` (Linux/macOS) ou `iniciar.ps1` (Windows).
4. Abrir `http://localhost:8080` e conferir `http://localhost:3001/api/saude`.

Guia completo: [COMECAR-AQUI.md](../../../COMECAR-AQUI.md).
