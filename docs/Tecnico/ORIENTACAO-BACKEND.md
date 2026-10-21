# Backend a partir da orientação do professor

Referência: “ABP 1DSM - Servidor.docx”, enviado com `seed.sql` e `questoes.zip` em 21/10/2026. A implementação segue o código escrito e sua divisão em configuração, middleware, rotas e serviços. Os vídeos são referências complementares; não foi utilizada transcrição deles.

## Questões e temas

A seleção do grupo usa os temas originais 1, 3, 4, 5, 6, 8, 9, 10, 11, 13, 14 e 15. O seed do professor usa 1 a 12.

Foram aproveitadas 36 questões e imagens dos nove temas em comum. As 12 questões de Manifesto Ágil, User Stories e Qualidade em Projetos Ágeis foram substituídas por quatro de cada tema restante: XP, Ferramentas para Equipes Ágeis e Boas Práticas em Projetos Ágeis. As novas questões foram elaboradas nesta implementação e precisam de revisão pedagógica do grupo. Não são um banco previamente aprovado pela equipe.

O [catálogo](../../database/servidor/questoes.json) registra a origem por questão. IDs e nomes das imagens foram organizados de 1 a 48 na ordem dos [temas escolhidos](../conteudo/temas.md). As 36 imagens aproveitadas mantêm o conteúdo dos arquivos enviados pelo professor.

## Adaptações

- O PostgreSQL 17 existente foi mantido. A coluna `valida` usa `STORED`; o exemplo usa `VIRTUAL`, disponível no PostgreSQL 18.
- O modelo do professor fica no schema `servidor`, separado do modelo anterior em `public`. A API utiliza somente `servidor`.
- Erros HTTP distinguem entrada inválida, autenticação, conflito e recurso inexistente.
- Sorteio, resposta e emissão usam transação e lock do candidato.
- Constraints impedem duas questões abertas ou duas questões do mesmo tema para o candidato.
- Uma rotina encerra questões expiradas; responder fora do prazo não concede acerto.
- Questão alheia e gabarito antecipado não são expostos nas rotas da prova.
- A imagem é resolvida por ID, sem caminho arbitrário do cliente.
- Consultas repetidas preservam código, instante e dados do certificado.
- As credenciais de exemplo do professor não foram copiadas para a aplicação.

## Referências em vídeo

1. [Criar o banco](https://youtu.be/MGi3o07bAts)
2. [Servidor e temas](https://youtu.be/1M8XVOD-zdw)
3. [Questões e alternativas](https://youtu.be/93iYJH9BdFM)
4. [Recuperar imagem](https://youtu.be/3wBb8WDf2go)
5. [Cadastrar candidato](https://youtu.be/0hKc5FCS01A)
6. [Codificar senha](https://youtu.be/M8bbr-_WXSk)
7. [Login](https://youtu.be/btWnljYaUJ4)
8. [Autenticação](https://youtu.be/o7uEAbP4diw)
9. [Próximo tema](https://youtu.be/8jPgSVaryvk)
10. [Sortear questão](https://youtu.be/H0NnGyT0Ttk)
11. [Responder questão](https://youtu.be/7s1rQp60NDo)
12. [Hash do certificado](https://youtu.be/pePw9GTKtks)
