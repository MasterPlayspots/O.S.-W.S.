# Produktfakten und Nachweise

Produkt: **O.A. - O.S**. Zugehörigkeit: **ourark.io**. Repository: https://github.com/MasterPlayspots/O.S.-W.S.

Die folgende Abgrenzung wurde für den vorliegenden v0.4-Releaseauftrag mit dem Implementierungsverantwortlichen abgeglichen: dunkles Graphit-/Korallen-Default, konfigurierbares Branding, Connection Center, lokaler JSON-Memory-Adapter, bestehende Demo-Arbeitsfenster und Eventimport. Der endgültige Test-/Browsernachweis bleibt an den tatsächlichen veröffentlichten Stand gebunden.

Diese Matrix verhindert, dass ein Marketingentwurf eine geplante Integration als geliefert darstellt. `Release-Prüfung offen` bedeutet: vor dem ersten Einsatz anhand des tatsächlich veröffentlichten Commits und eines reproduzierbaren Beispiels bestätigen. Alte Testzahlen oder Screenshots eines anderen Branches reichen dafür nicht. Der Release-Verantwortliche ergänzt den genauen Commit und die Belegpfade; die Kampagne behauptet keine bereits erfolgte Veröffentlichung der Social-Posts.

| ID | Zulässiger Claim nach Nachweis | Benötigter Beleg | Grenze |
|---|---|---|---|
| C01 | O.A. - O.S ist ein öffentliches, kostenlos verfügbares Dashboard-Projekt von ourark.io. | Öffentlich erreichbarer Zielcommit, README, Attribution. | Kein kostenloser externer API-/Hostingbetrieb zugesagt. |
| C02 | Die dokumentierte lokale Anwendung lässt sich starten und prüfen. | Frischer Checkout, aktuelle Befehle, tatsächlicher Testlauf und Browserstart. | Keine Multiuser-/Produktionsbereitstellung daraus ableiten. |
| C03 | Der Workspace zeigt mehrere stabile Arbeitsfenster mit unterstützter Anordnung und Kontext. | Browsernachweis für Layout, Pin, Resize und vorhandene Fensterköpfe. | Fähigkeiten des Fensters präzise benennen; Preview ist keine Shell-Ausführung. |
| C04 | Sessions und Usage können mit Quelle/Qualität angezeigt werden; Runtime und Modell werden getrennt erklärt. | Tatsächlicher UI-/Eventvertrag, Demo- oder Importnachweis, Behandlung fehlender Werte. | Kein erfolgreicher Provideraufruf ohne echten Runner-/Providerbeleg; keine geratenen Tokenkosten. |
| C05 | Name, Monogramm, Tagline, Website, Akzentfarbe und Hell-/Dunkel-Theme lassen sich über die dokumentierte JSON-Konfiguration ändern. | Config-Beispiel, gültige Werte, tatsächliches Vorher-/Nachher in der App. | Keine beliebige Logo-Upload-, Plugin- oder CSS-Injection-Funktion behaupten. |
| C06 | Das Verbindungsdashboard zeigt konfigurierte Anschlüsse und überprüfbare Statusinformationen. | Reale Registry-/Statusdaten, Erfolg-/Fehler-/Unbekannt-Fälle, Zeitstempel soweit implementiert. | Keine pauschale Behauptung, dass alle externen Tools bereits angebunden sind. |
| C07 | Der lokale JSON-Memory-Adapter unterstützt Lesen, Textsuche, Herkunft/Hashes und einen Kontext-JSON-Download. Bindung über `--connections-config`, mit Projekt-/Privat-/Geschäftlich-Scope. | Dokumentiertes Schema, synthetischer Beispieldatensatz, tatsächliches Lesen/Suchen/Exportieren und Zugriffstest. | Read-only; keine automatische Übergabe an ein Modell, keine semantische/Vektorsuche und kein bereits angebundenes Drive, Qdrant, REA, MCP oder universeller RAG-Dienst. |
| C08 | Ein dokumentierter Adaptervertrag ermöglicht gezielte Erweiterungen. | Aktuelle Schnittstellen, Beispiel, Tests und Integrationsanleitung im Release. | „Erweiterbar“ ist kein fertiger Connector-Katalog und keine Ein-Klick-Garantie für jedes System. |
| C09 | Die tatsächlich vorhandene lokale Automationsvorschau erklärt einen einfachen Ablauf. | Sichtbar markierter Preview-/Demo-Modus und nachgewiesenes Verhalten. | Aktuell lokale Ein-Schritt-Entwürfe; keine produktive externe Ausführung oder vollständige Cloud-Orchestrierung ableiten. |
| C10 | Die lokale Betriebsgrenze und der Umgang mit privaten Daten sind dokumentiert. | Tatsächliche Listener-/Auth-/Dateigrenzen und Betriebsdokumentation. | Kein Zertifikat, vollständiger Audit oder pauschales Sicherheitsversprechen. |
| C11 | Der veröffentlichte eigene Code steht unter MIT, soweit die jeweilige Lizenzdatei gilt. | Tatsächliche LICENSE, Hinweise zu Drittassets und Marken. | Markenrechte und fremde Assets nicht als pauschal frei darstellen. |
| C12 | Beiträge können anhand der dokumentierten Mitarbeitsschritte erfolgen. | CONTRIBUTING, aktuelle Tests, relevante Issues/PRs. | Keine bereits existierende aktive Community, Nutzerzahlen oder Kundenerfolge erfinden. |

