# UML de referência para Astah

A equipe relatou trabalho no Astah, mas não há arquivo `.asta` publicado nesta revisão. Não foram criadas evidências de edição ou autoria em nome dos colegas.

O [diagrama de estados de referência](../design/fluxo-de-telas.md) descreve o ciclo da questão, e o [modelo lógico](../database/logico.png) orienta as classes de domínio: Candidato, Tema, ConteudoEstudo, Questao, Alternativa, Tentativa, EtapaAvaliacao, Resposta, Resultado e Certificado. O [fonte PlantUML](dominio.puml) é editável e pode orientar a reprodução no Astah; não é um arquivo nativo do Astah.

No caso de uso, adotar ator **Candidato** e ator **Verificador público**, com fronteira “Portal de Certificação”. Casos: consultar instruções/estudos; cadastrar; autenticar; iniciar/retomar avaliação; responder questão; pausar; acompanhar progresso; consultar histórico/resultado; obter certificado se aprovado; validar certificado público. Tempo, sorteio, gabarito e cálculo são comportamentos internos, não atores humanos. Não usar `include` para simples ordem de telas; usar fluxos alternativos para expiração/interrupção e precondição para certificado ≥65%.

Entregar o `.asta` real com casos de uso/descrições, classes, estados e sequências pertinentes, revisar contra RF01–RF21 e registrar autoria/revisão na issue.
