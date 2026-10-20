# Temas definidos da certificação

Seleção informada por Breno em **20/10/2026**, como definição do grupo para o projeto. Os mesmos 12 temas devem organizar a área de estudos e a avaliação.

| Ordem de apresentação | Número na lista original | Tema | Questões previstas |
|---:|---:|---|---:|
| 1 | 1 | Fundamentos da Agilidade | 4 |
| 2 | 3 | Introdução ao Scrum | 4 |
| 3 | 4 | Papéis do Scrum | 4 |
| 4 | 5 | Eventos do Scrum | 4 |
| 5 | 6 | Artefatos do Scrum | 4 |
| 6 | 8 | Gestão do Product Backlog | 4 |
| 7 | 9 | Kanban | 4 |
| 8 | 10 | Planejamento Ágil | 4 |
| 9 | 11 | Métricas Ágeis | 4 |
| 10 | 13 | Extreme Programming (XP) | 4 |
| 11 | 14 | Ferramentas para Equipes Ágeis | 4 |
| 12 | 15 | Boas Práticas em Projetos Ágeis | 4 |

**Total: 12 temas e 48 questões previstas.** Os números originais 2, 7 e 12 não foram selecionados. A ordem contínua de 1 a 12 segue a sequência enviada; não altera os números da lista de origem. Ela é compatível com o campo `tema.ordem`, limitado a 1–12 no modelo atual.

O [catálogo JSON](temas.json) guarda nome, ordem e número original. A seleção dos temas está definida; não significa que todo o conteúdo didático ou as 48 questões estejam concluídos.

## Próximas entregas de conteúdo

Para cada tema, produzir/revisar objetivos, material didático com imagens/fontes e quatro questões contextualizadas. Cada questão exige imagem, A/B/C/D, uma correta, justificativa e revisão. Registrar autor/revisor e evidência na issue correspondente.

O `database/seed.sql` continua como **amostra técnica anterior**, com um tema de demonstração e quatro questões de Scrum. Não foi trocado por conteúdo final nem habilitada uma prova incompleta. Na implementação, carregar a seleção oficial no banco por migração/importação revisada; não executar o seed inicial em banco já utilizado nem sobrescrever histórico.

O backend deverá conferir `v_prontidao_base`: 12 temas selecionados, quatro questões publicadas por tema e conteúdo de estudo publicado em todos. A view não inicia nem libera uma prova sozinha.

## Decisões ainda pendentes

A seleção resolve **D02** e o primeiro critério da issue [#102](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/102). Pesos/escala/arredondamento (D03), novas tentativas (D05) e os demais alinhamentos com professor/PO continuam pendentes. Não tratar o fechamento prévio da issue como comprovação automática dessas decisões.
