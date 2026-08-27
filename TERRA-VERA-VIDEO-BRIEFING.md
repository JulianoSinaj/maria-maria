# Terra Vera E-Commerce — Video-Briefing (Zusammenfassung)

Zusammenfassung eines Video-Overviews zum **Terra-Vera-Onlineshop**, damit der
Inhalt im Projekt verfügbar ist, ohne das Video erneut abspielen zu müssen.

| | |
|---|---|
| **Quelle** | `WhatsApp Video 2026-08-26 at 10.16.16 PM.mp4` (per WhatsApp erhalten, 26.08.2026) |
| **Länge / Format** | 7:12 min · 1280×720 · 24 fps · Ton einkanalig |
| **Sprache** | Italienisch (Sprecherstimme + Textfolien) |
| **Erzeugt mit** | Gemini Notebook (NotebookLM Video Overview) — Wasserzeichen unten rechts |
| **Titel im Video** | *„Terra Vera E-commerce"* |

## Warum das dieses Projekt betrifft

Terra Vera ist **nicht** irgendein fremder Shop, sondern der offizielle externe
Verkaufskanal der Maria-Maria-Weine. Er ist im Code fest verdrahtet:

- [lib/shop/config.js:33](lib/shop/config.js:33) — `PARTNER_SHOP_NAME = "Terra Vera"`,
  `PARTNER_SHOP_ORIGIN = "https://www.terra-vera.com"`
- [lib/shop/config.js:65](lib/shop/config.js:65) — die Deeplinks aller neun Weine zeigen auf
  `terra-vera.com/products/…`
- [lib/seo/jsonLd.js:295](lib/seo/jsonLd.js:295) — im Produkt-JSON-LD ist Terra Vera der
  `seller`; der Kaufvertrag kommt dort zustande
- [content/de/home.js:134](content/de/home.js:134) — die Shop-CTA der Startseite führt dorthin

