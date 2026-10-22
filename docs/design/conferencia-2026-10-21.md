# Conferência das páginas — 21/10/2026

Home, Curso e Sobre nós foram implementadas a partir dos seis [frames de referência](figma.md), preservando navegação, ordem das seções, cores, fontes e composição de cada tamanho. A equipe revisou a entrega e Breno confirmou o aceite para integração à `main` no [PR #120](https://github.com/Tech0wl-2026/ABP-Tech0wl/pull/120).

## Diferenças conhecidas

| Recurso | Uso nesta versão |
|---|---|
| Estudante da Home | Exportação original do Figma, em `estudante.png`. |
| Retratos dos docentes | Imagem ilustrativa gerada, com composição e cores próximas às referências. Não representa integrantes ou professores reais. |
| Ilustrações dos módulos | Vetores locais de Scrum, Kanban, boas práticas e agilidade. As imagens originais não ficaram acessíveis. |
| Marca do rodapé e marca educacional | Vetores locais de apoio à composição. Não são os arquivos originais da identidade visual. |
| Certificado | Vetor ilustrativo, identificado como modelo sem validade. |
| Iluminação, faixa e brilho dos retratos | Gradientes e padrões CSS no lugar do runtime dos shaders indisponível. |
| Cabeçalho de Sobre nós no mobile | Exibe “Sobre nós”, coerente com a página. O frame mobile usa “Conheça o nosso curso” nesse ponto. |
| Textos | Pequenas correções de grafia; depoimentos mantêm textos e nomes do protótipo e são identificados como ilustrativos. |
| Botões | “Começar” leva à apresentação do curso; “Matricula-se” leva às informações da certificação. Não simulam cadastro concluído. |
| Regras da certificação | Bloco expansível com as regras de 150 segundos e 65% e o estado de integração das telas. Acrescenta informação funcional ao desenho. |

As substituições foram autorizadas por Breno. A tabela registra as diferenças aceitas nesta versão e os recursos originais que ainda podem ser recuperados.

## Retratos ilustrativos

Os retratos são imagens geradas de pessoas fictícias para compor esta versão. O arquivo `frontend/assets/figma/docentes.png` é compartilhado pelas três posições do CSS. As fotos originais do Figma poderão substituí-lo quando estiverem disponíveis.

## Validação

Os testes cobrem as três páginas em 1440, 820, 600, 393 e 320 px, imagens/fontes, navegação ativa, ausência de rolagem horizontal, separação dos módulos e do certificado e acesso sem JavaScript. Capturas desktop/mobile orientaram a revisão visual local. Os resultados e as capturas ficam nos artefatos do workflow de validação para cada commit publicado.

A revisão do grupo foi confirmada por Breno. O roteiro e o registro dos testes de uso estão em [usabilidade](usabilidade.md). O review da Sprint 1 está em [sprints](../sprints/review-sprint-1-2026-10-21.md).
