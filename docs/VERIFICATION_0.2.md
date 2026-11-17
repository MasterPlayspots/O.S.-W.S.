> Historische Implementierungsnotiz (vor O.A. - O.S 0.4). Für den aktuellen Produktstand gelten README.md, STATE.md und docs/INSTALLATION.md. Frühere Markenassets sind nicht Teil der aktuellen Auslieferung.

# Verifikation 0.2

Datum: 17.11.2026, Europe/Berlin. Nur neu erstelltes öffentliches Projekt geprüft. Keine bestehende Infrastruktur geändert.

| Prüfung | Ergebnis | Quelle |
|---|---|---|
| Ausgangsstand | GitHub main `45e06ffa668da49478a552d0cb68b081607d4bd0` | GitHub Git-Refs API, vor Änderungen |
| Automatisierte Tests | 26/26 bestanden, Node v24.22.1 | `npm test`; `test/core.test.mjs`, `test/studio.test.mjs` |
| Echte öffentliche Quelle | `MasterPlayspots/O.S.-W.S.`, public, JavaScript, main | Tatsächlicher Aufruf von `readPublicRepository`, 16:52:41 MEZ |
| Browser-Abruf | Gleicher Repo-Name, JavaScript und Zähler erschienen im Projekt-DOT; Lückenanzahl 3 → 2 | Chromium, Klick „Quelle jetzt lesen“, Beobachtung 16:54:22 MEZ |
| Regler und Speicherung | Glas/Tiefe 100, sichtbares Limit 1, Speicherung als Revision 1; nach Reload erhalten | Lokale Browser-Oberfläche |
| Konflikt der Einstellungen | Zwei Pins bei Limit 1 abgelehnt; nach Erhöhung auf 3 wieder gültig | Browser und Validator-Test |
| Zweite Speicherung | Revision 2, drei sichtbare Bereiche | Browser, gespeichert und danach neu geladen |
| Scope-Wechsel | Privat beginnt mit eigenem Profil und ohne geschäftlichen GitHub-Snapshot; Geschäftlich lädt Revision 2 | Browser und HTTP-Integrationstest |
| Desktop / Mobile | Raster und schmaler Stapel über Ansichtsschalter sichtbar | Browser; kein physisches iPhone getestet |
| Quellcodeprüfung | Keine Treffer für die geprüften GitHub-/API-/Private-Key-Tokenmuster; kein vollständiger Audit | Musterprüfung aller 27 Quell-/Dokumentationsdateien |
| Parallele Speicherzugriffe | Ein Gewinner, Konflikt für veraltete Basisrevision; kein stilles Überschreiben | Store- und HTTP-Tests |
| Eingabe-/Netzwerkgrenzen | Fremde Hosts/Origins, fehlende Sitzung, unbekannte Felder, private/falsche Antworten, Redirects, Timeout und übergroße Antworten abgefangen | Automatisierte Tests |

Der Host-Test verwendet bewusst `node:http`, weil Node-Fetch einen vorgegebenen Host-Header normalisiert und damit diese Grenze nicht tatsächlich testen würde. Der zunächst dadurch fehlerhafte Test wurde korrigiert; die Schutzprüfung selbst blieb unverändert.

Die Browserprüfung nutzte ein synthetisches lokales Profil und öffentliches Repo-Metadatenmaterial. Profile, Sitzungsschlüssel und erzeugte Dateien sind nicht im Commit. Eine Bildschirmansicht dient als Anschauung und ersetzt die Tests nicht. Der temporäre Vorschauprozess wurde danach beendet.

Nicht geprüft: physische Geräte, Safari/iOS-Gyroskop, reale Kalender/Chats, Modellaufrufe, Multiuser-Sicherheit, Betrieb über einen öffentlichen Proxy, Stromausfallbeständigkeit oder autonomer Dauerbetrieb. Keine Aussage über maximal erreichbare Produktivität.
