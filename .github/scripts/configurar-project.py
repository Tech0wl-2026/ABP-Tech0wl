"""Configura o Project da ABP sem acessar ou publicar o valor dos segredos.

O token temporário ABP_PROJECT_TOKEN é usado somente na API de Projects.
O GITHUB_TOKEN com contents:read/issues:read lê o repositório e seu planejamento.
Reexecuções preservam responsáveis, estados e valores já preenchidos nos itens.
"""

import base64
import collections
import datetime
import json
import os
import re
import time
from urllib.error import HTTPError
from urllib.parse import quote
from urllib.request import Request, urlopen


REPO = os.environ["GITHUB_REPOSITORY"]
EXPECTED_REPO = "Tech0wl-2026/ABP-Tech0wl"
TITLE = "ABP Tech0wl | 2026-2"
OWNER = "Tech0wl-2026"
PROJECT_TOKEN = os.environ.get("ABP_PROJECT_TOKEN", "")
REPO_TOKEN = os.environ["ABP_REPO_TOKEN"]
REF = os.environ["ABP_REF"]
WARNINGS = []
DATES = {
    1: ("2026-09-28", "2026-10-22"),
    2: ("2026-10-23", "2026-11-05"),
    3: ("2026-11-06", "2026-11-25"),
}
FIELD_FRAGMENT = """
  ... on ProjectV2FieldCommon { id name dataType }
  ... on ProjectV2SingleSelectField { options { id name color description } }
  ... on ProjectV2IterationField {
    configuration {
      iterations { id title startDate duration }
      completedIterations { id title startDate duration }
    }
  }
"""


def request(url, token, data=None, method=None):
    """No exception includes request headers or token values."""
    body = json.dumps(data, ensure_ascii=False).encode() if data is not None else None
    req = Request(url, data=body, method=method, headers={
        "Authorization": "Bearer " + token,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "ABP-Project-Setup",
    })
    try:
        with urlopen(req, timeout=60) as response:
            return json.load(response)
    except HTTPError as exc:
        raise RuntimeError("GitHub API retornou HTTP " + str(exc.code)) from None


def rest(path):
    return request("https://api.github.com/repos/" + REPO + path, REPO_TOKEN)


def contents(path):
    result = rest("/contents/" + quote(path, safe="/") + "?ref=" + quote(REF, safe=""))
    return json.loads(base64.b64decode(result["content"]))


def graphql(query, variables=None):
    result = request("https://api.github.com/graphql", PROJECT_TOKEN,
                     {"query": query, "variables": variables or {}})
    if result.get("errors"):
        # Only API error messages, never the payload or headers.
        messages = "; ".join(e.get("message", "Erro GraphQL") for e in result["errors"])
        for token in (PROJECT_TOKEN, REPO_TOKEN):
            if token:
                messages = messages.replace(token, "[redacted]")
        raise RuntimeError(messages)
    return result["data"]


def mutation(name, input_type, data, selection):
    result = graphql("mutation($input:" + input_type + "!){" + name +
                     "(input:$input){" + selection + "}}", {"input": data})
    time.sleep(0.8)
    return result[name]


def project_fields(project_id):
    result = graphql("query($id:ID!){node(id:$id){... on ProjectV2{"
                     "fields(first:100){nodes{" + FIELD_FRAGMENT + "}}}}}", {"id": project_id})
    return {f["name"]: f for f in result["node"]["fields"]["nodes"]}


def project_items(project_id):
    items, cursor = [], None
    while True:
        data = graphql("""query($id:ID!,$cursor:String){node(id:$id){... on ProjectV2{
          items(first:100,after:$cursor){pageInfo{hasNextPage endCursor} nodes{
            id isArchived content{... on Issue{id number url repository{nameWithOwner}}}
            fieldValues(first:50){nodes{
              ... on ProjectV2ItemFieldSingleSelectValue{name optionId field{... on ProjectV2FieldCommon{name}}}
              ... on ProjectV2ItemFieldIterationValue{iterationId title field{... on ProjectV2FieldCommon{name}}}
              ... on ProjectV2ItemFieldDateValue{date field{... on ProjectV2FieldCommon{name}}}
              ... on ProjectV2ItemFieldNumberValue{number field{... on ProjectV2FieldCommon{name}}}
            }}
          }}
        }}}""", {"id": project_id, "cursor": cursor})["node"]["items"]
        items.extend(data["nodes"])
        if not data["pageInfo"]["hasNextPage"]:
            return items
        cursor = data["pageInfo"]["endCursor"]


