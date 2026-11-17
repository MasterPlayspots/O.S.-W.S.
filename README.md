# O.A. Workspaces · Adaptive Bootstrap

**Stand 17.11.2026 · Version 0.1 · ausführbarer Planungskern, noch kein autonom installiertes Produkt.**

Ziel: Ein Arbeitsplatz, der freigegebene Dienste und Daten versteht, Nutzerziele erfragt und daraus ein anpassbares Dashboard mit möglichst wenig unnötigen Unterbrechungen vorschlägt. Fehlende Verbindungen sollen konkrete Anschlussaufgaben erzeugen, ohne bereits mögliche Arbeit zu blockieren.

## Was jetzt funktioniert

- Ein ausdrücklich ausgewähltes Node-Projekt lesen: ausschließlich aggregierte Struktur aus `package.json`, keine Kommandos, Env-Dateien oder Kontodaten.
- Inventar und Präferenzen validieren, Projekt-/Privat-/Geschäftlich-Kontexte getrennt halten.
- Aufgaben nach angegebenen Zielen priorisieren; angeheftete Elemente erhalten, sichtbare Elemente begrenzen, Desktop-/Mobile-Views trennen.
- Fehlende Anmeldung, fehlende Fähigkeit und veralteten Nachweis unterscheiden; passende nächste Schritte erzeugen.
- Einen begründeten Plan als JSON sowie eine schwarze HTML-Vorschau erzeugen.
- **15 Tests bestanden.** Keine npm-Abhängigkeiten; Node >=20.

## Lokal ausprobieren

```sh
git clone https://github.com/MasterPlayspots/O.S.-W.S..git
cd O.S.-W.S.
npm test
npm run demo
```

Der letzte Befehl nennt einen neuen Ordner unter `.local/` mit `plan.json` und `dashboard.html`. Die HTML-Datei direkt im Browser öffnen. Es wird kein Dienst installiert, kein Hintergrundprozess gestartet und kein Konto verbunden. Die Beispiele sind synthetisch.

Eigenes, ausdrücklich ausgewähltes Projekt untersuchen:

```sh
mkdir -p .local
node bin/oa.mjs inspect --root /ABSOLUTER/PROJEKTPFAD --project demo-project --scope business > .local/inventory.json
node bin/oa.mjs plan --inventory .local/inventory.json --preferences examples/preferences.json
```

Projekt-ID und Scope im Präferenzprofil müssen zum Inventar passen. Die Beobachtung aus dem lokalen Inspektor ist 15 Minuten gültig. Der Inspektor kann derzeit nur ein Node-Projekt mit `package.json` erkennen. Eine dokumentierte Abhängigkeit ist kein Beweis für einen verbundenen Dienst.

`examples/preferences.json` steuert Ziele, Prioritäten, angeheftete Fähigkeiten, sichtbare Anzahl, Benachrichtigungsmodus, Bewegungsreduktion und Erscheinungsparameter. Glas-/Tiefenwerte stehen im Plan; der erste statische Renderer bildet noch nicht alle Gestaltungsmöglichkeiten ab.

## Was noch fehlt

Kein LLM, kein MCP-/API-Client, keine echte Konnektorsuche, kein Betriebssystemscanner, keine autonome Installation, keine Hintergrund-Agenten, kein universeller DOTS-Editor und keine serverseitige Policy-Engine sind in diesem Kern angeschlossen. Das Inventar ist eine Eingabe, keine autoritative Kontofreigabe. Ein erzeugter Plan führt keine externen Aktionen aus. `actionDecision` ist eine Modellentscheidung für die nächste Implementierung, keine Sicherheitsgrenze eines laufenden Executors.

„Ideal“ und „produktiv“ sind Nutzerziele, keine gemessene Leistungsgarantie. Nutzerkorrektur, stabile Anordnung und Pause haben Vorrang vor Layout-Experimenten während der Arbeit.

## Dokumentation

- [Zielbild und Meta-Ebenen](docs/ADAPTIVE_SYSTEM.md)
- [Geführtes Aufsetzen](docs/ONBOARDING.md)
- [Autonomie und fehlende Konnektoren](docs/AUTONOMY_AND_CONNECTORS.md)
- [Installation und nächste Ausbaustufen](docs/INSTALLATION_PLAN.md)
- [Entwicklungsstand](STATE.md)
- [Quellen](docs/SOURCES.md)

Dieses öffentliche Repository startet mit neu erstelltem Bootstrap-Code. Die zuvor lokal gesicherte private Cockpit-Historie und die umfangreichen Desktop-/Mobile-Dummys wurden hier nicht veröffentlicht. Sie bleiben ein separater Integrationsbestand; diese Erstversion ersetzt oder deployt keinen bestehenden Cockpit-Dienst. Es wurde keine neue Open-Source-Lizenz festgelegt.
