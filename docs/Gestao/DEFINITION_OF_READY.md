# Definition of Ready (DoR) — quando uma issue pode começar

Uma issue só entra na sprint e vai para **"Pronto pra iniciar"** quando cumpre todos os itens abaixo. Se faltar algum, ela volta para o refinamento com o PO.

A DoR é conferida pelo **PO (Abdi)** no planejamento e por quem for assumir a issue antes de criar a branch. O que acontece depois que a issue fica pronta está na [Definition of Done](DEFINITION_OF_DONE.md).

## Checklist da issue pronta para iniciar

- [ ] **Título claro**, no padrão `[S3][TNNN][RFxx] Verbo + o que será feito`.
- [ ] **User story** no formato "Como **candidato**, quero **…**, para **…**" (ou objetivo técnico, quando não houver usuário).
- [ ] **Requisitos ligados** (RF, RNF ou RP) e o critério da rubrica que ela ajuda a cumprir (ex.: DW05, BD02).
- [ ] **Critérios de aceite** em checklist, verificáveis por outra pessoa (o que testar e o que deve acontecer).
- [ ] **Dependências resolvidas** ou com data combinada (ex.: a tela de prova depende do token do login).
- [ ] **Tamanho**: cabe em até 3 dias de trabalho de uma pessoa. Se não couber, dividir em issues menores.
- [ ] **Responsável** em *Assignees* e **Sprint**, **milestone** e etiquetas (`sprint:N`, `area:`, `tipo:`, `prioridade:`) preenchidos.
- [ ] **Onde mexer** indicado: arquivos, telas ou rotas da API envolvidos.
- [ ] **Material de apoio** disponível quando necessário: tela no Figma, rota documentada em `docs/Tecnico/API.md`, tabela no dicionário de dados.
- [ ] **Entendida pelo time**: quem vai fazer leu e não tem dúvida aberta (dúvidas vão para comentário na issue ou para a Daily).

## Exemplo de issue pronta

> **[S3][T046][RF16] Implementar página de resultado final**
>
> Como **candidato**, quero **ver minha nota ao terminar os 12 temas**, para **saber se fui aprovado**.
>
> Requisitos: RF16 · Rubrica: DW05, DW03 · Depende de: login com token (#105)
>
> Onde mexer: `frontend/resultado.html`, `frontend/src/js/resultado.js` · Rota: `GET /api/candidatos/resultado`
>
> Critérios de aceite:
> - [ ] A nota vem da API, sem cálculo no navegador.
> - [ ] Mostra acertos, percentual e "Aprovado" (≥ 65%) ou "Não aprovado".
> - [ ] Prova incompleta mostra quantos temas faltam.
> - [ ] PR com `Closes #47` e prints de aprovado e reprovado.

## Quando a issue NÃO está pronta

| Situação | O que fazer |
|---|---|
| Critério vago ("fazer a tela bonita") | PO reescreve em itens que dá para testar |
| Grande demais | Dividir em duas ou mais issues |
| Depende de algo que não existe | Criar a issue da dependência e combinar a ordem |
| Sem responsável | Definir na Daily ou no planejamento |
| Ninguém entendeu | Comentar a dúvida na issue e resolver antes de começar |
