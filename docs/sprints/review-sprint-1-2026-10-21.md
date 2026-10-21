# Review da Sprint 1 — 21/10/2026

Escopo: as 50 issues da Sprint 1, de 28/09 a 22/10/2026. A revisão parte da `develop` em `6d4b04675ddc5dfa35a68c6bfbe2957cd01ef587` e considera as páginas e a documentação adicionadas nesta entrega. O estado e os checklists das issues foram consultados em 21/10. Os checklists abaixo registram a situação consultada naquela data; o andamento atual fica no Project.

## O que já está disponível

- Modelos conceitual/lógico/físico, DER, dicionário, DDL e consultas em [database](../database/README.md), com validações automatizadas do modelo de referência.
- Casos de uso, cinco arquivos de classes do Astah, complementos e seis sequências corrigidas em PlantUML, PNG e SVG em [UML](../UML/README.md). Os arquivos de Thiago foram preservados.
- Os [12 temas escolhidos](../conteudo/temas.md), backlog, rastreabilidade, planejamento, fluxo de branches e critérios de pronto.
- [Figma desktop e mobile](../design/figma.md) acessíveis. Home, Curso e Sobre nós comparadas e implementadas para computador e celular; impedimento de permissão resolvido. Há [substituições visuais identificadas](../design/conferencia-2026-10-21.md).
- Backend Node/Express e banco executável, entregues anteriormente. Os contratos da API ajudam a conferir a modelagem da Sprint 1.

## Pendências para fechar a Sprint 1

| Prioridade | O que precisa de comprovação ou ajuste | Referências |
|---|---|---|
| Alta | Percorrer o Figma completo contra RF01–RF21 nos dois tamanhos: cadastro inválido, login, estudos, sorteio, feedback, expiração, interrupção/retomada, progresso, aprovação/reprovação e validação pública válida/inexistente. O acesso e os seis frames públicos foram conferidos; a revisão integral dos demais estados e conexões não foi concluída. | #3, #7, #11, #16, #22, #30, #34, #48, #53, #60, #68, #73, #93, #106 |
| Alta | Consolidar as sequências corrigidas no Astah, quando esse for o formato exigido, e exportar a versão final. Os arquivos PlantUML são editáveis; o `.asta` de sequências continua arquivado como rascunho. | #4, #8, #12, #17, #23, #26, #31, #37, #50, #55, #62, #72 |
| Alta | Alinhar UML, DER e dicionário à arquitetura escolhida: o modelo de referência tem dez tabelas em `public`, a API usa cinco em `servidor`. Definir a modelagem de entrega e registrar diferenças de cardinalidade, tentativas, sessão, resultado e certificado; os schemas não sincronizam dados. | #18, #82, #94, #95, #101, #106; [arquitetura](../Tecnico/ARQUITETURA.md) |
| Alta | Completar a máquina de estados de certificação/tema/questão e documentar o mecanismo e os limites de interrupção. O servidor controla o prazo; fechamento/perda de conexão imediata ainda não são detectados pela interface. Na Sprint 1 a pendência é modelar esse comportamento. | #95 |
| Média | Registrar com professor/equipe escala de apresentação da nota, regra definitiva de novas tentativas, dados públicos e decisões de sessão/logs. O código contém escolhas técnicas, sem comprovar todos os alinhamentos. A #102 está fechada, mas contém dois critérios desmarcados. | #18, #87, #92, #101, #102; [decisões](../Gestao/DECISOES.md) |
| Média | Registrar revisão das estimativas e validação dos critérios de pronto pela equipe. | #1, #81 |
| Fechamento | Registrar aceite real, teste com colegas, contribuições verificáveis, vídeo e Review/Retrospectiva quando ocorrerem; fixar hash e tag após validação final. O fechamento depende das pendências listadas aqui. | #86, #106; [fechamento](sprint-1.md), [participação](../evidencias/sprint-1/participacao.md) |

Implementação da interface da prova, estudos, QR e emissão do documento do certificado, quando previstas nas próximas sprints, permanece pendente. Para a Sprint 1, esses fluxos precisam estar completos no protótipo e na modelagem.

## Conferência das 50 issues

A tabela resume os checklists consultados em 21/10. Abra a issue para ler cada critério e acompanhar as atualizações. A presença dos demais estados no Figma ainda precisa ser conferida.

