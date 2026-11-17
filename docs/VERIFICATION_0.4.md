# Releaseprüfung 0.4.0

Datum: 17.11.2026. Basis: `feat/uniforce-workspace` bei `b8902d887960481471b5718bcfe53262271a9ae4`, aufbauend auf main `3b82b64a85a1546c495a876443d6eb3f8cd9f499`. Öffentliche White-Label-Weiterentwicklung als O.A. - O.S von ourark.io. Die Veröffentlichung erhält beide Entwicklungslinien.

## Automatisiert

`npm test`: **54/54 bestanden**, Node.js **24.22.1**, Linux. Vor der Erweiterung 47/47; sieben neue Tests prüfen Branding und Memory einschließlich Fehlerfällen. Keine npm-Abhängigkeiten installiert.

Geprüft: Layoutvalidierung/Pins, Scope-Trennung, Konflikte bei Revisionen, Entwurfspersistenz, geordnete/idempotente Events, Token-/Kosten-Semantik, begrenzte History, lokale Automationsvorschau/-aktivierung, eingeschränkte Dateizugriffe, optionale hashgeprüfte Writes, eingeschränkter Planner mit Fixtures, Host-/Origin-/Sessiongrenzen, Memory-Schema/Größe/Symlinks/Frische/Fehlercache, keine fremden Projekt-/Privatzugriffe und keine Browser-Dateipfade.

Die GitHub-Workflowdatei führt künftig Node 24/26 auf Ubuntu aus. Ein lokal bestandener Testlauf ist nicht automatisch ein abgeschlossener GitHub-CI-Lauf; dessen Ergebnis gehört zum jeweiligen Remote-Commit.

## Tatsächlich im Browser beobachtet

- O.A. - O.S-Hauptansicht mit sechs Fenstern und deutlich markierten Demo-Daten.
- Layout gespeichert: Revision 1; nach Neuladen weiterhin Revision 1.
- Lokales Repo ausdrücklich gelesen, Branch und Prüfzeit angezeigt.
- JSON-Memory ausdrücklich geprüft: vier synthetische Einträge, grüner Status und Gültigkeit.
- Memory geöffnet: vier Einträge mit Quelle und Exportfunktion.
- Suche nach `white-label`: genau ein passender Eintrag.
- Kontext-JSON heruntergeladen und gelesen: `brand-choice`, synthetische Quelle, 64-stelliger Inhaltshash, `modelContextInjected: false`.
- Echte JPEG-Aufnahmen unter `docs/screenshots/`, keine generierten Funktionsillustrationen.

Browser-Konsole zeigte Fehler der Browser-Erweiterung beim Versand eigener Metadaten. Diese lagen in `chrome-extension://…`; daraus wird weder ein Appfehler noch ein pauschaler fehlerfreier Konsolenlauf abgeleitet.

## Grenzen des Nachweises

Kein echter Modell-/Providerlauf in diesem Release-QA; Modelltests nutzen Fixtures. Keine produktive Agentensteuerung. Keine Cloud-Memory, keine Servermigration, kein Internet-/Mehrbenutzerbetrieb. Branding-Overrides wurden im Vertrag/HTTP getestet; ein vollständiger visueller Vergleich jeder kundenspezifischen Kombination ist nicht enthalten. Kein vollständiger Accessibility-/Mobilgeräte-/Betriebssystemaudit. Error-/Stale-Memory-Fälle wurden automatisiert geprüft; die Screenshots zeigen den erfolgreichen Beispielanschluss.

Ein datei-/musterbasierter Check ist kein vollständiger Secret-/DLP-Audit und keine Bestätigung einer erfolgreichen Schlüsselrotation. Private Laufzeitdaten sind nicht Teil des Release-Trees. Die Kampagne enthält 30 Motive, 120 Kanalentwürfe und vier originale Agentenrollen; Videos, Kontoverbindungen, Terminierung und Social-Veröffentlichung sind nicht erfolgt.
