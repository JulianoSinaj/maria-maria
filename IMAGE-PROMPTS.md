# Maria Maria — AI image prompts

The site is now wired to show real photos. Generate the 12 images below in **any**
AI image tool (ChatGPT / DALL·E, Adobe Firefly, Midjourney, Google Gemini/Imagen,
Leonardo, etc.), save each with the **exact filename**, and drop them into:

```
public/img/
```

Then run `npm run dev` to see them live — or just ask me and I'll regenerate the
`.html` previews with the photos baked in so you can view them without a build.

**Until a file exists, that slot automatically shows the current gradient
placeholder**, so nothing ever breaks. You can add them one at a time.

### Rules of thumb
- **Landscape orientation**, at least **1200 px wide**, saved as **.jpg**.
- Exact lowercase filenames (e.g. `hero.jpg`) — the code looks for these.
- For the big heroes, keep the **main subject on the RIGHT third** (the left side
  is covered by headline text).

### Paste this style line onto the end of every prompt
> photorealistic editorial photography, warm golden-hour Mediterranean light, muted elegant palette of bordeaux, champagne gold, ivory and stone, shallow depth of field, cinematic, sophisticated Italian boutique-wine mood, high detail — no text, no watermark, no logos, no brand names

---

## The 12 images

### 1. `hero.jpg`  — main hero (Home, Unsere Weine, Kontakt + shop banner)
Landscape 16:9, subject on the right.
```
An elegant woman in a black dress seen from behind, standing on a rustic stone terrace at golden hour, holding a glass of red wine, gazing over a sun-drenched southern-Italian landscape of hills and vineyards; a bottle of red wine and a small bowl of olives rest on the weathered stone ledge beside her; a terracotta pot with an olive branch to the side; soft warm sunset haze, the left side of the frame open and glowing for text
```

### 2. `regionen-hero.jpg`  — Regionen Italiens hero
Landscape 16:9, interest toward the right.
```
A sweeping panorama of the Italian countryside at golden hour: rolling hills striped with vineyards, cypress trees, olive groves and a distant stone farmhouse, warm hazy Mediterranean light, gentle depth
```

### 3. `region-apulien.jpg`  — Apulia region card
Landscape 4:3.
```
Apulia (Puglia) landscape in warm afternoon light: a wide sun-baked plain with old gnarled Primitivo vines in red earth, a whitewashed conical trullo hut and low dry-stone walls, the Adriatic light soft in the distance
```

### 4. `region-kampanien.jpg`  — Campania region card
Landscape 4:3.
```
Campania landscape: terraced green vineyards on volcanic soil with Mount Vesuvius rising in the background and the blue Bay of Naples beyond, bright Mediterranean daylight, fresh and mineral mood
```

### 5. `region-garda.jpg`  — Lake Garda / Lugana region card
Landscape 4:3.
```
Lake Garda in northern Italy: gentle vineyard hills of Lugana sloping down to a calm clear blue lake, cypress and olive trees, soft elegant northern light, serene and refined
```

### 6. `food.jpg`  — food pairing (Home + Magazin cards)
Landscape 4:3, cozy and moody.
```
A rustic Italian food-pairing scene on a dark wooden table, warm restaurant candlelight: a plate of southern-Italian food (orecchiette with rich tomato sauce, or an aged-cheese and cured-meat board) beside a poured glass of deep red wine, intimate close framing, moody warm tones
```

### 7. `vineyard.jpg`  — vineyard / “Herkunft” (Home + Magazin)
Landscape 4:3, backlit.
```
Vineyard rows at golden sunset with a dark bottle of red wine and a filled glass resting on an old wooden barrel in the foreground, warm backlight and floating dust, romantic and cinematic
```

### 8. `stilllife.jpg`  — featured story / Rebsorten / Regionen CTA
Landscape 3:2. **Keep the LEFT side brighter/simpler** (text sits there).
```
A warm still life on a weathered wooden terrace table: a dark bottle of red wine with a simple cream label, a poured glass, rustic bread and a cluster of dark grapes, soft blurred Italian countryside behind, golden light coming from the left so the left side is bright and open
```

### 9. `dinner.jpg`  — Dinner / Freunde / Genussmomente
Landscape 4:3, evening.
```
An outdoor evening dinner among friends in Italy, warm string lights and candles, several hands raising glasses of red wine in a toast over a laid table, soft golden bokeh, intimate and joyful, faces not visible
```

### 10. `aperitivo.jpg`  — Aperitivo / Lugana & Fisch
Landscape 4:3, bright and airy.
```
A bright Mediterranean aperitivo by the sea: chilled glasses of pale white wine, green olives, taralli and light seafood bites on a sun-dappled table, fresh airy daylight, elegant and summery
```

### 11. `gift.jpg`  — Geschenk (gifting)
Landscape 4:3, minimal studio.
```
An elegant wine gift: a dark wine bottle wrapped simply in linen and kraft paper with a satin bordeaux ribbon, on a warm neutral surface, soft refined studio light, minimal and premium
```

### 12. `tasting.jpg`  — Weinverkostung (tasting)
Landscape 4:3, dark and cinematic.
```
A close-up of a hand gently swirling a glass of deep red wine at a tasting, a softly out-of-focus row of wine glasses behind, dark moody background, single warm light, sophisticated
```

---

### Where each file appears
| File | Used on |
|---|---|
| `hero.jpg` | Home hero, Unsere Weine hero, Kontakt hero + shop banner |
| `regionen-hero.jpg` | Regionen Italiens hero |
| `region-apulien.jpg` | Home region card, Regionen (Apulien), Magazin thumbs |
| `region-kampanien.jpg` | Home region card, Regionen (Kampanien) |
| `region-garda.jpg` | Home region card, Regionen (Gardasee/Lugana) |
| `food.jpg` | Home “Was passt zu Primitivo”, Magazin food/latest/popular |
| `vineyard.jpg` | Home “Apulien – Das Herz des Südens”, Magazin regionen/popular |
| `stilllife.jpg` | Home “Rebsorten”, Magazin featured story, Regionen CTA |
| `dinner.jpg` | Weine Dinner & Freunde, Magazin Genussmomente |
| `aperitivo.jpg` | Weine Aperitivo, Magazin “Lugana und Fisch” |
| `gift.jpg` | Weine Geschenk |
| `tasting.jpg` | Magazin Weinwissen & “Kunst der Weinverkostung” |

*Tip: for a fully consistent look, generate all 12 in the same tool/session so the
lighting and colour grade match.*
