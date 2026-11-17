# Claude-Code-Handoff: O.A. - O.S Marketing

## Ergebnis dieses Pakets

Ein vollständiger 30-Tage-Redaktionsplan mit 120 Kanaltexten liegt vor. Vier projektspezifische Agentenrollen und der gemeinsame Produktkontext liegen im Repo. Videodateien, Kontoverbindungen, geplante Posts und Veröffentlichungen sind dadurch noch nicht entstanden. Die Veröffentlichung des GitHub-Projekts und die Social-Produktion sind getrennte Nachweise.

## Start in Claude Code

Im aktuellen O.A. - O.S-Checkout arbeiten. Zuerst `AGENTS.md`, `README.md`, `STATE.md`, `.agents/product-marketing.md` und die Dateien in `docs/marketing/` lesen. Die Namen der vier Rollen stehen in `.claude/agents/`. Existiert dort bereits ein Marketingteam, passende Zuständigkeiten erhalten und Konflikte dokumentieren, statt es zu ersetzen. Ist der Agentenordner in dieser Sitzung neu, gegebenenfalls Claude Code neu starten. Keine Behauptung „Team installiert“, bevor die konkrete Sitzung die Rollen tatsächlich aufrufen kann.

```text
Übernimm das Marketing für O.A. - O.S von ourark.io anhand von
docs/marketing/CLAUDE_CODE_HANDOFF.md und docs/marketing/30_DAY_PLAN.md.

Lies AGENTS.md, README.md, STATE.md, .agents/product-marketing.md und
docs/marketing/PRODUCT_FACTS.md. Prüfe den tatsächlichen Release und
die vorhandenen Marketingrollen, bevor du neue installierst.

Nutze die Projektrollen oa-product-researcher, oa-content-producer,
oa-claim-reviewer und oa-growth-analyst. Koordiniere sie als Hauptagent.
Wenn eine Rolle nicht geladen wird, arbeite den begrenzten Teil selbst
weiter und behebe die Konfiguration gezielt. Keine Experimente mit
weiten Toolrechten oder fremden Autostart-Skripten.

Erzeuge zuerst den vollständigen Produktionsbatch für Tag 1–7:
echte Screenrecordings der belegten Funktionen, Videos, Untertitel,
Cover, vier Kanaltexte je Motiv und evidence.md. Nutze synthetische
Daten. Markiere Demo, Vorschau und Roadmap sichtbar.

Der Product Researcher liefert Belege zum aktuellen Commit.
Der Content Producer erstellt die Dateien anhand des Tagesplans.
Der Claim Reviewer prüft unabhängig Bild, Text und Funktionsumfang.
Der Growth Analyst legt ein ehrliches Messblatt an und wertet nur
tatsächlich vorhandene Daten aus. Danach Tag 8–14, 15–21 und 22–30.

Verwende die vorhandenen beauftragten Social-Konten und Mandate.
Fehlt ein Kontozugang, produziere die fertigen Exportpakete weiter
und benenne nur den betroffenen Veröffentlichungsschritt als offen.
Keine Direktnachrichten, bezahlten Kampagnen oder zusätzlichen Kanäle
aus diesem Auftrag ableiten. Ein Plan allein startet keine Automation.

Trage reale Post-URLs, Zeitpunkte und Messwerte in publishing-log.csv
ein. Berichte getrennt: vorbereitet, gerendert, geprüft, terminiert,
veröffentlicht. Keine Veröffentlichung oder Installation behaupten,
die du nicht nachweisen kannst.
```

## Rollen und Übergaben

