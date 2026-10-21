# Abrir o projeto na sua máquina

Extraia o ZIP inteiro antes de iniciar. Você precisa do Docker Desktop aberto (Windows/macOS) ou Docker Engine com Compose v2 (Linux), com as portas 8080, 3001 e 5432 livres. A primeira inicialização precisa de internet para baixar as imagens e os pacotes. Fontes e imagens do site estão incluídas no projeto.

## Windows

Abra o PowerShell na pasta extraída e execute:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\iniciar.ps1
```

A opção acima vale apenas para esse processo do PowerShell; não altera a política permanente da máquina.

## Linux ou macOS

Abra o terminal na pasta extraída:

```sh
bash iniciar.sh
```

Os scripts criam o `.env` local e um segredo JWT aleatório, sem substituir um segredo já preenchido. Em seguida, sobem três serviços: site, backend e PostgreSQL. Se o comando falhar, verifique a mensagem; não é preciso apagar o banco para tentar novamente.

## Endereços

| Serviço | Endereço padrão |
|---|---|
| Site | http://localhost:8080 |
| Home | http://localhost:8080/index.html |
| Curso | http://localhost:8080/curso.html |
| Sobre nós | http://localhost:8080/sobre.html |
| Saúde da API | http://localhost:3001/api/saude |
| Banco | localhost:5432; credenciais no seu `.env` |

Para conferir o mobile, abra as ferramentas do navegador, selecione o modo de dispositivo e ajuste a largura para 393 px. Também há adaptações para 320 px e tablet.

As três páginas públicas seguem as referências desktop/mobile do Figma. Os botões levam às informações do curso e da certificação. Cadastro, login, estudos e avaliação ainda não estão integrados à interface; a [API](docs/Tecnico/API.md) já possui rotas para parte desses fluxos. Não há conta pré-cadastrada nem certificado real na imagem de exemplo.

As substituições visuais estão descritas na [conferência do Figma](docs/design/conferencia-2026-10-21.md). O [review da Sprint 1](docs/sprints/review-sprint-1-2026-10-21.md) reúne as pendências para o fechamento.

## Encerrar, reiniciar e consultar erros

```sh
docker compose ps
docker compose logs --tail=80 backend
docker compose down
```

`down` preserva o banco. Para abrir novamente, execute o script inicial. Não use `down -v` se quiser manter cadastros e respostas.

Se alguma porta estiver ocupada, altere `WEB_PORT`, `APP_PORT` ou `DB_PORT` no `.env`, execute o script novamente e abra a porta escolhida. O guia completo está em [Instalação](docs/Tecnico/INSTALACAO.md).
