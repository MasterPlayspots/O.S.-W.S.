# Eigenständig planen und handeln

Stand 17.11.2026. **0.1 führt keine externen Aktionen aus und nutzt kein LLM.** Es erzeugt deterministische Pläne und Anschlussaufgaben. Die folgenden Ausführungsstufen sind der Implementierungsvertrag für spätere Versionen.

## Autonomiestufen

| Stufe | Eigenständiges Verhalten | Voraussetzung |
|---|---|---|
| Beobachten | Freigegebene Quellen lesen, aktualisieren und einordnen | Begrenzte Ressourcen und lesende Rechte |
| Vorbereiten | Dashboard-Plan, Zusammenfassung, Entwurf, Adapter-Arbeitsauftrag erzeugen | Zweck, Revisionsbezug, Budget |
| Lokal anwenden | Bestätigte reversible Darstellungsänderungen umsetzen | Lokale Capability, Undo, Sperren respektieren |
| Begrenzt ausführen | Definierte Aufgaben an erlaubten Diensten erledigen | Serverseitig verifizierte, widerrufbare Berechtigung je Operation/Ressource und Budget |
| Eskalieren | Neue Rechte, neue Installation, Veröffentlichung, Vertrag, Zahlung oder irreversible Wirkung vorlegen | Konkrete menschliche Entscheidung, sofern nicht bereits genau autorisiert |

Innerhalb eines eingerichteten Mandats soll der Agent nicht bei jedem kleinen Schritt erneut fragen. Ein Mandat muss aber genauer sein als „mach alles“: Ziele, erlaubte Werkzeuge, Ressourcen, Datenzugriff, maximale Kosten, Gültigkeitsdauer und Stop-Bedingungen sind erforderlich.

## Denk- und Handlungsschleife

Ereignis aufnehmen → Relevanz für das aktuelle Ziel beurteilen → Plan mit erwarteter Wirkung bilden → Rechte/Verfügbarkeit/Budget prüfen → einen begrenzten Schritt ausführen → Ergebnis beobachten → Plan fortsetzen, korrigieren oder stoppen.

Für jeden Schritt werden Aktion, Quelle, Ergebnis und Revision protokolliert. Wiederholungen brauchen Idempotenz und Grenzen; ein Fehler darf keine Endlosschleife auslösen. Ein veralteter Konnektorstatus wird erneut geprüft. Fehlende Modellanbindung führt zu regelbasiertem Planen oder einer klaren Anschlussaufgabe, nicht zu vorgetäuschter KI-Autonomie.

## Wenn Konnektoren fehlen

1. Benötigte **Fähigkeit** präzise benennen: „Kalendertermine lesen“ statt „Google vollständig anbinden“.
2. Eigene freigegebene Adapter und aktuelle Fähigkeiten prüfen. Vorhandener Dienst mit fehlender Anmeldung ist kein fehlender Konnektor.
3. Offizielle Anbieterquellen und geeignete MCP-Verzeichnisse nach Kandidaten durchsuchen. Version, Betreiber, Dokumentation, Rechte und Transport festhalten.
4. Einen Kandidaten in isolierter Testumgebung mit minimalen Rechten prüfen. Ein Verzeichnisfund oder selbst gemeldetes Tool-Merkmal ist keine Sicherheitsfreigabe.
5. Falls kein geeigneter MCP-Server vorhanden ist, eine dokumentierte API prüfen. Der Agent kann daraus einen Adapterentwurf, Vertragstests und einen Review-Patch erstellen.
6. Falls eine API ungeeignet oder nicht verfügbar ist, einen manuellen Import, Linkübergang oder ausdrücklich freigegebene Browserbedienung vorschlagen. Keine Zugangsbeschränkungen umgehen.
7. Zugang/Installation in einem konkreten, überprüfbaren Schritt einrichten. Danach Fähigkeiten erneut prüfen und die Verbindung im Projektgraphen aktivieren.
8. Das Dashboard ergänzt nur die nun tatsächlich verfügbaren Elemente. Alle übrigen Aufgaben laufen mit vorhandenen Fähigkeiten weiter.

**In 0.1 werden diese Schritte als Arbeitsauftrag ausgegeben.** Es gibt noch keinen automatischen Registry-Client, Adapter-Codegenerator, Paketinstaller oder OAuth-Flow.

## Laufzeitvertrag eines Konnektors

Die zukünftige Registry trennt: gefunden → bewertet → getestet → Autorisierung fehlt → verbunden → eingeschränkt → gestört → widerrufen. Fähigkeiten, Authentifizierung und Tool-Schema haben jeweils eine Quelle und Gültigkeit. Änderungen erfordern erneute Prüfung statt stiller Rechteausweitung.

Ein Serviceadapter darf nur berechtigte Ressourcen lesen oder verändern. Daten und Tool-Ausgaben sind nicht vertrauenswürdige Instruktionen. Herkunftsmetadaten bleiben erhalten; fremde Texte können keine Policy überschreiben. Zugangsdaten werden nicht durchgereicht oder im Dashboardzustand abgelegt.

## Protokollstand

Die überprüfte MCP-Veröffentlichung vom 28.07.2026 beschreibt einen zustandslosen Kern und optionale Capability-Discovery über `server/discover`. Der Adapter muss seine tatsächlich unterstützte Protokollversion festhalten; alte SDK-Anleitungen und neue Nachrichtenformen dürfen nicht vermischt werden. Der erste lokale Kern implementiert selbst keinen MCP-Transport.

Die offizielle Registry enthält von Betreibern gemeldete Metadaten. Sie dient als Ausgangspunkt der Suche. Vertrauensentscheidung, Berechtigung und Funktionstest liegen weiterhin beim Client/Betreiber unseres Systems. Quellen siehe `SOURCES.md`.
