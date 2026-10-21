# Como contribuir

## Assumir uma atividade

1. Consultar [Backlog](docs/Gestao/BACKLOG.md) e escolher uma issue da Sprint atual sem responsável.
2. Ler critérios de aceite e dependências. Atribuir a issue a si em **Assignees**; se a permissão não permitir, solicitar a atribuição ao Scrum Master.
3. Registrar o início e o plano na issue e mover o item no Project para **Em andamento**. Na Daily, registrar apenas a atividade do dia, conforme o [modelo simples](docs/Daily%20Scrum/TEMPLATE.md).
4. Manter uma atividade principal por pessoa em andamento; revisar o limite com a equipe.

## Branches

| Branch | Uso |
|---|---|
| `main` | Base estável e entregas revisadas |
| `develop` | Integração do trabalho da equipe |
| `sprint/1-prototipo-modelagem` | Referência da entrega da Sprint 1 |
| `sprint/2-certificacao` | Referência da entrega da Sprint 2 |
| `sprint/3-entrega-final` | Referência da entrega da Sprint 3 |
| `docs/issue-N-descricao` | Figma, UML, banco e documentação de uma issue |
| `feat/issue-N-descricao` | Implementação funcional de uma issue |
| `fix/issue-N-descricao` | Correção rastreável |

Criar branches de atividade a partir do `develop` atualizado. Atualize as branches de sprint no fechamento de cada entrega.

```bash
git clone https://github.com/Tech0wl-2026/ABP-Tech0wl.git
cd ABP-Tech0wl
git switch develop
git pull --ff-only
git switch -c docs/issue-N-descricao
```

Substituir `N` pelo número real da issue e a descrição por texto curto sem espaços.

## Commits e Pull Requests

Escreva mensagens curtas que digam o que mudou, como `Adiciona diagrama de classes da certificação` ou `Corrige a validação do CPF no cadastro`.

Abrir PR para `develop` com contexto, requisitos, evidências e validação. Vincular a issue com `Closes #N`. Solicitar revisão de outro integrante e aplicar a [Definition of Done](docs/Gestao/DEFINITION_OF_DONE.md) antes de integrar. Confira também as proteções de branch configuradas no GitHub.

## Documentação e dados

- Figma, UML e banco devem cobrir RF01 a RF21 já na Sprint 1.
- Versionar UML editável, exports, DER, dicionário e SQL; links do Figma ficam na documentação de protótipo.
- Registrar reuniões reais em `docs/Daily Scrum/AAAA-MM-DD.md`.
- Não versionar senhas, tokens, dados reais de candidatos ou arquivos `.env`.
- Atualizar documentação e rastreabilidade junto com a alteração.

## Fechamento

Conclua a issue depois de conferir os critérios de aceite e anexar as evidências. Registre bloqueios na issue e avise a equipe na Daily.
