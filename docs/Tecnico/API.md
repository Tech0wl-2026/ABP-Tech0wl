# Contrato proposto da API

**Nenhum endpoint HTTP de backend está implementado.** Esta tabela orienta o grupo e deve ser substituída por documentação do contrato real, com exemplos e testes, quando D01 for resolvida.

| Operação proposta | Entrada | Saída e regra no servidor |
|---|---|---|
| Cadastro | CPF normalizado, nome, e-mail, senha | Validar, CPF único, hash seguro; nunca retornar senha/hash |
| Login/logout | CPF/senha ou sessão | Sessão protegida, limite de tentativas e erro genérico |
| Estudos | Tema selecionado | Conteúdo publicado e fontes dos mesmos 12 temas |
| Iniciar/retomar tentativa | Usuário autenticado | Validar prontidão, política de tentativas e titularidade; retomar próximo tema |
| Apresentar questão | Tentativa do titular | Sorteio persistido, imagem, alternativas sem gabarito e prazo do servidor |
| Responder/encerrar | Etapa e alternativa ou motivo | Lock, prazo, uma resposta; feedback depois do encerramento; idempotência |
| Histórico/progresso/resultado | Sessão do titular | Não aceitar usuário arbitrário; resultado só após 12 temas |
| Certificado privado | Resultado do titular | Emitir apenas com ≥65%, guardar snapshot e criar QR para URL pública |
| Validar certificado público | Token opaco | Válido/inexistente, dados mínimos conforme D06; nunca listar CPF/e-mail completos por busca |

Prever códigos 400 (entrada), 401 (sessão), 403/404 (acesso indevido sem revelar dados), 409 (estado/conflito) e erro 5xx sem detalhes internos. Testar entradas inválidas, SQL injection por parâmetros, acesso à tentativa alheia, duplo envio concorrente, relógio manipulado e reconexão.

As consultas PREPARE em [consultas-exemplo.sql](../../database/consultas-exemplo.sql) são referência SQL. Não são evidência de integração por driver nem API funcional.
