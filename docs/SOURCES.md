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
