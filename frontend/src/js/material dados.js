// Conteúdo extraído das apostilas (DOCX). Para editar um texto, altere aqui.
const CURSOS = [
  {
    "id": "scrum",
    "modulo": 1,
    "cor": "#d5882f",
    "titulo": "Scrum",
    "mapa": "mapa-grupo-1.png",
    "secoes": [
      {
        "titulo": "1. Introdução ao Scrum",
        "lead": "Scrum é um framework leve para desenvolver, entregar e sustentar produtos em contextos complexos. Em vez de tentar prever tudo no início, a equipe trabalha em ciclos curtos, observa os resultados e ajusta as próximas decisões com base no que aprendeu.",
        "blocos": [
          {
            "titulo": "Empirismo e pilares",
            "texto": "O Scrum se apoia no empirismo: conhecimento construído a partir da experiência e decisões baseadas no que é observado. Seus três pilares são **transparência** (trabalho e situação compreensíveis), **inspeção** (examinar progresso e resultados com frequência) e **adaptação** (ajustar o plano ou a abordagem quando algo se desvia do esperado)."
          },
          {
            "titulo": "Valores do Scrum",
            "texto": "Compromisso, foco, abertura, respeito e coragem orientam as decisões e relações da equipe. Os valores não são etapas do processo: ajudam a criar um ambiente em que problemas podem ser expostos, debatidos e resolvidos."
          },
          {
            "titulo": "A Sprint e a Scrum Team",
            "texto": "A Sprint é o ciclo de trabalho com duração fixa de um mês ou menos. Dentro dela, a equipe transforma trabalho selecionado em um Incremento que atenda à Definition of Done. A Scrum Team é pequena, multifuncional e autogerenciável; não possui subequipes ou hierarquias internas definidas pelo framework."
          },
          {
            "titulo": "Como o conjunto funciona",
            "texto": "O Product Owner ajuda a maximizar o valor do produto; os Developers planejam e executam o trabalho; o Scrum Master promove a correta compreensão e efetividade do Scrum. Os eventos oferecem oportunidades regulares de planejar, acompanhar, inspecionar o resultado e melhorar o modo de trabalhar."
          },
          {
            "titulo": "O que não é Scrum",
            "texto": "Scrum não é apenas uma reunião diária, um quadro de tarefas ou uma sequência rígida de etapas. É um framework com elementos interdependentes. Retirar eventos, artefatos ou compromissos pode reduzir a transparência e dificultar a inspeção e a adaptação."
          }
        ],
        "chave": "----------------------------------------------------------------------------------------------------------------- Essência para lembrar: ciclos curtos + transparência + inspeção + adaptação + entrega de valor. -----------------------------------------------------------------------------------------------------------------",
        "figura": {
          "src": "fig-scrum.png",
          "alt": "Ciclo do Scrum: Sprint, Sprint Planning, Daily Scrum, Sprint Review e Sprint Retrospective"
        }
      },
      {
        "titulo": "2. Papéis do Scrum: responsabilidades (accountabilities)",
        "lead": "O Scrum Guide atual descreve três responsabilidades dentro de uma única Scrum Team: Product Owner, Scrum Master e Developers. Elas não representam departamentos isolados nem cargos hierárquicos; são responsabilidades complementares para gerar valor.",
        "blocos": [
          {
            "titulo": "Product Owner --- valor e prioridades",
            "texto": "É responsável por maximizar o valor do produto resultante do trabalho da Scrum Team e pela gestão eficaz do Product Backlog. Isso inclui desenvolver e comunicar o Product Goal, criar e tornar os itens compreensíveis e ordenar o backlog. Pode delegar atividades, mas continua responsável pelos resultados."
          },
          {
            "titulo": "Scrum Master --- efetividade do Scrum",
            "texto": "É responsável por estabelecer o Scrum conforme definido no Guia e por melhorar a efetividade da equipe. Atua como líder servidor: ajuda a equipe a compreender o framework, facilita eventos quando necessário, apoia a remoção de impedimentos e auxilia a organização a criar condições para o trabalho ágil. Não é simplesmente um gerente que distribui tarefas."
          },
          {
            "titulo": "Developers --- criar o Incremento",
            "texto": "São as pessoas comprometidas em criar qualquer aspecto de um Incremento utilizável a cada Sprint. Definem o plano da Sprint (Sprint Backlog), incorporam qualidade por meio da Definition of Done, adaptam o plano diariamente em direção ao Sprint Goal e responsabilizam-se mutuamente como profissionais."
          },
          {
            "titulo": "Responsabilidade compartilhada",
            "texto": "A Scrum Team é responsável por todas as atividades relacionadas ao produto --- colaboração com stakeholders, verificação, manutenção, operação, experimentação e outras. A composição e as competências devem ser suficientes para criar valor sem depender de uma estrutura de subequipes."
          },
          {
            "titulo": "Distinção importante",
            "texto": "O Product Owner prioriza o valor e a direção do produto; os Developers decidem como organizar o trabalho para criar o Incremento; o Scrum Master trabalha para que Scrum e equipe sejam efetivos. Nenhuma dessas responsabilidades anula a colaboração entre as três."
          }
        ],
        "chave": "---------------------------------------------------------------------------------------------------------- Memorização: Product Owner = valor; Scrum Master = efetividade; Developers = Incremento. ----------------------------------------------------------------------------------------------------------"
      },
      {
        "titulo": "3. Eventos do Scrum",
        "lead": "Os eventos formais criam regularidade e reduzem a necessidade de reuniões improvisadas. Cada evento é uma oportunidade de inspecionar algo e adaptar o que vem a seguir. A Sprint contém os demais eventos.",
        "blocos": [
          {
            "titulo": "Sprint",
            "texto": "É o contêiner de todos os eventos e do trabalho necessário para atingir o Sprint Goal. Tem duração fixa de um mês ou menos; uma nova Sprint começa imediatamente após a anterior. Durante a Sprint, mudanças não devem colocar em risco o Sprint Goal, a qualidade não diminui e o Product Backlog é refinado conforme necessário."
          },
          {
            "titulo": "Sprint Planning --- planejar",
            "texto": "Inicia a Sprint e responde a três questões: **por que** esta Sprint é valiosa (Sprint Goal), **o que** pode ser feito (itens selecionados) e **como** o trabalho será realizado. O plano é criado colaborativamente pela Scrum Team, considerando o objetivo, o backlog e a capacidade disponível."
          },
          {
            "titulo": "Daily Scrum --- acompanhar",
            "texto": "Evento de 15 minutos para os Developers inspecionarem o progresso em direção ao Sprint Goal e adaptarem o Sprint Backlog. Não precisa ser um relatório ao Scrum Master ou uma rodada obrigatória de três perguntas; seu foco é produzir um plano de ação para o próximo dia de trabalho."
          },
          {
            "titulo": "Sprint Review --- inspecionar o produto",
            "texto": "A Scrum Team e os stakeholders relevantes examinam os resultados da Sprint, discutem mudanças no ambiente e colaboram sobre o que fazer a seguir. É uma sessão de trabalho sobre o produto, não apenas uma apresentação ou demonstração formal."
          },
          {
            "titulo": "Sprint Retrospective --- melhorar o processo",
            "texto": "A equipe examina como a Sprint ocorreu em relação a pessoas, interações, processos, ferramentas e Definition of Done. Identifica mudanças úteis para melhorar qualidade e efetividade; pode convertê-las em ações concretas para a próxima Sprint."
          },
          {
            "titulo": "Distinção entre Review e Retrospective",
            "texto": "Review olha principalmente para o produto, resultados e próximos passos com stakeholders. Retrospective olha para a forma de trabalhar e como a equipe pode melhorar. Ambas apoiam a adaptação, mas têm focos diferentes."
          }
        ],
        "chave": "----------------------------------------------------------------------------------------------------------------------------- Sequência mental: planejar → inspecionar o progresso diariamente → revisar o produto → melhorar o processo. -----------------------------------------------------------------------------------------------------------------------------"
      },
      {
        "titulo": "4. Artefatos do Scrum",
        "lead": "Os artefatos representam trabalho ou valor e devem tornar informações importantes transparentes. Cada um possui um compromisso associado, que ajuda a equipe a manter foco e avaliar progresso.",
        "blocos": [
          {
            "titulo": "Product Backlog --- Product Goal",
            "texto": "É uma lista emergente e ordenada do que é necessário para melhorar o produto. Evolui conforme surgem novas necessidades e aprendizados. Seu compromisso é o **Product Goal**, que descreve um estado futuro do produto e dá direção de longo prazo à Scrum Team."
          },
          {
            "titulo": "Sprint Backlog --- Sprint Goal",
            "texto": "Reúne o **Sprint Goal** (por que a Sprint é valiosa), os itens do Product Backlog selecionados para a Sprint e o plano de entrega desses itens. É um plano feito pelos Developers para os Developers e muda conforme aprendem mais durante o trabalho. Seu compromisso é o Sprint Goal."
          },
          {
            "titulo": "Incremento --- Definition of Done",
            "texto": "É um passo concreto em direção ao Product Goal. Cada Incremento deve ser utilizável e integrar-se aos Incrementos anteriores, sendo verificado para não prejudicá-los. Só é considerado parte do Incremento quando atende à **Definition of Done (Definição de Pronto/Concluído)**, uma descrição formal do estado de qualidade requerido."
          },
          {
            "titulo": "Transparência e qualidade",
            "texto": "Artefatos opacos levam a decisões ruins: um backlog sem ordem torna prioridades confusas; um Sprint Backlog desatualizado oculta o trabalho real; um Incremento que não atende à Definition of Done não pode ser apresentado como concluído. Transparência não significa excesso de documentação: significa informação suficiente e compartilhada."
          },
          {
            "titulo": "Não confundir artefato e compromisso",
            "texto": "O artefato mostra o trabalho ou valor; o compromisso fornece foco para avaliar o progresso. A associação oficial é: **Product Backlog → Product Goal; Sprint Backlog → Sprint Goal; Incremento → Definition of Done**."
          }
        ],
        "chave": "------------------------------------------------------------------------------------------------------------------ Trinca essencial: Produto = Product Goal; Sprint = Sprint Goal; Incremento = Definition of Done. ------------------------------------------------------------------------------------------------------------------"
      },
      {
        "titulo": "5. Gestão do Product Backlog",
        "lead": "A gestão do Product Backlog é um processo contínuo de compreender, ordenar e atualizar o trabalho potencialmente necessário para melhorar o produto. O backlog não é um contrato fechado nem uma lista definitiva de tudo o que será entregue.",
        "blocos": [
          {
            "titulo": "Responsabilidade do Product Owner",
            "texto": "O Product Owner responde pela gestão eficaz do backlog: comunicar o Product Goal, criar e comunicar itens, ordená-los e garantir que o backlog seja transparente e compreensível. Pode realizar o trabalho diretamente ou delegar partes dele, mas permanece responsável."
          },
          {
            "titulo": "Ordenar não é apenas listar",
            "texto": "A ordem deve refletir valor esperado, risco, dependências, urgência, custo de atraso e aprendizado. O item mais importante costuma ficar mais acima e precisa estar suficientemente claro para que a equipe o considere no planejamento. A ordenação pode mudar com novas evidências."
          },
          {
            "titulo": "Refinamento do backlog",
            "texto": "Refinamento consiste em decompor e definir melhor itens, esclarecer critérios, avaliar tamanho e dependências e remover ou reordenar itens que perderam relevância. É uma atividade contínua, colaborativa; não é um evento formal do Scrum nem exige que todos os itens futuros estejam detalhados por completo."
          },
          {
            "titulo": "Tamanho e clareza dos itens",
            "texto": "Itens próximos do trabalho tendem a precisar de mais detalhe e devem ser pequenos o bastante para serem compreendidos e concluídos dentro de uma Sprint. Itens mais distantes podem permanecer amplos. Histórias de usuário são uma forma comum de expressar necessidade, mas o Scrum não obriga um formato específico."
          },
          {
            "titulo": "Exemplo aplicado",
            "texto": "Em um aplicativo de compras, \"permitir pagamento\" é amplo. O refinamento pode separar cartão, Pix e tratamento de falhas; esclarecer critérios de aceitação; identificar dependências e ordenar primeiro a opção de maior valor ou risco. Após feedback do usuário, o Product Owner pode alterar a ordem ou adicionar novos itens."
          },
          {
            "titulo": "Sinais de boa gestão",
            "texto": "O backlog tem uma direção compreensível, itens prioritários claros, detalhe proporcional à proximidade da execução e espaço para mudanças. Não se deve confundir previsão com garantia: estar no backlog significa ser uma opção de trabalho, não uma promessa automática de entrega."
          }
        ],
        "chave": "--------------------------------------------------------------------------------------------------------------------- Gestão eficaz = Product Goal claro + itens compreensíveis + ordem por valor + refinamento contínuo. ---------------------------------------------------------------------------------------------------------------------"
      }
    ],
    "referencias": [
      {
        "texto": "Scrum Guide --- versão oficial",
        "url": "https://scrumguides.org/scrum-guide.html"
      },
      {
        "texto": "Agile Alliance --- Product Backlog",
        "url": "https://agilealliance.org/glossary/backlog/"
      },
      {
        "texto": "Agile Alliance --- Backlog Refinement",
        "url": "https://agilealliance.org/glossary/backlog-refinement/"
      }
    ]
  },
  {
    "id": "kanban-xp",
    "modulo": 2,
    "cor": "#d933dc",
    "titulo": "Kanban x XP",
    "mapa": "mapa-grupo-4.png",
    "secoes": [
      {
        "titulo": "1. Kanban",
        "lead": "Kanban é um método para definir, visualizar e melhorar o fluxo de trabalho. Seu objetivo é ajudar o sistema a entregar valor de forma mais previsível, revelando esperas, excesso de trabalho em andamento e gargalos. Pode ser adotado gradualmente sem exigir uma reorganização completa da equipe.",
        "blocos": [
          {
            "titulo": "Visualizar o fluxo",
            "texto": "O trabalho é representado por itens que atravessam etapas definidas, como \"A fazer\", \"Em andamento\", \"Em revisão\" e \"Concluído\". O quadro deve representar o processo real e ter regras explícitas para entrada, saída e passagem entre estados. Nem todo processo precisa usar exatamente essas colunas."
          },
          {
            "titulo": "Limitar trabalho em andamento (WIP)",
            "texto": "WIP é o trabalho iniciado e ainda não concluído. Limites de WIP evitam que a equipe comece muitos itens ao mesmo tempo e deixe vários pela metade. Quando uma etapa atinge o limite, a resposta preferível é colaborar para concluir ou desbloquear o trabalho existente, em vez de puxar novas tarefas automaticamente."
          },
          {
            "titulo": "Sistema puxado e gestão do fluxo",
            "texto": "Em um sistema puxado, novo trabalho é iniciado quando há capacidade, seguindo políticas acordadas. A equipe observa onde itens ficam esperando, envelhecem ou se acumulam. A meta não é manter todas as pessoas ocupadas a qualquer custo, e sim otimizar o fluxo total de valor."
          },
          {
            "titulo": "Definição do Workflow (DoW)",
            "texto": "O fluxo precisa explicitar o que conta como item de trabalho, quando um item começa e termina, quais estados existem, como o WIP é controlado e quais políticas orientam o movimento. Uma definição compartilhada permite que a equipe interprete o quadro e as métricas de maneira consistente."
          },
          {
            "titulo": "Métricas de fluxo",
            "texto": "As principais medidas incluem **WIP** (itens em andamento), **throughput** (itens concluídos por período), **cycle time** (tempo entre início e conclusão do trabalho) e **Service Level Expectation --- SLE** (previsão, com probabilidade, de quanto tempo um item deve levar do início ao fim, baseada idealmente em dados históricos). Elas ajudam a verificar previsibilidade e localizar problemas."
          },
          {
            "titulo": "Melhoria contínua",
            "texto": "Kanban estimula observar o sistema, experimentar mudanças e avaliar os resultados. Se a revisão acumula trabalho, por exemplo, a equipe pode investigar capacidade, critérios ou tamanho dos itens. O propósito não é culpar uma pessoa ou perseguir uma coluna \"verde\", mas melhorar o fluxo como um todo."
          },
          {
            "titulo": "Kanban e Scrum",
            "texto": "Kanban não exige Sprints nem todos os eventos do Scrum. Ele pode ser usado em diferentes contextos, inclusive junto ao Scrum para gerir e aprimorar o fluxo dentro das Sprints. A escolha depende do tipo de trabalho, da necessidade de cadência e da forma como a equipe quer inspecionar e adaptar."
          }
        ],
        "chave": "------------------------------------------------------------------------------------------------- Kanban: visualizar o fluxo → limitar WIP → gerir o trabalho → medir → melhorar. -------------------------------------------------------------------------------------------------"
      },
      {
        "titulo": "2. Extreme Programming (XP)",
        "lead": "Extreme Programming (XP) é uma abordagem ágil de desenvolvimento de software especialmente conhecida pela ênfase em práticas de engenharia. A ideia é levar práticas úteis --- testes, integração, feedback e simplicidade --- a sério e aplicá-las continuamente para produzir código confiável e fácil de mudar.",
        "blocos": [
          {
            "titulo": "Valores e propósito",
            "texto": "XP costuma enfatizar comunicação, simplicidade, feedback, coragem e respeito. É indicada sobretudo quando requisitos mudam com frequência e a equipe precisa aprender rapidamente sem acumular defeitos ou tornar o código difícil de evoluir."
          },
          {
            "titulo": "Programação em par e propriedade coletiva",
            "texto": "Na programação em par, duas pessoas trabalham juntas no mesmo problema, alternando entre escrever código e revisar ou orientar. Isso facilita compartilhamento de conhecimento e detecção de erros. A propriedade coletiva do código permite que a equipe melhore partes diferentes do sistema seguindo padrões comuns, em vez de criar áreas exclusivamente \"pertencentes\" a uma pessoa."
          },
          {
            "titulo": "TDD e testes automatizados",
            "texto": "No Test-Driven Development (TDD), a equipe escreve um teste que falha, implementa o mínimo necessário para fazê-lo passar e depois refatora o código. O ciclo costuma ser descrito como vermelho → verde → refatorar. Testes automatizados em diferentes níveis ajudam a detectar regressões e dão confiança para mudar o sistema."
          },
          {
            "titulo": "Integração contínua e pequenas entregas",
            "texto": "O código é integrado frequentemente a uma base compartilhada, com build e testes automatizados para revelar conflitos cedo. Pequenas liberações encurtam o ciclo de feedback e reduzem o tamanho das mudanças arriscadas. A integração frequente funciona melhor quando os testes são rápidos e confiáveis."
          },
          {
            "titulo": "Design simples e refatoração",
            "texto": "Design simples busca a solução mais direta que atende às necessidades atuais, sem antecipar funcionalidades incertas. Refatoração melhora a estrutura interna sem alterar o comportamento observável. Juntas, evitam tanto complexidade desnecessária quanto deterioração gradual do código."
          },
          {
            "titulo": "Histórias, planejamento e cliente",
            "texto": "XP favorece histórias pequenas, priorizadas com participação próxima do cliente ou representante de negócio. A equipe negocia escopo e estima o trabalho para ciclos curtos, revendo planos com base na capacidade e no feedback. Envolvimento frequente evita desenvolver longamente a funcionalidade errada."
          },
          {
            "titulo": "Ritmo sustentável e qualidade integrada",
            "texto": "A abordagem procura manter um ritmo de trabalho sustentável, padrões de codificação e colaboração frequente. Testes, revisão e design não devem ser tratados como tarefas opcionais para \"quando sobrar tempo\": sustentam a capacidade de responder a mudanças futuras."
          },
          {
            "titulo": "XP em conjunto com outras abordagens",
            "texto": "XP não é incompatível com Scrum ou Kanban. Uma equipe pode usar eventos ou gestão de fluxo de outro método e incorporar práticas técnicas de XP para melhorar a qualidade e reduzir riscos. Scrum estrutura colaboração e inspeção; Kanban enfatiza o fluxo; XP oferece práticas de engenharia especialmente concretas."
          }
        ],
        "chave": "------------------------------------------------------------------------------------------------------------------- XP: testes primeiro + integração contínua + programação em par + pequenas entregas + refatoração. -------------------------------------------------------------------------------------------------------------------",
        "figura": {
          "src": "fig-xp.png",
          "alt": "Fluxo da Programação Extrema (XP)"
        }
      }
    ],
    "referencias": [
      {
        "texto": "Guia Kanban --- versão em português",
        "url": "https://kanbanguides.org/portugues/"
      },
      {
        "texto": "Agile Alliance --- Extreme Programming",
        "url": "https://agilealliance.org/glossary/xp/"
      },
      {
        "texto": "Extreme Programming Alliance --- práticas de XP",
        "url": "https://extremeprogrammingalliance.com/about-extreme-programming-xp/extreme-programming-xp-practices/"
      }
    ]
  },
  {
    "id": "ferramentas",
    "modulo": 3,
    "cor": "#b944ff",
    "titulo": "Ferramentas e boas práticas para projetos ágeis",
    "mapa": "mapa-grupo-3.png",
    "secoes": [
      {
        "titulo": "1. Ferramentas para Equipes Ágeis",
        "lead": "Ferramentas ágeis ajudam a tornar o trabalho visível, facilitar colaboração e automatizar tarefas repetitivas. Elas apoiam o método adotado, mas não definem por si só a agilidade: uma equipe pode usar uma plataforma sofisticada e continuar trabalhando de forma burocrática.",
        "blocos": [
          {
            "titulo": "Quadros, backlog e acompanhamento",
            "texto": "Quadros Kanban e task boards mostram estados do trabalho, responsáveis quando útil, bloqueios e limites de tarefas simultâneas. Ferramentas de backlog permitem registrar itens, ordená-los, relacioná-los a objetivos e acompanhar mudanças. O quadro deve refletir o fluxo real, não apenas reproduzir um modelo padrão."
          },
          {
            "titulo": "Documentação e comunicação",
            "texto": "Wikis, documentos compartilhados, chat e videoconferência permitem guardar decisões, requisitos, critérios de aceitação e acordos de equipe. É útil registrar decisões e informações que precisam durar, sem substituir conversas por longos documentos que deixam de ser atualizados. Em equipes distribuídas, acordos sobre canais, horários e respostas reduzem ruídos."
          },
          {
            "titulo": "Desenvolvimento e qualidade técnica",
            "texto": "Repositórios de código com controle de versão (por exemplo, Git) registram mudanças e apoiam colaboração. Revisão de código, integração contínua, testes automatizados, pipelines de build/deploy e monitoramento ajudam a detectar problemas cedo e tornar as entregas mais confiáveis."
          },
          {
            "titulo": "Critérios para escolher",
            "texto": "Avalie se a ferramenta resolve uma necessidade real; facilidade de uso e acessibilidade; integração com sistemas existentes; segurança e permissões; exportação e propriedade dos dados; custo total; suporte e manutenção. Evite adotar múltiplas ferramentas que duplicam registros e criam versões conflitantes da verdade."
          },
          {
            "titulo": "Informação útil e transparência",
            "texto": "O registro deve ajudar a responder: qual é o objetivo? O que está em andamento? O que está bloqueado? O que foi concluído e com qual nível de qualidade? Informação visível deve ser confiável, atualizada e acessível a quem precisa dela."
          },
          {
            "titulo": "Regra prática",
            "texto": "Comece pelo problema de colaboração ou fluxo; escolha a ferramenta mais simples que o resolva; combine regras de uso com a equipe; revise se está ajudando. A ferramenta deve se adaptar ao processo e apoiar o aprendizado --- não obrigar a equipe a criar trabalho artificial para alimentar o sistema."
          }
        ],
        "chave": "--------------------------------------------------------------------------------------------------------------------------------------- Ferramentas devem apoiar transparência, colaboração, rastreabilidade e qualidade --- sem substituir decisões humanas. ---------------------------------------------------------------------------------------------------------------------------------------",
        "figura": {
          "src": "fig-ferramentas.png",
          "alt": "Infográfico: Ferramentas para Equipes Ágeis"
        }
      },
      {
        "titulo": "2. Boas Práticas em Projetos Ágeis",
        "lead": "Boas práticas são hábitos que ajudam uma equipe a entregar valor com frequência, manter qualidade e adaptar-se com responsabilidade. A prática escolhida deve fazer sentido para o tipo de produto, a equipe, o risco e o contexto do projeto.",
        "blocos": [
          {
            "titulo": "Objetivo e valor claros",
            "texto": "Conecte tarefas a um problema do usuário ou resultado de negócio. Priorize pelo valor esperado, risco, urgência e aprendizado. Um objetivo claro permite que a equipe negocie escopo sem perder de vista o resultado desejado."
          },
          {
            "titulo": "Entrega pequena e feedback frequente",
            "texto": "Divida grandes soluções em incrementos que possam ser testados e avaliados. Mostre trabalho utilizável a clientes ou stakeholders, ouça feedback e valide hipóteses antes de investir demais. Entregar frequentemente não significa liberar software incompleto ou de baixa qualidade."
          },
          {
            "titulo": "Colaboração e autonomia",
            "texto": "Envolva pessoas com conhecimento de negócio, usuários e competências técnicas durante o trabalho, e não apenas no início ou na aprovação final. A equipe precisa de clareza de objetivos, acesso a decisões e autonomia proporcional para organizar como realizará o trabalho."
          },
          {
            "titulo": "Qualidade incorporada",
            "texto": "Use critérios de aceitação claros, testes adequados, revisão, integração frequente, segurança e manutenção do código. A Definition of Done (quando usada no Scrum) torna explícito o padrão mínimo para considerar um Incremento concluído. Qualidade não deve ser deixada para uma \"fase final\" separada."
          },
          {
            "titulo": "Transparência e gestão de impedimentos",
            "texto": "Torne visíveis progresso, riscos, dependências, bloqueios e mudanças de escopo. Falar cedo sobre problemas permite buscar ajuda e renegociar expectativas. Transparência não é culpabilização: o foco é entender o sistema, remover causas e melhorar as condições de trabalho."
          },
          {
            "titulo": "Inspeção e melhoria contínua",
            "texto": "Reserve momentos para avaliar produto, fluxo e colaboração. Experimente melhorias pequenas, defina o que se espera mudar e verifique o efeito. Retrospectivas são úteis quando resultam em ações concretas e acompanhamento, não apenas em uma lista repetida de reclamações."
          },
          {
            "titulo": "Ritmo sustentável e simplicidade",
            "texto": "Evite depender permanentemente de horas extras. Reduza trabalho iniciado sem necessidade, tarefas sem propósito e processos que não agregam valor. Documente o suficiente para manter entendimento, decisões e conformidade; prefira a menor solução que resolva o problema sem comprometer qualidade futura."
          },
          {
            "titulo": "Antipadrões a evitar",
            "texto": "Agilidade não é ausência de documentação, plano ou responsabilidade; não significa mudar prioridades continuamente sem acordo; não é simplesmente aplicar cerimônias; e não consiste em medir pessoas por quantidade de tarefas. A equipe deve selecionar práticas pelo resultado observado e adaptar o que não funciona."
          }
        ],
        "chave": "------------------------------------------------------------------------------------------------------------------------ Boas práticas: foco em valor + colaboração + entregas pequenas + qualidade + transparência + melhoria. ------------------------------------------------------------------------------------------------------------------------",
        "figura": {
          "src": "fig-boas-praticas.png",
          "alt": "Infográfico: Boas Práticas em Projetos Ágeis"
        }
      }
    ],
    "referencias": [
      {
        "texto": "Manifesto Ágil --- português",
        "url": "https://agilemanifesto.org/iso/ptbr/manifesto.html"
      },
      {
        "texto": "PMI --- Agile Practice Guide",
        "url": "https://www.pmi.org/pt-br/standards/agile"
      },
      {
        "texto": "Agile Alliance --- Agile Practice Guide e práticas",
        "url": "https://agilealliance.org/agile101/practices-timeline/"
      }
    ]
  },
  {
    "id": "principios",
    "modulo": 4,
    "cor": "#58a2e6",
    "titulo": "Princípios e práticas da agilidade",
    "mapa": "mapa-grupo-2.png",
    "secoes": [
      {
        "titulo": "1. Fundamentos da Agilidade",
        "lead": "Agilidade é uma forma de trabalhar que busca entregar valor cedo, aprender com feedback e adaptar-se quando necessidades, riscos ou circunstâncias mudam. Não é ausência de planejamento ou processo; é a capacidade de ajustar ambos sem perder o objetivo.",
        "blocos": [
          {
            "titulo": "Os quatro valores do Manifesto Ágil",
            "texto": "O Manifesto valoriza: **indivíduos e interações** mais que processos e ferramentas; **software em funcionamento** mais que documentação abrangente; **colaboração com o cliente** mais que negociação de contratos; e **responder a mudanças** mais que seguir um plano. Os elementos à direita continuam tendo valor --- a preferência indica prioridade, não exclusão."
          },
          {
            "titulo": "Princípios na prática",
            "texto": "Priorizar satisfação do cliente por entregas valiosas e frequentes; acolher mudanças úteis; colaborar diariamente com pessoas de negócio; manter ritmo sustentável; favorecer comunicação clara; refletir periodicamente sobre como melhorar; e considerar qualidade técnica e bom design como suporte à adaptação."
          },
          {
            "titulo": "Iterativo e incremental",
            "texto": "Iterativo significa aprender e aperfeiçoar por ciclos repetidos. Incremental significa entregar partes utilizáveis do produto. As duas ideias podem coexistir: entregar uma primeira versão pequena e usar feedback para aprimorar as próximas. Isso reduz o risco de investir muito tempo em uma solução que não atende à necessidade."
          },
          {
            "titulo": "Agilidade não é um framework único",
            "texto": "Scrum, Kanban e XP são abordagens distintas e podem ser combinadas conforme o contexto. Scrum fornece uma estrutura de responsabilidades, eventos e artefatos; Kanban enfatiza a gestão do fluxo; XP enfatiza práticas técnicas para desenvolver software com qualidade. O Manifesto é uma base de valores e princípios, não uma receita operacional única."
          },
          {
            "titulo": "O que significa entregar valor",
            "texto": "Atividade concluída não é necessariamente resultado valioso. A equipe deve relacionar o trabalho a uma necessidade real, verificar uso e feedback e ajustar prioridades. Valor pode envolver utilidade para o cliente, redução de risco, qualidade, conformidade ou resultado de negócio --- não apenas quantidade de funcionalidades."
          }
        ],
        "chave": "----------------------------------------------------------------------------------------------- Agilidade = valor frequente + colaboração + feedback + qualidade + adaptação. -----------------------------------------------------------------------------------------------"
      },
      {
        "titulo": "2. Planejamento Ágil",
        "lead": "O planejamento ágil combina direção de longo prazo com decisões detalhadas tomadas perto da execução. Como o conhecimento aumenta durante o trabalho, planos são hipóteses revisáveis, não previsões imutáveis.",
        "blocos": [
          {
            "titulo": "Começar pelo objetivo",
            "texto": "Defina o problema, o público e o resultado desejado antes de listar tarefas. Um objetivo claro ajuda a equipe a decidir o que priorizar e o que pode ser descartado. No Scrum, por exemplo, Product Goal e Sprint Goal conectam o trabalho a uma direção de produto e a um resultado da Sprint."
          },
          {
            "titulo": "Planejar em níveis",
            "texto": "O planejamento estratégico define visão, resultados e restrições; o planejamento de produto ou roadmap indica possíveis etapas e prioridades; o planejamento de uma iteração ou do fluxo define o trabalho próximo. Os níveis devem se conectar, sem exigir que todo detalhe futuro seja especificado desde o início."
          },
          {
            "titulo": "Decompor e priorizar",
            "texto": "Divida objetivos grandes em entregas menores que possam ser avaliadas. Ordene o trabalho considerando valor, risco, urgência, dependências e aprendizado esperado. Técnicas como histórias de usuário, story mapping, estimativas relativas e Planning Poker podem apoiar a conversa, mas não substituem o entendimento compartilhado."
          },
          {
            "titulo": "Capacidade, riscos e dependências",
            "texto": "A previsão deve considerar capacidade real, competências, interrupções, incerteza e dependências externas. É melhor assumir uma previsão explícita e revisável do que transformar estimativas em promessas rígidas. Entregas pequenas ajudam a descobrir riscos cedo e reduzem o custo de mudanças."
          },
          {
            "titulo": "Feedback e adaptação",
            "texto": "Após cada entrega, compare o resultado com o objetivo: o usuário conseguiu resolver o problema? A hipótese foi confirmada? O que mudou no contexto? Use essas respostas para repriorizar. Um roadmap ágil comunica intenção e direção, mas pode mudar conforme evidências."
          },
          {
            "titulo": "Antipadrões",
            "texto": "Evite planejar todos os detalhes com excessiva antecedência, medir sucesso apenas por cumprimento do cronograma, assumir que todas as estimativas são certezas ou mudar prioridades diariamente sem um critério claro. Adaptação eficaz tem propósito e transparência."
          }
        ],
        "chave": "-------------------------------------------------------------------------------------------------------------------- Planejamento adaptativo: objetivo → priorização → pequenas entregas → feedback → revisão do plano. --------------------------------------------------------------------------------------------------------------------"
      },
      {
        "titulo": "3. Métricas Ágeis",
        "lead": "Métricas oferecem evidências para compreender o fluxo, a previsibilidade, a qualidade e os resultados. Devem ajudar a equipe a fazer perguntas e melhorar o sistema de trabalho --- não ser usadas isoladamente para vigiar pessoas ou criar rankings simplistas.",
        "blocos": [
          {
            "titulo": "Lead time e cycle time",
            "texto": "**Lead time** mede o tempo decorrido desde a solicitação ou entrada do item no sistema até sua conclusão; **cycle time** mede o tempo entre o início do trabalho ativo e sua conclusão. A definição exata dos pontos de início e fim deve ser explícita e consistente dentro da equipe."
          },
          {
            "titulo": "Throughput e WIP",
            "texto": "**Throughput** é a quantidade de itens concluídos em um período. **WIP (work in progress)** é o número de itens iniciados e ainda não concluídos. Um WIP alto pode indicar excesso de tarefas simultâneas, espera e dificuldade de foco; limitar o WIP pode incentivar concluir o que já começou antes de puxar mais trabalho."
          },
          {
            "titulo": "Velocidade no Scrum",
            "texto": "Velocidade costuma representar a quantidade de trabalho estimado que uma equipe conclui por Sprint. Pode ajudar a equipe a prever a própria capacidade com base no histórico, mas depende da escala de estimativa usada. Não mede valor, qualidade ou produtividade de forma universal e não deve ser comparada diretamente entre equipes."
          },
          {
            "titulo": "Burndown e previsibilidade",
            "texto": "Um gráfico burndown mostra trabalho restante ao longo do tempo em relação a uma meta ou período. Ajuda a conversar sobre progresso, mas pode ocultar mudanças de escopo ou diferenças de complexidade. Para fluxo, gráficos de controle de cycle time e diagramas de fluxo cumulativo podem ajudar a enxergar variação e gargalos."
          },
          {
            "titulo": "Métricas de resultado e qualidade",
            "texto": "Além de atividade e fluxo, acompanhe se o trabalho produz efeito: adoção, satisfação do usuário, taxa de falhas, retrabalho, defeitos, tempo de recuperação ou resultados de negócio apropriados ao produto. A métrica deve se conectar a uma pergunta decisória e a um objetivo claro."
          },
          {
            "titulo": "Uso responsável",
            "texto": "Combine métricas quantitativas com contexto e conversas qualitativas. Métricas viram contraproducentes quando são alvos isolados: contar tickets pode incentivar dividir trabalho artificialmente; maximizar velocidade pode reduzir qualidade; aumentar utilização individual pode prolongar o tempo total de entrega. Use tendências para melhorar o sistema, não culpar indivíduos."
          }
        ],
        "chave": "----------------------------------------------------------------------------------------------------------------------------------- Escolha métricas pela pergunta: fluxo (tempo/WIP/throughput), previsão (histórico) e resultado (valor/qualidade). -----------------------------------------------------------------------------------------------------------------------------------"
      }
    ],
    "referencias": [
      {
        "texto": "Manifesto Ágil --- português",
        "url": "https://agilemanifesto.org/iso/ptbr/manifesto.html"
      },
      {
        "texto": "PMI --- Agile Practice Guide",
        "url": "https://www.pmi.org/pt-br/standards/agile"
      },
      {
        "texto": "Atlassian --- Métricas ágeis",
        "url": "https://www.atlassian.com/agile/project-management/metrics"
      }
    ]
  }
];