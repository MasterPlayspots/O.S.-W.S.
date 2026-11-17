# Lokale Metadaten-Bridge

Stand 17.11.2026. Der Host importiert ausschließlich eine ausdrücklich ausgewählte JSONL-Datei. Kein automatischer Zugriff auf CLI-Verläufe, Tokens, Shell, private Chats oder die Firmen-Datenbank.

```sh
node bin/bridge.mjs --file /PRIVATER/PFAD/events.jsonl --url http://127.0.0.1:4317 --project workspace-core --scope business
```

Max. 2 MiB / 1000 Zeilen / 30.000 Bytes je Zeile. Nur `http://127.0.0.1:PORT`, keine Redirects/entfernten Hosts/URL-Credentials. Sitzungswert nur im Prozess, keine Ausgabe oder Dateiablage. Jede Zeile ist separat atomar. Bei Fehler können frühere Zeilen bereits gespeichert sein; unveränderte Event-IDs erlauben Wiederholung ohne zweite Wirkung.

## Hülle

```json
{
  "eventId": "source-event-0001",
  "streamId": "explicit-run-001",
  "sequence": 1,
  "schemaVersion": 1,
  "occurredAt": "2026-11-17T10:00:00Z",
  "type": "session.upsert",
  "payload": {}
}
```

`sequence` beginnt bei 1 und steigt ohne Lücke. Event-ID bei Wiederholung gleich lassen, Inhalt nicht ändern. Erlaubte Typen: `session.upsert`, `task.upsert`, `usage.snapshot`, `usage.delta`. Keine frei ausführbaren Kommandos. Der HTTP-Einstieg ist `POST /api/events/ingest` mit `{project:{id,scope},event}` und lokalem `x-oa-session`.

## Session-Payload

```json
{
  "id": "session-001",
  "taskId": null,
  "agent": "Implementierung",
  "runtime": "Codex CLI",
  "provider": null,
  "requestedModelId": null,
  "effectiveModelId": null,
  "state": "completed",
  "contextUsed": null,
  "contextLimit": null,
  "capabilities": [],
  "startedAt": null,
  "heartbeatAt": "2026-11-17T10:00:00Z",
  "quality": "reported",
  "nextStep": "Ergebnis prüfen",
  "branch": null
}
```

Dies ist ein anonymes Schema-Beispiel, kein existierender Lauf. Alle Felder erforderlich; unbekannte Werte `null`. `capabilities` bleibt leer: Metadaten erlauben keine Sessionsteuerung. Status: `ready`, `running`, `waiting`, `review`, `completed`, `failed`, `cancelled`. Quelle verantwortet die Richtigkeit der gemeldeten Werte; keine kryptographische Verifikation.

## Usage-Payload

```json
{
  "requestId": "request-001",
  "attemptId": "1",
  "sessionId": "session-001",
  "modelId": null,
  "revision": 1,
  "final": true,
  "kind": "snapshot",
  "input": 100,
  "output": 20,
  "cacheRead": null,
  "cacheWrite": null,
  "reasoning": null,
  "providerTotal": null,
  "totalSemantics": "disjoint_io",
  "cost": null,
  "source": "selected-runtime-event",
  "quality": "reported",
  "observedAt": "2026-11-17T10:00:00Z"
}
```

Session zuerst registrieren. Request-ID und Attempt-ID bilden den eindeutigen Schlüssel. Aggregatoren dürfen ein bereits eingetragenes Child-Request nicht unter einer neuen Parent-ID erneut melden. API kennt keine automatische providerübergreifende Parent-/Child-Auflösung; diese Normalisierung ist Aufgabe des Quelladapters.

Kumulative Snapshots ersetzen ältere Revisionen. `delta` nur nach einem Snapshot und mit direkt anschließender Revision; danach als neuer Gesamtstand abgelegt. Keine Addition unbekannter Zähler. Nach `final` nur höher revisionierte terminale Snapshots als Korrektur, keine Deltas. Negative Platzhalter wie `-1` an der Quelle nach `null` normalisieren; die API lehnt sie ab.

`providerTotal` hat Vorrang. Sonst Input+Output nur bei bestätigter `disjoint_io`-Semantik. Cache/Reasoning bleiben Teilmengen, nicht nochmals zur Gesamtzahl addieren. Fehlt bei einem Request der Totalwert, ist die Gesamtzahl unbekannt; bekannter Teilbetrag und Abdeckung stehen separat in `/api/usage`. `from`, `to`, `session` filtern Beobachtungen – keine anteilige Verteilung eines kumulativen Requests über dessen Laufzeit.

Kosten optional `{value,currency,quality,priceVersion}`; Währungen `EUR|USD`, Herkunft `reported|estimated|demo`. Keine Umrechnung oder Mischung der Herkunft. Ein Abonnementpreis wird nicht automatisch in Requestkosten umgerechnet.

## Aufgaben-Payload

`{id,title,status,acceptedCount,eligibleCount,quality:"reported"}`. Status `planned|in_progress|blocked|review|accepted|cancelled`; Zähler nichtnegativ, akzeptiert ≤ relevant. Projektfortschritt zählt akzeptierte Aufgaben, Fensterfortschritt deren Teilpunkte. Diese Bridge schreibt keine Aufgaben in ein führendes System.

## Host-Anschluss

Einen freigegebenen Quelladapter mit erlaubten Feldern, projektgebundenem Cursor und zuverlässiger ID-Normalisierung bauen. Kein Rohdump von Chat-/Sessiondateien. Authentifizierung bleibt außerhalb des Repos in der bestehenden Host-Konfiguration. Für produktiven Controls-/Kalender-/Chatbetrieb fehlen hier Vertrag, autorisierter Zugriff, Widerrufsprüfung und Abnahme.


## Synthetischer Ersttest

`node bin/bridge.mjs --file examples/runtime-events.example.jsonl` importiert eine ausdrücklich synthetisch benannte Session und einen Demo-Usage-Eintrag. Sessionqualität `reported` bezeichnet nur die importierte Meldung; `Synthetic example`/`Example CLI` sind keine echten Providerläufe. Dies in einem separaten Test-Profil verwenden, nicht mit echten Laufdaten vermischen.
