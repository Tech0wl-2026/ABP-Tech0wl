# Decisões e dúvidas de domínio

As regras transcritas em [Requisitos](../Requisitos/REQUISITOS.md) prevalecem. D02 foi definida pelo grupo e informada por Breno em 20/10/2026; a orientação de backend recebida em 21/10 define a stack e exemplifica o cálculo e a tentativa única. As decisões ainda abertas continuam indicadas abaixo.

| ID | Decisão necessária | Proposta técnica desta revisão | Responsável pela validação |
|---|---|---|---|
| D01 | Tecnologia do backend e driver PostgreSQL | Node.js/Express com pg, bcryptjs e JWT, conforme orientação de 21/10; API em backend/ | Equipe técnica |
| D02 | Seleção e ordem dos 12 temas | **Definida em 20/10/2026:** [12 temas e numeração original](../conteudo/temas.md), com [catálogo JSON](../conteudo/temas.json). Banco de 48 questões em database/servidor; as 12 questões novas precisam de revisão pedagógica | Definição do grupo informada por Breno; acompanhamento por Conteúdo/PO |
| D03 | Pesos, escala e arredondamento da nota | DDL de referência usa pesos iguais, percentual `acertos/12*100` e nota 0–10, duas casas. 8 acertos = 66,67%, 7 = 58,33%. Material de apoio usa acertos/total; a API adota esse percentual. Confirmar a escala de apresentação 0–10 | Professor/PO |
| D04 | Pontuação em interrupção de questão | API encerra sem escolha e com acerto falso em expiração ou interrupção explícita. Fechamento/perda de conexão ainda exigem integração da interface | Professor/PO |
| D05 | Limite de novas tentativas após finalizar | A API segue o material do professor: uma questão por tema/candidato, sem reinício. O modelo anterior em public admite múltiplas tentativas e permanece apenas referência | Professor/PO |
| D06 | Dados exibidos na validação pública | API pública usa código opaco e retorna nome, percentual e emissão; CPF/e-mail apenas na rota privada. Confirmar apresentação final | Professor/PO |
| D07 | Política de expiração de sessão e detecção de perda de conexão | JWT dura uma hora conforme o material. Servidor controla prazo e concorrência; perda de conexão/fechamento imediato ainda não são detectados | Backend/equipe |
| D08 | Horário de fechamento e critérios por Sprint | Datas confirmadas; hora e denominador da rubrica a confirmar | Professor/SM |
| D09 | Identidade visual e titularidade das imagens existentes | Páginas públicas ajustadas aos protótipos desktop/mobile em 21/10; substituições locais autorizadas por Breno, descritas em docs/design/conferencia-2026-10-21.md. Confirmar marca definitiva e direitos dos assets originais | Design/equipe |

O identificador `peso-igual-v1-proposta` na tentativa permite reconhecer a regra usada no modelo. Alterar fórmulas exige migração versionada e preservação dos resultados já emitidos, depois de D03 ser resolvida. Não recalcular certificados antigos silenciosamente.
