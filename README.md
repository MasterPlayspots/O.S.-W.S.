# UNIFORCE · AI Workspace

**Version 0.3 · 17.11.2026 · lokal lauffähiger Entwicklungsstand.** Der bestehende O.A.-Kern wurde um den UNIFORCE-Arbeitsplatz aus dem Handoff erweitert. Node/Vanilla-ESM bleibt erhalten; keine neuen Paketabhängigkeiten.

Drei Code- und drei Sessionfenster, persönliche Seiten, Fensterkontext, Usage, gespeicherte Zustände und ein Layout-Assistent bilden den Arbeitsplatz. Die erste Ansicht enthält klar bezeichnete synthetische Beispieldaten. **Kein Produktionsdeploy und keine aktive Verbindung zu einer Firmen-Datenbank.**

## Start

Node ≥ 20 und Git im PATH. Im Checkout:

```sh
npm test
npm start
```

`http://127.0.0.1:4317/` auf demselben Rechner öffnen. Andere Ports: `npm start -- --port 4318`. Keine Paketinstallation erforderlich. Beenden: Strg+C. Bisheriges Onboarding: `/setup`; CLI `bin/oa.mjs` und `/api/profile`, `/api/preview`, `/api/github` bleiben verfügbar.

Für den ausdrücklich ausgewählten Arbeitsbestand:

```sh
npm start -- --project-root /ABSOLUTER/PROJEKTPFAD --data-dir /PRIVATER/PFAD/workspace-state
```

Das Repo wird erst nach **Verbindungen → Repo jetzt lesen** gelesen. Der Adapter ist an `workspace-core/business` gebunden; andere Projekt-/Privatkontexte erhalten dessen Dateien nicht. „Verbundene Quellen“ zeigt importierte Metadaten, keine Demo-Agenten. Dateiinhalte öffnen erst nach Auswahl im Fenster.

## Was funktioniert

- UNIFORCE-Farben und lokal gespeichertes Originallogo; lizenzierte Schriftassets sind nicht beigefügt, System-/Serif-Fallbacks greifen.
- Sechs stabile Fensterinstanzen; Verschieben und Größenänderung im breiten Raster, Pin, Minimieren, Maximieren, Duplizieren, Schließen/Wiederöffnen. Seitenauswahl und Fensterliste für Mobile. Eigenständige mobile Reihenfolge, Desktop-Geometrie bleibt erhalten.
- Code-/Notizentwürfe speichern, Seiten anlegen/umbenennen, Fenster zwischen Seiten verschieben, Undo für 40 Layoutschritte. Dateidropdown und eigener Sessionkontext pro Fenster.
- Projekt-/Scope-Speicher mit Writer-Lock, atomaren Dateien und Revisionen. Konflikt 409 behält den Entwurf; „Stand prüfen“ erlaubt eine bewusste neue Basis.
- Letzte 40 Snapshots und ein nur lesender Verlauf. Wiederherstellung betrifft ausschließlich das Layout. Fehlende historische Dateiversionen werden nicht durch aktuellen Code ersetzt.
- Lesender Repo-Adapter und normalisierte lokale Event-Bridge. Cursor-SSE, Wiederholungserkennung und strenge Streamsequenzen.
- Usage-Ledger mit Snapshotersetzung, expliziten Deltas, finalen Korrekturen, unbekannten Werten statt Null und getrennten Kostenwährungen/Herkünften.
- Regelbasierte Layoutvorschläge mit Vorschau/Übernahme/Speichern. Optionaler Codex-CLI-Adapter für strukturierte Vorschläge, standardmäßig aus.
- Geprüfte Aktivierung lokaler Ein-Schritt-Abläufe. Manuell geliefertes Ereignis erzeugt einen privaten Review-/Berichtsentwurf; keine Nachricht, kein Deployment, kein Teststart.
- Optionale CSS-2.5D-Übersicht; produktive Bearbeitung in 2D, Reduced Motion und Pausenschalter.

## Modellanschluss

```sh
npm start -- --enable-codex-planner
```

Nur auf einem Arbeits-Host mit eigener funktionsfähiger Codex-Anmeldung. Kein Tokenimport. Der Adapter überprüft benötigte CLI-Funktionsschalter, deaktiviert Werkzeuge/Unteragenten/Websuche und liefert ausschließlich einen begrenzten Layoutvorschlag. Ein Lauf maximal 60 Sekunden, keine parallelen Läufe, 10 Sekunden Mindestabstand. Das ist **kein finanzieller Kosten-Cap**. Vor einem Aufruf werden nur das eingegebene Layoutziel und Fenster-IDs/Typen/Pins übergeben, keine Codeinhalte.

**Verifikationsgrenze 17.11.:** Codex CLI `0.167.0-alpha.4` und bestehende Anmeldung erkannt. Der echte Vorschlagslauf scheiterte hier beim internen App-Server-Start an `Read-only file system (os error 30)`. Deshalb kein erfolgreicher Modellanschluss behauptet. Die Vertrags-/Timeouttests verwenden eine ausdrücklich synthetische CLI. Erfolgreiche spätere Modellläufe erfassen nur tatsächlich gemeldete Usage; nicht gemeldetes Modell und Geldkosten bleiben unbekannt.

## Anschluss und Übergabe

- [Installation für Claude Code / Codex](docs/UNIFORCE_INSTALL.md)
- [Architektur und Datenverträge](docs/WORKSPACE_ARCHITECTURE.md)
- [Lokale Runtime-Bridge](docs/RUNTIME_BRIDGE.md)
- [Prüfstand und offene Abnahme](docs/UNIFORCE_ACCEPTANCE.md)
- [Aktueller Entwicklungsstand](STATE.md)
- [Integrationsmatrix](docs/INTEGRATION_MATRIX.md)

## Betriebsgrenzen

Die App bindet nur an `127.0.0.1` und prüft Host, Origin und lokalen Sitzungskopf. Sie ist **ein lokaler Einzelplatz**, keine Anmeldung, VM, Mandantentrennung oder Sandbox für beliebigen Code. Zugriff auf denselben Rechner ist nicht durch die Privat-/Geschäftlich-Auswahl abgesichert. Kein öffentlicher Tunnel zu diesem Prozess.

Persönliche Layouts, Entwürfe, importierte Metadaten und Snapshots liegen standardmäßig in `.local/profiles/`, vollständig von Git ausgeschlossen. Kein Betriebssystem-/Home-Scanner. Keine privaten Cockpit-Archive oder internen Arbeitsunterlagen im öffentlichen Repo. Wichtige private Zustände vor einem Update separat sichern; atomare Ersetzung ersetzt keine Backupstrategie.

Optionales `--allow-file-write` erlaubt bewusst bestätigte Änderungen an ausgewählten, bereits verfolgten Textdateien im angegebenen Repo. Basis-Hash muss passen, es erfolgt kein Commit. Nur in eigenem Worktree verwenden: Die Hashprüfung ersetzt keine Sperre gegen unabhängige externe Dateischreiber.

Noch offen: produktiver Controls/A12-Vertrag und Zugriff, echte Claude-/Gemini-/Codex-Sessionsteuerung, PTY/Terminal, Benchmark-Läufe, Kalender/Kommunikation/Meet, vollständige Tabgruppen und Split-Semantik, Monaco/xterm/Three.js, echtes iPhone/Safari und Mehrbenutzerbetrieb. Die vorhandene CSS-Tiefe ist kein Three.js-Renderer.
