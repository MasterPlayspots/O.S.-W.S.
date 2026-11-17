# UNIFORCE Workspace – Installation und Agentenübergabe

Stand 17.11.2026, Version 0.3. Ausgangspunkt der Umsetzung: `3b82b64a85a1546c495a876443d6eb3f8cd9f499` in `MasterPlayspots/O.S.-W.S.`. Ziel ist zunächst ein prüfbarer lokaler Arbeitsplatz. Eine Übertragung des Codes ist noch kein Anschluss an produktive Daten.

## 1. Vorprüfung am Zielgerät

```sh
pwd
git status --short
git log -1 --oneline
node --version
npm test
```

Vorhandene Änderungen erhalten. Den geprüften Feature-Stand in einem eigenen Checkout/Worktree öffnen. Keine Tokens, CLI-Anmeldedateien oder Runtime-Daten von einem anderen Rechner übernehmen. Eigene Anmeldung am vertrauenswürdigen Ziel-Host verwenden. Die private Datenablage außerhalb des Git-Checkouts bestimmen und vorhandene Daten vor Updates sichern.

Reversibilität: Neuer Checkout und separater Datenordner; Beenden mit Strg+C. Kein Autostart, keine Dienste, DNS-, Access- oder Tunneländerungen. Rückkehr zur bisherigen Version durch Start des bisherigen Checkouts. Bestehende persönliche Daten nicht überschreiben oder löschen.

## 2. Lokalen Arbeitsplatz starten

```sh
npm start -- --project-root /ABSOLUTER/ARBEITSCHECKOUT --data-dir /PRIVATER/PFAD/uniforce-workspace
```

Im Browser desselben Rechners `http://127.0.0.1:4317/` öffnen. Auf einem entfernten Arbeits-Host bleibt der Server lokal gebunden. Ein Zugangsweg muss separat freigegeben und getestet werden; keinen ungeschützten öffentlichen Reverse-Proxy oder Tunnel erzeugen. Für den hier geprüften Stand sind weder Zielhostzugang noch Firmen-API-Zugang verfügbar.

Die Anwendung benötigt aktuell keine `npm install`- oder Build-Stufe. Fonts verwenden lokale Fallbacks. Eine spätere Paketaufnahme erhält eine eigene Versions-, Lizenz- und Buildentscheidung.

## 3. Geführt einrichten

1. Profilknopf → Projekt/Privat & Geschäftlich. Dies wählt einen persönlichen lokalen Kontext, kein Firmenprojekt-Anlegewerkzeug.
2. Drei Startseiten: Arbeitsplatz, Planung & Wissen, Review & Übergabe. Über „Seite hinzufügen“ benennen/erweitern.
3. Fenster anlegen, Titel vergeben, Seite bestimmen, Größe/Position und mobile Reihenfolge einstellen. Wichtige Fenster anheften.
4. „Aufbau begleiten“ → Arbeitsziel → Anordnung → Vorschlag. Übernehmen verändert den lokalen Entwurf, „Layout speichern“ schreibt die nächste Revision.
5. „Verbindungen“ → ausgewähltes Repo bewusst lesen. Auf „Verbundene Quellen“ wechseln; Dateien im Dropdown wählen. Fehlende Agenten bleiben als fehlend sichtbar.
6. Entwurf speichern hält Änderungen privat im Workspace-State. Optionales Übernehmen in echte Dateien bleibt zunächst gesperrt.

## 4. Modellverbindung separat prüfen

```sh
codex --version
codex login status
npm start -- --project-root /ABSOLUTER/ARBEITSCHECKOUT --data-dir /PRIVATER/PFAD/uniforce-workspace --enable-codex-planner
```

Anmeldestatus prüfen, niemals Authdateien ausgeben. Im Dialog den optionalen Codex-Aufruf bewusst wählen. Erst ein erfolgreiches, schema-validiertes Ergebnis bestätigt den Anschluss. Die in dieser Umgebung gemessene Startstörung steht in `UNIFORCE_ACCEPTANCE.md`; fehlgeschlagen ist nicht verbunden.

Die CLI-Version muss die überprüften Schutzschalter unterstützen. Keine automatische Installation/Herabstufung und kein Entfernen von Schutzschaltern bei Fehlern. Der Adapter ist ein Layoutberater, kein Coding-Executor. Nach Fehlern Ursache am Host klären und Prozess neu starten. Terminal, Pause/Resume, Chatversand und Sessionstart haben aktuell keine freigegebene Fähigkeit.

