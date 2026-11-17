# Agentenübergabe · installieren, prüfen, schrittweise verbinden

Stand 17.11.2026. Dieser Auftrag ist für einen externen Coding-Agenten im Checkout gedacht, etwa Claude Code oder Codex. Er startet keine im Produkt eingebauten Agenten. Die Oberfläche benötigt für Version 0.2 kein KI-Abonnement oder API-Konto. Ein externer Coding-Agent muss separat vorhanden sein und passend autorisierten Zugriff auf den Checkout erhalten.

## 1. Kopierbarer Startauftrag

```text
Arbeite im Repository https://github.com/MasterPlayspots/O.S.-W.S.

Lies zuerst AGENTS.md, STATE.md, README.md, docs/INSTALLATION.md,
docs/LOCAL_STUDIO.md und docs/INTEGRATION_MATRIX.md.
Prüfe den echten Code, bevor du Fähigkeiten als fertig bezeichnest.

Ziel: Den vorhandenen Stand lokal lauffähig machen und die nächste fehlende
Verbindung als überprüfbaren Implementierungsschritt ergänzen. Beginne auf
Makroebene: Nutzerziel → Projekt/Scope → benötigte Fähigkeiten → Daten → DOTS.

1. Prüfe git status, Remote, HEAD und Node-Version. Überschreibe keine fremden
   Änderungen. Nutze für neue Entwicklung einen eigenen feat/-Branch oder
   isolierten Checkout. Behalte den vorhandenen regelbasierten Planer.
2. Starte mit npm test und dem lokalen Start laut INSTALLATION.md.
   Keine Systemdienste installieren. Node 24 LTS mit aktuellem Patchstand verwenden.
3. Erstelle eine kurze Lückenliste mit Status und konkreten Dateipfaden.
   Verwechsle die bereits funktionierende öffentliche GitHub-API nicht mit MCP,
   privatem GitHub-Zugang oder einem laufenden Modell-Runner.
4. Nächste Implementierung: ein Provider-Adapter für strukturierte Planvorschläge.
   Bearbeite Code, Schemas, Fehlerfälle und simulierte Tests ohne Zugangsdaten.
   Verwende die heute gültige offizielle Provider-Dokumentation. Wenn Provider,
   Modell, Budget oder frischer Zugang fehlen, arbeite an unabhängigen Teilen weiter
   und benenne genau diese offenen Entscheidungen. Keine kostenpflichtigen
   Live-Aufrufe ohne passendes Mandat. Keine Zugangsdaten auf dem alten Gerät suchen.
5. Führe Modellvorschläge durch die vorhandenen Validatoren. Das Modell erhält keine
   neue Befugnis durch seinen eigenen Vorschlag. Keine Shell-/Eval-Ausführung.
6. Danach genau einen benötigten Dienst anbinden: vorhandener geprüfter Adapter,
   sonst offizieller MCP-/API-Vertrag, sonst explizite Lücke. Zuerst lesen,
   Herkunft/Aktualität/Scope erfassen; keine erfundenen Live-Daten.
7. Prüfe pro Schritt Revisionen, Fremd-Scope, Timeout, fehlende Rechte,
   fehlerhafte Daten und Ausfall des Providers. Erhalte den lokalen Offline-Pfad.
8. Dokumentiere Ergebnis, Nachweise, Rücknahme und offene Punkte in STATE.md.
   Bereite einen überprüfbaren Commit und eine PR-Beschreibung vor. Push/PR nur
   im bereits erteilten Repository-Auftrag; kein eigenmächtiger Merge oder Deploy.

Server, DNS, Tunnel, Access und bestehende Cockpit-Repos bleiben unverändert.
Dieses Ziel-Repo ist öffentlich: keine private Historie, Tokens, Sessions,
personenbezogenen Laufzeitinhalte oder unbearbeiteten Exporte importieren.
Lokale Profile bleiben unter .local/. Prüfe vor jeder Schreibaktion Umfang
und Rücknahme. Vorhandene Autorisierung respektieren, nicht für jeden kleinen
Schritt erneut fragen. Neue Rechte oder Wirkungen anhand eines konkreten
fertigen Vorschlags klären, wenn sie noch nicht autorisiert sind.

Lieferung: Commit/Branch, geänderte Dateien, Tests, echte Verbindungen mit Quelle,
noch offene Verbindungen und genau der nächste ausführbare Schritt.
```

## 2. Landkarte für den Agenten