| Issue | Atividade | Critérios marcados | Situação e próxima conferência |
|---|---|---|---|
| [#1](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/1) | Definir critérios de pronto da equipe | 3/4 | Registrar a validação dos critérios pela equipe. |
| [#3](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/3) | Prototipar a página inicial | 0/4 | Figma acessível. Conferir navegação, estados de erro e retorno, e registrar o aceite. |
| [#4](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/4) | Modelar em UML a navegação inicial | 3/4 | Conferir os fluxos, a exportação no formato acordado e o alinhamento com Figma e banco. |
| [#5](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/5) | Documentar os dados e decisões de persistência da tela inicial | 6/6 | Checklist completo; aguarda aceite na issue. |
| [#7](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/7) | Prototipar início e retorno à certificação | 0/4 | Figma acessível. Conferir navegação, estados de erro e retorno, e registrar o aceite. |
| [#8](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/8) | Modelar em UML início e retorno à certificação | 2/4 | Conferir os fluxos, a exportação no formato acordado e o alinhamento com Figma e banco. |
| [#9](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/9) | Modelar o estado da certificação e a retomada | 6/6 | Checklist completo; aguarda aceite na issue. |
| [#11](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/11) | Prototipar o cadastro e seus estados de validação | 0/4 | Figma acessível. Conferir navegação, estados de erro e retorno, e registrar o aceite. |
| [#12](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/12) | Modelar em UML o cadastro | 2/4 | Conferir os fluxos, a exportação no formato acordado e o alinhamento com Figma e banco. |
| [#13](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/13) | Modelar candidatos e unicidade do CPF | 6/6 | Checklist completo; aguarda aceite na issue. |
| [#16](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/16) | Prototipar login com CPF e senha | 0/4 | Figma acessível. Conferir navegação, estados de erro e retorno, e registrar o aceite. |
| [#17](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/17) | Modelar em UML autenticação e sessão | 1/4 | Conferir os fluxos, a exportação no formato acordado e o alinhamento com Figma e banco. |
| [#18](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/18) | Modelar os dados necessários à autenticação | 5/6 | Representar os atributos de autenticação e a política de sessão escolhida. |
| [#22](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/22) | Prototipar a avaliação por tema | 0/4 | Figma acessível. Conferir navegação, estados de erro e retorno, e registrar o aceite. |
| [#23](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/23) | Modelar em UML a execução da certificação | 2/4 | Conferir os fluxos, a exportação no formato acordado e o alinhamento com Figma e banco. |
| [#24](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/24) | Modelar certificação e temas respondidos | 6/6 | Checklist completo; aguarda aceite na issue. |
| [#26](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/26) | Modelar em UML o sorteio das questões | 2/4 | Conferir os fluxos, a exportação no formato acordado e o alinhamento com Figma e banco. |
| [#27](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/27) | Modelar temas e banco de questões | 6/6 | Checklist completo; aguarda aceite na issue. |
| [#30](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/30) | Prototipar a área de estudos | 0/4 | Figma acessível. Conferir navegação, estados de erro e retorno, e registrar o aceite. |
| [#31](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/31) | Modelar em UML a navegação nos estudos | 1/4 | Conferir os fluxos, a exportação no formato acordado e o alinhamento com Figma e banco. |
| [#34](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/34) | Prototipar feedback e continuidade após uma resposta | 0/4 | Figma acessível. Conferir navegação, estados de erro e retorno, e registrar o aceite. |
| [#37](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/37) | Modelar em UML resposta feedback e continuidade | 2/4 | Conferir os fluxos, a exportação no formato acordado e o alinhamento com Figma e banco. |
| [#38](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/38) | Modelar respostas e estados de resolução | 6/6 | Checklist completo; aguarda aceite na issue. |
| [#48](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/48) | Prototipar resultado final | 0/4 | Figma acessível. Conferir navegação, estados de erro e retorno, e registrar o aceite. |
| [#50](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/50) | Modelar em UML o cálculo do resultado | 1/4 | Conferir os fluxos, a exportação no formato acordado e o alinhamento com Figma e banco. |
| [#51](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/51) | Modelar os dados do resultado final | 4/4 | Checklist completo; aguarda aceite na issue. |
| [#53](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/53) | Prototipar aprovação e reprovação | 0/4 | Figma acessível. Conferir navegação, estados de erro e retorno, e registrar o aceite. |
| [#54](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/54) | Modelar a elegibilidade do certificado | 4/4 | Checklist completo; aguarda aceite na issue. |
| [#55](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/55) | Modelar em UML a emissão condicionada à aprovação | 2/4 | Conferir os fluxos, a exportação no formato acordado e o alinhamento com Figma e banco. |
| [#60](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/60) | Prototipar certificado eletrônico | 0/4 | Figma acessível. Conferir navegação, estados de erro e retorno, e registrar o aceite. |
| [#61](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/61) | Modelar certificado e identificador de validação | 6/6 | Checklist completo; aguarda aceite na issue. |
| [#62](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/62) | Modelar em UML a geração do certificado | 2/4 | Conferir os fluxos, a exportação no formato acordado e o alinhamento com Figma e banco. |
| [#68](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/68) | Prototipar o acompanhamento de progresso | 0/4 | Figma acessível. Conferir navegação, estados de erro e retorno, e registrar o aceite. |
| [#71](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/71) | Modelar o progresso da certificação | 6/6 | Checklist completo; aguarda aceite na issue. |
| [#72](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/72) | Modelar em UML o acompanhamento de progresso | 2/4 | Conferir os fluxos, a exportação no formato acordado e o alinhamento com Figma e banco. |
| [#73](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/73) | Prototipar estados responsivos para celular e computador | 0/4 | Figma acessível. Conferir navegação, estados de erro e retorno, e registrar o aceite. |
| [#78](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/78) | Organizar Product Backlog e rastreabilidade dos requisitos | 3/3 | Checklist completo; aguarda aceite na issue. |
| [#79](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/79) | Formalizar as metas e o planejamento das três Sprints | 3/3 | Checklist completo; aguarda aceite na issue. |
| [#80](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/80) | Documentar branches commits e fluxo de Pull Requests | 3/3 | Checklist completo; aguarda aceite na issue. |
| [#81](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/81) | Revisar estimativas com a equipe | 0/3 | Revisar estimativas e dependências com a equipe. Registrar divergências; valores normalizados da planilha são referência, não estimativa final confirmada. Vincular o PR e a revisão na issue. |
| [#82](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/82) | Consolidar modelo conceitual lógico físico e DDL PostgreSQL | 8/8 | Checklist completo; aguarda aceite na issue. |
| [#86](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/86) | Registrar Daily Scrum Review e Retrospective | 4/5 | Registrar Review e Retrospectiva reais, quando realizadas. |
| [#87](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/87) | Registrar dúvidas e alinhamentos com o cliente ou professor | 2/3 | Registrar respostas do professor/cliente sem inventar aprovação. |
| [#92](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/92) | Documentar arquitetura e escolher tecnologia do back-end | 2/3 | Definir a tecnologia do back-end com a equipe sem presumir stack já aprovada. |
| [#93](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/93) | Completar protótipo de validação pública e histórico | 0/3 | Prototipar validação de certificado válido e inexistente. Prototipar histórico incluindo certificações reprovadas e respostas sem alternativa escolhida. Integrar esses fluxos ao Figma completo de RF01 a RF21. |
| [#94](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/94) | Completar modelo de estudos imagens e histórico | 3/3 | Checklist completo; aguarda aceite na issue. |
| [#95](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/95) | Modelar máquina de estados e contratos da certificação | 2/4 | Diagramar estados de certificação, tema e questão. Registrar mecanismo proposto de detecção de interrupção e seus limites. |
| [#101](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/101) | Definir proteção dos dados no modelo e na arquitetura | 2/4 | Definir dados exibidos na validação pública e política de logs. Registrar decisões com a equipe; não marcar conformidade como concluída sem implementação. |
| [#102](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/102) | Selecionar os 12 temas e esclarecer regras em aberto | 1/3 | Issue fechada; ainda faltam confirmação das regras de nota/tentativas e registro do alinhamento com o professor. |
| [#106](https://github.com/Tech0wl-2026/ABP-Tech0wl/issues/106) | Revisar entrega integral do Figma UML e banco da Sprint 1 | 2/5 | Demonstrar protótipo navegável abrangendo RF01 a RF21. Verificar alinhamento entre protótipo, requisitos e modelo, incluindo todos os estados da prova. Registrar aceite real da equipe e evidências até 22/10. |

Na consulta: **49 abertas e 1 fechada**. **15 issues** têm o checklist técnico totalmente marcado e podem ser priorizadas para aceite: #5, #9, #13, #24, #27, #38, #51, #54, #61, #71, #78, #79, #80, #82, #94. O aceite dessas atividades fica registrado nas próprias issues. As outras **35** possuem critérios desmarcados, incluindo a #102 já fechada.

Esse levantamento cobre apenas a Sprint 1 e preserva o estado das issues e do Project.

## Revisão da entrega pública

Breno confirmou a revisão com o grupo e autorizou o merge do [PR #120](https://github.com/Tech0wl-2026/ABP-Tech0wl/pull/120). As páginas públicas e os atalhos do Project estão na `main`. Os demais critérios de protótipo, modelagem e fechamento seguem acompanhados nas issues.
