# Validação técnica — 14/10/2026

Execução real em 14/10/2026 às 22h12–22h13 (America/Sao_Paulo), correspondente a 15/10 01h12–01h13 UTC.

- Commit: `b413d0e96b5d673b5370005a245ba5bb6499b107`, em `develop`, autoria/committer GitHub `breesiqueiramkt`.
- [GitHub Actions aprovado](https://github.com/Tech0wl-2026/ABP-Tech0wl/actions/runs/38664364322).
- Container iniciado a partir de volume vazio, DDL e seed aplicados no PostgreSQL **17.11**. [Ambiente registrado](ambiente.txt).
- [24 verificações SQL aprovadas](database.txt); consultas preparadas executadas sem erro.
- Quatro testes de navegador aprovados: 1440px, 390px, 320px e JavaScript desativado. Capturas integrais reais: [desktop](desktop.png), [mobile](mobile.png), [320px](mobile-estreito.png).
- Capturas inspecionadas: conteúdo legível, sem sobreposição ou rolagem horizontal, menu e FAQ coerentes. O contorno laranja mostra o foco acessível após teste da busca.
- Regressão do importador de issues adicionada em seguida e validada localmente; o CI do próximo commit confirma sua execução.

As capturas foram copiadas sem alteração do artifact de execução. Não representam sessão de usabilidade com colega, aprovação do professor, comparação com Figma ou produto de certificação completo. O teste de prontidão retorna falso, pois a amostra não seleciona os 12 temas.
