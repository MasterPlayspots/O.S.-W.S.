# O.A. Workspaces · Adaptive Studio

**Stand 17.11.2026 · Version 0.2 · lokaler, interaktiver Bootstrap mit echtem öffentlichem GitHub-Leser.**

Ein Arbeitsplatz, der ausgewählte Quellen einordnet, deine Prioritäten aufnimmt und daraus ein begründetes, anpassbares Board vorschlägt. Du beginnst auf Projektebene; fehlende Anschlüsse werden als konkrete nächste Schritte sichtbar.

## Starten

Für neue Installationen empfehlen wir Node 24 LTS mit aktuellem Patchstand; getestet wurde die 24er-Reihe. Die technische Mindestangabe bleibt `>=20`, Node 20 ist inzwischen EOL. Keine zusätzlichen npm-Pakete erforderlich.

**Einstieg:** [Installationsanleitung](docs/INSTALLATION.md) · [Startauftrag für Coding-Agenten](docs/AGENT_HANDOFF.md) · [Was ist enthalten?](docs/INTEGRATION_MATRIX.md)

```sh
git clone https://github.com/MasterPlayspots/O.S.-W.S..git
cd O.S.-W.S.
npm test
npm start
```

Die ausgegebene Adresse `http://127.0.0.1:4317/` im Browser **auf demselben Rechner** öffnen. Ein anderer Port ist mit `npm start -- --port 4318` möglich. Beenden mit Strg+C. Es gibt keinen Autostart, keinen Serverdeploy und keine Installation auf deinem Mac. Eine URL mit 127.0.0.1 ist kein öffentlicher Demo-Link und erreicht vom iPhone aus nicht den Mac.

## Jetzt bedienbar

1. **Fokus:** Arbeitsbereiche auswählen, Prioritäten verändern, Elemente anheften. Ein bis sechs Elemente bleiben sichtbar; weitere kommen in die Ablage.
2. **Quellen:** Ein öffentliches GitHub-Repository als `owner/name` eintragen und bewusst lesen. Der Projekt-DOT zeigt echte Sprache, offene Issues einschließlich Pull Requests und den Beobachtungszeitpunkt. Kein Token, kein privater Kontozugriff.
3. **Gefühl:** Schwarze Glasoptik und Tiefe per Regler einstellen, Bewegung reduzieren, Desktop- und Mobile-Vorschau wechseln.
4. **Speichern:** Projekt und Privat-/Geschäftlich-Kontext erhalten getrennte lokale Profile. Revisionen verhindern stilles Überschreiben aus einem zweiten Fenster. Ein Entwurf kann als JSON exportiert werden.

GitHub wird nur beim Klick auf „Quelle jetzt lesen“ kontaktiert. Ein frischer Snapshot wird 15 Minuten zwischengespeichert; später kennzeichnet die Oberfläche ihn als veraltet. Ein Neustart verwirft die Snapshots und erfordert einen erneuten bewussten Abruf. Die anderen Arbeitsbereiche zeigen Anschlussbedarf statt erfundener Live-Daten.

## Daten und Grenzen

Präferenzen und der ausgewählte öffentliche Repository-Name liegen unter `.local/profiles/`, das von Git ausgeschlossen ist. Die Browserablage merkt sich nur den zuletzt gewählten Projektkontext. GitHub-Snapshots bleiben im Prozessspeicher. Es werden keine Tokens, Nachrichten, Kalendereinträge oder Repository-Inhalte gespeichert.

Der lokale Server bindet ausschließlich an `127.0.0.1`, prüft Host/Origin und benötigt für API-Aufrufe eine zufällige Sitzung aus der lokalen Seite. Das ist eine Einzelplatz-Anwendung, **keine Benutzeranmeldung, Mandantentrennung, VM oder Sandbox für fremden Code**. Wer Zugriff auf denselben Rechner/Prozess hat, ist nicht durch die Privat-/Geschäftlich-Auswahl ausgesperrt. Profile werden atomar ersetzt, besitzen aber noch keine historische Wiederherstellung oder Sicherung gegen Stromausfall. Vor wichtigen Änderungen den JSON-Export verwenden.

**Noch nicht angeschlossen:** LLM, MCP-Discovery, OAuth, Kalender/Chats, Hintergrund-Agenten, autonomer Executor, universeller DOTS-Editor, Gyroskop, Modell-Benchmarks und Container. Benachrichtigungsmodi werden nur als Präferenz gespeichert. Agenten können den dokumentierten lokalen JSON-Vertrag verwenden; die Anwendung selbst startet noch keine Agenten.

Die Planung bleibt deterministisch. Pins und explizite Prioritäten bestimmen die Anordnung. „Ideal“ und „produktiv“ sind Ziele, keine gemessene Garantie. `actionDecision` ist weiterhin kein Autorisierungsmechanismus für einen echten Executor. Der Zähler `externalActionsExecuted` gehört zum reinen Planer; der separat ausgelöste öffentliche HTTP-Lesezugriff ist in `source.evidence` nachgewiesen.

## CLI weiterhin verfügbar

```sh
npm run demo
mkdir -p .local
node bin/oa.mjs inspect --root /ABSOLUTER/PROJEKTPFAD --project demo-project --scope business > .local/inventory.json
node bin/oa.mjs plan --inventory .local/inventory.json --preferences examples/preferences.json
```

`demo` erzeugt einen neuen Ordner mit JSON und statischer HTML-Vorschau. `inspect` liest nur aggregierte Struktur aus dem ausgewählten `package.json`; keine Skripte, Env-Dateien oder Kontodaten. Beispiele sind synthetisch, vorhandene Ausgabeordner werden nicht überschrieben. Der statische Renderer besitzt weniger Darstellungsmöglichkeiten als das interaktive Studio.

## Nachweise und Weiterarbeit

- [Installation auf dem Mac und Fehlerhilfe](docs/INSTALLATION.md)
- [Agentenübergabe mit ausführbarem API-Beispiel](docs/AGENT_HANDOFF.md)
- [Vollständigkeit und offene Verbindungen](docs/INTEGRATION_MATRIX.md)
- [Entwicklungsstand und nächste Schritte](STATE.md)
- [Lokale API, Speicherung und Adaptervertrag](docs/LOCAL_STUDIO.md)
- [Browser- und Testnachweis](docs/VERIFICATION_0.2.md)
- [Meta-Ebenen](docs/ADAPTIVE_SYSTEM.md) · [Onboarding](docs/ONBOARDING.md)
- [Autonomie und Konnektoren](docs/AUTONOMY_AND_CONNECTORS.md)
- [Installationsfolge](docs/INSTALLATION_PLAN.md) · [Quellen](docs/SOURCES.md)

Dieses öffentliche Repository enthält neu erstellten Bootstrap-Code. Die private Cockpit-Historie und bisherigen Desktop-/Mobile-Dummys bleiben ein separater Integrationsbestand. Bestehende Dienste wurden nicht verändert. Es wurde keine neue Open-Source-Lizenz festgelegt.