def options(definitions):
    return [{"name": name, "color": color, "description": description}
            for name, color, description in definitions]


def ensure_field(project_id, fields, name, data_type, **config):
    if name in fields:
        if fields[name]["dataType"] != data_type:
            raise RuntimeError("Campo existente com tipo incompatível: " + name)
        return fields[name]
    mutation("createProjectV2Field", "CreateProjectV2FieldInput", {
        "projectId": project_id, "name": name, "dataType": data_type, **config,
    }, "projectV2Field{" + FIELD_FRAGMENT + "}")
    fields.update(project_fields(project_id))
    return fields[name]


def filled_values(item):
    return {v["field"]["name"]: v for v in item.get("fieldValues", {}).get("nodes", []) if v.get("field")}


def set_missing_values(project_id, item, values):
    current = filled_values(item)
    pending = [(field_id, value) for name, (field_id, value) in values.items() if name not in current]
    if not pending:
        return
    declarations, calls, variables = [], [], {}
    for index, (field_id, value) in enumerate(pending):
        var = "v" + str(index)
        declarations.append("$" + var + ":UpdateProjectV2ItemFieldValueInput!")
        calls.append(var + ":updateProjectV2ItemFieldValue(input:$" + var + "){projectV2Item{id}}")
        variables[var] = {"projectId": project_id, "itemId": item["id"], "fieldId": field_id, "value": value}
    graphql("mutation(" + ",".join(declarations) + "){" + " ".join(calls) + "}", variables)
    time.sleep(1)


