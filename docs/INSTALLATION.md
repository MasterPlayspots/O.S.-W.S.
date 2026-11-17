# O.A. - O.S installieren und betreiben

Stand: v0.4.0, 17.11.2026. Node.js 24+ und Git; geprüft auf Linux mit Node.js 24.22.1. Keine npm-Abhängigkeiten, keine Datenbank, kein Build. macOS/Windows sind nicht in diesem Release-Lauf geprüft; die Dateiregeln sind auf Unix abgestimmt.

## Lokal starten

```sh
git clone https://github.com/MasterPlayspots/O.S.-W.S..git oa-os
cd oa-os
npm test
npm start
```

Im Browser `http://127.0.0.1:4317/` öffnen. `npm run dev` startet zusätzlich mit der synthetischen Beispiel-Memory-Konfiguration. Eine Quelle wird erst nach Klick gelesen. Demo-Sessions sind keine laufenden Agenten.

## Dateien an den richtigen Ort legen

| Datei/Ordner | Ziel und Zweck |
|---|---|
| Git-Checkout | z. B. `/opt/oa-os/app` oder eigener Entwicklungsordner; Programmcode |
| `examples/brand.example.json` | private Kopie als `brand.json`; Name/Farben/Website |
| `examples/connections.example.json` | private Kopie als `connections.json`; Quelle, Projekt und Scope |
| `examples/memory.example.json` | private Kopie als `memory.json`; durch geeignete eigene Einträge ersetzen |
| Laufzeitprofile | eigener privater Ordner, z. B. `/var/lib/oa-os/profiles`; niemals veröffentlichen |
| `docs/screenshots/` | öffentliche echte UI-Aufnahmen mit synthetischen Inhalten |
| `docs/marketing/`, `.claude/agents/`, `.agents/` | im Checkout belassen; direkt für Claude Code nutzbar |

Absolute Pfade in den folgenden Beispielen sind bewusst Platzhalter, keine existierende Serverinstallation. Im privaten `connections.json` den Pfad `memory.example.json` zu `memory.json` ändern, wenn die Kopie so heißt. Relative Quellpfade beziehen sich auf den Speicherort der Verbindungsdatei.

```sh
npm start -- --project-root /ABSOLUT/DEIN/REPO --data-dir /PRIVAT/oa-os/profiles --brand-config /PRIVAT/oa-os/brand.json --connections-config /PRIVAT/oa-os/connections.json
```

`--project-root` ist das ausdrücklich freigegebene Repo. Es wird dem Kontext `workspace-core` / `business` zugeordnet; andere Kontexte bekommen keinen Zugriff darauf. Weitere Repo-Kontexte benötigen eine gezielte Erweiterung der Startkonfiguration/API. Memory-Verbindungen können schon jetzt je Projekt und Scope konfiguriert werden.

| Option | Wirkung |
|---|---|
| `--port 4317` | lokaler Port; bei Belegung anderen Port wählen |
| `--data-dir PATH` | persistente Profile, Layouts, Entwürfe, Events/History |
| `--project-root PATH` | erlaubte lokale Git-Wurzel; erst nach Klick lesen |
| `--brand-config FILE` | eigenes Branding beim Start laden |
| `--connections-config FILE` | explizite lokale Memory-Bindungen beim Start laden |
| `--allow-file-write` | Dateiübernahme nach Basis-Hash-Prüfung freigeben; kein Commit |
| `--enable-codex-planner` | vorhandene kompatible Codex CLI als Layoutberater erlauben |

Ohne die letzten beiden Flags bleiben Repo-Schreiben und Modellaufrufe deaktiviert. Konfigurationsänderungen werden nach Neustart geladen. Zwei Prozesse dürfen nicht denselben Profilordner gleichzeitig verwenden. Ein Speicherfehler wird nicht durch stilles Zurücksetzen kaschiert.

## Linux-Server für einen einzelnen Operator

Listener unverändert auf 127.0.0.1 lassen. Auf dem Server mit einem eigenen unprivilegierten Benutzer und privaten, nur für ihn lesbaren Verzeichnissen starten. Auf dem eigenen Rechner eine autorisierte SSH-Verbindung nutzen:

```sh
ssh -N -L 4317:127.0.0.1:4317 USER@SERVER
```

Danach lokal `http://127.0.0.1:4317/` öffnen. Kein öffentlicher Nginx-/Cloudflare-Endpunkt ist Bestandteil dieser Anleitung. Ein SSH-Tunnel macht aus der App kein Mehrbenutzersystem. Für einen dauerhaften Dienst müssen Benutzer, Pfade, Neustartpolitik und vorhandenes Prozessmanagement am konkreten Host geprüft werden.

## Vorhandene WebUI schrittweise ersetzen

1. Aktuelle Dienste, Ports, Datenpfade und Rückweg am konkreten Host dokumentieren. Keine fremden Datenbanken oder Dienste pauschal stoppen.
2. Bestehenden Code und private Daten sichern. O.A. - O.S in einem separaten Checkout mit eigenem Profilordner auf einem freien Loopback-Port starten.
3. Layout speichern/neuladen, Repo nach Klick lesen, Memory prüfen/suchen/exportieren und einen synthetischen Bridge-Import testen.
4. Reale Quellen einzeln mit festem Projekt/Scope anschließen; Herkunft, Zeitstempel und Fehlerzustände prüfen.
5. Erst nach Host-Abnahme den bisherigen Start-/Zugangsweg umstellen. Altstand für Rollback behalten. DNS, Tunnel, Serverfreigabe und Teamzugriff sind eigene Änderungen.

Dieser Release führt keine Migration auf einem vorhandenen Linux-Server aus. Er liefert ausführbaren Code, Verträge und eine konkrete Übergabe: [LINUX_HANDOFF.md](LINUX_HANDOFF.md).

## Update, Backup, Rollback

Vor einem Update laufende Arbeit speichern und den Prozess beenden. Den privaten Profil- und Konfigurationsordner mit privaten Dateirechten sichern; Memory-Quellen separat nach ihrer eigenen Sicherungsstrategie. Danach `git pull --ff-only`, `npm test`, gleiche Startargumente nutzen. Änderungen am Datenformat zuerst in einer Kopie prüfen.

Rollback: Prozess stoppen, vorigen geprüften Commit in einem separaten Checkout starten und eine kompatible Datensicherung verwenden. Alte/new Profile nicht gleichzeitig beschreiben. Der v0.4-Stand akzeptiert bestehende Layout-Theme-IDs weiter; Branding wird unabhängig davon konfiguriert. Kein automatisches Downgrade beliebiger zukünftiger Schemata.

## Fehler schnell zuordnen

| Beobachtung | Nächster Schritt |
|---|---|
| Port belegt | anderen `--port` wählen; nicht unbekannte Prozesse beenden |
| Sitzung fehlt | App unter ihrer exakten lokalen Adresse neu laden |
| Memory rot | Hostpfad, Rechte, Schema, Dateigröße und Symlinks prüfen |
| Keine Memory-Einträge | richtigen Kontext wählen, Quelle explizit prüfen, Suche leeren |
| Codex deaktiviert | nur bei Bedarf kompatible CLI am Host prüfen und Startflag setzen |
| Modell/Kosten unbekannt | Quelladapter muss den Wert melden; keine Schätzung als Messung ausgeben |
| Layoutkonflikt | neueren Stand in der UI ansehen; eigene Entwürfe bewusst beibehalten oder gespeicherten Stand laden |
