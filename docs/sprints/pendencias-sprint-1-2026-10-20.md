# Pendências da Sprint 1 — 20/10/2026

> Registro histórico de 20/10. Consulte o [review de 21/10](review-sprint-1-2026-10-21.md) para o estado atualizado; os acessos desktop/mobile foram liberados.

Prazo: **22/10/2026**. Registro atualizado após a revisão das sequências e a definição dos temas. O andamento e os responsáveis atuais ficam nas issues; as reuniões de Review e Retrospectiva têm registros próprios.

## Atualizações realizadas

- Sequências corrigidas em [PlantUML e imagens](../UML/sequencias/README.md), incluindo retorno do cadastro pelo controlador, falhas de cadastro/login, resposta, expiração, interrupção, retomada, resultado/certificado e validação pública.
- Caso de uso estável e classes de Thiago preservados. O Astah de Abdi com as sequências iniciais está preservado como [rascunho](../UML/rascunhos/README.md).
- [12 temas definidos](../conteudo/temas.md), com ordem contínua 1–12 e numeração da lista original, também em JSON. D02 está resolvida quanto à seleção; isso não resolve pesos, escala ou novas tentativas.

## O que falta para finalizar a Sprint 1

| Frente | Pendência concreta | Issues relacionadas |
|---|---|---|
| Figma | Publicar URL/versão, navegação RF01–RF21, estados de erro/retorno e frames mobile/desktop; revisar com o grupo | #3, #7, #11, #16, #22, #30, #34, #48, #53, #60, #68, #73, #93 |
| UML no Astah | Incorporar as sequências corrigidas ao `.asta` e conferir/exportar no editor; registrar review contra Figma e banco. O arquivo nativo não foi corrigido nesta publicação | #4, #8, #12, #17, #23, #26, #31, #37, #50, #55, #62, #72, #95 |
| Modelagem | Revisão conjunta de DER, lógico, DDL, dicionário e UML; alinhar nomes/tipos, cardinalidades e propostas de regra | #5, #9, #13, #18, #24, #27, #38, #51, #54, #61, #71, #82, #94 |
| Decisões | Definir backend/driver, sessão e detecção de interrupção, pesos/escala/arredondamento, novas tentativas, campos públicos/logs e registrar respostas reais do professor/PO | #18, #87, #92, #95, #101, parte restante da #102 |
| Gestão | Validar DoD e planejamento; registrar estimativas/dependências revisadas e evidência de aceite por issue | #1, #78, #79, #80, #81 |
| Reuniões | Dailys simples e reais, revisão do índice de 16/10, Review/Retrospectiva quando realizadas; não usar rascunhos fictícios como atas | #86 |
| Entrega | Conferir critérios RF01–RF21, versão final do Figma/modelos, CI do hash entregue, participação verificável, vídeo e registro de fechamento; consolidar branch/tag da Sprint | #106 e docs/sprints/sprint-1.md |

O roteiro de vídeo de aproximadamente quatro minutos foi preparado fora do repositório. A gravação precisa usar os artefatos e a versão realmente entregues.

## Issue #102

Já estava fechada. A seleção foi agora registrada e pode comprovar seu primeiro critério. Os critérios de nota/tentativas e alinhamento com professor/PO ainda precisam de evidência. Nenhuma issue ou status do Project foi alterado automaticamente nesta publicação.

## Próximas Sprints

Continuam pendentes implementação e integração de cadastro/login, estudos, motor da prova, resultado, certificado/QR, validação pública e histórico/progresso. Também falta produzir/revisar os materiais e as 48 questões dos temas definidos. Na Sprint 1, o aceite dessas atividades se concentra no protótipo e na modelagem.
