# Marketing für O.A. - O.S

Dieses Verzeichnis enthält das vollständige Kampagnenpaket für **O.A. - O.S von ourark.io**. Es ist eine Arbeitsgrundlage für Claude Code und das Marketingteam. Social-Konten sind dadurch weder verbunden noch bespielt.

| Datei | Zweck |
|---|---|
| [30_DAY_PLAN.md](30_DAY_PLAN.md) | 30 Tagesmotive, Voice-over, Shotlist, CTA und vier Kanaltexte je Tag |
| [calendar.csv](calendar.csv) | tabellarischer Import in eine Redaktionsplanung |
| [calendar.json](calendar.json) | strukturierte Quelle für Produktionswerkzeuge |
| [publishing-log.csv](publishing-log.csv) | 120 leere Veröffentlichungs-/Messdatensätze |
| [PRODUCT_FACTS.md](PRODUCT_FACTS.md) | belegbare Claims, Grenzen und Nachweisanforderungen |
| [CLAUDE_CODE_HANDOFF.md](CLAUDE_CODE_HANDOFF.md) | Startprompt, Rollenverteilung und Übergabe an Claude Code |
| [SOURCES_AND_SKILLS.md](SOURCES_AND_SKILLS.md) | verifizierte Quellen und optionale Marketing-Skills |
| [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) | konkrete Anforderungen an jeden fertigen Clip |

Im Repository liegen zusätzlich vier selbst verfasste Agentenrollen unter `.claude/agents/` und der gemeinsame Produktkontext unter `.agents/product-marketing.md`. Die Rollen funktionieren als projektspezifische Anweisungen ohne Installation eines fremden Marketingpakets. Ob die konkrete Claude-Code-Sitzung sie geladen hat, wird dort durch einen Testaufruf geprüft.

## Einstieg

1. Aktuellen Produktstand und `PRODUCT_FACTS.md` lesen.
2. In Claude Code den Prompt aus `CLAUDE_CODE_HANDOFF.md` ausführen.
3. Zuerst Tag 1–7 produzieren und mit tatsächlichen Screenshots/Screenrecordings des Releases belegen.
4. Vorhandene Kanalmandate und Kontozugänge verwenden; fehlende Angaben nur für die betroffenen Veröffentlichungsschritte klären.
5. Nach echten Ergebnissen den nächsten Batch optimieren. Ein Plan ist keine laufende Automation und keine Zusage zukünftiger Veröffentlichung.

Der Plan enthält englische Texte für eine internationale Open-Source-Zielgruppe. Planungs- und Übergabeanweisungen sind deutsch. Ein deutscher Kanal kann aus denselben Produktbelegen übersetzt werden; nicht bloß automatisch Wort für Wort kopieren.
