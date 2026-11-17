> Historische Implementierungsnotiz (vor O.A. - O.S 0.4). Für den aktuellen Produktstand gelten README.md, STATE.md und docs/INSTALLATION.md. Frühere Markenassets sind nicht Teil der aktuellen Auslieferung.

# Installation in überprüfbaren Schritten

Stand 17.11.2026. Der aktuelle Auftrag legt die Produktentwicklung fest. Bestehende Server, Tunnel, DNS, Passwörter und private Repositories werden dadurch nicht automatisch migriert oder veröffentlicht.

Konkrete Schritt-für-Schritt-Anleitung: [INSTALLATION.md](INSTALLATION.md). Agentenauftrag und Datei-/API-Zuordnung: [AGENT_HANDOFF.md](AGENT_HANDOFF.md).

## Heute ausführbar

Der CLI-Kern deklariert technisch Node >=20. Für neue Installationen Node 24 LTS mit aktuellem Patchstand verwenden; Node 20 ist EOL. `npm install` ist nicht nötig. `npm start` öffnet den lokalen Einzelplatz-Server mit interaktivem Studio. `npm run demo` erzeugt weiterhin eine statische Vorschau. `inspect --root ...` liest nur das ausgewählte Projekt. Ausgabeordner sind neu; vorhandene Pläne werden nicht überschrieben. Rücknahme: ausschließlich den erzeugten Ausgabeordner entfernen. Keine Systeminstallation und kein Autostart.

## Ausbaufolge

| Phase | Lieferumfang | Abnahme |
|---|---|---|
| 0 · Planungskern | Inventar, Ziele, Graph, Layoutplan, Lückenaufträge | 15 lokale Tests, kein externer Effekt, Quellen/Status sichtbar |
| 1 · Geführter Start (0.2 umgesetzt) | Interaktiver Fragebogen, Vorschau, Speicherung mit Revisionen | Onboarding ohne Konnektor möglich; Nutzer kann Prioritäten/Pins korrigieren und zurücknehmen |
| 2 · Ein echter Leser (0.2: öffentliches GitHub) | Öffentliche Projektmetadaten; private Konto-/Task-/Kalenderadapter noch offen | Aktuelle Daten, Rechte und Widerruf; Timeout-/Leer-/Fehlerzustände |
| 3 · Modellanschluss | Ein echter Planungs-Runner, nachvollziehbare Ereignisse | Modellvorschläge durch denselben Validator; Usage und Budget erfasst; kein erfundener Erfolg |
| 4 · Lokale Anwendung | Plan an bestehenden Workspace-State und DOTS anbinden | Revision/409-Konflikt, Scopegrenzen, Undo, Desktop/Mobile getrennt |
| 5 · Konnektorwerkstatt | Kandidatensuche, API-Vertrag, isolierter Test, Review-Patch | Keine ungeprüfte automatische Installation; fehlende Fähigkeit erzeugt prüfbaren Auftrag |
| 6 · Begrenzte Aktionen | Dauerhafte verifizierte Mandate und kleiner Executor | Idempotenz, Widerruf, Budgetreservierung, Stopp, Wiederanlauf, externe Wirkung messbar |
| 7 · Lokale Installation | Geeignete signierte Desktop-/Agent-Hülle | Sauberer Rechner, explizite Ordnerrechte, Deinstallation; keine Tokenübernahme vom kompromittierten Gerät |
| 8 · Produktbetrieb | Serverseitige Identität, Isolation, Betriebsnachweise | Mandantentests, Wiederherstellung, Geräteabnahme; eigener Deployment-Auftrag |

## Integration mit dem bisherigen Cockpit

Der lokale gesicherte Altbestand enthält bereits Workspace-State mit Revisionierung sowie Daten-/Assistant-Gateways. Dies sind Integrationskandidaten, keine in diesem öffentlichen Kern enthaltenen Dienste. Zuerst die aktuelle Live-Version lesend feststellen, dann einen kleinen Adapter bauen. Die bisherigen Desktop-/Mobile-/Agent-Lab-Dummys bleiben bis dahin getrennte Demonstratoren.

Eine Übernahme bisher privater Codehistorie in ein öffentliches Ziel ist eine eigene Veröffentlichungsentscheidung. Dieser erste öffentliche Kern enthält ausschließlich neu erstellte Dateien und synthetische Beispiele, keine Kopie des privaten Altbestands.

## Offene Voraussetzungen

Installationsziel und sauberer Zielrechner; erstes konkretes Nutzerziel; erste freizugebende Datenquelle; Modell-/Betriebsbudget; konkrete autonome Operationsrechte. Diese Angaben werden im geführten Aufsetzen erhoben. Die Entwicklung des lokalen Planers benötigt sie noch nicht.
