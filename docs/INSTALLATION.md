# Installation und erster Start · O.A. Workspaces 0.2

Stand: 17.11.2026. Ziel: das vorhandene Studio auf einem freigegebenen lokalen Rechner starten. Dieser Ablauf installiert keinen Serverdienst, verändert keine bestehende Infrastruktur und verbindet keine privaten Konten.

## 1. Voraussetzungen auf dem Mac

- Einen vertrauenswürdigen, für die Arbeit freigegebenen Rechner verwenden. Keine Tokens oder Schlüssel aus einer ungeklärten Altinstallation übernehmen. Für Version 0.2 ist überhaupt kein API-Token nötig.
- **Node.js 24 LTS mit aktuellem Patchstand** installieren, falls nicht vorhanden: [offizielle Downloadseite](https://nodejs.org/en/download). Dort die 24er-Reihe und macOS wählen; die zum Gerät passende Architektur verwenden, bei Apple Silicon ARM64. Lokal wurde mit 24.22.1 getestet, nicht mit allen Node-/macOS-Versionen.
- Git muss vorhanden sein. Falls `git --version` keinen Git-Befehl findet: [offiziell dokumentierter macOS-Weg](https://git-scm.com/install/mac), beispielsweise Apples Command Line Tools über `xcode-select --install`. Eine vorhandene funktionierende Git-Installation genügt.

Vorab in Terminal prüfen:

```sh
node --version
npm --version
git --version
```

Technisch deklariert `package.json` noch `node >=20`; das ist keine Empfehlung, Node 20 neu zu installieren. Laut [Node-Releaseübersicht](https://nodejs.org/en/about/previous-releases), geprüft am 17.11.2026, ist Node 20 EOL, Node 24 weiterhin LTS. Für diese Anleitung ist 24 die getestete Hauptversion; neuere Hauptversionen wurden hier nicht abgenommen.

## 2. Repo laden und prüfen

Einen freien Projektordner verwenden. Der folgende Clone legt den Ordner `oa-workspaces` neu an; bei einem bereits vorhandenen Ordner nicht überschreiben, sondern den Update-Ablauf unten verwenden.

```sh
git clone --branch main https://github.com/MasterPlayspots/O.S.-W.S..git oa-workspaces
cd oa-workspaces
git remote get-url origin
git rev-parse HEAD
npm test
```

Der Repository-Name endet tatsächlich mit einem Punkt; deshalb enthält die Clone-URL vor `git` zwei Punkte. Der lokal gewählte Ordnername ist einfacher. Für diesen öffentlichen Clone ist keine GitHub-Anmeldung erforderlich.

Erwartung für Stand 0.2: **26 Tests bestanden**. Bei einem Testfehler anhalten und den Fehler prüfen. Keine Installation von npm-Abhängigkeiten nötig; `npm install`, Docker, Datenbank und `.env` sind für diesen Stand nicht erforderlich.

## 3. Studio starten

Im Projektordner:

```sh
npm start
```

Das Terminal bleibt offen. Es nennt normalerweise:

```text
http://127.0.0.1:4317/
```

Diese Adresse im Browser **desselben Rechners** öffnen. Auf macOS geht das in einem zweiten Terminal auch mit:

```sh
open http://127.0.0.1:4317/
```

Wenn der Port belegt ist, zuerst prüfen, ob das Studio bereits läuft. Einen fremden Prozess nicht beenden. Für einen sonst freien Port:

```sh
npm start -- --port 4318
```

Dann die tatsächlich ausgegebene Adresse verwenden. Zwei Instanzen dürfen nicht denselben Profilspeicher beschreiben; ein anderer Port umgeht den Writer-Lock nicht.

## 4. Erste Einrichtung

1. Projekt-ID, beispielsweise `ourark`, und Privat/Geschäftlich wählen; „Profil laden / neu beginnen“ anklicken. Das aktive Profil steht darunter.
2. In **Fokus** Bereiche wählen, Prioritäten einstellen und gewünschte Elemente anheften. Die Zahl der Pins darf das Sichtlimit nicht überschreiten.
3. In **Quellen** `MasterPlayspots/O.S.-W.S.` eintragen und „Quelle jetzt lesen“ klicken. Der Projektüberblick muss als Arbeitsbereich ausgewählt sein, damit seine Karte erscheint. Es werden nur öffentliche Repository-Metadaten gelesen.
4. In **Gefühl** Glas, Tiefe, sichtbare Anzahl und Bewegungsreduktion einstellen. Desktop und Mobile sind getrennte Darstellungen desselben Plans.
5. „Arbeitsplatz speichern“ klicken; **Revision 1** beziehungsweise die nächste Revision erscheint. Seite neu laden und prüfen, dass die Einstellungen erhalten sind.
6. Vor größeren Änderungen den aktuellen Entwurf mit **JSON ↓** exportieren. Der Export enthält Präferenzen und den öffentlichen Repository-Namen. Ein Import-Button ist noch nicht vorhanden.

Tasks, Kalender, Kommunikation und KI sind derzeit gewünschte Bereiche mit Anschlussplänen. Ihre Auswahl meldet dich bei keinem Anbieter an. Der GitHub-Abruf funktioniert ohne Anmeldung; nach 15 Minuten gilt sein Snapshot als veraltet, nach einem Neustart muss er erneut bewusst gelesen werden.

## 5. Beenden, wieder öffnen, aktualisieren

Im laufenden Terminal **Strg+C** drücken. Beim nächsten Mal im selben Projektordner wieder `npm start` ausführen. Ein neuer Checkout enthält nicht automatisch die Profile eines alten Checkouts.

Vor einem Update: Studio beenden und lokale Profile außerhalb des Repositorys sichern. In einem **unveränderten** Checkout:

```sh
git status --short
```

Nur wenn die Ausgabe leer ist und ihr auf `main` arbeitet:

```sh
git pull --ff-only
npm test
npm start
```

Bei lokalen Änderungen oder abweichender Historie nicht mit Reset/Force weitermachen. Erst Änderungen sichern oder in einem separaten Checkout testen. Eine frühere Codeversion zunächst in einem neuen Ordner mit eigenen Testprofilen prüfen; kein älteres Programm ungeprüft auf neuere Profildaten loslassen.

## 6. Wo liegen Daten und wie erfolgt die Rücknahme?

| Inhalt | Ort / Verhalten |
|---|---|
| Quellcode | Geklonter Projektordner |
| Gespeicherte Profile | `.local/profiles/` im Projektordner; von Git ausgeschlossen |
| Aktiver Browserkontext | Browser-LocalStorage: nur Projekt-ID und Scope |
| Öffentliche GitHub-Snapshots | Prozessspeicher; nicht als Profil gespeichert |
| JSON-Export | Downloadordner des Browsers |
| Sitzungsschlüssel | Pro Prozess, nicht als Datei und nicht in URLs |

Die Anwendung legt keinen Autostart oder Systemdienst an. Rücknahme: Prozess beenden; Projektordner nach Sicherung der benötigten Profile entfernen. Node/Git sind separate Werkzeuge und werden dabei nicht entfernt. Zum Backup bei gestoppter Anwendung den gesamten Profilordner in ein privates, geeignet geschütztes Ziel kopieren. Eine Wiederherstellung ist manuell und in einer separaten Testkopie zu prüfen; es gibt noch keine automatische Backup-/Restore-Funktion oder vollständige Versionshistorie.

## 7. Häufige Stolperstellen

| Anzeige | Vorgehen |
|---|---|
| `node: command not found` | Node installieren, Terminal neu öffnen, Version prüfen |
| `EADDRINUSE` | Eigenen schon laufenden Prozess nutzen oder beenden; andernfalls freien Port wählen |
| Profilspeicher gesperrt | Laufende Instanz prüfen. Nur nach sicherem Beenden aller Studio-Prozesse einen nach Absturz verbliebenen `.local/profiles/.writer-lock` entfernen; nicht die Profile |
| HTTP 403 / Sitzung fehlt | Exakte ausgegebene `127.0.0.1`-Adresse verwenden und Seite neu laden; nicht `localhost`, LAN-IP oder Proxy einsetzen |
| HTTP 409 beim Speichern | Entwurf exportieren, Profil neu laden und Änderungen vergleichen; kein automatisches Überschreiben |
| GitHub nicht gefunden / Zugriff begrenzt | Öffentlichen `owner/name` prüfen; bei Limits später erneut versuchen. Keine Tokens in Eingabefelder schreiben |
| Keine KI-Antwort | Erwartet: noch kein Modell-Runner integriert |
| Adresse auf iPhone nicht erreichbar | Erwartet: 127.0.0.1 zeigt dort auf das iPhone, nicht den Mac |

## 8. iPhone, Team und Serverbetrieb

Die Mobile-Schaltfläche ist eine lokale Vorschau, keine veröffentlichte mobile App. Für iPhone-Zugriff oder Team-Betrieb fehlen noch eine freigegebene Betriebsumgebung, echte Authentifizierung/Autorisierung und passende Netz-/Sitzungsgrenzen. Die bestehenden Host- und Origin-Prüfungen nicht lockern, um dies kurzfristig zu umgehen. Dieser Installationsauftrag gibt keinen Eingriff in bestehende Server, Tunnel oder DNS frei.

Weiter: [Agentenübergabe](AGENT_HANDOFF.md), [Integrationsmatrix](INTEGRATION_MATRIX.md), [lokaler API-Vertrag](LOCAL_STUDIO.md).
