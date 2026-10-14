# Como contribuir

## Assumir uma atividade

1. Consultar [Backlog](documentos/Gestao/BACKLOG.md) e escolher uma issue da Sprint atual sem responsável.
2. Ler critérios de aceite e dependências. Atribuir a issue a si em **Assignees**; se a permissão não permitir, solicitar a atribuição ao Scrum Master.
3. Registrar o início e o plano na issue e na Daily. Quando o GitHub Project estiver configurado, mover para **Em andamento**.
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

Criar branches de atividade a partir do `develop` atualizado. As branches de Sprint começam na mesma base e serão atualizadas no fechamento da entrega; criar a branch não declara conclusão da Sprint.

```bash
git clone https://github.com/Tech0wl-2026/ABP-Tech0wl.git
cd ABP-Tech0wl
git switch develop
git pull --ff-only
git switch -c docs/issue-N-descricao
```

Substituir `N` pelo número real da issue e a descrição por texto curto sem espaços.

## Commits e Pull Requests

Usar mensagens claras, por exemplo `docs: adiciona diagrama de classes da certificacao` ou `feat: implementa cadastro com CPF`.

Abrir PR para `develop` com contexto, requisitos, evidências e validação. Vincular a issue com `Closes #N`. Solicitar revisão de outro integrante e aplicar a [Definition of Done](documentos/Gestao/DEFINITION_OF_DONE.md) antes de integrar. As regras de revisão descritas aqui são uma política proposta; proteção de branch depende da configuração do GitHub.

## Documentação e dados

- Figma, UML e banco devem cobrir RF01 a RF21 já na Sprint 1.
- Versionar UML editável, exports, DER, dicionário e SQL; links do Figma ficam na documentação de protótipo.
- Registrar reuniões reais em `documentos/Daily Scrum/AAAA-MM-DD.md`.
- Não versionar senhas, tokens, dados reais de candidatos ou arquivos `.env`.
- Atualizar documentação e rastreabilidade junto com a alteração.

## Fechamento

Uma issue aberta é planejamento, não evidência de implementação. Só concluir após validar critérios de aceite e anexar evidências. Bloqueios devem ser descritos na issue e comunicados na Daily.
