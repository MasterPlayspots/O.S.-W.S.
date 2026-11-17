# Quellen und Entscheidungen

Stand / Abruf: 17.11.2026. Primärquellen begründen Integrationsentscheidungen, nicht die Fertigstellung des Produkts.

| Quelle | Befund / Entscheidung |
|---|---|
| Nutzeraufträge in dieser O.A.-Workspaces-Sitzung | Freie DOTS, Meta-Ebenen, getrennte Mobile-/Desktop-Views, Makro zuerst, Agentenzugriff, geführter Aufbau und autonome Bearbeitung innerhalb freigegebener Möglichkeiten |
| `src/core.mjs`, `src/inspect.mjs`, `src/render.mjs`, `test/core.test.mjs` | Tatsächlicher Implementierungsstand dieses öffentlichen Kerns |
| [MCP Specification Release 2026-07-28](https://blog.modelcontextprotocol.io/posts/2026-07-28/) | Versionsbewusster Adapter; optionale `server/discover`-Discovery; keine Vermischung mit alten Handshake-Annahmen |
| [MCP Registry Einführung](https://blog.modelcontextprotocol.io/posts/2025-09-08-mcp-registry-preview/) | Registry als Suchquelle für selbst gemeldete Metadaten; kein automatischer Vertrauensnachweis |
| [MCP Security Best Practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices) | Scope-/Zielbindung, keine Tokenweitergabe, lokale Installations- und SSRF-Grenzen bei späteren Adaptern |
| Vorheriger lokaler Cockpit-/Prototyp-Bestand dieser Sitzung | Integration vorgesehen; nicht öffentlich importiert und kein neuer Live-Nachweis |

Eine Garantie maximaler Produktivität ist keine belegte Eigenschaft. Die Zielfunktion stammt aus dem Nutzerauftrag; Messverfahren und freiwillige Erprobung müssen erst gebaut werden.

## Ergänzung 0.2 · 17.11.2026

| Quelle | Entscheidung / Nachweis |
|---|---|
| [GitHub: Get a repository](https://docs.github.com/en/rest/repos/repos#get-a-repository) | Öffentliche Metadaten anonym lesen; nur einen festen GET-Endpunkt implementieren |
| [GitHub: API versions](https://docs.github.com/en/rest/about-the-rest-api/api-versions) | Expliziter Header `X-GitHub-Api-Version: 2026-03-10` |
| [GitHub: Rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api) | Anonyme Abrufe unterliegen Limits; Cache und manuelle Aktualisierung, Fehlerzustand statt erfundener Daten |
| `src/github.mjs`, `src/server.mjs`, `src/store.mjs`, `web/` | Tatsächlich implementierter Leser, lokale API, Profile und Oberfläche |
| `docs/VERIFICATION_0.2.md`, `test/studio.test.mjs` | Echte API-/Browser-Beobachtungen und automatisierte Fehler-/Isolationsprüfungen |

## Installation und Übergabe · 17.11.2026

| Quelle | Entscheidung / Nachweis |
|---|---|
| [Node.js Releases](https://nodejs.org/en/about/previous-releases) | Node 24 weiterhin LTS, Node 20 EOL; technische Mindestangabe nicht als Installationsempfehlung behandeln |
| [Node.js Download](https://nodejs.org/en/download) | Offizielle Quelle für die unterstützte 24er-Reihe mit aktuellem Patchstand |
| [Git für macOS](https://git-scm.com/install/mac) | Git bei Bedarf über den dokumentierten Weg, etwa Apples Command Line Tools |
| GitHub Git-Refs/-Tree-API für `10f02c4ef6bae9b593e0c3ee3d1ffc5c92723874` | Alle 27 bisherigen Repo-Dateien lesend bestätigt; private Altbestände fehlen in diesem öffentlichen Stand |
| `src/server.mjs`, `src/store.mjs`, `examples/preferences.json` | Sitzungs-, Profil- und Vorschauvertrag des Agentenbeispiels gegen Implementierung abgeglichen |
