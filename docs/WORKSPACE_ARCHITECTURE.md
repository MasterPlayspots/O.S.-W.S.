> Historische Implementierungsnotiz (vor O.A. - O.S 0.4). Für den aktuellen Produktstand gelten README.md, STATE.md und docs/INSTALLATION.md. Frühere Markenassets sind nicht Teil der aktuellen Auslieferung.

# Arbeitsplatzkern 0.3

Stand: 17.11.2026. Bisheriger Node-/Vanilla-ESM-Kern bleibt erhalten. Keine neuen Laufzeitabhängigkeiten.

| Ebene | Dateien | Verantwortlichkeit |
|---|---|---|
| Darstellung | `web/workspace.html`, `tokens.css`, `workspace.css` | UNIFORCE-Shell, responsive Raster, 2.5D-Übersicht |
| Interaktion | `web/workspace.js` | Seiten, Kontext, Vorschlag/Übernahme, Quellen, Verlauf, Konfliktentscheidung |
| Fenster | `web/modules/window-manager.js` | stabile DOM-Instanzen je Window-ID; Sichtbarkeit statt Neuaufbau von Editoren |
| Inhalte | `web/modules/panes.js` | Dateibuffer, Sessionmetadaten, Aufgaben, Notizen, Usage |
| Verträge | `web/modules/contracts.js` | gemeinsame Runtime-Validierung, Raster, Pins, Scope |
| HTTP | `src/server.mjs`, `src/workspace/routes.mjs` | vorhandene Origin-/Host-/Sessiongrenze, neue explizite Routen |
| Speicher | `src/store.mjs`, `src/workspace/store.mjs` | vorhandener Prozess-Writer-Lock, getrennte Projektdateien, Revisionen, Snapshots |
| Quelle | `src/adapters/local-repo.mjs`, `bin/bridge.mjs` | ausgewähltes Repo / normalisierte lokale Ereignisse |
| Modell | `src/model/codex-planner.mjs` | optionaler, begrenzter Strukturaufruf; keine allgemeine Agentensteuerung |
| Verbrauch | `src/model/usage.mjs` | Request-/Attempt-Ledger, Korrekturen, Deltas, Herkunft |
| Ablauf | `src/automations/runner.mjs` | geschlossener Katalog für lokale Entwürfe |

## Zustände und Datenhoheit

`project.id` + `project.scope` bilden den lokalen Dateischlüssel. Layout ist Präsentationszustand; es ersetzt keine führenden Projekte/Tasks/Entscheidungen. Der private State speichert erlaubte importierte Metadaten, keine automatisch eingesammelten Arbeitsinhalte. Nutzereigene Code-/Notizentwürfe sind dagegen bewusst gespeicherte private Inhalte und dürfen nicht ins öffentliche Git.

Jede Änderung serialisiert in einer Prozesswarteschlange, prüft bei UI-Schreibvorgängen `baseRevision`, schreibt eine private temporäre Datei und ersetzt sie atomar. Derselbe Datenordner darf nicht durch weitere Prozesse außerhalb dieses Kern-Locks beschrieben werden. Noch keine Crash-/Stromausfall-Durabilitätsgarantie mit fsync.

Maximal 12 Seiten, 24 Fenster je Seite, 12 Rasterspalten und 64 Rasterzeilen. Window-ID ist unabhängig von Typ und Session-ID. Geschlossene/minimierte Fenster bleiben im Modell, mit ihren Entwürfen. Duplizieren erzeugt ein eigenes Fenster mit gleicher Dateibindung, keinen zweiten Prozess. Vollständige Tabgruppen/echte Editor-Splits sind nicht implementiert.

Großer Desktop nutzt individuelle Geometrie; unter 1700 px übernimmt ein zweispaltiges Raster die gespeicherte Reihenfolge. Unter 680 px erscheint ein Fenster mit Umschalter. Die getrennte mobile Reihenfolge ist kein vollständiger freier Mobile-Layout-Editor. Es gibt noch keinen Gyroskopanschluss.

## Dateien