Das Video ist also ein **Audit und Wachstumsplan für den Shop, in den wir
unsere Kunden schicken**. Ein Teil der aufgezählten Mängel betrifft direkt
Maria-Maria-Produktdaten (siehe [Abschnitt „Direkt Maria Maria"](#direkt-maria-maria)).

---

## Aufbau

Das Video ist in fünf Kapitel gegliedert, angekündigt bei 1:04:

| # | Kapitel | Untertitel |
|---|---|---|
| 1 | Passione vs Conversione | *Il contrasto essenziale* |
| 2 | 6 Blocchi Invisibili | *Ostacoli alla crescita* |
| 3 | La Boutique Digitale | *Strategia di posizionamento* |
| 4 | Roadmap di 90 Giorni | *Il piano di esecuzione* |
| 5 | Consolidare e Scalare | *Ottimizzare la crescita* |

Leitfrage zu Beginn (0:22): *„Perché un sito bello fatica a vendere?"* —
Warum tut sich eine schöne Website schwer damit, zu verkaufen?

---

## 1 · Passione vs Conversione (1:07)

Kernaussage (1:12):

> *„Lo storytelling dà fiducia, ma gli ostacoli tecnici fermano gli acquisti."*
> — Storytelling schafft Vertrauen, aber technische Hürden stoppen den Kauf.

Der Shop verkauft Leidenschaft und Herkunftsgeschichte glaubwürdig; verloren
geht der Umsatz an handwerklichen Defekten, nicht an der Marke.

## 2 · Sechs unsichtbare Blocker (1:42)

Die sechs benannten technischen Hürden:

1. **Dati prodotto incoerenti** — widersprüchliche Produktdaten
2. **SEO con doppi H1** — doppelte H1-Überschriften
3. **Troppo testo editoriale** — zu viel redaktioneller Text (drängt Kaufelemente nach unten)
4. **Fiducia commerciale nascosta** — Trust-Signale (Versand, Rückgabe, Zahlung) zu weit unten versteckt
5. **Inglese errato e misto** — fehlerhaftes und gemischtes Englisch
6. **Assenza di modulo CRM** — kein Newsletter-/CRM-Formular

### <a id="direkt-maria-maria"></a>Direkt Maria Maria (2:31)

Als Musterbeispiel für Blocker 1 nennt das Video **wörtlich unser Produkt**:

> *„L'olio Maria Maria ha ‚Puglia' nel titolo ma ‚Calabria' nel testo."*
> — Das Maria-Maria-Öl trägt „Apulien" im Titel, aber „Kalabrien" im Fließtext.

Ein widersprüchlicher Herkunftsangabe im Shop-Listing. Das ist ein
Datenpflegefehler auf Terra-Vera-Seite, schlägt aber auf die Marke Maria Maria
durch — und widerspricht potenziell den Herkunftsangaben, die wir auf unserer
eigenen Seite führen.

### H1-Befund (2:56)

| Seite | Fehler | Lösung |
|---|---|---|
| Homepage | H1 doppelt | genau eine semantische H1 |
| Blog | H1 fehlt | H1 ergänzen |
| Produkt | Titel abgeschnitten | SEO-Titel kürzen |

## 3 · Die digitale Boutique (3:02)

Positionierungsentscheidung — nicht gegen die Großen antreten:

| Mass-Market | Boutique Digitale |
|---|---|
| Konkurrenz über **Katalogtiefe** gegen die Giganten | Konkurrenz über **kuratierte Auswahl** und Eigenmarken |

Positionierungssatz (3:35):

> *„La selezione guidata per chi vuole scegliere bene."*
> — Die geführte Auswahl für alle, die gut wählen wollen.

## 4 · 90-Tage-Roadmap (3:47)

| Zeitraum | Phase |
|---|---|
| 0–14 Tage | Phase 1: Datensicherheit und Tracking |
| 15–30 Tage | Phase 2: UX, CRO und CRM |
| 31–60 Tage | Phase 3: Skalierbare Akquise |
| 61–90 Tage | Phase 4: Retention und Wachstum |

**Phase 1 — „Sprint P0" (4:38).** Fünf Schritte in fester Reihenfolge:

`Dati Maria` → `SEO` → `Prezzi` → `Lingua` → `Tracking`

- **Dati Maria** — die widersprüchlichen Herkunftsangaben des Öls korrigieren
- **SEO** — H1 und fehlerhafte Meta-Tags korrigieren
- **Prezzi** — den Preisfehler „€ 0,00" beseitigen
- **Lingua** — Indexierungsprobleme der englischen Fassung lösen
- **Tracking** — Analytics-Events prüfen und korrigieren

**Phase 2 — UX und CRM (5:04)**
- Hero-Bilder um 35–50 % komprimieren
- kommerzielle Trust-Signale **über** die Falz holen
- Newsletter-Formular auf der Startseite
- E-Mails für abgebrochene Warenkörbe

**Phase 3 — Akquise (5:30)**
- validierte Feeds im Merchant Center
- Filter nach Nutzerbedürfnis statt nach interner Logik
- strukturierte Daten (JSON-LD) validieren
- thematische Bundles für Aperitivo und Pasta

**Phase 4 — Wachstum (5:54)**
- Blog als Hub für Rezepte und Weinkultur
- kontrollierte A/B-Tests auf Designvarianten
- Segmentierung für Post-Purchase-E-Mails
- Budget auf profitable Kategorien hochskalieren

## 5 · Konsolidieren und skalieren (6:01)

Verantwortlichkeiten, jede Rolle auf **eine** Kennzahl verpflichtet:

| Rolle | Verantwortungs-Metrik |
|---|---|
| E-Comm Manager | Roadmap und Margen |
| SEO / Paid | Kundenrückkehr und Marge |
| CRM / CRO | Nettomarge nach Media-Kosten |
| Web Developer | Qualität und Performance |

Warnsatz (6:38):

> *„Nessun canale deve ottimizzare metriche isolate di pura vanità."*
> — Kein Kanal darf auf isolierte Vanity-Metriken hin optimieren.

Schlussfrage (6:52): *„Pronti per lo Sprint P0 e sbloccare la crescita?"*

---

## Was daraus für uns folgt

Nichts davon ist Arbeit **in** diesem Repository — Terra Vera ist ein fremder
Shopify-Shop, auf den wir nur verlinken. Relevant sind drei Punkte:

1. **Öl-Herkunft klären.** Puglia oder Calabria? Sobald das feststeht, muss die
   Angabe zwischen Terra Vera und unseren eigenen Inhalten übereinstimmen.
2. **Preisfehler „€ 0,00".** Unser Produkt-JSON-LD in
   [lib/seo/jsonLd.js](lib/seo/jsonLd.js) gibt Preise an, die zum Zielshop
   passen müssen — ein 0,00-Preis dort erzeugt einen Widerspruch zu unseren
   strukturierten Daten.
3. **Deeplink-Stabilität.** Wenn Terra Vera im Zuge von Phase 1–3 SEO-Titel und
   Produktseiten umbaut, können die neun Produkt-URLs in
   [lib/shop/config.js:65](lib/shop/config.js:65) brechen. Nach dem Sprint P0 einmal
   nachprüfen.

---

## Herkunft dieser Zusammenfassung

Zusammengefasst aus den **23 Textfolien** des Videos, die vollständig
ausgewertet wurden. Die gesprochene Erzählspur wurde **nicht** transkribiert —
sie führt die Folienpunkte aus, fügt aber vermutlich keine neuen Fakten hinzu.
Wo etwas wörtlich zitiert ist, steht das italienische Original mit deutscher
Übersetzung dahinter; Zeitangaben beziehen sich auf das Video.

Folien lassen sich jederzeit neu extrahieren:

    ffmpeg -i "<video>.mp4" -vf "fps=1,mpdecimate=hi=64*20:lo=64*8:frac=0.02" -vsync vfr slide_%03d.jpg
