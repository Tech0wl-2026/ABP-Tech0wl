# Definition of Done (DoD) — quando uma issue está pronta

Uma issue só está **pronta** quando cumpre todos os itens gerais e os do seu tipo. Só então ela é **fechada** e o cartão vai para **Done**, no mesmo dia do merge.

A adoção destes critérios pela equipe é registrada na [issue #1](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/1). Para começar uma issue, veja a [Definition of Ready](DEFINITION_OF_READY.md). As regras do board estão em [QUADRO.md](QUADRO.md).

## 1. Para qualquer issue

- [ ] Todos os **critérios de aceite** da issue atendidos e marcados.
- [ ] Trabalho feito numa branch `feat/issue-N-descricao` criada a partir da `develop`.
- [ ] **PR para a `develop`** com `Closes #N` e descrição do que mudou.
- [ ] **CI verde** no PR.
- [ ] **Revisão de outro integrante**: aprovação ou comentário no PR, e os pontos levantados resolvidos.
- [ ] **Evidência** linkada na issue: PR, print ou arquivo em `docs/evidencias/`.
- [ ] Documentação relacionada atualizada (README, API, funcionalidades, dicionário).
- [ ] Sem senhas, tokens ou dados reais de candidatos no repositório.
- [ ] O que ainda falta registrado em comentário na issue ou em nova issue.
- [ ] **Issue fechada** e cartão em **Done** no mesmo dia do merge.

## 2. Código (frontend e backend)

- [ ] Caminho de sucesso e de erro testados (ex.: login certo e senha errada).
- [ ] Frontend usa a **API como fonte dos dados**: nada de conta, senha, questão, gabarito ou nota no `localStorage`.
- [ ] HTML, CSS e JavaScript sem framework; funciona em computador e celular (393 px e 320 px, sem rolagem lateral).
- [ ] Na API: acesso pelo token, prazo de 150 s, resposta única, nota calculada no servidor e SQL parametrizado.
- [ ] Testes existentes continuam passando (`npm test` no backend e testes de interface).
- [ ] Funciona pelo Docker Compose (`docker compose up --build`).

## 3. Banco de dados e UML

- [ ] Modelos conceitual, lógico e físico, DER e dicionário coerentes com o schema `servidor` usado pela API.
- [ ] Atributos, tipos, chaves, obrigatoriedade, cardinalidades e restrições conferidos.
- [ ] DDL executado no PostgreSQL sem erro.
- [ ] Arquivo editável (Astah, PlantUML, .dot) e exportação legível (PNG ou PDF) versionados.
- [ ] Coerente com o Figma e com as telas implementadas.

## 4. Design (Figma)

- [ ] Telas em computador e celular, com navegação entre elas.
- [ ] Estados de erro, tempo esgotado, interrupção e retomada, resultado, certificado e validação pública.
- [ ] Exportação datada em `docs/design/` e link do Figma atualizado.
- [ ] Comparado com a tela implementada; diferenças anotadas.

## 5. Conteúdo (questões e apostilas)

- [ ] Uma alternativa correta por questão, enunciado claro e coerente com a apostila do tema.
- [ ] Imagem associada, legível e com procedência registrada.

## 6. Documentação

- [ ] Explica o funcionamento **atual**, sem apresentar planejamento como pronto.
- [ ] Links válidos e fontes identificadas.
- [ ] Registros de reuniões com data e participantes confirmados.

## 7. Fechamento da sprint

- [ ] Nenhuma issue da sprint aberta sem decisão (fechada ou movida com o motivo comentado).
- [ ] Review e Retrospectiva registradas com data, presentes, feedback real e ações com responsável.
- [ ] Melhoria da sprint anterior conferida.
- [ ] Burndown atualizado a partir das issues fechadas.
- [ ] Versão do Figma e fontes dos modelos guardadas.
- [ ] `develop` integrada à `main` com o CI verde e tag `sprint-N` criada no commit entregue.
