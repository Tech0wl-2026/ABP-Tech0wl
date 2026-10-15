# Temas da certificação

A seleção final dos 12 temas e sua ordem precisa ser confirmada com Gabriel A./PO. O Daily menciona trabalho em conteúdo, mas não identifica a lista aprovada. Não foi criada uma lista fictícia de temas supostamente escolhidos.

O seed contém **apenas um tema de demonstração, Fundamentos do Scrum**, com `selecionado=false`. Os testes criam temporariamente outros temas artificiais dentro de uma transação revertida; esses dados não fazem parte do conteúdo do produto.

Antes de liberar uma tentativa, o backend deve consultar `v_prontidao_base` e exigir 12 temas selecionados, 4 questões publicadas por tema e conteúdo de estudo publicado em todos. A view não bloqueia uma tentativa sozinha; a aplicação ainda precisa integrar a checagem na transação de início.

Cada tema final deve registrar: título/ordem, objetivos de aprendizagem, conteúdo com imagens/fontes, quatro questões revisadas, autor e revisor. Não publicar material como concluído antes dessa revisão.
