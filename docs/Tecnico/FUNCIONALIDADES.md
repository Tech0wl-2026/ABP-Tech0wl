# Funcionalidades disponíveis

| Parte | Situação |
|---|---|
| Página inicial | HTML/CSS/JavaScript, menu responsivo e busca nas dúvidas. |
| Cadastro/login | API com CPF único, bcrypt e JWT por uma hora. |
| Conteúdo da prova | 12 temas do grupo, 48 questões, 192 alternativas e 48 imagens. |
| Sorteio | Uma questão por tema/candidato, prazo persistido e controle de chamadas concorrentes. |
| Resposta/feedback | Prazo de 150 segundos no banco, resposta única e gabarito após encerramento. |
| Pausa explícita | Encerra a questão aberta e retoma no próximo tema. |
| Resultado | Acertos, percentual e nota após os 12 temas. |
| Código do certificado | Gerado para aprovados com ≥65%; código, data e dados preservados. |
| Validação pública | Endpoint JSON por código, sem CPF/e-mail. |
| Histórico/progresso | Consultas privadas vinculadas ao candidato autenticado. |
| Containers | Nginx, backend e PostgreSQL no Compose. |

## O que falta

- Conectar cadastro, avaliação e resultado nas telas do portal.
- Preparar a área de estudos com os mesmos temas.
- Revisar as 12 questões elaboradas para XP, ferramentas e boas práticas.
- Gerar o documento eletrônico do certificado, QR e página pública de validação.
- Integrar a interface ao encerramento por interrupção e conferir o RF14.
- Alinhar UML, DER e dicionário ao modelo executável.
- Confirmar escala da nota e campos públicos.

[Rotas e exemplos](API.md) · [Diferenças em relação ao material do professor](ORIENTACAO-BACKEND.md)