def main():
    if REPO.lower() != EXPECTED_REPO.lower():
        raise RuntimeError("Automação limitada ao repositório oficial da ABP")
    if not PROJECT_TOKEN:
        raise RuntimeError("Configure o secret de Actions ABP_PROJECT_TOKEN (escopo project)")
    plan = contents("docs/Gestao/BACKLOG_PLANEJADO.json")
    if plan["repository"].lower() != REPO.lower():
        raise RuntimeError("Planejamento não corresponde ao repositório")
    tasks = plan["issues"]
    if len(tasks) != 107 or collections.Counter(t["sprint"] for t in tasks) != {1: 50, 2: 31, 3: 26}:
        raise RuntimeError("Distribuição do planejamento difere da configuração validada 50/31/26")
    issues = {}
    page = 1
    while True:
        batch = rest("/issues?state=all&per_page=100&page=" + str(page))
        issues.update({i["number"]: i for i in batch if "pull_request" not in i})
        if len(batch) < 100:
            break
        page += 1
    for task in tasks:
        issue = issues[task["github_issue_number"]]
        if "<!-- abp-task:" + task["key"] + " -->" not in (issue["body"] or ""):
            raise RuntimeError("Identificador divergente na issue " + str(issue["number"]))

    viewer = graphql("query{viewer{id login}}")['viewer']
    if viewer["login"].lower() != OWNER.lower():
        raise RuntimeError("O token deve pertencer à conta dona do Project: " + OWNER)
    cursor, existing = None, []
    while True:
        result = graphql("""query($owner:String!,$cursor:String){user(login:$owner){
          projectsV2(first:100,after:$cursor){nodes{id title number url}
          pageInfo{hasNextPage endCursor}}
        }}""", {"owner": OWNER, "cursor": cursor})["user"]["projectsV2"]
        existing.extend(p for p in result["nodes"] if p["title"] == TITLE)
        if not result["pageInfo"]["hasNextPage"]:
            break
        cursor = result["pageInfo"]["endCursor"]
    if len(existing) > 1:
        raise RuntimeError("Há mais de um Project com o título esperado; selecionar explicitamente antes de alterar")
    project = existing[0] if existing else mutation("createProjectV2", "CreateProjectV2Input",
        {"ownerId": viewer["id"], "title": TITLE}, "projectV2{id title number url}")["projectV2"]
    project_id = project["id"]
    print("PROJECT_URL=" + project["url"], flush=True)
    readme = """# ABP Tech0wl · Portal de Certificação em Metodologias Ágeis

Planejamento oficial do 1º DSM da Fatec Jacareí, 2026-2.

| Sprint | Período | Entrega | Atividades |
|---|---|---|---|
| Sprint 1 | 28/09–22/10 | Figma completo dos RF01–21; modelagem conceitual, lógica e física; DER; dicionário; DDL PostgreSQL; UML | 50 |
| Sprint 2 | 23/10–05/11 | Implementação do portal e motor da certificação; autenticação, estudos, questões, cronômetro e persistência | 31 |
| Sprint 3 | 06/11–25/11 | Resultados, certificado, QR Code, validação pública, histórico, testes e entrega final | 26 |

## Como assumir uma atividade
1. Confira critérios de aceite e dependências da issue.
2. Atribua a issue a si em Assignees. Se não tiver permissão, peça acesso ao administrador.
3. Mova o Status para Em andamento e crie sua branch a partir de develop.
4. Vincule o Pull Request, as evidências e mova para Em revisão.
5. Use Concluído após revisão e validação dos critérios de pronto.

Daily Scrum de 15 minutos: realizado desde a última reunião, próximo passo e impedimentos.
Registre atas reais em docs/Daily Scrum. Registros reconstruídos devem permanecer identificados.

As datas Início/Prazo representam a janela planejada da sprint, não evidência de início efetivo.
Estimativas e responsáveis devem ser definidos pela equipe. Nenhuma atividade foi concluída automaticamente.

Repositório: https://github.com/Tech0wl-2026/ABP-Tech0wl
"""
    mutation("updateProjectV2", "UpdateProjectV2Input", {
        "projectId": project_id, "public": True,
        "shortDescription": "ABP · Fatec Jacareí · 1º DSM · Portal de Certificação Ágil · 3 sprints, 107 atividades",
        "readme": readme,
    }, "projectV2{id url public}")
    repo_id = rest("")["node_id"]
    try:
        mutation("linkProjectV2ToRepository", "LinkProjectV2ToRepositoryInput", {
            "projectId": project_id, "repositoryId": repo_id,
        }, "repository{id nameWithOwner}")
    except RuntimeError as exc:
        WARNINGS.append("Vínculo à aba Projects do repositório: " + str(exc))

    fields = project_fields(project_id)
    status_options = options([
        ("Backlog", "GRAY", "Atividade disponível; conferir dependências antes de iniciar"),
        ("Pronto para iniciar", "BLUE", "Critérios e dependências conferidos pela equipe"),
        ("Em andamento", "YELLOW", "Responsável executando a atividade"),
        ("Em revisão", "PURPLE", "Aguardando revisão de PR e evidências"),
        ("Concluído", "GREEN", "Critérios de pronto validados pela equipe"),
    ])
    status = fields.get("Status")
    if status:
        old_options = {o["name"]: o for o in status["options"]}
        # Preserve identities for already localized options.
        for option in status_options:
            if option["name"] in old_options:
                option["id"] = old_options[option["name"]]["id"]
        if [o["name"] for o in status["options"]] != [o["name"] for o in status_options]:
            # Existing non-empty projects are not reset automatically.
            if project_items(project_id):
                raise RuntimeError("Status diferente em Project com itens; revisar antes de modificar opções")
            mutation("updateProjectV2Field", "UpdateProjectV2FieldInput", {
                "fieldId": status["id"], "singleSelectOptions": status_options,
            }, "projectV2Field{" + FIELD_FRAGMENT + "}")
            fields.update(project_fields(project_id))
    else:
        ensure_field(project_id, fields, "Status", "SINGLE_SELECT", singleSelectOptions=status_options)

    iterations = []
    for number, (start, end) in DATES.items():
        duration = (datetime.date.fromisoformat(end) - datetime.date.fromisoformat(start)).days + 1
        iterations.append({"title": "Sprint " + str(number), "startDate": start, "duration": duration})
    ensure_field(project_id, fields, "Sprint", "ITERATION", iterationConfiguration={
        "startDate": DATES[1][0], "duration": 14, "iterations": iterations,
    })
    ensure_field(project_id, fields, "Área", "SINGLE_SELECT", singleSelectOptions=options([
        ("Gestão", "GRAY", "Scrum e documentação da equipe"),
        ("Figma", "PINK", "Protótipo e fluxos de interface"),
        ("Modelagem", "BLUE", "Banco de dados, DER, dicionário e SQL"),
        ("UML", "PURPLE", "Diagramas UML e comportamento do sistema"),
        ("Front-end", "YELLOW", "Interface e integração do portal"),
        ("Back-end", "GREEN", "API, regras de negócio e persistência"),
        ("Conteúdo", "ORANGE", "Estudos e banco de questões"),
        ("Infra", "GRAY", "Ambiente, versionamento e entrega"),
        ("Testes", "RED", "Verificação, evidências e correções"),
    ]))
    ensure_field(project_id, fields, "Prioridade", "SINGLE_SELECT", singleSelectOptions=options([
        ("Alta", "RED", "Prioridade alta registrada na issue"),
        ("Normal", "BLUE", "Prioridade normal registrada na issue"),
    ]))
    for name, kind in [("Estimativa", "NUMBER"), ("Início", "DATE"), ("Prazo", "DATE")]:
        ensure_field(project_id, fields, name, kind)

    sprint_config = fields["Sprint"]["configuration"]
    all_iterations = sprint_config["iterations"] + sprint_config["completedIterations"]
    sprint_ids = {}
    for expected in iterations:
        found = [i for i in all_iterations if all(i[k] == expected[k] for k in expected)]
        if len(found) != 1:
            raise RuntimeError("Iteração ausente ou datas divergentes: " + expected["title"])
        sprint_ids[expected["title"]] = found[0]["id"]
    select_ids = {name: {o["name"]: o["id"] for o in fields[name]["options"]}
                  for name in ("Status", "Área", "Prioridade")}
    area_names = {"gestao": "Gestão", "figma": "Figma", "modelagem": "Modelagem", "uml": "UML",
                  "frontend": "Front-end", "backend": "Back-end", "conteudo": "Conteúdo",
                  "infra": "Infra", "testes": "Testes"}
    item_map = {i["content"]["id"]: i for i in project_items(project_id) if i.get("content")}
    added = 0
    for index, task in enumerate(sorted(tasks, key=lambda t: (t["sprint"], t["key"])), 1):
        issue = issues[task["github_issue_number"]]
        item = item_map.get(issue["node_id"])
        if item is None:
            item = mutation("addProjectV2ItemById", "AddProjectV2ItemByIdInput", {
                "projectId": project_id, "contentId": issue["node_id"],
            }, "item{id}")["item"]
            item_map[issue["node_id"]] = item
            added += 1
        labels = {l["name"] for l in issue["labels"]}
        priority = "Alta" if "prioridade:alta" in labels else "Normal"
        sprint = "Sprint " + str(task["sprint"])
        values = {
            "Status": (fields["Status"]["id"], {"singleSelectOptionId": select_ids["Status"]["Backlog"]}),
            "Sprint": (fields["Sprint"]["id"], {"iterationId": sprint_ids[sprint]}),
            "Área": (fields["Área"]["id"], {"singleSelectOptionId": select_ids["Área"][area_names[task["area"]]]}),
            "Prioridade": (fields["Prioridade"]["id"], {"singleSelectOptionId": select_ids["Prioridade"][priority]}),
            "Início": (fields["Início"]["id"], {"date": DATES[task["sprint"]][0]}),
            "Prazo": (fields["Prazo"]["id"], {"date": DATES[task["sprint"]][1]}),
        }
        set_missing_values(project_id, item, values)
        if index % 10 == 0 or index == len(tasks):
            print("Atividades configuradas: " + str(index) + "/" + str(len(tasks)), flush=True)

    # Public API supports layout, filter and visible columns. No undocumented web endpoints.
    schema = graphql('query{__type(name:"Mutation"){fields{name}}}')
    mutations = {f["name"] for f in schema["__type"]["fields"]}
    views = graphql("query($id:ID!){node(id:$id){... on ProjectV2{views(first:100){nodes{id name layout filter}}}}}",
                    {"id": project_id})["node"]["views"]["nodes"]
    desired_views = [
        ("Backlog geral", "TABLE_LAYOUT", ""),
        ("Quadro da Sprint 1", "BOARD_LAYOUT", 'sprint:"Sprint 1"'),
        ("Quadro da Sprint 2", "BOARD_LAYOUT", 'sprint:"Sprint 2"'),
        ("Quadro da Sprint 3", "BOARD_LAYOUT", 'sprint:"Sprint 3"'),
        ("Minhas atividades", "TABLE_LAYOUT", "assignee:@me"),
        ("Roadmap por Sprint", "ROADMAP_LAYOUT", ""),
    ]
    visible_names = ["Title", "Status", "Sprint", "Assignees", "Área", "Prioridade", "Início", "Prazo", "Estimativa", "Milestone", "Labels"]
    visible = [fields[name]["id"] for name in visible_names if name in fields]
    if "createProjectV2View" in mutations and "updateProjectV2View" in mutations:
        by_name = {v["name"]: v for v in views}
        for index, (name, layout, filter_text) in enumerate(desired_views):
            view_config = ({"configuration": {"visibleFieldIds": visible}}
                           if layout != "ROADMAP_LAYOUT" else {})
            view = by_name.get(name)
            # Reuse only the untouched default view of a newly created project.
            if not view and not existing and index == 0 and len(views) == 1:
                view = views[0]
            if not view:
                view = mutation("createProjectV2View", "CreateProjectV2ViewInput", {
                    "projectId": project_id, "name": name, "layout": layout,
                    **view_config,
                }, "projectV2View{id name layout filter}")["projectV2View"]
            mutation("updateProjectV2View", "UpdateProjectV2ViewInput", {
                "viewId": view["id"], "name": name, "layout": layout, "filter": filter_text,
                **view_config,
            }, "projectV2View{id name layout filter}")
    else:
        WARNINGS.append("A API desta conta não expõe criação e edição de visualizações")

    verified = project_items(project_id)
    linked = {i["content"]["id"]: i for i in verified if i.get("content")}
    counts = collections.Counter()
    for task in tasks:
        issue = issues[task["github_issue_number"]]
        item = linked.get(issue["node_id"])
        if not item:
            raise RuntimeError("Issue ausente do Project: " + str(issue["number"]))
        values = filled_values(item)
        if values.get("Sprint", {}).get("iterationId") != sprint_ids["Sprint " + str(task["sprint"])]:
            raise RuntimeError("Sprint divergente na issue " + str(issue["number"]))
        for name in ["Status", "Área", "Prioridade", "Início", "Prazo"]:
            if name not in values:
                raise RuntimeError("Campo não preenchido: " + name + " na issue " + str(issue["number"]))
        counts[task["sprint"]] += 1
    final = graphql("""query($id:ID!){node(id:$id){... on ProjectV2{
      id number url title public repositories(first:20){nodes{nameWithOwner}}
      views(first:100){nodes{id name layout filter}} items(first:1){totalCount}
    }}}""", {"id": project_id})["node"]
    report = {"project": final, "added": added, "verified_issues": len(tasks),
              "sprint_counts": dict(counts), "iterations": all_iterations, "warnings": WARNINGS}
    print("PROJECT_REPORT=" + json.dumps(report, ensure_ascii=False), flush=True)
    summary = ["# Project oficial da ABP", "", "[Abrir Project](" + project["url"] + ")", "",
               "107 issues verificadas · Sprint 1: 50 · Sprint 2: 31 · Sprint 3: 26.", "",
               "Responsáveis e estimativas preservados. Estados existentes não foram redefinidos."]
    for warning in WARNINGS:
        summary.append("\n- " + warning)
    with open(os.environ["GITHUB_STEP_SUMMARY"], "a", encoding="utf-8") as output:
        output.write("\n".join(summary) + "\n")


if __name__ == "__main__":
    main()
