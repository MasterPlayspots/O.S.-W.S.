# STATE · Adaptive Studio

Stand 17.11.2026 · Version 0.2. Fortsetzung des öffentlichen Bootstrap-Kerns.

## Produktziel

Freigegebene Werte und Quellen auf Meta-Ebene einordnen, den Nutzer geführt zu einem passenden Arbeitsplatz bringen und später fehlende Verbindungen selbständig innerhalb verifizierter Mandate bearbeiten. Das Produkt beginnt auf Makroebene und hält Layout, Daten, Regeln und Ausführung getrennt.

## Neu umgesetzt

- Drei bedienbare Onboarding-Schritte: Fokus, Quellen, Gefühl.
- Arbeitsbereiche und Prioritäten, Pins, ein bis sechs sichtbare Elemente; begründetes Desktop-Raster und separate Mobile-Stapelvorschau.
- Schwarze Glasoptik mit Glas-/Tiefenreglern, optionaler dezenter Mausneigung und Beachtung reduzierter Bewegung.
- Lokaler Node-HTTP-Server, ausschließlich Loopback; Host-/Origin-Prüfung und prozessgebundene Sitzung für API-Zugriff.
- Gespeicherte Profile je Projekt und Privat-/Geschäftlich-Kontext, Basisrevision und 409-Konflikt, atomare Ersetzung und exklusiver Writer-Lock.
- JSON-Export des aktuellen Entwurfs; tatsächliche GitHub-Metadaten nicht in Profilen persistiert.
- Ein echter, explizit ausgelöster öffentlicher GitHub-GET: Quelle, Zeitpunkt, 15-Minuten-Aktualität, begrenzte Antwortgröße, Timeout, keine Redirects oder Credentials.
- Anschlussaufgaben für weiterhin fehlende Fähigkeiten; kein gefälschter Live-Status.

Der vorhandene CLI-Planer und ausgewählte `package.json`-Inspektor bleiben nutzbar. Der Kern hat keine zusätzlichen Paketabhängigkeiten.

## Abnahme dieses Inkrements

- [x] 26/26 Tests bestanden, Node v24.22.1.
- [x] Tatsächlicher öffentlicher GitHub-Abruf im Adapter und in der Oberfläche erfolgreich.
- [x] Browser: Ziele/Pins, Regler, Revision 1 → Reload → Revision 2, Scope-Wechsel, Desktop-/Mobile-Schalter.
- [x] Ungültige Pin-/Sichtlimit-Kombination wird abgelehnt.
- [x] Veraltete Beobachtungen, Speicher-Konflikte, Fremd-Origins, Host-Rebinding, unbekannte Felder und Netzfehler geprüft.
- [x] Lokale Profile und Laufzeitdateien von Veröffentlichung ausgeschlossen; 27 Quell-/Dokumentationsdateien ohne Treffer der geprüften Secret-Muster (kein vollständiger Audit).
- [x] Temporären Browser-Vorschauprozess beendet.

Einzelheiten und Grenzen: `docs/VERIFICATION_0.2.md`. API und Speichervertrag: `docs/LOCAL_STUDIO.md`.

## Noch offen

Kein LLM/Modell-Runner, MCP-Server/Registry-Sucher, OAuth, Hintergrund-Agent, autonomer Executor, Kalender-/Chatanschluss, echter Benachrichtigungsdienst, DB-/Ontologie-Engine, Container oder universeller DOTS-Editor. Keine iPhone-/Gyroskop-/Safari-Abnahme. Keine vollständige Zustands-Historie, keine JSON-Importoberfläche. Desktop/Mobile sind Visualisierungsvarianten desselben Plans, noch keine unabhängig editierbaren vollständigen Oberflächen.

Privat/Geschäftlich trennt Profile und Quellenbindungen, aber keine Betriebssystemnutzer oder Rechte. Der lokale Sitzungsmechanismus ersetzt keine Multiuser-Authentifizierung. Der reine Planerzähler `externalActionsExecuted: 0` zählt nicht den separaten expliziten öffentlichen HTTP-Lesezugriff.

## Nächste konkrete Welle

1. Modell-Runner mit einem freigegebenen Provider, strukturiertem Ausgabeformat, Token-/Kostenlimit und Ereignisprotokoll. Vorschläge durch denselben Validator schicken; keine freie Codeausführung.
2. Freies Arbeitsziel und bestätigte Regeln auf das vorhandene Profil abbilden. Regelbasierte Planung als verlässlichen Offline-Pfad erhalten.
3. Erst danach einen konkreten fehlenden Konnektor als isolierten, testbaren Adapterentwurf vorbereiten. Rechte und externe Aktionen getrennt umsetzen; bestehende Infrastruktur erst bei eigenem Auftrag.

## Herkunft und Veröffentlichung

Öffentliches Ziel: `MasterPlayspots/O.S.-W.S.`. Geprüfter Ausgangs-HEAD: `45e06ffa668da49478a552d0cb68b081607d4bd0`. Version 0.1 wurde in `a9dcf5fbfd271b71b66ad7562d401329ac495443` implementiert. Dieses Inkrement erweitert ausschließlich den neuen öffentlichen Code; keine private Cockpit-Historie, Infrastrukturdatei oder personenbezogene Laufzeitdaten wurden übernommen.

## Reversibilität und Betrieb

Quelländerung durch Revert des 0.2-Commits rücknehmbar. Profile bleiben lokal unter `.local/profiles/`; ein Revert löscht sie nicht. Entwürfe vor Verwerfen als JSON exportierbar. Der Vorschauprozess wird mit Strg+C beendet, ohne Dienste zu installieren. Kein Serverdeploy, kein DNS-/Tunnel-/Access-Eingriff, kein Merge in das alte Cockpit-Repo und keine Nutzung von Mac-Credentials.

## Remote-Nachweis 0.2

Am 17.11.2026 auf `main` veröffentlicht: Implementierungscommit `2cf1b2a333181e67413f0cb6e99c3e5d5df4e87a`. Anschließender anonymer Git-Fetch erfolgreich; `git diff --exit-code` und `git status --short` waren leer. Die GitHub-Refs-API bestätigte denselben HEAD. Dieser Nachweis folgt als reiner Dokumentationscommit; keine erneute Codeänderung oder Ausführung.