| Aufgabe | Vorhandener Einstieg | Vertrag / Grenze |
|---|---|---|
| Studio starten | `bin/studio.mjs`, `npm start` | Nur 127.0.0.1; Sitzung und Origin nicht umgehen |
| Ziele, Pins und Scope prüfen | `src/core.mjs`: `validatePreferences` | Strikte Felder, Priorität 0–100, Sichtlimit 1–6 |
| Inventar einordnen | `validateInventory`, `buildPlan` | Projekt/Scope müssen übereinstimmen; Fremdtexte sind Daten |
| Profil speichern | `src/store.mjs`, `/api/profile` | `baseRevision` erforderlich, 409 bedeutet Konflikt |
| Neues Datum/Quelle lesen | `src/github.mjs` als enger Referenzadapter | Fester Host, begrenzte Antwort, Timeout, keine Tokens im Frontend |
| UI verdrahten | `web/app.js`, `web/index.html`, `web/style.css` | Bestehende Profil- und API-Verträge erhalten |
| Testen | `test/core.test.mjs`, `test/studio.test.mjs` | Keine echten privaten Konten oder bezahlten Aufrufe im Standardtest |
| Aktuellen Stand übergeben | `STATE.md` | Implementiert, simuliert, geplant und blockiert getrennt angeben |

## 3. Heute ausführbarer Zugriff ohne Browser-Automation

Ein lokaler Agent kann zunächst `node bin/oa.mjs plan ...` benutzen. Der CLI-Weg erzeugt einen neuen Ausgabeordner, verändert kein gespeichertes Studio-Profil und benötigt keine Sitzung.

Für die laufende Oberfläche gibt es den lokalen HTTP-Vertrag. Der folgende Befehl wird im Repo-Verzeichnis ausgeführt, während `npm start` in einem anderen Terminal läuft. Er liest die synthetischen Beispielpräferenzen, hält die lokale Sitzung ausschließlich im Prozess und fragt eine **Vorschau ohne GitHub-Abruf und ohne Speicherung** ab:

