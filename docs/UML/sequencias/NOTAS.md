# Notas dos diagramas de sequência

Os fluxos em PlantUML descrevem as interações previstas. Para o funcionamento implementado, consulte a [documentação da API](../../Tecnico/API.md).

## Regras representadas

- Cadastro retorna do banco ao controlador e depois à tela, com caminhos para CPF duplicado e entrada inválida.
- Login verifica credenciais no controlador e prevê falha genérica, sem devolver hash ou senha à interface.
- A questão sorteada e o prazo de 150 segundos são persistidos. O fluxo inclui resposta, expiração, interrupção e feedback.
- A retomada segue o próximo tema pendente. A conclusão exige 12 temas encerrados.
- O certificado depende de aproveitamento mínimo de 65%, com dados da emissão e QR para validação pública.
- As decisões D03–D07 sobre cálculo, interrupção, tentativas, dados públicos e sessão estão em [DECISOES.md](../../Gestao/DECISOES.md).

## Formatos e Astah

As fontes desta pasta são PlantUML, acompanhadas de PNG e SVG. A incorporação desses fluxos ao Astah e a conferência no editor continuam pendentes.

O [arquivo em rascunhos](../rascunhos/PortalDeCertificacao-sequencias-em-revisao.asta) contém versões iniciais de DS01/DS02 e casos de uso. Nelas há retorno direto do banco à tela no cadastro, alternativas de falha ausentes, fluxo de certificação incompleto e uma guarda genérica `Guard`.

O [projeto de caso de uso](../PortalDeCertificacaoEmMetodologiasAgeis.asta) fica na pasta UML. Os modelos em PlantUML não são uma atualização dos arquivos `.asta`.
