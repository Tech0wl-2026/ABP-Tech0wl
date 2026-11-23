# Evidência: medição e melhoria do carregamento das páginas

Issue [#75](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/75) — RNF02. Medição de 23/11/2026, pelo Scrum Master (Breno).

## Como foi medido

- Navegador Chromium (Playwright), cache vazio, uma aba por página.
- Rede limitada a **1,6 Mbps de download e 150 ms de latência** (perfil de 3G rápido), para simular um celular.
- **Peso:** bytes transferidos até o evento `load`. **Carregamento:** `loadEventEnd` da página.
- Mesmas condições antes e depois, na `develop` de 23/11/2026.
- Páginas do portal abertas com uma sessão fictícia. Algumas voltam ao login porque o token não é válido, por isso pesam pouco.

## O problema encontrado

Imagens muito maiores do que o tamanho exibido:

| Imagem | Antes | Onde aparece | Problema |
|---|---|---|---|
| `logoDT.png`, `logoSM.png`, `logoPO.png` | 1,9 MB, 1,7 MB e 1,6 MB (1254 × 1254 px) | Página inicial, círculos de 110 px | 11 vezes maior que o necessário |
| `certificado-modelo.png` | 1,8 MB | Página do curso e PDF do certificado | PNG para uma imagem com aparência de foto |
| `fundo.png` | 1,1 MB | Fundo da página inicial, do curso e do sobre | PNG com canal de transparência sem uso |
| `fig-principios.png`, `fig-ferramentas.png`, `fig-xp.png`, `triangulos.png`, `curso-ferramentas.png` | 170 a 330 KB cada | Estudos e página inicial | PNG sem compressão de paleta |

## O que foi feito

- Logos reduzidos para 330 × 330 px (3× o tamanho exibido, nítido em telas retina) e com paleta otimizada.
- `fundo` e `certificado-modelo` convertidos para JPEG progressivo, mantendo o tamanho em pixels (o PDF do certificado continua com a mesma resolução).
- Figuras dos estudos com paleta de 256 cores e compressão máxima.
- `loading="lazy"` na imagem do certificado da página do curso, que fica abaixo da dobra.
- As imagens foram comparadas lado a lado antes do envio, sem perda visível.

## Resultado

| Página | Peso antes | Peso depois | Carregamento antes | Carregamento depois |
|---|---:|---:|---:|---:|
| index.html | 6.813 KB | 450 KB | 35,2 s | 2,6 s |
| curso.html | 2.364 KB | 399 KB | 12,4 s | 2,4 s |
| material.html | 226 KB | 73 KB | 0,6 s | 0,3 s |
| sobre.html | 29 KB | 28 KB | 0,9 s | 0,9 s |
| login.html | 76 KB | 76 KB | 0,9 s | 1,0 s |
| cadastro.html | 35 KB | 35 KB | 0,8 s | 0,9 s |
| curso-portal.html | 164 KB | 163 KB | 1,2 s | 1,3 s |
| questao.html | 126 KB | 126 KB | 1,2 s | 1,2 s |
| certificado.html | 31 KB | 31 KB | 0,7 s | 0,7 s |

**A página inicial ficou 15 vezes mais leve e carrega 13 vezes mais rápido** no 3G simulado. A pasta de imagens caiu de cerca de 12 MB para 3 MB.

## Questões da prova

As 48 imagens das questões servidas pela API (`backend/assets/questoes/*.svg`) são SVG e não passaram por esta otimização. Na tela de questão, a imagem mais pesada tem 59 KB e a página carrega em 1,2 s no 3G simulado.

## Conferência

- Testes de interface (`testes/frontend.spec.mjs`): 26 de 27 aprovados, incluindo "Todas as imagens devem carregar" nas páginas públicas em cinco larguras de tela.
- A única falha é o teste de cadastro, que ainda espera o cadastro no navegador. Desde a integração do login com a API (#105), esse teste precisa do backend rodando. A falha acontece igual antes e depois desta mudança.

## Como repetir

1. Abrir a página no Chrome, F12 → **Network** → marcar **Disable cache** → limitar a rede para **Fast 4G** ou **3G**.
2. Recarregar e anotar o total transferido e o tempo de **Load** no rodapé da aba.
3. Ou rodar o **Lighthouse** (F12 → Lighthouse → Mobile) e comparar a nota de desempenho.
