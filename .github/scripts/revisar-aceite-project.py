"""Move somente os artefatos conferidos para Em revisão no Project oficial.

Reutiliza o token de Projects já configurado. Não edita issues, responsáveis,
estimativas, iterações nem outros campos. Confere todos os corpos antes de mover.
"""
import base64
import hashlib
import json
import os
import re
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

REPO = 'Tech0wl-2026/ABP-Tech0wl'
OWNER = 'Tech0wl-2026'
NUMBER = 7
TARGET = 'Em revisão'
ALLOWED = {1,2,4,5,9,13,24,27,38,51,54,61,71,78,79,80,82,83,85,88,90,94}


def validate_manifest(data):
    if (data.get('repository'), data.get('project_owner'), data.get('project_number'), data.get('target_status')) != (REPO, OWNER, NUMBER, TARGET):
        raise RuntimeError('Manifesto não corresponde ao destino autorizado')
    entries = data.get('issues', [])
    numbers = [i.get('number') for i in entries]
    if len(numbers) != len(set(numbers)) or set(numbers) != ALLOWED:
        raise RuntimeError('Manifesto deve conter exatamente as 22 issues conferidas')
    if not re.fullmatch('[0-9a-f]{40}', data.get('reviewed_commit', '')):
        raise RuntimeError('Commit de revisão inválido')
    if any(not re.fullmatch('[0-9a-f]{64}', i.get('body_sha256', '')) for i in entries):
        raise RuntimeError('Hash de conferência inválido')
    return entries


