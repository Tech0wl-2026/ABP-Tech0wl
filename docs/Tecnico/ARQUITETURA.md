# Arquitetura

O Compose executa frontend em Nginx, API Node.js/Express e PostgreSQL 17. O Nginx encaminha `/api/` ao backend na mesma origem do site. O frontend apresenta Home, Curso e Sobre nós; as telas de cadastro, prova e certificado ainda precisam consumir as rotas.

## Backend

`routes/` recebe HTTP, `services/` concentra as regras e `config/database.js` mantém o pool do driver `pg`. O middleware valida JWT HS256, emissor, destinatário e expiração. Senhas usam bcrypt com custo 12.

Dados de entrada são enviados ao SQL por parâmetros. Cada transação da avaliação usa a mesma conexão e bloqueia o candidato até o commit. Há restrições de uma questão por candidato/tema e uma questão aberta por candidato.

## Banco

O schema PostgreSQL `servidor` contém as cinco tabelas usadas pela API: candidatos, temas, questões, alternativas e respostas. É uma adaptação do material do professor, com restrições adicionais para concorrência e preservação das respostas.

As dez tabelas anteriores em `public` continuam como modelo de referência da Sprint 1. A API não grava nelas. Os dois modelos não sincronizam dados. O modelo executável fica em [database/servidor](../../database/servidor/README.md); o alinhamento dos diagramas e do dicionário ainda precisa ser feito com a equipe.

O preparador cria estrutura e seed em uma única transação, usando lock de instalação. Reiniciar preserva o banco. Uma base existente incompleta gera erro em vez de apagar ou recarregar tabelas automaticamente.

## Limites

O Compose é local. Uma implantação pública precisa de HTTPS, credencial de banco com privilégios mínimos, backups, gestão de segredos e configuração do limitador de chamadas para os proxies utilizados.

Área de estudos, integração das telas, documento eletrônico do certificado, QR e detecção de interrupção pela interface continuam pendentes. O backend oferece as rotas do material de apoio e consultas de histórico, progresso e validação em JSON.