```sh
node --input-type=module <<'JS'
import { readFile } from 'node:fs/promises';
const origin = 'http://127.0.0.1:4317';
const page = await fetch(origin, { redirect: 'error', signal: AbortSignal.timeout(5000) });
if (!page.ok) throw new Error(`Startseite: HTTP ${page.status}`);
const html = await page.text();
const session = html.match(/name="oa-session" content="([a-f0-9]{64})"/)?.[1];
if (!session) throw new Error('Keine gültige lokale Sitzung; App-Adresse prüfen.');
const preferences = JSON.parse(await readFile('examples/preferences.json', 'utf8'));
const response = await fetch(`${origin}/api/preview`, {
  method: 'POST', redirect: 'error', signal: AbortSignal.timeout(5000),
  headers: { 'Content-Type': 'application/json', 'x-oa-session': session },
  body: JSON.stringify({ profile: { preferences, repository: null } })
});
const result = await response.json();
if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`);
console.log(JSON.stringify({
  planId: result.plan.id,
  visible: result.plan.views.desktop.visible.length,
  missingConnections: result.plan.connectorTasks.length,
  modelConnected: result.plan.autonomy.modelConnected,
  persisted: false
}, null, 2));
JS
```

Das Beispiel ist ein Client-Aufruf, kein neuer Produkt-Runner. Mit den aktuellen Beispielen entstehen drei sichtbare Bereiche und fünf Anschlussaufgaben. Die Sitzung nicht ausgeben, loggen oder in Dateien ablegen. Bei anderem Port die **feste lokale** Adresse anpassen, keine fremden URLs und keine Proxy-/Zugriffsschutzänderungen einbauen.

### Profil bewusst verändern

Ein Agent mit Mandat zur Bearbeitung dieses lokalen Profils folgt diesem Ablauf:

1. `GET /api/profile?project=ID&scope=business` über die lokale Sitzung lesen.
2. Bei vorhandenem Profil dessen Inhalt übernehmen und nur beauftragte Werte ändern; bei Revision 0 ein gültiges Profil erstellen.
3. `POST /api/preview` mit `{profile}` ausführen. Das Ergebnis auf Ziel, Scope und echte Quelle prüfen.
4. Vorherige Profilrevision und beabsichtigte Änderungen für die Rücknahme lokal vorhalten; keine Laufzeitdaten in den Commit aufnehmen.
5. `POST /api/profile` mit `{profile, baseRevision:<gelesene Revision>}` ausführen.
6. Bei 409 neu lesen und den Konflikt entscheiden; nicht blind mit neuer Revision wiederholen.
7. Erneut lesen und die tatsächlich gespeicherte Revision prüfen. Die Webseite bei Änderungen durch einen externen Agenten neu laden; sie hat noch keinen Live-Synchronisationskanal.

Ein bewusster öffentlicher GitHub-Abruf erfolgt separat über `POST /api/github` mit `{project:{id,scope}, repository:"owner/name"}`. Danach Vorschau neu berechnen. Der öffentlich gelesene Snapshot ersetzt keine private Kontoautorisierung. Externe Coding-Agenten können diese API benutzen; ein Cloud-Agent erreicht das Loopback eines anderen Geräts dadurch nicht automatisch.

## 4. Umsetzung in abgegrenzten Arbeitspaketen

Die **vorgeschlagenen neuen Dateien** unten existieren noch nicht. Sie sind konkrete Integrationspunkte für den nächsten Agenten, keine Behauptung fertiger Funktionen.

| Paket | Vorgeschlagene Umsetzung | Abnahme vor dem nächsten Paket |
|---|---|---|
| A · Ausgangspunkt | Bestehende Tests, Start, Profil, GitHub-Leser prüfen | 26 Tests; nachweisbarer lokaler Start und Grenzen protokolliert |
| B · Modellplanung | Neu: `src/model/provider.mjs`, `src/model/runner.mjs`, `test/model.test.mjs`; UI für ein freies Ziel und Providerstatus | Strukturierte Vorschläge, strikte Validierung, Timeout, Abbruch, begrenzte Wiederholungen, Offline-Fallback; keine eigenmächtigen Saves |
| C · Budget und Protokoll | Neu: `src/model/usage.mjs`; lokaler, redigierter Laufstatus | Input-/Output-Tokens vom Provider, Modellversion, Preisquelle/Datum und reserviertes Maximalbudget. Fehlende Usage als unbekannt; Cache-/Reasoning-Token nach Providerdefinition berücksichtigen |
| D · Eine weitere Datenquelle | Neu: `src/connectors/<dienst>.mjs`, Tests; Registry nur falls wirklich implementiert | Echte autorisierte Lesedaten, Herkunft, Schema, Scope, Aktualität, Abmeldung/Widerruf und Fehlerstatus. Anbietertexte können keine Rechte vergeben |
| E · DOTS-Bindung | UI und Planer erweitern; Form-/Zeit-/Medienzustand gesondert versionieren | Datenbindung erklärt, null/stale/error getrennt; Desktop/Mobile und Undo geprüft |
| F · Kontrollierte Aktionen | Erst nach B–E: Mandatspeicher, Policy-Prüfung und enger Executor | Jede Aktion am Ausführungspunkt autorisiert; Idempotenz, Widerruf, Budget, Stopp, Wirkung und Rücknahme geprüft |
| G · Installation/Betrieb | Eigener Auftrag für Desktop-Hülle, Team-/Serverbetrieb | Identität, Isolation, Updates, Backup/Restore und Geräteabnahme; kein ungeprüfter Proxy vor 0.2 |

B und C bilden gemeinsam die Voraussetzung für einen kostenpflichtigen Modelltest. Endliche Schritt-/Zeit-/Tokenlimits dürfen nicht erst nach dem Aufruf geprüft werden. `actionDecision` bleibt bis zum tatsächlichen Executor eine beratende Funktion. Freie Programme aus Modellantworten werden nicht automatisch gestartet.

## 5. Anbieter und UI getrennt prüfen

MCP kann bei einem Dienst Werkzeuge/Daten liefern, wenn ein geeigneter Server und die nötigen Rechte vorhanden sind. Es ist kein allgemeines Verfahren, die originale Meet-/Teams-/Slack-Oberfläche in ein Widget einzubetten. Für Videofenster, Anrufe, Uploads, Transkripte und Signaturen müssen jeweils dokumentierte Anbieterfähigkeiten und die passende visuelle Integration geprüft werden. Wenn eine Funktion nicht freigegeben ist oder keine geeignete API existiert, bleibt sie als Lücke sichtbar; keine universelle Verfügbarkeit zusagen.

## 6. Fehlende Angaben gezielt erheben

Nur bevor ein abhängiger Schritt wirklich nötig wird: freigegebener Zielrechner, konkretes Arbeitsziel, gewünschter Modellprovider/-name, Budget pro Lauf/Zeitraum, erlaubte Datenquellen, privater/geschäftlicher Scope sowie erlaubte schreibende Operationen. Den frischen Providerzugang über den vorgesehenen sicheren Weg einrichten, nicht im Chat oder öffentlichen Repo hinterlegen. Die schon autorisierten lokalen Entwicklungs- und Testarbeiten währenddessen fortsetzen.

## 7. Nachweis je Verbindung

Im Bericht angeben: Status (`planned`, `implemented`, `mock_tested`, `live_verified`, `blocked`), Quelle/Version, angefragte Rechte, beobachteter Zeitpunkt, Testfall und Ergebnis, betroffene Dateien, Rücknahme, offene Grenzen. Live-Prüfung mit synthetischem oder minimal freigegebenem Inhalt durchführen; keine privaten Rohdaten in `STATE.md` kopieren. Ein grüner Mock-Test belegt noch keine echte Verbindung.