def main():
    if os.environ.get('GITHUB_REPOSITORY') != REPO or os.environ.get('GITHUB_ACTOR') != 'breesiqueiramkt':
        raise RuntimeError('Execução restrita ao repositório e solicitante autorizados')
    project_token = os.environ.get('ABP_PROJECT_TOKEN', '')
    repo_token = os.environ.get('ABP_REPO_TOKEN', '')
    ref = os.environ['ABP_REF']
    if not project_token or not repo_token:
        raise RuntimeError('Credencial de Projects ou leitura do repositório indisponível')

    def request(url, token, payload=None):
        data = json.dumps(payload).encode() if payload is not None else None
        req = Request(url, data=data, headers={
            'Authorization': 'Bearer '+token,
            'Accept': 'application/vnd.github+json',
            'Content-Type': 'application/json',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'ABP-Aceite-Project',
        })
        try:
            with urlopen(req, timeout=45) as response:
                return json.load(response)
        except HTTPError as exc:
            raise RuntimeError('GitHub API retornou HTTP '+str(exc.code)) from None
        except URLError:
            raise RuntimeError('Falha de comunicação com a API do GitHub') from None

    def rest(path):
        return request('https://api.github.com/repos/'+REPO+path, repo_token)

    def graphql(query, variables=None):
        data = request('https://api.github.com/graphql', project_token,
                       {'query': query, 'variables': variables or {}})
        if data.get('errors'):
            message = '; '.join(e.get('message', 'Erro GraphQL') for e in data['errors'])
            for token in (project_token, repo_token):
                message = message.replace(token, '[redacted]')
            raise RuntimeError(message)
        return data['data']

    source = rest('/contents/.github/aceite-project.json?ref='+ref)
    manifest = json.loads(base64.b64decode(source['content']))
    entries = validate_manifest(manifest)
    viewer = graphql('query{viewer{login}}')['viewer']['login']
    if viewer not in (OWNER, 'breesiqueiramkt'):
        raise RuntimeError('Token de Projects não pertence às contas autorizadas')
    projects = graphql('''query{user(login:"Tech0wl-2026"){
      projectsV2(first:100){nodes{id number title url}}
    }}''')['user']['projectsV2']['nodes']
    matches = [p for p in projects if p['number'] == NUMBER and p['title'] == 'ABP Tech0wl | 2026-2']
    if len(matches) != 1:
        raise RuntimeError('Project oficial não localizado de forma única')
    project = matches[0]
    fields = graphql('''query($id:ID!){node(id:$id){... on ProjectV2{
      fields(first:100){nodes{... on ProjectV2SingleSelectField{id name options{id name}}}}
    }}}''', {'id': project['id']})['node']['fields']['nodes']
    statuses = [f for f in fields if f.get('name') == 'Status']
    if len(statuses) != 1:
        raise RuntimeError('Campo Status não localizado de forma única')
    field = statuses[0]
    options = [o for o in field['options'] if o['name'] == TARGET]
    if len(options) != 1:
        raise RuntimeError('Opção Em revisão não localizada de forma única')
    option = options[0]

    def items():
        cursor, result = None, []
        while True:
            page = graphql('''query($id:ID!,$cursor:String){node(id:$id){... on ProjectV2{
              items(first:100,after:$cursor){pageInfo{hasNextPage endCursor} nodes{
                id isArchived content{... on Issue{number repository{nameWithOwner}}}
                fieldValues(first:50){nodes{
                  ... on ProjectV2ItemFieldSingleSelectValue{name field{... on ProjectV2FieldCommon{name}}}
                }}
              }}
            }}}''', {'id': project['id'], 'cursor': cursor})['node']['items']
            result.extend(page['nodes'])
            if not page['pageInfo']['hasNextPage']:
                return result
            cursor = page['pageInfo']['endCursor']

    def status(item):
        return next((v['name'] for v in item['fieldValues']['nodes'] if (v.get('field') or {}).get('name') == 'Status'), None)

    all_items = items()
    selected = []
    # Nenhuma mutação acontece até todas as evidências e identidades conferirem.
    for entry in entries:
        issue = rest('/issues/'+str(entry['number']))
        if hashlib.sha256((issue.get('body') or '').encode()).hexdigest() != entry['body_sha256']:
            raise RuntimeError('Issue #'+str(entry['number'])+' mudou após a revisão; reavaliar antes de mover')
        match = [i for i in all_items if not i['isArchived'] and i.get('content')
                 and i['content'].get('number') == entry['number']
                 and i['content'].get('repository', {}).get('nameWithOwner') == REPO]
        if len(match) != 1:
            raise RuntimeError('Cartão ausente/duplicado/arquivado para #'+str(entry['number']))
        selected.append((entry['number'], match[0]))
    report = []
    for number, item in selected:
        before = status(item)
        changed = before != TARGET
        if changed:
            graphql('''mutation($input:UpdateProjectV2ItemFieldValueInput!){
              updateProjectV2ItemFieldValue(input:$input){projectV2Item{id}}
            }''', {'input': {'projectId': project['id'], 'itemId': item['id'],
                            'fieldId': field['id'], 'value': {'singleSelectOptionId': option['id']}}})
        report.append({'issue': number, 'before': before, 'after': TARGET, 'changed': changed})
    verified = {i['id']: i for i in items()}
    if any(status(verified.get(item['id'], {'fieldValues': {'nodes': []}})) != TARGET for _, item in selected):
        raise RuntimeError('Falha na conferência final dos cartões')
    print('ACEITE_PROJECT='+json.dumps({'project': project['url'], 'reviewed': len(report),
                                      'changed': sum(i['changed'] for i in report), 'items': report}, ensure_ascii=False))
    with open(os.environ['GITHUB_STEP_SUMMARY'], 'a') as output:
        output.write('# Artefatos enviados para revisão\n\n[Project]('+project['url']+')\n\n')
        output.write('| Issue | Antes | Depois |\n|---|---|---|\n')
        for row in report:
            output.write('| #'+str(row['issue'])+' | '+str(row['before'])+' | '+row['after']+' |\n')
        output.write('\nSomente o campo Status dos 22 cartões listados foi atualizado. Nenhuma issue foi encerrada.\n')


if __name__ == '__main__':
    main()
