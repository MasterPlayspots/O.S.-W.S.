# STATE · UNIFORCE AI Workspace 0.3

Stand: 17.11.2026. Feature-Entwicklung aus Basis `3b82b64a85a1546c495a876443d6eb3f8cd9f499` (0.2.0), isolierter Zweig `feat/uniforce-workspace`. Das bisherige Hauptbranch-/Produktionssystem wird nicht durch lokalen Start verändert.

## Übertragung und Nachweis

Der geprüfte Code wurde am 17.11.2026 in den separaten öffentlichen Branch `feat/uniforce-workspace` übertragen, Code-Commit `eed568e08a6c06f140ee83204d256480c15b3069`. Remote-Tree und geprüfter lokaler Tree stimmen exakt überein: `b3de9e0be440f56fcf90551fe73d863121568e8f`. Remote-Branches anschließend gelesen: `main` bleibt `3b82b64a85a1546c495a876443d6eb3f8cd9f499`. Kein Merge, kein Deployment, keine Zielinstallation.

`git diff --cached --check` ohne Befund nach Bereinigung. Muster-/Pfadscan über 35 übertragene Dateien: keine Treffer für die geprüften Token-/Private-Key-Muster oder ausgeschlossene Laufzeitordner. Dies war kein vollständiger Gitleaks-/DLP-Audit. Browsernachweis liegt unter `docs/verification/uniforce-desktop.jpg`. Die lokale Automation erzeugte auch bei zweifachem identischem Ereignis genau einen Entwurf.

## Auftrag und Quellen

- Nutzerauftrag: vorhandenes O.S.-W.S.-Repo für den UNIFORCE-Arbeitsalltag gemäß hochgeladenem Konzept und Handoff umbauen, prüfbar fertigstellen und zur Übertragung/Anbindung vorbereiten.
- Quellen: bereitgestellter `UNIFORCE_AI_Workspace_Handoff(1).md` einschließlich eingebetteter Repo-Integration und Variablen-/Arbeitsprozesse; `UNIFORCE_AI_Workspace_Konzept(1).pdf` (16 Seiten, visuelle Referenzen); geprüfter Repo-Basisstand; Original-Logo von `https://uni-force.de/assets/brand/header.svg` am 17.11.2026.
- Interne Arbeitsunterlagen/Runtime-Daten werden nicht in dieses öffentliche Repo übernommen. Führende Firmenstruktur bleibt außerhalb dieses persönlichen UI-/Präsentationsspeichers.

## Abgeschlossene Wellen

- [x] Remote/HEAD/Arbeitsbaum und Repo-Anweisungen gelesen; Basistests 26/26 bestanden.
- [x] Reversibler eigener Worktree; kein Frameworkwechsel, keine Paketinstallation.
- [x] UNIFORCE-Tokens, lokales Originalasset, sechs Fenster, drei Seiten, KPIs und Inspector.
- [x] Stabile Fenster-/Editorinstanzen, lokale Entwürfe, Auswahl echter Repo-Dateien, Raster/Pins/Seiten/Undo und mobile Reihenfolge.
- [x] Revisionsgeschützter Workspace-State, Konfliktbehandlung, Replay und reine Layoutwiederherstellung.
- [x] Lokaler Repo-Adapter, normalisierte Event-Bridge, SSE, Usage-Deduplizierung und abgegrenzter lokaler Automationsrunner.
- [x] Optionaler Codex-Planungsadapter implementiert; echter Startversuch durchgeführt und Fehler dokumentiert, nicht als Erfolg gezählt.
- [x] Installationsanleitung, Architektur, Bridge-Vertrag und aktuelle Integrationsmatrix geschrieben.
- [x] 47 automatisierte Tests bestanden, einschließlich HTTP-/CLI-Import, Scope-Isolation, Preview-Aktivierung, Modellvertrag und Prozess-Timeout mit synthetischer Runtime.
- [x] Browser: Entwurf speichern, Fokus/Maximieren, Layoutvorschlag, Speicherung, Verlauf, Rückkehr, echte Repo-Datei und mobile Fensterauswahl geprüft.

## Reale Grenzen / keine Scheinanbindungen

1. **Zielhost/Controls:** Hier kein Arbeitsserver-/A12-Zugang. Auch die verbundene GitHub-Reposuche nach LinuxServer und UNIFORCE lieferte keinen zugänglichen Treffer. Das ersetzt keine Prüfung am Ziel. Keine Firmen-Datenbankanbindung, keine Zielinstallation.
2. **Modell:** Codex `0.167.0-alpha.4`, vorhandene Anmeldung erkannt. Echte Aufrufe scheiterten beim internen App-Server-Start mit `Read-only file system (os error 30)`. Kein erfolgreicher LLM-Lauf und keine echte gemessene Provider-Usage dieses Arbeitsboards. Standard bleibt deterministisch.
3. **Sessionsteuerung:** importierte Metadaten, keine verbundenen PTYs/Chat-/Start-/Pause-/Cancel-Adapter. Modell-Planerabbruch betrifft ausschließlich den optionalen Layoutlauf.
4. **Optionale Komponenten:** Monaco, xterm, Three.js, Gyroskop und volle Tabgruppen nicht enthalten; CSS-2.5D klar so benannt.
5. **Abnahme:** Browserprüfung bei tatsächlich beobachteten CSS-Breiten, keine echte iPhone-/Safari-/MacBook-Hardwareabnahme. Exakte Gerätematrix und Reduced-Motion-Systemeinstellung am Ziel offen.
6. **Betrieb:** lokaler Einzelplatz, keine Mehrbenutzerrechte/VM. Keine Server-, DNS-, Access-, Tunnel- oder bestehenden Dienständerungen.

