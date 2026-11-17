# Integrationsmatrix · aktueller Stand 0.3

17.11.2026. Die folgende Tabelle ersetzt für die Hauptoberfläche die darunter archivierte 0.2-Bewertung.

| Baustein | Jetzt implementiert | Tatsächlich angeschlossen / verbleibend |
|---|---|---|
| UNIFORCE-Shell | sechs Fenster, drei Seiten, Kontext, KPIs, mobile Einzelansicht | Browser mit synthetischen Fixtures geprüft |
| Fenster/Layout | Pin, Raster, Resize, Maxi/Minimieren, Duplikat, Seiten, Undo, Revision | volle Tabgruppen, echter Split und freie Mobile-Geometrie offen |
| Persistenz/Verlauf | lokale Scoped-Dateien, 409, 40 Snapshots, Layout-Restore | kein Firmen-/Multiuser-Backend, kein Backupservice |
| Repo | gezielter Git-/Textleser, optionaler Hash-geprüfter Dateischreiber | Lesen im ausgewählten Entwicklungsrepo geprüft |
| Runtime-Bridge | lokale JSONL-/HTTP-Metadaten, Cursor-SSE, Deduplizierung | synthetischer End-to-End-Import geprüft; kein produktiver Controls-Adapter |
| Modellplaner | opt-in Codex CLI, geprüfte JSON-Antwort, Pins, Übernahme, Usage | echte CLI erkannt; Aufruf am internen App-Server durch Read-only-Dateisystem blockiert |
| Token/Kosten | Request/Attempt, Snapshot/Delta, finale Korrektur, Null statt -1, Währungen | reale externe Sessionfeeds fehlen; Fixtures sind ausdrücklich Demo |
| Automationen | Vorschau, versionsgebundene Aktivierung, lokaler Ein-Schritt-Runner | manuelle Ereignisse; kein externer Executor oder Firmenlistener |
| Code/Terminal | native bearbeitbare Entwürfe, Quelldateien, Git-Statistik | Monaco/Diffeditor/xterm/PTY optional und nicht enthalten |
| Raum/Zeit | CSS-2.5D und echter lokaler Snapshotverlauf | kein Three.js/WebGL, kein Gyroskop, keine begehbare Welt |
| Controls/A12, Kalender, Chat, Meet | Lücken und Anschlussvertrag dokumentiert | Zielzugang, autorisierte APIs und reale Adapter fehlen |
| Betriebsstufe | Loopback-Einzelplatz; Installations-/Übergabeanleitung | kein Serverdeploy, keine VM, kein Teamlogin |

[Prüfstand](UNIFORCE_ACCEPTANCE.md) · [Installation](UNIFORCE_INSTALL.md) · [Datenvertrag](RUNTIME_BRIDGE.md)

---

## Archiv: 0.2

# Was ist im Repo – und was muss noch verbunden werden?

Stand: 17.11.2026. Ausgangspunkt ist der geprüfte öffentliche 0.2-Stand `10f02c4ef6bae9b593e0c3ee3d1ffc5c92723874`. Die folgende Matrix dokumentiert Implementierung, nicht bloß Produktwünsche. „Im Repo“ bedeutet Code oder ausdrücklich bezeichnete Dokumentation; eine API-Beschreibung ist keine aktive Anbieteranbindung.

