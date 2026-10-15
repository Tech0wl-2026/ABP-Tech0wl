"""Regressão: reimportação não pode apagar refinamentos humanos de issues."""
import copy
import json
import re
import textwrap
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]

class PreservarIssues(unittest.TestCase):
    def test_preserva_corpo_responsavel_estado_e_milestone(self):
        snapshot=json.loads((ROOT/'.github/abp-backlog.json').read_text())
        existing=[]
        for item in snapshot['issues']:
            existing.append({'number':item['original_number'], 'body':item['body'],
                'labels':[{'name':s} for s in item['labels']],
                'milestone':{'number':item['source_milestone']}, 'state':'open',
                'assignees':[{'login':'colaborador-real'}]})
        target=existing[0]
        target['body']='Texto refinado pelo grupo\n- [x] Revisado\n<!-- abp-task:'+snapshot['issues'][0]['key']+' -->\n'
        target['state']='closed'
        target['milestone']={'number':99}
        before=copy.deepcopy(existing)
        mutations=[]
        def api(path,method='GET',data=None):
            mutations.append((path,method,data))
            number=int(path.rsplit('/',1)[1])
            item=next(x for x in existing if x['number']==number)
            item.update(data)
            return item
        workflow=(ROOT/'.github/workflows/configurar-abp.yml').read_text()
        raw=re.search(r"(?m)^          python3 - <<'PY'\n(.*?)^          PY$",workflow,re.S).group(1)
        source=textwrap.dedent(raw)
        start=source.index('existing_issues = {}')
        end=source.index("lines = ['# Estrutura",start)
        def task_key(issue):
            return re.search(r'<!-- abp-task:(T\d+) -->',issue['body']).group(1)
        env={'snapshot':snapshot,'pages':lambda _:existing,'task_key':task_key,'api':api,
             'milestones':{i:{'number':i} for i in (1,2,3)},'source_base':'https://github.com/'+snapshot['source_repository'],
             'target_base':'https://github.com/'+snapshot['target_repository'],'re':re}
        exec(compile(source[start:end],str(ROOT/'.github/workflows/configurar-abp.yml'),'exec'),env)
        self.assertEqual(existing,before)
        self.assertEqual(mutations,[])
        self.assertEqual(len(env['imported']),107)

if __name__=='__main__':
    unittest.main()
