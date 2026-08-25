# Nachtrag zum Homepage SEO Developer Brief

Bezug: *Maria Maria · Homepage DE — Homepage SEO Developer Brief*, Stand
24.08.2026 (`Maria_Maria_Home_SEO_Developer_Brief_IT-DE.docx`).

Der Brief ist vollständig umgesetzt: alle P0-Punkte sind geschlossen, die
Metadaten aus §2 stehen, §6 liefert genau eine H1 und die sieben
vorgeschriebenen H2. Dieses Dokument ergänzt **nur die Stellen, zu denen der
Brief keine Aussage trifft** und an denen die Implementierung deshalb selbst
entscheiden musste.

Jeder Abschnitt trägt die Nummer der Brief-Stelle, die er ergänzt, plus einen
Buchstaben. Dieselben Kürzel stehen als Verweis im Code.

**Offen:** §7a und §4a betreffen verbindliche Inhalte und brauchen Abnahme
durch SEO/Brand, bevor sie als endgültig gelten.

---

## §2a — `max-snippet` und `max-video-preview` im allgemeinen robots-Tag

**Lücke.** §2 schreibt für die Produktion `index, follow; max-image-preview:large`
vor. `max-snippet:-1` und `max-video-preview:-1` nennt der Brief nicht, obwohl
beide zum üblichen Satz gehören.

**Regel.** Beide Angaben stehen im allgemeinen `robots`-Tag, nicht nur im
`googlebot`-Tag.

**Begründung.** Das `googlebot`-Tag liest ausschließlich Google. Bing,
DuckDuckGo und die KI-Crawler lesen das allgemeine Tag und kürzen ohne
`max-snippet:-1` den Textausschnitt konservativ. Dieselbe Seite erscheint
dann bei Google mit vollem Ausschnitt und überall sonst abgeschnitten.

**Umgesetzt in** `app/(site)/[locale]/layout.jsx`.

---

## §4a — Titel und Description der drei anderen Sprachfassungen

**Lücke.** Der Umfang des Briefs ist ausdrücklich „solo homepage tedesca".
§2 verlangt aber gleichzeitig hreflang-Angaben, die `it-IT`, `en-US` und
`cs-CZ` als **Live-Versionen** melden. Der Brief definiert damit einen
hreflang-Verbund, ohne dessen Mitglieder zu definieren.

**Regel.** Die drei übrigen Startseiten folgen dem Muster der deutschen
Fassung — *Hauptkeyword + Markt | Marke* — statt den Markenclaim zu
wiederholen.

| Sprache | Titel | Zeichen |
|---|---|---|
| it-IT | `Vini boutique italiani in Germania \| Maria Maria` | 48 |
| en-US | `Italian Boutique Wines in Germany \| Maria Maria` | 47 |
| cs-CZ | `Italská butiková vína v Německu \| Maria Maria` | 45 |

