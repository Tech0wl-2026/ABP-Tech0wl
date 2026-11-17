"""Gera o burndown de uma sprint a partir das issues fechadas no GitHub.

Uso (na raiz do repositório, com o GitHub CLI autenticado):

    python3 scripts/burndown.py 3 2026-11-06 2026-11-25

Conta as issues com a etiqueta sprint:N (abertas e fechadas). Uma issue só sai
da linha "restantes" no dia em que foi fechada, no fuso America/Sao_Paulo.
Gera em docs/Gestao/burndown/: burndown-sprint-N.csv, issues-sprint-N.csv e
burndown-sprint-N.png. Requer matplotlib (pip install matplotlib).
"""
import csv, json, subprocess, sys
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

REPO = "Tech0wl-2026/ABP-Tech0wl"
FUSO = timezone(timedelta(hours=-3))  # America/Sao_Paulo, sem horário de verão
SAIDA = Path("docs/Gestao/burndown")


def buscar_issues(sprint):
    issues, pagina = [], 1
    while True:
        dados = json.loads(subprocess.check_output([
            "gh", "api", f"repos/{REPO}/issues?state=all&labels=sprint:{sprint}&per_page=100&page={pagina}"]))
        issues += [i for i in dados if "pull_request" not in i]
        if len(dados) < 100:
            return issues
        pagina += 1


def main():
    sprint, inicio, fim = sys.argv[1], date.fromisoformat(sys.argv[2]), date.fromisoformat(sys.argv[3])
    hoje = datetime.now(FUSO).date()
    issues = buscar_issues(sprint)
    total = len(issues)

    fechada_em = {}
    for i in issues:
        if i["state"] == "closed" and i["closed_at"]:
            fechada_em[i["number"]] = datetime.fromisoformat(i["closed_at"].replace("Z", "+00:00")).astimezone(FUSO).date()

    dias = [inicio + timedelta(d) for d in range((fim - inicio).days + 1)]
    linhas = []
    for n, dia in enumerate(dias):
        ideal = round(total * (1 - n / (len(dias) - 1)), 2)
        real = total - sum(1 for d in fechada_em.values() if d <= dia) if dia <= hoje else None
        linhas.append((dia, ideal, real))

    SAIDA.mkdir(parents=True, exist_ok=True)
    with open(SAIDA / f"burndown-sprint-{sprint}.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["data", "ideal", "restantes"])
        for dia, ideal, real in linhas:
            w.writerow([dia.strftime("%d/%m/%Y"), ideal, "" if real is None else real])

    with open(SAIDA / f"issues-sprint-{sprint}.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["issue", "titulo", "responsaveis", "situacao", "fechada_em"])
        for i in sorted(issues, key=lambda x: x["number"]):
            d = fechada_em.get(i["number"])
            w.writerow([f"#{i['number']}", i["title"], ",".join(a["login"] for a in i["assignees"]),
                        "Fechada" if d else "Aberta", d.strftime("%d/%m/%Y") if d else ""])

    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    fig, ax = plt.subplots(figsize=(11, 5.5), dpi=150)
    x = [d.strftime("%d/%m") for d, _, _ in linhas]
    ax.plot(x, [i for _, i, _ in linhas], "--", color="#9a9aa6", label="Ideal")
    reais = [(xx, r) for xx, (_, _, r) in zip(x, linhas) if r is not None]
    ax.plot([a for a, _ in reais], [b for _, b in reais], "-o", color="#6D39A8", linewidth=2.2, label="Restantes (real)")
    for a, b in reais[-1:]:
        ax.annotate(f"{b}", (a, b), textcoords="offset points", xytext=(6, 8), color="#6D39A8", fontweight="bold")
    ax.set_title(f"Burndown da Sprint {sprint} — {total} issues · atualizado em {hoje.strftime('%d/%m/%Y')}", fontsize=12)
    ax.set_ylabel("Issues abertas")
    ax.set_ylim(0, total + 2)
    ax.grid(axis="y", alpha=0.3)
    ax.legend()
    plt.xticks(rotation=45, fontsize=8)
    fig.tight_layout()
    fig.savefig(SAIDA / f"burndown-sprint-{sprint}.png")

    restantes = reais[-1][1] if reais else total
    print(f"Sprint {sprint}: {total} issues, {total - restantes} fechadas, {restantes} abertas em {hoje:%d/%m/%Y}.")


if __name__ == "__main__":
    main()
