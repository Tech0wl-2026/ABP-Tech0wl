-- Amostra técnica: 1 tema e 4 questões, não a base final de 12/48.
-- Fonte conceitual: Scrum Guide 2020, https://scrumguides.org/scrum-guide.html
-- Tema não selecionado para a certificação; validação editorial pendente.
BEGIN;
INSERT INTO tema(nome, ordem, selecionado) VALUES ('Fundamentos do Scrum (demonstração)', 1, false);
INSERT INTO conteudo_estudo(tema_id, titulo, corpo_markdown, fontes, publicado)
SELECT id, 'Introdução ao Scrum',
 'Scrum usa empirismo e ciclos de inspeção e adaptação. O Product Backlog organiza o trabalho do produto; a Daily Scrum inspeciona o progresso em direção à meta da Sprint.',
 'Scrum Guide 2020: https://scrumguides.org/scrum-guide.html', false FROM tema WHERE ordem = 1;

INSERT INTO questao(tema_id, numero, enunciado, imagem_caminho, imagem_descricao, imagem_fonte, justificativa, fonte_conteudo)
SELECT t.id, v.numero, v.enunciado, v.imagem, v.descricao, 'Diagrama vetorial original da equipe, gerado para demonstração técnica.', v.justificativa,
 'Scrum Guide 2020: https://scrumguides.org/scrum-guide.html'
FROM tema t CROSS JOIN (VALUES
 (1, 'Qual conceito sustenta o ciclo ilustrado?', '/assets/questoes/demo-01.svg', 'Ciclo de observar, inspecionar e adaptar.', 'O empirismo usa observação e experiência para orientar decisões.'),
 (2, 'Quem responde pelo gerenciamento eficaz do Product Backlog?', '/assets/questoes/demo-02.svg', 'Lista de itens de trabalho do produto.', 'Essa responsabilidade pertence ao Product Owner.'),
 (3, 'Qual é o limite de duração da Daily Scrum?', '/assets/questoes/demo-03.svg', 'Encontro diário de uma equipe.', 'A Daily Scrum tem timebox de 15 minutos.'),
 (4, 'Qual compromisso está associado ao Sprint Backlog?', '/assets/questoes/demo-04.svg', 'Uma seleção de itens de trabalho para a Sprint.', 'O compromisso associado ao Sprint Backlog é a Sprint Goal.')
) AS v(numero, enunciado, imagem, descricao, justificativa) WHERE t.ordem = 1;

INSERT INTO alternativa(questao_id, letra, texto, correta)
SELECT q.id, v.letra, v.texto, v.correta FROM questao q JOIN (VALUES
 (1,'A','Empirismo',true),(1,'B','Previsão sem inspeção',false),(1,'C','Trabalho sem feedback',false),(1,'D','Plano imutável',false),
 (2,'A','Product Owner',true),(2,'B','Um gerente externo obrigatório',false),(2,'C','Apenas o cliente final',false),(2,'D','Um aprovador de contratos',false),
 (3,'A','15 minutos',true),(3,'B','60 minutos',false),(3,'C','4 horas',false),(3,'D','Sem limite de tempo',false),
 (4,'A','Sprint Goal',true),(4,'B','Um contrato de escopo fixo',false),(4,'C','Uma lista individual de horas',false),(4,'D','Um relatório de presença',false)
) AS v(numero, letra, texto, correta) ON q.numero = v.numero JOIN tema t ON t.id = q.tema_id WHERE t.ordem = 1;
UPDATE questao SET publicada = true WHERE tema_id = (SELECT id FROM tema WHERE ordem = 1);
COMMIT;
