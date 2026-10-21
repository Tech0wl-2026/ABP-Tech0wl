# Protótipos do portal

O frontend deve seguir os protótipos escolhidos pela equipe. Layout, cores, fontes, imagens, espaçamentos e navegação devem ser conferidos contra a versão correspondente antes da publicação.

| Versão | Protótipo | Situação em 21/10/2026 |
|---|---|---|
| Celular | [Protótipo da ABP](https://www.figma.com/proto/BfNaCOc4zGZZ3Vgqlhtmr1/Prot%C3%B3tipo-da-ABP?node-id=280-11646&t=gxgwTafOdJ1tIaLq-1) | Link recebido. A integração ainda retorna falta de permissão de edição para a conta conectada. |
| Computador | [ABP](https://www.figma.com/proto/kCNzSpVnEBPcjUV1AbgbwC/ABP?node-id=0-1&t=zWujp4WTEMi4yCTi-1) | Estrutura, imagens de referência e código de contexto consultados pela integração. |

## Referências desktop

| Página | Frame | Tamanho no Figma |
|---|---|---|
| Home | `4:38` | 1440 × 4496 |
| Sobre nós | `152:2` | 1440 × 3386 |
| Cursos | `152:45` | 1440 × 6256 |

A página inicial tem fundo preto, iluminação azul e roxa no topo, navegação em formato de cápsula, chamada “Amplie seus conhecimentos e impulsione sua carreira”, ilustração de estudo, faixa roxa, benefícios, retratos e rodapé. Os detalhes estão na [referência visual](sistema-visual.md).

## Preparação da implementação

A leitura do desktop foi concluída para as três páginas acima. O download das imagens indicadas pela integração retornou HTML com “Site Unavailable” no lugar dos arquivos, portanto esses downloads não podem ser usados como assets.

Os efeitos autorais também exigem os módulos de shader indicados na resposta do Figma. A leitura do recurso `file://shader-runtime-index.json/` falhou na conexão do servidor, e a descoberta dos recursos não disponibilizou esses módulos. Nenhum efeito foi substituído por aproximação.

Para continuar, é necessário obter os assets originais e liberar a leitura do arquivo mobile. As exportações reais podem ser mantidas em uma pasta de referências quando estiverem disponíveis. Versão de entrega, autoria, revisão dos fluxos e teste com colegas continuam a ser registrados pela equipe.

A interface azul anterior é provisória. Ela ainda não corresponde aos protótipos e não deve ser apresentada como implementação validada do Figma.

## Certificado

Os [estudos V1](../Prototipo/Prototipo-CertificadoV1.png) e [V2](../Prototipo/Prototipo-CertificadoV2.png) estão na pasta Prototipo. Eles são referências visuais; emissão e dados reais precisam seguir o resultado da avaliação.

[Fluxo de telas](fluxo-de-telas.md) · [Teste com colegas](usabilidade.md)