Nur `git ls-files` des gewählten Root, feste Text-Endungen, max. 64 KiB. Dot-/Secret-/Credentialpfade, Symlinks, Root-Ausbrüche und erkannte Tokenmuster ablehnen. Musterfilter ersetzen keine vollständige DLP/Secret-Prüfung; Quellrepo muss passend freigegeben sein. Keine automatischen Home-Verzeichnisse, `auth.json` oder Prozessumgebungen lesen. Dateiübernahme standardmäßig gesperrt; explizites Startflag + UI-Bestätigung + Basis-Hash erforderlich. Fremde parallele Dateischreiber liegen außerhalb der lokalen Warteschlange.

## Ereignisse und Historie

Event-IDs global je Projekt, Streamsequenzen je Stream strikt monoton. Unveränderte Wiederholung verändert keine Revision. Gleiche ID mit geändertem Inhalt, Sequenzlücke oder unbekannte Fähigkeit wird abgelehnt. 10.000 Event-IDs, 300 sichtbare Ereignisse, 100 Sessions, 300 Tasks, maximal 8 MiB je State. Bei Erreichen stoppen und private Archivierung planen, nicht still IDs verwerfen.

SSE abonniert vor dem Snapshotlesen, liefert Cursor und Wiederanlauf; bei Lücke/Future-Cursor fordert `resync` einen aktuellen Snapshot. Authentifizierung im Header, nicht in der URL. Maximal 24 Streams pro Prozess. Das ist der lokale Ereigniskanal; eine Verbindung dazu beweist keine Verbindung zu einem externen Provider.

40 Snapshots enthalten Layout, Tasks, Sessions, Usage und ausdrücklich gespeicherte Entwürfe. Keine externen Terminalzustände/Transkripte und keine automatische Dateiversionierung. Replay ist UI-seitig schreibgeschützt; nur Layout als neuer Entwurf wiederherstellbar. Diese Darstellung ist keine Sicherheitsrolle gegenüber einem lokalen API-Aufrufer: API-Rechte entsprechen weiterhin dem lokalen Einzelplatz.

## Modell und Automationen

Das Modell erhält ausschließlich Layoutziel und Fenster-ID/Typ/Pin. Es entscheidet `balanced|focus` und eine Begründung. Der deterministische Rasterplaner schützt Pins und das ausgewählte Fenster. Ein Vorschlag ändert das Layout nicht. Parallel veränderte Quellrevision oder lokale Anordnung verlangt einen neuen Vorschlag. Tatsächlich gemeldete erfolgreiche Modell-Usage wird als eigener Request gespeichert; fehlende Kosten/Modell-ID nicht geschätzt.

Keine Werkzeuge, Unteragenten, Websuche oder frei ausführbare Antworten. Werkzeugschalter werden gegen CLI geprüft; kein Fallback, der Schutzschalter entfernt. Timeout/Abbruch mit SIGTERM, nach 1,5 Sekunden SIGKILL; temporäre Dateien erst nach Prozessende entfernen. Das schützt diesen Lauf, ist aber keine allgemeine VM und kein Geldbudget.

Automation: Vorschau auf eine konkrete Version → projektspezifisches 5-Minuten-Ticket → Aktivierung mit Basisrevision. Geänderte Version oder anderer Scope verwirft das Ticket. Nur `review.prepare` / `report.prepare`; ein lokaler Textentwurf. Ein Ereignis ist je Automation-Version idempotent. Aktuell manuell geliefertes Ereignis, kein laufender Firmen-Workflow-Listener.

## Optik und Abhängigkeiten

Originalasset: `https://uni-force.de/assets/brand/header.svg`, gelesen 17.11.2026 und unverändert unter `web/brand/uniforce-header-original.svg`. Kein nachgebautes Logo, keine neue Markenfreigabe behauptet. DM Sans/DM Serif Display nur Fontstacks mit System-Fallback; keine externen Fontrequests.

Monaco, xterm.js, Three.js bleiben optionale nächste Module. Aktuell natives Textfeld statt Monaco, kein PTY, CSS-2.5D statt WebGL. Keine unbegründete Frameworkmigration oder zusätzliche Pakete. Eine spätere Three.js-Stufe verwendet einen gemeinsamen Renderer und denselben Window-State; erst Versions-/Lizenz-/Performance-/A11y-Prüfung.
