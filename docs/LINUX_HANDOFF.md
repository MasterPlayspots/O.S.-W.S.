# Claude Code — Linux- und Integrationsübergabe

Diesen Prompt in der bestehenden Claude-Code-Sitzung im aktuellen Checkout verwenden:

```text
Übernimm O.A. - O.S von ourark.io auf Basis des aktuellen main-Stands.
Lies AGENTS.md, README.md, STATE.md, docs/INSTALLATION.md,
docs/INTEGRATIONS.md und docs/MEMORY.md vollständig.

Bewahre bestehende Arbeit und private Daten. Prüfe den konkreten Linux-Host:
aktuelle WebUI, Dienste, Ports, Besitzer, Datenverzeichnisse, Startbefehle
und Rückweg. Keine privaten Inhalte oder Credentials in das öffentliche Repo.

Starte den neuen Code zunächst isoliert mit privatem Profilordner auf einem
freien Loopback-Port. Verwende Node.js 24+, npm test und einen Browsercheck.
Konfiguriere Name/Theme über brand.json und Quellen über connections.json.
Lege beide Dateien mit geeigneten Rechten außerhalb des Repos ab.

Prüfe Layout speichern/neuladen, Repo lesen, eigene freigegebene Memory lesen,
Suchergebnis und Export. Importiere erst synthetische Metadaten, danach die
explizit freigegebenen realen Daten. Pro Quelle Projekt/Scope, Rechte,
Herkunft, letzte Prüfung, Frische und verständlichen Fehlerzustand nachweisen.
Keine Sessionsteuerung oder Modellinjektion aus einer Statusmeldung ableiten.

Ersetze den bisherigen WebUI-Zugangsweg erst nach dokumentierter Abnahme
und vorhandener Rückfallmöglichkeit im tatsächlich autorisierten Umfang.
Erhalte den Loopback-Listener; kein öffentlicher Proxy ohne eigenes
Auth-/Autorisierungs-/Betriebskonzept. Berichte konkrete Blocker am Host.

Die Marketingproduktion ist separat anhand
 docs/marketing/CLAUDE_CODE_HANDOFF.md auszuführen.
Aktualisiere STATE und liefere Commit, Startkonfiguration ohne Geheimnisse,
Test-/Browsernachweise, funktionierende Quellen und verbleibende Lücken.
```

Benötigte Dateien liegen bereits im Repository; nichts in fremde Systemordner kopieren, bevor deren Funktion am Host feststeht. Die Beispiele enthalten synthetische Inhalte. Dieses Dokument ist keine Bestätigung einer bereits erfolgten Serverumstellung.
