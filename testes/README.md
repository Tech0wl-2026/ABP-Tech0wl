# Testes

Esta pasta reúne os testes do banco de dados, da interface e do importador de issues.

| Arquivo | Conteúdo |
|---|---|
| [database.sql](database.sql) | Verificações das regras e restrições do PostgreSQL, com rollback dos dados de teste. |
| [frontend.spec.mjs](frontend.spec.mjs) | Testes de navegação, busca, layout responsivo e uso sem JavaScript com Playwright. |
| [test_importador.py](test_importador.py) | Testes para preservar alterações nas issues ao executar o importador. |
| [EXECUCAO.md](EXECUCAO.md) | Comandos, requisitos e cobertura dos testes. |

A execução no GitHub Actions está definida no [workflow de validação](../.github/workflows/validar-projeto.yml).

Os testes do backend ficam em [backend/test](../backend/test), com instruções no [guia de instalação](../docs/Tecnico/INSTALACAO.md).
