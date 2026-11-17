# Roadmap

Die Einträge sind ein Arbeitsvorrat, keine Termin- oder Lieferzusage.

| Welle | Ergebnis | Abnahme |
|---|---|---|
| 0.4 — geliefert | White-Label-Kern, Workspace, Metadaten/Usage, lokale Entwurfsautomation, Verbindungen, JSON-Memory, Dokumentation | 54 Tests und dokumentierte Desktopprüfung |
| 0.5 — Einstieg | geführte Quellenkonfiguration, English UI, bessere Mobilbedienung | Erstinstallation ohne manuelle JSON-Fehler; echte Mobil-/Tastaturprüfung |
| 0.6 — erster realer Adapter | genau eine priorisierte externe read-only Quelle, z. B. vorhandenes Wissenssystem | autorisierter Zugriff, Widerruf, Fehler/Frische und Scope-Isolation geprüft |
| 0.7 — Runtime-Brücken | verlässliche Exporte bestehender Claude-/Codex-Läufe | stabile IDs, keine doppelten Usage-Werte, keine Rohchat-/Credentialimporte |
| spätere Welle — Ausführung | begrenzte externe Aktionen mit expliziten Rechten/Budgets/Audit | Negativfälle, Abbruch, Wiederholungen und Freigaben getestet |
| spätere Welle — Team | Login, Rollen, Mandantentrennung, zentraler Betrieb | unabhängige Isolation-/Betriebsprüfung; kein Loopback-Schutz als Ersatz |
| Forschung — 3D/Zeit | optionale Three.js-Ansicht mit Zeitlayer | gleicher nutzbarer 2D-Pfad, Lesbarkeit, reduzierte Bewegung, Performancebudget |

Gute erste Beiträge: Dokumentation, Lokalisation, Accessibility, echte Mobiltests, klar begrenzter read-only Adapter. Neue Abhängigkeiten nur begründet einführen. Einen Prototyp nicht als fertig angeschlossenen Dienst dokumentieren.
