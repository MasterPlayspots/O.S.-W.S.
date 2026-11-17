# White-Label

O.A. - O.S gehört zu ourark.io. Ein eigener Fork darf Name und Gestaltung unter Beibehaltung des MIT-Hinweises anpassen. Die Standardoberfläche nutzt Graphit, helle Typografie und Koralle `#F76B5C`; lokal eingebundene Typografie-Systemfonts und ein neu erstelltes O.A.-Monogramm.

`npm start -- --brand-config /PRIVAT/brand.json` lädt die Konfiguration beim Start. Beispiel: `examples/brand.example.json`. Alle Felder sind optional, unbekannte Felder werden abgelehnt; `schemaVersion` bleibt 1.

| Schlüssel | Vorgabe / Grenze |
|---|---|
| `name` | `O.A. - O.S`, maximal 40 Zeichen |
| `tagline` | `Your tools. One workspace.`, maximal 100 Zeichen |
| `monogram` | `O.A.`, maximal 8 Zeichen |
| `website` | öffentliche HTTPS-Adresse ohne Credentials, Query oder Fragment |
| `theme` | `dark` oder `light` |
| `accent` | sechsstelliger Hexwert |

Der Server validiert die Daten; der Browser setzt Text mit `textContent`, die Farbe als CSS-Variable. Kein HTML, JS oder freies CSS in der Konfiguration. Prüfe bei eigenen Farben Lesbarkeit und Fokuskontrast. Das Branding verändert den Hauptworkspace; der separat erhaltene Legacy-Planungsassistent `/setup` wird nicht vollständig durch diese Konfiguration gestaltet.

Die Kopfzeile nutzt ein Textmonogramm. Für ein individuelles Bildlogo/Favicon `web/brand/oaos-mark.svg` durch ein berechtigtes eigenes SVG ersetzen und bei Bedarf die Kopfzeile in `web/workspace.html` anpassen. Arbiträre Assets werden nicht vom Server freigegeben; neue Pfade gehören bewusst in die Assetliste. Es gibt keinen Logo-Upload-Dialog.

Bestehende gespeicherte Layout-Themes `uniforce` und `black-glass` bleiben als Kompatibilitätswerte lesbar. Neue Layouts nutzen `oaos`. Die aktuelle Darstellung stammt aus der Branding-Konfiguration. Alte Drittmarkenassets sind nicht Teil der aktuellen Auslieferung. Siehe [NOTICE.md](../NOTICE.md).
