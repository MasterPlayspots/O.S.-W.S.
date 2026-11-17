# Memory anschließen

Der v0.4-Adapter liest eine ausdrücklich gebundene JSON-Datei. Er scannt keine Verzeichnisse, durchsucht keine Chatarchive und kontaktiert keinen Cloudanbieter. Das ist der erste funktionierende Anschluss für bestehende persönliche oder projektbezogene Wissenssammlungen.

## Verbindung

```json
{
  "schemaVersion": 1,
  "connections": [{
    "id": "project-memory",
    "label": "Projektwissen",
    "purpose": "Entscheidungen und freigegebene Arbeitsregeln",
    "type": "memory-json",
    "project": {"id": "workspace-core", "scope": "business"},
    "path": "memory.json",
    "freshForSeconds": 300
  }]
}
```

`scope` ist `business` oder `private`. Quelle und Konfiguration privat ablegen. `path` darf absolut sein; relativ gilt der Ordner der Konfigurationsdatei. Die Browser-API akzeptiert keine beliebigen Pfade. Höchstens 20 Verbindungen; Gültigkeit 10–3600 Sekunden. IDs eindeutig und entsprechend dem gemeinsamen Identifier-Vertrag in `web/modules/contracts.js`.

## Quelldatei

```json
{
  "schemaVersion": 1,
  "items": [{
    "id": "review-rule",
    "title": "Review vor Übernahme",
    "content": "Dies ist ein synthetisches Beispiel für eine Arbeitsregel.",
    "source": "example:synthetic/working-agreement",
    "updatedAt": "2026-11-17T10:00:00Z",
    "tags": ["review", "workflow"]
  }]
}
```

| Feld/Grenze | Vertrag |
|---|---|
| Datei | reguläre lokale Datei, UTF-8-JSON, höchstens 1 MiB, keine Symlinks |
| Einträge | maximal 1000, eindeutige IDs |
| Titel/Inhalt/Quelle | maximal 160 / 8192 / 240 Zeichen |
| Tags | maximal 12, je maximal 40 Zeichen |
| `updatedAt` | parsebarer Zeitstempel; bevorzugt ISO 8601 mit Zeitzone |
| Unbekannte Felder | abgelehnt, einschließlich Befehls-/Credentialfeldern |
| `example:`-Quelle | als synthetische Demo gekennzeichnet |

Start: `npm start -- --connections-config /PRIVAT/connections.json`. Danach **Verbindungen → Verbindung prüfen → Memory**. Ohne erfolgreichen Leseversuch bleibt die Quelle ungeprüft und die Bibliothek leer. Ein fehlgeschlagener erneuter Check entfernt deren vorherigen Cache. Ein abgelaufener Check bleibt als veraltet erkennbar; Status wird beim nächsten Abruf neu berechnet. Keine laufende externe Überwachung.

## Suche, Herkunft und Export

Suche ist eine lokale, groß-/kleinschreibungsunabhängige Teilstringsuche über Titel, Inhalt und Tags. Standard 50 Ergebnisse, API-Limit 1–100, Suchtext maximal 160 Zeichen. `total` zeigt die Gesamtzahl der Treffer. Engere Suche verwenden, wenn mehr Treffer vorhanden sind; kein vollständiger paginierter Browser ist implementiert.

Das API-Ergebnis enthält Connection-ID, Prüfzeit, Status, Dateihash und Inhaltshash. Hashes werden aus den gelesenen Bytes bzw. dem Inhalt berechnet. Sie beweisen keine sachliche Richtigkeit oder Autorenschaft. Der JSON-Export eines ausgewählten Eintrags enthält den Projektkontext und `modelContextInjected: false` / `untrustedSourceContent: true`. Vor Weitergabe prüfen; der Export beinhaltet den tatsächlichen Inhalt.

## API

Alle Routen benötigen die lokale Sitzung `x-oa-session`. GET-Anfragen benötigen `project` und `scope` als Queryparameter; POST-Anfragen das Objekt `project` im Body.

| Methode | Route | Eingabe/Ergebnis |
|---|---|---|
| GET | `/api/connections` | konfigurierte Quellen, Fähigkeiten, Beobachtungen |
| POST | `/api/connections/check` | `{project, connectionId}`; liest nur die gebundene Quelle |
| GET | `/api/memory` | optionale `q`, `limit`, `connectionId`; Einträge + Herkunft |
| GET | `/api/memory/item` | `connectionId`, `itemId`; einzelner Cache-Eintrag |

Projekt- und Scope-Grenzen werden serverseitig geprüft. Die Quelle wird nur beim Check gelesen; Suche arbeitet auf dem begrenzten Prozesscache. Neustart leert diesen Cache. Die ursprüngliche Datei wird nie geschrieben.

## Bestehende Systeme

REA, Drive, Obsidian, eine eigene DB oder ein Vector Store können über einen separat gebauten, autorisierten Exporter dieses JSON liefern. Daten minimieren, Provenienz erhalten und Export atomar ersetzen. Dieser Exporter ist nicht Bestandteil des Releases. Für direkte APIs gelten die Anforderungen in [INTEGRATIONS.md](INTEGRATIONS.md).

Keine automatische Einbettung ins Modell, kein Training, keine Embeddings, kein semantisches RAG, kein bidirektionaler Sync. Die nächste Ausbaustufe muss Modellziel, Budget, Inhaltsauswahl, Widerruf und die Behandlung untrusted Inhalte ausdrücklich definieren.
