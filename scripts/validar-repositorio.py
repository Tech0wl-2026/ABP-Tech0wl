#!/usr/bin/env python3
"""Verificações de integridade documental; não avalia nota ou aprova produto."""
import ast
import json
import re
from collections import Counter
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
errors = []
def check(condition, message):
    if not condition:
        errors.append(message)

files = [p for p in ROOT.rglob('*') if p.is_file() and not any(x in p.relative_to(ROOT).parts for x in ('.git', 'node_modules', 'test-results', '__pycache__'))]
for p in files:
    check(p.stat().st_size > 0, f'Arquivo vazio: {p.relative_to(ROOT)}')
    if p.suffix != '.md':
        continue
    for raw in re.findall(r'!?\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)', p.read_text()):
        link = urlsplit(raw)
        if link.scheme or link.netloc or not link.path:
            continue
        target = (p.parent / unquote(link.path)).resolve()
        check(target.is_relative_to(ROOT) and target.exists(), f'Link inválido em {p.relative_to(ROOT)}: {raw}')

rubric = json.loads((ROOT/'docs/avaliacao/rubrica.json').read_text())
criteria = rubric['criterios']
expected = {f'{p}{i:02}' for p, n in [('ES',9),('DW',7),('BD',5),('DD',4)] for i in range(1,n+1)}
check({c['id'] for c in criteria} == expected and len(criteria)==25, 'Rubrica deve conter exatamente os 25 critérios')
check(sum(c['pontos'] for c in criteria)==100, 'Pesos da rubrica devem somar 100')
for c in criteria:
    check((ROOT/c['evidencia']).is_file(), 'Evidência/referência inexistente: '+c['id'])
    if c['id'].startswith('ES') or c['id']=='DW01':
        check(c['sprints_propostas']==[1,2,3], 'Critério transversal ausente: '+c['id'])

backlog = json.loads((ROOT/'docs/Gestao/BACKLOG_PLANEJADO.json').read_text())['issues']
check(len(backlog)==107 and len({t['key'] for t in backlog})==107, 'Backlog planejado deve manter 107 chaves únicas')
check(dict(Counter(t['sprint'] for t in backlog))=={1:50,2:31,3:26}, 'Distribuição planejada alterada sem revisão')
known={t['key'] for t in backlog}
for task in backlog:
    check(all(d in known for d in task['depends_on']), 'Dependência desconhecida: '+task['key'])
requirements={f'{p}{i:02}' for p,n in [('RF',21),('RNF',8),('RP',9)] for i in range(1,n+1)}
covered={i for t in backlog for i in t['requirements']}
check(requirements <= covered, 'Requisitos sem tarefa: '+str(requirements-covered))
trace=(ROOT/'docs/avaliacao/RASTREABILIDADE.md').read_text()
for req in requirements:
    check(f'| {req} |' in trace, 'Requisito ausente na matriz: '+req)
for name in re.findall(r"'(/assets/[^']+)'", (ROOT/'database/seed.sql').read_text()):
    check((ROOT/'frontend'/name.lstrip('/')).is_file(), 'Imagem do seed inexistente: '+name)
# Scripts Python embutidos: validar sintaxe sem executar credenciais/ações.
for path in (ROOT/'.github/workflows').glob('*.yml'):
    source=path.read_text()
    for match in re.finditer(r"(?m)^( +)python3 - <<'PY'\n(.*?)^\1PY$",source,re.S|re.M):
        body='\n'.join(line[len(match[1]):] for line in match[2].splitlines())
        try: ast.parse(body)
        except SyntaxError as exc: errors.append(f'{path.name}: Python inválido: {exc}')
for name in ['configurar-abp.yml','configurar-project.yml']:
    source=(ROOT/'.github/workflows'/name).read_text()
    check('  push:' not in source, name+': configuração externa deve ser manual')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'OK: {len(files)} arquivos, links locais, 25 critérios/100 pontos, 107 tarefas e 38 requisitos.')
print('Pendências de produto/Figma/participação permanecem em docs/avaliacao/AUDITORIA.md.')
