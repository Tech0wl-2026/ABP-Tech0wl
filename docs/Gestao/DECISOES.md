# Decisões e dúvidas de domínio

As regras transcritas em [Requisitos](../Requisitos/REQUISITOS.md) prevalecem. Propostas abaixo não foram aprovadas pelo professor.

| ID | Decisão necessária | Proposta técnica desta revisão | Responsável pela validação |
|---|---|---|---|
| D01 | Tecnologia do backend e driver PostgreSQL | Escolher uma stack pequena que a equipe saiba manter; nenhuma API implementada ainda | Equipe técnica |
| D02 | Seleção e ordem dos 12 temas | Validar com Gabriel A./PO; não tratar a amostra Scrum como seleção final | Conteúdo/PO |
| D03 | Pesos, escala e arredondamento da nota | DDL de referência usa pesos iguais, percentual `acertos/12*100` e nota 0–10, duas casas. 8 acertos = 66,67%, 7 = 58,33%. Confirmar antes de integrar | Professor/PO |
| D04 | Pontuação em interrupção de questão | Amostra persiste sem resposta e incorreta; requisito garante encerramento, política exata deve ser confirmada | Professor/PO |
| D05 | Limite de novas tentativas após finalizar | Modelo aceita várias tentativas, uma resposta por tema em cada tentativa. Confirmar se o desafio exige bloqueio por candidato em vez de por tentativa | Professor/PO |
| D06 | Dados exibidos na validação pública | Contrato proposto usa token opaco e informação mínima; CPF/e-mail completos só no documento privado | Professor/PO |
| D07 | Política de expiração de sessão e detecção de perda de conexão | Servidor decide prazo e retomada, transação idempotente encerra questão interrompida antes de avançar; testar reconexão e requisições concorrentes | Backend/equipe |
| D08 | Horário de fechamento e critérios por Sprint | Datas confirmadas; hora e denominador da rubrica a confirmar | Professor/SM |
| D09 | Identidade visual e titularidade das imagens existentes | Validar se o logotipo magenta é definitivo antes de harmonizar a página azul; registrar criadores/licenças | Design/equipe |

O identificador `peso-igual-v1-proposta` na tentativa permite reconhecer a regra usada no modelo. Alterar fórmulas exige migração versionada e preservação dos resultados já emitidos, depois de D03 ser resolvida. Não recalcular certificados antigos silenciosamente.