| Bereich | Status | Beleg im Repo | Nächste Verbindung / Abnahme |
|---|---|---|---|
| Lokaler Start | Implementiert | `bin/studio.mjs`, `src/server.mjs`, `package.json` | Node/Git am Zielgerät; Tests und Browserstart |
| Geführtes Onboarding | Implementiert: Fokus, Quellen, Gefühl | `web/index.html`, `web/app.js` | Freies Arbeitsziel und weitergehende Präferenzen ergänzen |
| Regeln für sichtbare Elemente | Implementiert: Priorität, Pins, Sichtlimit | `src/core.mjs` | Validierte Modellvorschläge auf dieselben Eingaben abbilden |
| Lokale Profile | Implementiert: Projekt/Scope, Revision, 409 | `src/store.mjs`, `src/server.mjs` | Historie, Import und Wiederherstellung ergänzen |
| Desktop / Mobile | Implementiert: Raster und Stapel | `src/core.mjs`, `web/style.css`, `web/app.js` | Eigenständige Layoutbearbeitung und echte Geräteprüfung |
| Glas / Tiefe / Neigung | Implementiert: Regler, Mausneigung, Reduced Motion | `web/style.css`, `web/app.js` | iPhone-Gyroskop, freie Formen, Zeitverhalten fehlen |
| Ausgewähltes lokales Projekt | Implementiert: aggregiertes `package.json` | `src/inspect.mjs`, `bin/oa.mjs` | Explizite Auswahl weiterer Quellen; kein OS-Gesamtscanner |
| GitHub öffentlich | Echter anonym lesender API-Adapter | `src/github.mjs`, `test/studio.test.mjs` | Nur Metadaten; Code/Issues-Inhalte/Private-Repos separat umsetzen |
| Ontologie | Erzeugter Projekt-/Service-/DOT-Graph | `src/core.mjs`, `docs/ADAPTIVE_SYSTEM.md` | Persistente DB, Abfragen, Herkunft und Änderungshistorie fehlen |
| KI-Chat / Modellwechsel | Planungsziel, kein Modell angeschlossen | `model.execute` im Kern, `STATE.md` | Provider, strukturierte Ausgabe, Budget, Usage, Fehler-/Abbruchpfad |
| Claude-/Codex-artiges Agent Lab | Zielbild; nicht in 0.2 enthalten | `STATE.md`, ursprünglicher Produktauftrag | Runner, Isolation, Benchmarks, Tokenmessung und Oberfläche fehlen |
| Kalender / Aufgaben / Glocke | Gewünschte Fähigkeiten und Anschlusspläne | `calendar.read`, `tasks.read` in `src/core.mjs` | Echter Leseadapter; danach Task-Zeitstempel und Kontextöffnung |
| Gemeinsamer Chat / Dateien | Gewünschte Fähigkeiten | `messages.read`, `files.read` in `src/core.mjs` | Je Anbieter autorisierte APIs, Scope und Datenbindung |
| Meet / Teams / Slack / Zoom / weitere | Nicht verbunden | Anschlussstrategie in `docs/AUTONOMY_AND_CONNECTORS.md` | Tatsächliche API-/MCP-Fähigkeiten und visuelle Einbettung getrennt prüfen |
| MCP | Strategie dokumentiert, kein Transport/Server | `docs/AUTONOMY_AND_CONNECTORS.md`, `docs/SOURCES.md` | Protokollversion, Discovery, Auth, Tool-Verträge implementieren |
| Vollständiger DOTS-Editor | Nicht importierter Integrationsbestand / Ziel | Hinweis in `README.md`, `STATE.md` | Freie Form, Raster, Ebenen, Medien, Trigger, Uhren, Glow/Blink und Undo integrieren |
| 3D / begehbare Welten / Blender | Integrationsziel | Ursprünglicher Produktauftrag; kein entsprechender Code in diesem Repo | Freigegebenen Bestand auswählen, Lizenz/Verträge und Renderer-Grenze prüfen |
| Policy / Nutzungsrechte | Geschlossener beratender Aktionskatalog | `actionDecision` in `src/core.mjs` | Autorisierte Laufzeitprüfung, Mandate, Budgets, Widerruf und Audit fehlen |
| Autonomes Handeln | Noch nicht implementiert | `STATE.md` | Modell-Runner → Adaptertests → begrenzter Executor; keine Selbstfreigabe |
| Räume / Einmalcodes / Transkripte / Signaturen | Zielbild, kein produktiver Dienst | Kein ausführender Code in 0.2 | Identität, Isolation, Einwilligung, Medien-/Signaturdienst und Nachweise implementieren |
| Server / Desktop-App / VM | Kein Installer, kein Deployment, keine VM | Lokaler Server in `src/server.mjs` | Separater Betriebsauftrag und echte Isolation nötig |
| Tests und Übergabe | Enthalten | `test/`, `STATE.md`, `AGENTS.md`, `docs/` | Pro Änderung relevante Tests und dokumentierte Abnahme |

## Was ausdrücklich nicht hier angehängt ist

- Die vollständige private Historie des ursprünglichen Cockpits.
- Die zuvor separat gesicherten umfangreichen HTML-Dummys, Blueprint-Dateien und Archive. Deren Bestand wurde in früheren Sitzungen beschrieben; dieses Inkrement hat sie nicht neu geladen oder öffentlich importiert.
- Der aktuelle Server-Code, Live-Release, private Infrastrukturkonfiguration und personenbezogene Laufzeitstände.
- Tokens, Sessions, private Kontoinhalte und lokale Profile.

Für einen späteren Import muss der genaue Bestand bereitgestellt oder über einen freigegebenen privaten Zugriff gelesen werden. Ein Agent soll daraus zunächst Manifest, Rechte-/Lizenzprüfung und bereinigten Patch erstellen. Ein privates Archiv nicht pauschal in dieses öffentliche Repo kopieren. Ohne Quellmaterial bleibt die Integration offen; ein Platzhalter zählt nicht als Übernahme.

## Was „alles verkabeln“ in dieser Version konkret bedeutet

Schon möglich: lokale Anwendung starten, Profil über CLI/HTTP vorbereiten, GitHub-Metadaten ausdrücklich lesen, einen validierten Plan ansehen und das Profil mit Basisrevision speichern. Noch zu entwickeln: Modellplanung, zusätzliche echte Adapter, freie DOTS-Bearbeitung und autonome Ausführung. Die [Agentenübergabe](AGENT_HANDOFF.md) zerlegt diese Arbeit in prüfbare Schritte und trennt bereits ausführbare Befehle von vorgeschlagenen neuen Dateien.
