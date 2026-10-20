# Base de questões e revisão editorial

Estado: **4 questões demonstrativas de um tema**, não 48 questões finais. O [seed](../../database/seed.sql) usa fonte primária Scrum Guide 2020 e imagens SVG locais. Todas as corretas da amostra são A para facilitar inspeção; distribuir alternativas na base final e validar qualidade dos distratores. A prova real não está disponível.

## Critério por questão

- Identificador, tema, posição 1–4 e versão.
- Enunciado contextualizado, sem ambiguidade e coerente com o estudo.
- Imagem útil, descrição alternativa e fonte/licença confirmada.
- Quatro alternativas A/B/C/D, apenas uma correta e distratores plausíveis.
- Justificativa e fonte técnica primária com seção/data de consulta.
- Autor, revisor e revisão pedagógica registrada na issue.

O DDL permite rascunhos incompletos e só publica questão com quatro alternativas e uma correta. Questão utilizada e suas alternativas não são alteradas; despublicar e criar nova versão preserva o histórico. A base só fica pronta quando a seleção completa passa na view de prontidão.

Conteúdo, gabarito e justificativa devem ficar no servidor durante resolução. Servir o seed ou enviar a alternativa correta antes de encerrar a questão violaria a integridade da avaliação.

## Seleção temática definida

Os [12 temas oficiais do projeto](temas.md) foram definidos em 20/10/2026. Esta base continua sendo amostra técnica, não o conjunto final de 48 questões. A distribuição final será de quatro questões revisadas por tema, ligadas ao conteúdo didático correspondente.