## Nächste Session: ohne Wiederholung fortsetzen

1. Diesen geprüften Feature-Stand und `docs/UNIFORCE_INSTALL.md` am freigegebenen Arbeits-Host öffnen; eigenen Datenordner bestimmen, Start + Browser prüfen.
2. Autorisierten Controls-Lesevertrag und Zielzugang bestätigen. Ausschließlich erlaubte Metadaten in den bestehenden Bridge-Vertrag normalisieren; Source-/Scope-/Widerrufs-/Idempotenztests ergänzen.
3. CLI-Startfehler auf dem Ziel-Host prüfen, begrenzten Modelllauf bestätigen und echte Usage erfassen. Erst danach weiteren Runtime-Adapter/PTY mit eigenen Rechten aufnehmen.
4. `docs/UNIFORCE_ACCEPTANCE.md` mit realen Quellenbelegen vervollständigen; Team-/Serverbetrieb getrennt freigeben und härten.

## Frühere Sitzungen (historisch)

# STATE · Adaptive Studio

Stand 17.11.2026 · Version 0.2. Fortsetzung des öffentlichen Bootstrap-Kerns.

## Produktziel

Freigegebene Werte und Quellen auf Meta-Ebene einordnen, den Nutzer geführt zu einem passenden Arbeitsplatz bringen und später fehlende Verbindungen selbständig innerhalb verifizierter Mandate bearbeiten. Das Produkt beginnt auf Makroebene und hält Layout, Daten, Regeln und Ausführung getrennt.

## Neu umgesetzt

- Drei bedienbare Onboarding-Schritte: Fokus, Quellen, Gefühl.
- Arbeitsbereiche und Prioritäten, Pins, ein bis sechs sichtbare Elemente; begründetes Desktop-Raster und separate Mobile-Stapelvorschau.
- Schwarze Glasoptik mit Glas-/Tiefenreglern, optionaler dezenter Mausneigung und Beachtung reduzierter Bewegung.
- Lokaler Node-HTTP-Server, ausschließlich Loopback; Host-/Origin-Prüfung und prozessgebundene Sitzung für API-Zugriff.
- Gespeicherte Profile je Projekt und Privat-/Geschäftlich-Kontext, Basisrevision und 409-Konflikt, atomare Ersetzung und exklusiver Writer-Lock.
- JSON-Export des aktuellen Entwurfs; tatsächliche GitHub-Metadaten nicht in Profilen persistiert.
- Ein echter, explizit ausgelöster öffentlicher GitHub-GET: Quelle, Zeitpunkt, 15-Minuten-Aktualität, begrenzte Antwortgröße, Timeout, keine Redirects oder Credentials.
- Anschlussaufgaben für weiterhin fehlende Fähigkeiten; kein gefälschter Live-Status.

Der vorhandene CLI-Planer und ausgewählte `package.json`-Inspektor bleiben nutzbar. Der Kern hat keine zusätzlichen Paketabhängigkeiten.

## Abnahme dieses Inkrements

- [x] 26/26 Tests bestanden, Node v24.22.1.
- [x] Tatsächlicher öffentlicher GitHub-Abruf im Adapter und in der Oberfläche erfolgreich.
- [x] Browser: Ziele/Pins, Regler, Revision 1 → Reload → Revision 2, Scope-Wechsel, Desktop-/Mobile-Schalter.
- [x] Ungültige Pin-/Sichtlimit-Kombination wird abgelehnt.
- [x] Veraltete Beobachtungen, Speicher-Konflikte, Fremd-Origins, Host-Rebinding, unbekannte Felder und Netzfehler geprüft.
- [x] Lokale Profile und Laufzeitdateien von Veröffentlichung ausgeschlossen; 27 Quell-/Dokumentationsdateien ohne Treffer der geprüften Secret-Muster (kein vollständiger Audit).
- [x] Temporären Browser-Vorschauprozess beendet.

Einzelheiten und Grenzen: `docs/VERIFICATION_0.2.md`. API und Speichervertrag: `docs/LOCAL_STUDIO.md`.

## Noch offen

Kein LLM/Modell-Runner, MCP-Server/Registry-Sucher, OAuth, Hintergrund-Agent, autonomer Executor, Kalender-/Chatanschluss, echter Benachrichtigungsdienst, DB-/Ontologie-Engine, Container oder universeller DOTS-Editor. Keine iPhone-/Gyroskop-/Safari-Abnahme. Keine vollständige Zustands-Historie, keine JSON-Importoberfläche. Desktop/Mobile sind Visualisierungsvarianten desselben Plans, noch keine unabhängig editierbaren vollständigen Oberflächen.

