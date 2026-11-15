# Banco de questões

A API utiliza os 12 temas definidos pelo grupo, com quatro questões por tema, uma imagem por questão e quatro alternativas A/B/C/D. O banco tem 48 questões e 192 alternativas.

- [Catálogo completo com gabarito e origem](../../database/servidor/questoes.json)
- [Seed executado pelo backend](../../database/servidor/seed.sql)
- [Imagens das questões](../../backend/assets/questoes)
- [Temas escolhidos](temas.md)

## Origem e revisão

As 48 questões dos doze temas escolhidos dentre os dezesseis opcionais foram produzidas pela equipe. --att de arquivo--

Os temas foram definidos pela equipe em 20/10. Na revisão das questões, foram avaliados: clareza, contexto, coerência com o estudo, gabarito, fontes e direitos de uso das imagens.
--att de arquivo após revisão e remodelação de html e css--

## Critério por questão

- Um enunciado claro, coerente com o tema e com a imagem.
- Quatro alternativas, com exatamente uma correta e distratores plausíveis.
- Imagem útil para a leitura do cenário.
- Fundamentação técnica e revisão registrada pela equipe.

O catálogo e o seed não são arquivos públicos do servidor web. A API retorna alternativas sem indicar o gabarito durante a resolução. O gabarito aparece no feedback e no histórico após o encerramento.

A amostra anterior de quatro questões fica em `database/seed.sql`, vinculada ao modelo de referência em `public`. Ela não é usada pelo backend. Os detalhes dessa separação estão na [arquitetura](../Tecnico/ARQUITETURA.md).
