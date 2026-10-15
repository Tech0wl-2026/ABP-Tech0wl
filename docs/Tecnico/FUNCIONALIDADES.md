# Funcionalidades implementadas e planejadas

| Parte | Estado real | Evidência |
|---|---|---|
| Página inicial informativa | Implementada: conteúdo, navegação mobile e busca nas dúvidas | `frontend/index.html`, CSS/JS e testes de navegador |
| Modelo físico | Executável em banco vazio com seed demonstrativo | `database/schema.sql`, `seed.sql` e testes SQL |
| Modelo conceitual/lógico e dicionário | Proposta técnica editável para revisão da equipe | `docs/database/` |
| Execução em containers | Nginx estático e PostgreSQL; serviços sem integração entre si | `compose.yaml` e CI |
| Cadastro/login/estudos reais | Não implementados | Planejados Sprint 2 |
| Prova, sorteio, prazo e retomada via API | Não implementados; DDL prevê invariantes | Planejados Sprint 2 |
| Resultado, certificado, QR e validação pública | Não implementados; modelo e protótipo de referência | Planejados Sprint 3 |
| Figma completo | Não comprovado: URL e versão ausentes | `docs/design/figma.md` |

As regras exibidas na página descrevem o formato exigido da certificação; não há botão que simule cadastro, prova ou emissão inexistente.