Privat/Geschäftlich trennt Profile und Quellenbindungen, aber keine Betriebssystemnutzer oder Rechte. Der lokale Sitzungsmechanismus ersetzt keine Multiuser-Authentifizierung. Der reine Planerzähler `externalActionsExecuted: 0` zählt nicht den separaten expliziten öffentlichen HTTP-Lesezugriff.

## Nächste konkrete Welle

1. Modell-Runner mit einem freigegebenen Provider, strukturiertem Ausgabeformat, Token-/Kostenlimit und Ereignisprotokoll. Vorschläge durch denselben Validator schicken; keine freie Codeausführung.
2. Freies Arbeitsziel und bestätigte Regeln auf das vorhandene Profil abbilden. Regelbasierte Planung als verlässlichen Offline-Pfad erhalten.
3. Erst danach einen konkreten fehlenden Konnektor als isolierten, testbaren Adapterentwurf vorbereiten. Rechte und externe Aktionen getrennt umsetzen; bestehende Infrastruktur erst bei eigenem Auftrag.

## Herkunft und Veröffentlichung

Öffentliches Ziel: `MasterPlayspots/O.S.-W.S.`. Geprüfter Ausgangs-HEAD: `45e06ffa668da49478a552d0cb68b081607d4bd0`. Version 0.1 wurde in `a9dcf5fbfd271b71b66ad7562d401329ac495443` implementiert. Dieses Inkrement erweitert ausschließlich den neuen öffentlichen Code; keine private Cockpit-Historie, Infrastrukturdatei oder personenbezogene Laufzeitdaten wurden übernommen.

## Reversibilität und Betrieb

Quelländerung durch Revert des 0.2-Commits rücknehmbar. Profile bleiben lokal unter `.local/profiles/`; ein Revert löscht sie nicht. Entwürfe vor Verwerfen als JSON exportierbar. Der Vorschauprozess wird mit Strg+C beendet, ohne Dienste zu installieren. Kein Serverdeploy, kein DNS-/Tunnel-/Access-Eingriff, kein Merge in das alte Cockpit-Repo und keine Nutzung von Mac-Credentials.

## Remote-Nachweis 0.2

Am 17.11.2026 auf `main` veröffentlicht: Implementierungscommit `2cf1b2a333181e67413f0cb6e99c3e5d5df4e87a`. Anschließender anonymer Git-Fetch erfolgreich; `git diff --exit-code` und `git status --short` waren leer. Die GitHub-Refs-API bestätigte denselben HEAD. Dieser Nachweis folgt als reiner Dokumentationscommit; keine erneute Codeänderung oder Ausführung.

## Installation und Agentenübergabe · 17.11.2026

Auftrag: Installationsanleitung für das Team, konkreter Weg zur Agentenintegration und ehrliche Prüfung der Vollständigkeit im öffentlichen Repository.

- Neu: `docs/INSTALLATION.md` mit Mac-Voraussetzungen, Start, Einrichtung, Update, Backup-/Rücknahmehinweisen und Fehlerhilfe. Node 24 LTS mit aktuellem Patchstand empfohlen; Node 20 trotz technischer Mindestangabe nicht mehr als neue Installation empfohlen.
- Neu: `docs/AGENT_HANDOFF.md` mit kopierbarem Coding-Agentenauftrag, vorhandenen Dateipfaden, lokalem HTTP-Beispiel und abgegrenzten Integrationspaketen. Vorgeschlagene neue Modell-/Adapterdateien ausdrücklich als noch nicht vorhanden markiert.
- Neu: `docs/INTEGRATION_MATRIX.md` mit implementierten Funktionen, offenen Verbindungen und nicht importierten privaten Altbeständen.
- README und AGENTS verlinken den Einstieg; Quellen und Installationsroadmap aktualisiert. Öffentlicher Dateibestand vor dieser Ergänzung: 27 Dateien, danach 30. Keine Produktcodeänderung, kein neuer Modellanschluss und keine Installation auf einem Nutzergerät.
- Nachweis: Den unveränderten dokumentierten Node-Beispielcode extrahiert und gegen eine isolierte lokale HTTP-Instanz ausgeführt (nur Testport angepasst): drei sichtbare Elemente, fünf Anschlussaufgaben, `modelConnected: false`, keine Profilschreibvorgänge. Prozess und temporären Testspeicher danach entfernt.
- `npm test`: erneut 26/26 bestanden, Node v24.22.1. Lokale Dokumentationslinks gültig. Keine neue Browser-/macOS-/iPhone-Abnahme in diesem Dokumentationslauf.
- Umfang/Rücknahme: ausschließlich neue beziehungsweise aktualisierte Dokumentationsdateien; per Commit-Revert rücknehmbar. Keine Secrets, private Codehistorie oder Laufzeitdaten hinzugefügt. Ausgangs-HEAD für diesen Lauf: `10f02c4ef6bae9b593e0c3ee3d1ffc5c92723874`.