## 5. Echte Quellen anbinden

Zuerst den vorhandenen Firmenvertrag und erlaubten Projekt-/Benutzerscope read-only bestätigen. Keine direkte Datenbankkopie und keine parallele Firmen-Datenbank aufbauen. Für die UI nur erlaubte, normalisierte Metadaten in den in `RUNTIME_BRIDGE.md` beschriebenen Vertrag übersetzen. Unbekannte Werte bleiben `null`; CLI-Namen sind keine Modell-IDs.

Der Agent soll am Ziel feststellen:

| Benötigt | Nachweis vor Anschluss |
|---|---|
| Führender Projektdienst | genehmigte Projekt-IDs, zulässiger Lesescope, Response-Schema |
| Controls/A12 | erreichbarer authentifizierter Read-Endpunkt, erlaubte Felder, Fehler-/Widerrufsverhalten |
| Agentenläufe | Session-ID, tatsächliche Runtime, Modell-/Usage-Quelle, Event-ID und monotone Sequenz |
| Repo | expliziter Pfad, eigener Worktree, erreichbarer Branch/HEAD |
| Modell | erfolgreicher begrenzter Strukturaufruf, Usage oder ausdrücklich fehlende Usage |
| Personenbezogene Inhalte | Freigabe durch Quelle; keine Transkripte, Nachrichten oder privaten Inhalte im öffentlichen Repo |

Nach bestätigtem Vertrag einen eigenen Adapter implementieren; nicht frei konfigurierbare beliebige URLs, SQL oder Shellkommandos an diese Oberfläche hängen. Quelle ausweisbar machen, Staleness anzeigen und Rechteentzugs-/Doppellieferungsfälle prüfen. Lokale Eventmeldungen sind Meldungen des Importeurs, keine unabhängige kryptographische Bestätigung der Quelle.

## 6. Dateiübernahme optional

Nur in einem eigenen Arbeits-Worktree:

```sh
npm start -- --project-root /ABSOLUTER/EIGENER/WORKTREE --data-dir /PRIVATER/PFAD/uniforce-workspace --allow-file-write
```

Ausgewählte bereits verfolgte Textdatei lesen, Entwurf ändern, „Datei übernehmen“ konkret bestätigen. Die Änderung verwendet einen Basis-Hash. Zwischenzeitliche Abweichung → 409; Entwurf bleibt erhalten. Kein Commit/Push/Teststart durch diesen Knopf. Externe Editoren können weiterhin konkurrieren; keine globale Dateisperre behaupten.

## 7. Abnahme und Ende

`npm test`, Browserprüfung, Entwurf speichern/neu laden, konkurrierende Revision, Projekt-/Privatwechsel, Fensterwechsel, lokale Quellenmeldung, Wiederholungsimport, Verlauf ohne Seiteneffekt. Ergebnisse in STATE mit Datum und Commit festhalten. Nur eigenen lokalen Testprozess beenden. Produktivdeploy und bestehende Dienste bleiben separate Entscheidungen.

### Startprompt für die Ziel-Session

> Arbeite im geprüften UNIFORCE-Feature-Stand von O.S.-W.S. Lies AGENTS.md, STATE.md, diese Datei und RUNTIME_BRIDGE.md. Erhalte lokale Änderungen und den führenden Firmen-Datenbestand. Prüfe zuerst Node/Git/Tests, starte den lokalen Einzelplatz in einem separaten privaten Datenordner und verifiziere Browser + Speicher. Prüfe dann den bereits freigegebenen Controls-Lesevertrag am Ziel-Host. Implementiere nur dessen erlaubte Metadatenübersetzung in die bestehende Bridge, dokumentiere Herkunft, Scope und fehlende Rechte. Prüfe einen begrenzten Codex-Layoutaufruf nur über die eigene Ziel-Anmeldung. Ein Fehlschlag ist kein Anschluss. Keine Anmeldedateien kopieren, keine beliebige Shell freigeben, keine Dienste/DNS/Tunnel ändern und keine produktive Bereitstellung auslösen. Fehlende Zugangsinformationen konkret benennen. Danach den tatsächlich verbundenen Stand und verbleibende Abnahmen dokumentieren.