## Prüftabelle vor Kampagnenstart

| Feld | Wert |
|---|---|
| Geprüfter Release/Commit | noch einzutragen |
| Prüfung durchgeführt am | 17.11.2026 |
| Test-/Browsernachweise | 54/54 lokal; docs/VERIFICATION_0.4.md und docs/screenshots/ |
| Verifizierte Claim-IDs | C02, C04, C06–C12 im dokumentierten Umfang; C01 mit öffentlichem Release bestätigen |
| Zurückgestellte Claim-IDs / Grund | C03: Pin/Resize vor Aufnahme erneut zeigen; C05: eigenes Branding visuell vor/nach aufnehmen. Vertrags-/API-Tests liegen vor. |
| Erste geplante Veröffentlichung | noch nicht terminiert |

## Feste Positionierung

Für Entwickler, kleine Teams, Agenturbuilder und technikaffine Nutzer, die Arbeitsfenster, Projektkontext, Sessioninformationen und angebundene Wissensquellen in einer nachvollziehbaren Oberfläche zusammenbringen möchten. Der Einstieg ist lokal und nachvollziehbar. Erweiterungen entstehen anhand klarer Quellen- und Adapterverträge.

Primärer Nutzen: weniger Suchaufwand zwischen Ansichten, sichtbare Zuordnung von Arbeit und Kontext, verständliche Verbindungen und eine anpassbare Basis. Das sind Nutzenhypothesen bzw. beschreibbare Funktionen, keine gemessenen Zeit- oder Kostenersparnisse. Ohne Studie keine Prozentwerte nennen.

## Sprachregeln

- Namen exakt schreiben: `O.A. - O.S` und `ourark.io`.
- „Free, open-source dashboard“ erst mit veröffentlichtem Code und Lizenz. „White-label“ an die dokumentierten Branding-Felder binden.
- „Connect your memory“ im aktuellen Release konkret als lokale JSON-Anbindung erklären. Andere Quellen als mögliche Adapter kennzeichnen.
- Kein „connects everything instantly“, „fully autonomous company“, „zero cost AI“, „production-ready for every team“ oder „secure by certification“.
- Laufzeit, Provider, Modell, Kontextbelegung, Sessiontoken und Kosten nicht vermischen.
- Beispiele sichtbar als demo/synthetic markieren. Ausgedachte Marken bleiben fiktiv; keine Kundenzitate nachstellen.
- Keine vollständige Leakfreiheit oder abgeschlossene Incident-Behebung ohne entsprechenden Nachweis behaupten. Nur belegte Maßnahmen und Grenzen nennen.
- Raumdarstellung: der aktuelle Stand verwendet CSS-2.5D; keine Three.js-/WebGL-Engine behaupten. Die Revisionhistorie ist auf den implementierten Umfang begrenzt und kein vollständiger semantischer Replay aller externen Systeme.