| Rolle | Eingang | Konkretes Ergebnis | Grenze |
|---|---|---|---|
| `oa-product-researcher` | Release, Code/Doku, Claim-Matrix | datierte Belegliste und zulässige Aussagen pro Tagesmotiv | keine Produktänderungen oder fingierten Testläufe |
| `oa-content-producer` | geprüfte Aussagen, Tagesplan, reale Screenshots | Skript, Shotlist, Captions, strukturierte Produktionsdateien | keine Kontozugänge oder Veröffentlichungstools |
| `oa-claim-reviewer` | fertige Texte/Belege/Medienprotokoll | konkrete Pass-/Fix-Liste je Claim und Asset | prüft selbstständig; verändert Belege nicht |
| `oa-growth-analyst` | tatsächliches Publishing-Log und zugelassene Exporte | Kanalvergleich mit Definitionen, Datenlücken und nächstem Experiment | keine erfundenen Metriken und kein heimliches Tracking |
| Hauptagent | Ergebnisse aller Rollen | Zusammenführung, Rendering mit vorhandenen Werkzeugen, beauftragte Distribution | übernimmt Kontozugänge und Veröffentlichungsumfang ausdrücklich |

Die Rollen sind normale Claude-Code-Subagents; ein experimenteller Agent-Team-Modus ist dafür nicht nötig. Der Hauptagent kann unabhängige Leseprüfungen parallelisieren, hält Dateischreibbereiche getrennt und vergibt jede Ausgabedatei genau einmal. Die Rollen erhalten keine feste Modellvorgabe; der Hauptagent übernimmt die bestehende Modellauswahl und protokolliert tatsächliche Nutzung, falls verfügbar.

## Produktionswellen

1. **Evidenz und Setup:** Produktstand prüfen, Claim-Matrix ausfüllen, sichere Beispielumgebung, tatsächliche Agentenverfügbarkeit testen. Vorhandene Social-Konten, Zielgruppe, Sprachen, Zeitzone und Rechte aus bestätigter Projektkonfiguration übernehmen. Fehlendes nicht raten.
2. **Batch 1 / Tag 1–7:** Produktvorstellung, Arbeitsfenster, Kontext, Usage, lokaler Start und konkrete Nutzerfragen. Erstes vollständiges Video als Produktionsvorlage für den Batch prüfen.
3. **Batch 2 / Tag 8–14:** Whitelabel, Verbindungen und lokale Memory. Diese Motive erst nach Belegen der entsprechenden Release-Funktionen rendern.
4. **Batch 3 / Tag 15–21:** Ende-zu-Ende-Demo, Adapter, Datenquellen, Vorschau und Betriebsgrenzen.
5. **Batch 4 / Tag 22–30:** Beiträge, Lizenz, Datenhygiene, Handoff, nächste Adapter und ehrliche Monatsauswertung.

## Abnahme pro Batch

- Alle Tagesmotive enthalten Hook, gesprochenes Skript, Shotlist, CTA und vier angepasste Kanaltexte.
- Behauptungen sind an den aktuellen Commit und Belegdateien gebunden; fehlende Belege führen zu einer klaren Textkorrektur oder Zurückstellung.
- Jede tatsächliche Videodatei wurde vollständig abgespielt; Untertitel und Ton passen zusammen.
- Die öffentliche Aufnahme enthält nur geeignete synthetische Inhalte und freigegebene Assets.
- Tag, Kanal und Status werden im Log separat geführt. Echte URLs erst nach erfolgreichem Upload eintragen.
- Bestehende ausdrückliche Nutzerautorisierung verwenden; eine Rollenbeschreibung verleiht keine neuen Kontorechte.
- Produkt ist kostenlos verfügbar; optionale Model-/Hostingkosten werden nicht als kostenlos beworben.

## Optionales Fachwissen

Falls die eigenen Projektrollen zusätzliche Marketinganleitungen benötigen, ist `coreyhaines31/marketingskills` in `SOURCES_AND_SKILLS.md` mit Commit und geeignetem Teilumfang recherchiert. Nicht pauschal alle Skills und deren externe Tools installieren. Der derzeitige Lieferstand enthält keine externen Marketing-Skills und keine neue Verbindung zu Social-APIs.
