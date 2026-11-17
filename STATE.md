# STATE · Adaptive Bootstrap

Stand 17.11.2026 · Version 0.1.

## Produktziel

Freigegebene Systemwerte, Dienste und Meta-Ebenen erkennen; Nutzerziele geführt aufnehmen; einen anpassbaren Arbeitsplatz vorschlagen; fehlende Konnektoren als konkrete Arbeit behandeln; später innerhalb verifizierter Mandate eigenständig planen und handeln.

## Tatsächlich implementiert

- Strikt validierte Inventar-/Präferenz-Eingaben mit Projekt-/Scope-Abgleich.
- Kleiner Projekt-/Service-/DOT-Graph, explizite Prioritäten, Pins, sichtbares Limit, getrennte Desktop-/Mobile-Pläne.
- Aktualität von Beobachtungen, fehlende Fähigkeit und fehlende Anmeldung getrennt.
- Anschlussaufträge mit MCP-/API-/manuellem Fallback als Planung.
- Lokaler Inspektor für ein ausgewähltes `package.json`; nur aggregierte Struktur, begrenzte Lesegröße, keine Symlinks auf die Datei, keine Kommandos/Env-/Netzwerkzugriffe.
- CLI erzeugt JSON-Plan und eigenständige schwarze HTML-Vorschau in einem neuen lokalen Ordner; vorhandene Ausgabe wird nicht überschrieben.
- Geschlossener Aktionskatalog ohne Ausführungsfunktion.

## Verifikation

`npm test`: **15/15 bestanden**, Node v24.22.1. `npm run demo`: drei sichtbare Elemente, vier Anschlussaufgaben, null externe Aktionen. `inspect --root . --project demo-project --scope business`: lokale Projektstruktur erkannt, null Dependencies, keine Kommandos ausgeführt. Keine echte Browser-/Geräteabnahme; Renderer nur strukturell und auf sichere Textbehandlung getestet.

## Noch nicht implementiert

Interaktiver Onboarding-Fragebogen, echte MCP-/API-Verbindungen, Registry-Suche, OAuth, LLM, Hintergrundschleife, Datenbank, serverseitige Policy, Installation, Adapter-Codegenerierung, Container, messbare Produktivitätsoptimierung und Integration der bisherigen DOTS-Dummys. Diese Funktionen sind als Zielablauf dokumentiert. Der Inspektor ist keine automatische Erkennung aller Apps oder Accounts eines Mac.

## Veröffentlichung und Herkunft

Ziel ist das vom Nutzer angelegte öffentliche Repository `MasterPlayspots/O.S.-W.S.`. Dieses Inkrement enthält nur neu erstellten Code und synthetische Beispiele. Die vorherige private Cockpit-Historie bleibt separat gesichert und wird nicht durch diese Erstversion als öffentlich importiert ausgegeben. Kein Serverdeploy und keine Betriebssysteminstallation.

## Reversibilität

Lokale Erstellung: neuer Projektordner; keine Altdateien verändert. CLI-Ausgabe: neuer lokaler Ordner, durch Entfernen rücknehmbar. Geplanter Repository-Commit: ausschließlich diese neuen Dateien; mit Revert rücknehmbar. Öffentliche Git-Historie kann nach einer Veröffentlichung von Dritten kopiert sein; deshalb keine privaten Bestandsdateien übernehmen.

## Nächster Umsetzungsschritt

Den Fragebogen und den Planer an eine echte lokale Vorschau mit versioniertem Projektzustand anbinden. Danach genau einen lesenden Adapter anschließen. Erst wenn Daten und Rechte nachweisbar stimmen, Modellplanung und begrenzte Ausführung ergänzen. Detaillierte Abnahme: `docs/INSTALLATION_PLAN.md`.
