# Frontend

Telas do Aprendizagem Ágil em HTML, CSS e JavaScript, com versões para computador e celular.

## Páginas públicas

| Página | Conteúdo |
|---|---|
| [index.html](index.html) | Home, apresentação, benefícios e docentes. |
| [curso.html](curso.html) | Módulos, depoimentos ilustrativos e informações do certificado. |
| [sobre.html](sobre.html) | Apresentação do projeto e da equipe Tech0wl. |

## Acesso

| Página | Conteúdo |
|---|---|
| [cadastro.html](cadastro.html) | Cadastro com nome, CPF, e-mail e senha, com validação dos campos. |
| [login.html](login.html) | Entrada com CPF e senha. |
| [esqueci_senha.html](esqueci_senha.html) e [senha-nov.html](senha-nov.html) | Recuperação e definição de nova senha. |

## Portal do candidato

| Página | Conteúdo |
|---|---|
| [home.html](home.html) | Área de estudos e andamento da prova, com pausa e retomada. |
| [curso-portal.html](curso-portal.html) | Módulos de estudo do portal. |
| [material.html](material.html) | Material didático por tema. |
| [questao.html](questao.html) | Questão com imagem, quatro alternativas e cronômetro de 150 segundos. |
| [resultado.html](resultado.html) | Nota final e situação de aprovação (mínimo de 65%). |
| [certificado.html](certificado.html) | Emissão do certificado em PDF. |
| [perfil.html](perfil.html) | Dados do candidato e progresso na trilha. |
| [feedback.html](feedback.html) | Avaliação e comentários sobre o curso. |

Nesta etapa, as telas do portal guardam os dados no navegador (localStorage). A integração com a [API](../docs/Tecnico/API.md) está prevista para a Sprint 3.

## Organização

| Pasta ou arquivo | Conteúdo |
|---|---|
| [src/js](src/js) | Scripts das telas de acesso e do portal. |
| [src/css](src/css) | Estilos das telas de acesso e do portal. |
| [src/images](src/images) | Imagens das telas e das questões. |
| [css](css) e [js](js) | Estilos e script das páginas públicas. |
| [assets](assets) | Fontes, ilustrações e recursos do layout. |
| [arquivosextras](arquivosextras) | Versões anteriores das páginas públicas, mantidas como referência. |
| [Dockerfile](Dockerfile) | Imagem do frontend. |
| [nginx.conf](nginx.conf) | Servidor das páginas e encaminhamento de `/api/`. |

[Como abrir](../COMECAR-AQUI.md) · [Referências do Figma](../docs/design/figma.md)
