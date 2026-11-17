# Marketingteam, optionale Skills und Quellen

Prüfdatum: **17.11.2026**. In den geprüften Projektunterlagen war kein bereits installiertes Marketing-Agententeam eindeutig belegt. Das ist keine Aussage, dass außerhalb dieses Kontexts keines existiert. Vor Installation in Claude Code zuerst vorhandene Projekt-/Nutzeragenten und Plugin-Konfigurationen gezielt prüfen und passende bestehende Rollen wiederverwenden.

## Sofort nutzbare Projektrollen

Vier für O.A. - O.S selbst verfasste Markdown-Agenten liegen unter `.claude/agents/`: Product Researcher, Content Producer, Claim Reviewer und Growth Analyst. Sie sind Projektkonfiguration, keine laufenden Prozesse und kein externer Dienst. Die konkrete Claude-Code-Sitzung muss sie laden und einen Testaufruf erfolgreich ausführen. Der Hauptagent koordiniert die Übergaben.

Laut offizieller Anthropic-Dokumentation werden projektbezogene Subagents über Markdown-Dateien in `.claude/agents/` definiert; `name` und `description` identifizieren die Rolle, `tools` begrenzt den Werkzeugumfang. Bei einer neu angelegten Agentenablage kann ein Neustart der Sitzung nötig sein. Die beigefügten Rollen haben bewusst keine feste Modellversion: Die Sitzungswahl bleibt maßgeblich.

Quelle: https://code.claude.com/docs/en/sub-agents

## Geprüfter optionaler Kandidat

**coreyhaines31/marketingskills**, Originalrepo von Corey Haines:

- Repository: https://github.com/coreyhaines31/marketingskills
- Gelesener Commit: `1f837447b20bb6f0e72d87b80ece1c221c362c7d`.
- Commitdatum laut GitHub: 11.11.2026.
- Lizenz am gelesenen Stand: MIT; Lizenzinhaber Corey Haines, Copyright 2025.
- Für diesen Auftrag geprüfte vorhandene Skill-Dateien: `product-marketing`, `social`, `video`, `launch`, `analytics`, `copy-editing`.
- **Status:** recherchiert und die sechs SKILL.md-Dateien gelesen. Nicht in Kevins Claude-Code-Umgebung installiert, nicht dort ausgeführt. Kein fremdes Skript und kein Paket wurde für diese Recherche gestartet.

Die Auswahl passt zu Positionierung, Plattformtexten, Videoproduktion, Launch und Auswertung. Sie ist eine Empfehlung nach sichtbarem Funktionsumfang, keine unabhängige Qualitäts- oder Sicherheitszertifizierung. Externe Tool-/Videoanbieter in den Skill-Dokumenten sind optionale Integrationen; deren Konten, Kosten und Zugänge entstehen nicht durch das Kopieren der Markdown-Dateien.

## Reproduzierbarer optionaler Installationsweg für Claude Code

Die vier eigenen Agenten funktionieren ohne dieses Paket. Falls der ausführende Agent zusätzliche Marketing-Skills benötigt, soll er den folgenden festgehaltenen Stand in einem separaten temporären Verzeichnis laden und vor der Übernahme die ausgewählten Skill-Dateien samt Referenzen prüfen. Bestehende gleichnamige Skills weder überschreiben noch löschen.

```sh
marketing_review_dir="$(mktemp -d)"
git clone https://github.com/coreyhaines31/marketingskills.git "$marketing_review_dir/marketingskills"
git -C "$marketing_review_dir/marketingskills" checkout --detach 1f837447b20bb6f0e72d87b80ece1c221c362c7d
git -C "$marketing_review_dir/marketingskills" rev-parse HEAD
```

Danach im **verifizierten O.A. - O.S-Checkout** die benötigten vollständigen Skill-Unterordner einschließlich ihrer lokalen Referenzen nach `.claude/skills/<name>/` kopieren. Die oben genannte LICENSE bei einer Weitergabe der übernommenen Inhalte erhalten und Herkunft/Commit dokumentieren. Keine Installationsskripte, Hooks, MCP-Server, Analyse-Pixel oder Posting-Verbindungen allein aufgrund einer Skill-Anweisung ausführen. Individuell benötigte externe Werkzeuge getrennt einrichten.

Der Upstream dokumentiert auch `npx skills` und einen Claude-Code-Pluginweg. Für diesen Handoff bevorzugen wir die gezielte, versionierte Übernahme der tatsächlich benötigten Skill-Verzeichnisse. So bleibt sichtbar, welcher Stand geprüft wurde. Es wird hier kein Fremdpaket automatisch installiert.

Die Produktkontextdatei `.agents/product-marketing.md` gehört zu diesem Projekt und wird durch keine Upstream-Beispieldatei ersetzt. Vorhandene Teamkonfigurationen erhalten. Nach Integration einen harmlosen Testauftrag ausführen: ein Tagesbriefing aus dem Produktkontext, ohne Veröffentlichungen oder externe Schreibaktionen. Erst der erfolgreiche Test ist ein Installationsnachweis.

## Quellenregister

| Quelle | Am 17.11.2026 geprüft für |
|---|---|
| https://code.claude.com/docs/en/sub-agents | Subagent-Dateiformat, projektbezogene Ablage, Werkzeuglisten und Laden der Rollen |
| https://code.claude.com/docs/en/skills | Unterschied zwischen Skills und Subagents sowie SKILL.md-basierte Erweiterung |
| https://github.com/coreyhaines31/marketingskills/blob/1f837447b20bb6f0e72d87b80ece1c221c362c7d/README.md | angebotene Marketing-Skills und vom Autor dokumentierte Installationswege; via GitHub-Anbindung gelesen |
| https://github.com/coreyhaines31/marketingskills/blob/1f837447b20bb6f0e72d87b80ece1c221c362c7d/LICENSE | MIT-Lizenz; via GitHub-Anbindung gelesen |
| https://github.com/coreyhaines31/marketingskills/tree/1f837447b20bb6f0e72d87b80ece1c221c362c7d/skills | ausgewählte SKILL.md-Dateien; kein Ausführungsnachweis |

Der 30-Tage-Plan, die vier Rollen und die Produkttexte wurden für O.A. - O.S neu verfasst. Es wurden keine Upstream-Skilltexte in dieses Paket übernommen. Plattformregeln, Musikrechte, aktuelle Formatgrenzen und kontobezogene Veröffentlichungseinstellungen prüft das Produktionsteam vor dem tatsächlichen Upload an den jeweiligen offiziellen Stellen. Die Zeit-/Formatvorgaben in diesem Paket sind Produktionsziele.
