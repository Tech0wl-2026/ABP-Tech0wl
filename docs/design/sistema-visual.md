# Referência visual do Figma

Os [protótipos desktop e mobile](figma.md) orientam as três páginas públicas do frontend.

| Elemento | Computador (1440 px) | Celular (393 px) |
|---|---|---|
| Abertura | Fundo preto e iluminação vertical azul, 1024 px de altura | Composição própria, 764 px de altura |
| Navegação | Cápsula `#c4c5d8`, item ativo branco, Jost 24 px | Cápsula de 249 × 30 px, Jost 16 px |
| Título de abertura | Joan 96 px | Joan 32 px |
| Títulos de seção | Julius Sans One | Mesma família, tamanhos do frame mobile |
| Textos | Kulim Park; Kumbh Sans em Sobre nós | Mesmas famílias, com larguras e quebras adaptadas |
| Depoimentos | Kreon | Kreon |
| Matrícula | Botão `#232596` | Mesmo fundo, botão de 148 × 38 px |
| Faixa da Home | Roxo `#7215c9` | Faixa compacta com texto e padrão lateral |
| Rodapé | Fundo `#21097e`, Jura e Gruppo | Mesmas cores e famílias, composição reduzida |

As oito famílias estão em `frontend/assets/fonts`, com as respectivas licenças OFL. Os arquivos foram obtidos do [repositório oficial Google Fonts](https://github.com/google/fonts/tree/main/ofl), nas pastas `joan`, `jost`, `juliussansone`, `kulimpark`, `kumbhsans`, `jura`, `gruppo` e `kreon`. O site não busca fontes externas durante a navegação.

A composição usa HTML/CSS sem framework, foco visível, link para pular ao conteúdo e navegação utilizável sem JavaScript. O contexto original do Figma foi traduzido para essa estrutura; as capturas do protótipo servem apenas para comparação.

Os shaders, alguns vetores e fotografias tiveram [substituições autorizadas](conferencia-2026-10-21.md). As imagens da avaliação continuam em `backend/assets/questoes`; a amostra anterior fica em `frontend/assets/questoes`.