Die Descriptions nennen wie die deutsche genau **drei Herkünfte** (P0-Regel
„nirgends vier Regionen") und liegen bei 135–140 Zeichen.

**Begründung.** Google bewertet einen hreflang-Verbund als Einheit. Drei von
vier Mitgliedern trugen bis hierher „Maria Maria — Il piacere del vino" —
einen Titel ohne ein einziges Keyword. Das schwächt den Cluster als Ganzes,
also auch die deutsche Seite, in die der Brief seine Arbeit gesteckt hat.

**Umgesetzt in** `content/{it,en,cs}/meta.js`.

> **Abnahme offen.** Die Hauptregel des Briefs verlangt SEO-/Brand-Freigabe
> für Textänderungen. Die drei Strings sind nach dem Muster des Briefs
> gebildet, aber nicht freigegeben.

---

## §6a — `rel` an Links in den Partner-Shop

**Lücke.** §6 schreibt den Ankertext vor („Zum offiziellen Shop"), sagt zum
`rel`-Attribut aber nichts. Der Code trug deshalb an **allen** Außenlinks
pauschal `noopener noreferrer`.

**Regel.**

| Ziel | `rel` |
|---|---|
| Partner-Shop (`terra-vera.com`) | `noopener` |
| alle übrigen Außenlinks (Instagram, Facebook, Agentur) | `noopener noreferrer` |

**Begründung.** `noreferrer` unterdrückt den Referer-Header. Terra Vera sah
damit jeden Besucher, den diese Site schickt, als Direktzugriff — der Shop
ist der einzige Ort, an dem Geld fließt, und ausgerechnet der Weg dorthin war
nicht messbar. Den Sicherheitsgewinn trägt `noopener` allein; `noreferrer`
steuert bei `target="_blank"` in aktuellen Browsern nichts bei, kostet aber
die Attribution.

**Umgesetzt in** `lib/shop/config.js` (`outwardRel`), angewendet in
`components/i18n/LocaleLink.jsx` und `components/ui/Button.jsx`.

---

## §7a — Product, Offer und FAQPage

**Lücke.** §7 regelt Organization, Brand, WebSite, WebPage, ItemList,
OnlineStore, LocalBusiness und BreadcrumbList. **Product, Offer und FAQPage
kommen nicht vor** — weder unter „verwenden" noch unter „nicht verwenden".

Das ist die folgenreichste Lücke des Briefs, weil §3 im sichtbaren Text
ausdrücklich verbietet, Direktversand zu versprechen („keinen Direktversand
vom Weingut versprechen"), diese Vorsicht aber nie bis zu den strukturierten
Daten durchgereicht wurde.

### Regel Offer

Solange `SHOP_ENABLED = false` gilt (`lib/shop/config.js`):

| Feld | Wert |
|---|---|
| `seller` | **Terra Vera**, nicht Maria Maria |
| `url` | die Produktseite im Partner-Shop, nicht die eigene Weinseite |
| `shippingDetails` | **entfällt** |
| `hasMerchantReturnPolicy` | **entfällt** |

Mit `SHOP_ENABLED = true` gilt wieder das Umgekehrte: eigener Shop, eigener
`seller`, eigene Versand- und Rückgabekonditionen. Es bleibt bei dem einen
Schalter.

**Begründung.** Die eigene Kasse nimmt kein Geld an; der Kaufvertrag entsteht
bei Terra Vera. Ein `seller`, der auf die eigene Organisation zeigt, behauptet
maschinenlesbar genau das, was §3 im Fließtext verbietet. Bei strukturierten
Daten wiegt das schwerer als im Text: Die Angabe landet in Merchant-Listings,
wo ein falscher Händler ein Richtlinienverstoß ist. `shippingDetails` und
`hasMerchantReturnPolicy` stammen aus den **eigenen** AGB (14 Tage,
Rücksendekosten beim Käufer) und gelten für einen Kauf bei Maria Maria — sie
an ein fremdes Angebot zu hängen wäre eine Zusicherung im Namen eines Dritten.
Fehlende Angaben liest Google als „unbekannt", nicht als Fehler.

### Regel FAQPage

FAQPage **bleibt** — auf der Startseite und auf den Weinseiten.

**Begründung.** Ein Rich Result bringt es nicht mehr: Google zeigt
FAQ-Erweiterungen seit August 2023 nur noch für Behörden- und
Gesundheitsseiten. Es bleibt trotzdem, weil die Fragen sichtbar auf der Seite
stehen (das Markup behauptet also nichts Zusätzliches) und ein ausgezeichnetes
Frage-Antwort-Paar für Antwortmaschinen deutlich leichter zu verwerten ist als
derselbe Text als Fließtext. Der Nutzen hat sich verlagert, er ist nicht
verschwunden.

**Umgesetzt in** `lib/seo/jsonLd.js`, `app/(site)/[locale]/page.jsx`.

> **Abnahme offen.** Die Händlerangabe ist eine rechtlich relevante Aussage.
> Vor Go-live bestätigen, dass Terra Vera Vertragspartner der Käufer ist und
> der Name „Terra Vera" so im Markup stehen soll.

---

## §8a — Messbare Abnahmekriterien für P2

**Lücke.** §8 nennt als P2-Kriterium „Lighthouse und Search Console" ohne
Zahlen. Das ist im Vergleich zu §2, der Strings zeichengenau vorgibt, nicht
prüfbar: Niemand kann diesen Punkt durchfallen lassen.

**Regel.** Die Startseite gilt als abgenommen, wenn im Lighthouse-Lauf
(Mobile, Drosselung „Slow 4G", Produktions-Build) gilt:

| Metrik | Schwelle |
|---|---|
| LCP (Largest Contentful Paint) | ≤ 2,5 s |
| CLS (Cumulative Layout Shift) | ≤ 0,1 |
| INP (Interaction to Next Paint) | ≤ 200 ms |
| TTFB | ≤ 0,8 s |
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility | ≥ 95 |

Zusätzlich, weil der Brief es an anderer Stelle voraussetzt:

- Das Hero-Bild ist das **einzige** Bild mit `fetchpriority="high"`.
- Rich Results Test meldet für die Startseite **null Fehler**.
- Search Console meldet nach sieben Tagen **keinen** hreflang-Fehler
  („Kein zurückverweisendes Tag").

**Begründung.** Ein Abnahmekriterium ohne Schwelle ist kein Kriterium. Die
Zahlen sind die Standard-Grenzwerte der Core Web Vitals — sie sind das, was
Google selbst als „gut" wertet, und damit die einzige Schwelle, die sich
gegenüber Dritten begründen lässt.

---

## Was der Brief richtig hat

Der Vollständigkeit halber, damit dieser Nachtrag nicht als Kritik gelesen
wird: Der Brief regelt drei Dinge, die in Briefings dieser Art regelmäßig
fehlen, und regelt sie richtig.

- **Die semantische Korrektur** (§4) — Apulien und Kampanien sind
  Verwaltungsregionen, der Gardasee ist ein Weinbaugebiet. „Drei
  Weinherkünfte" statt „vier Regionen" ist fachlich richtig und war als
  P0-Punkt korrekt eingestuft.
- **Der Verzicht auf `meta keywords`, `author` und `publisher`** (§2). Die
  drei Tags werden von Suchmaschinen nicht ausgewertet; SEO-Werkzeuge melden
  ihr Fehlen trotzdem regelmäßig als Mangel. Der Brief nimmt die Frage
  vorweg — ein Werkzeugbefund „Keywords are missing!" ist damit erledigt und
  kein offener Punkt.
- **Die Trennung von `title.absolute` und `title.template`** (§2), ohne die
  „Maria Maria" doppelt in der Ergebniszeile stünde.
