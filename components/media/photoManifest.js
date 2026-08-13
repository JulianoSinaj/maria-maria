/* AUTOGENERIERT von scripts/optimize-pages.mjs — nicht von Hand bearbeiten.

   Welche WebP-Breiten es je Quellbild wirklich gibt. <Photo> baut daraus den
   srcSet; was hier fehlt, rendert es unverändert als nacktes <img>.

   Bewusst ohne LQIP-Data-URIs: die Bilder hier stehen unter dem Falz und laden
   lazy, ein Blur-Platzhalter wäre nur Ballast im Client-Bundle. Die beiden
   Hero-Pipelines (heroBlur.js, pairingBlur.js) halten ihre LQIPs selbst. */

export const PHOTO_MANIFEST = {
  "/img/aniversario.png": {
    "base": "/img/aniversario",
    "widths": [
      160,
      320,
      447
    ]
  },
  "/img/aperitivo-sunset.jpg": {
    "base": "/img/aperitivo-sunset",
    "widths": [
      160,
      320,
      640,
      1024,
      1200
    ]
  },
  "/img/aperitivo.jpg": {
    "base": "/img/aperitivo",
    "widths": [
      160,
      320,
      640,
      1024,
      1200
    ]
  },
  "/img/dinner.webp": {
    "base": "/img/dinner",
    "widths": [
      160,
      320,
      640,
      1024,
      1400
    ]
  },
  "/img/home/moment-bg.jpg": {
    "base": "/img/home/moment-bg",
    "widths": [
      160,
      320,
      640,
      1024,
      1448
    ]
  },
  "/img/home/region-apulien.webp": {
    "base": "/img/home/region-apulien",
    "widths": [
      160,
      320,
      640,
      1024,
      1600
    ]
  },
  "/img/home/region-garda.webp": {
    "base": "/img/home/region-garda",
    "widths": [
      160,
      320,
      640,
      1024,
      1600
    ]
  },
  "/img/home/region-kampanien.webp": {
    "base": "/img/home/region-kampanien",
    "widths": [
      160,
      320,
      640,
      1024,
      1600
    ]
  },
  "/img/logo.png": {
    "base": "/img/logo",
    "widths": [
      160,
      320,
      400
    ]
  },
  "/img/magazin/abendessen.jpg": {
    "base": "/img/magazin/abendessen",
    "widths": [
      160,
      320,
      640,
      1024,
      1400
    ]
  },
  "/img/magazin/cover-story.jpg": {
    "base": "/img/magazin/cover-story",
    "widths": [
      160,
      320,
      640,
      875
    ]
  },
  "/img/magazin/handverlesen.jpg": {
    "base": "/img/magazin/handverlesen",
    "widths": [
      160,
      320,
      592
    ]
  },
  "/img/magazin/pranzo.jpg": {
    "base": "/img/magazin/pranzo",
    "widths": [
      160,
      320,
      640,
      1024,
      1400
    ]
  },
  "/img/magazin/tavolata.jpg": {
    "base": "/img/magazin/tavolata",
    "widths": [
      160,
      320,
      640,
      915
    ]
  },
  "/img/magazin/trauben-hand.jpg": {
    "base": "/img/magazin/trauben-hand",
    "widths": [
      160,
      320,
      555
    ]
  },
  "/img/magazin/weinkeller.jpg": {
    "base": "/img/magazin/weinkeller",
    "widths": [
      160,
      320,
      640,
      641
    ]
  },
  "/img/magazin/weinlese.jpg": {
    "base": "/img/magazin/weinlese",
    "widths": [
      160,
      320,
      640,
      677
    ]
  },
  "/img/pranzo.webp": {
    "base": "/img/pranzo",
    "widths": [
      160,
      320,
      640,
      1024,
      1400
    ]
  },
  "/img/regions/apulien.webp": {
    "base": "/img/regions/apulien",
    "widths": [
      160,
      320,
      640,
      1024,
      1400
    ]
  },
  "/img/regions/kampanien.webp": {
    "base": "/img/regions/kampanien",
    "widths": [
      160,
      320,
      640,
      1024,
      1400
    ]
  },
  "/img/regions/lugana.webp": {
    "base": "/img/regions/lugana",
    "widths": [
      160,
      320,
      640,
      1024,
      1400
    ]
  },
  "/img/regions/regionen-hero-poster.webp": {
    "base": "/img/regions/regionen-hero-poster",
    "widths": [
      160,
      320,
      640,
      1024,
      1280
    ]
  },
  "/img/sotria.webp": {
    "base": "/img/sotria",
    "widths": [
      160,
      320,
      640,
      1024,
      1400
    ]
  },
  "/img/stemma.png": {
    "base": "/img/stemma",
    "widths": [
      134
    ]
  },
  "/img/stilllife.jpg": {
    "base": "/img/stilllife",
    "widths": [
      160,
      320,
      640,
      700
    ]
  },
  "/img/weine/moment-aperitivo.jpg": {
    "base": "/img/weine/moment-aperitivo",
    "widths": [
      160,
      320,
      640,
      1024,
      1200
    ]
  },
  "/img/weine-hero.jpg": {
    "base": "/img/weine-hero",
    "widths": [
      160,
      320,
      640,
      1024,
      1600,
      3076
    ]
  },
  "/img/wines/falanghina/back.jpg": {
    "base": "/img/wines/falanghina/back",
    "widths": [
      160,
      320,
      640,
      1024,
      1600,
      2000
    ]
  },
  "/img/wines/falanghina/card-back.webp": {
    "base": "/img/wines/falanghina/card-back",
    "widths": [
      160,
      320,
      488
    ]
  },
  "/img/wines/falanghina/card-front.webp": {
    "base": "/img/wines/falanghina/card-front",
    "widths": [
      160,
      320,
      395
    ]
  },
  "/img/wines/falanghina/front.jpg": {
    "base": "/img/wines/falanghina/front",
    "widths": [
      160,
      320,
      640,
      1024,
      1600,
      2000
    ]
  },
  "/img/wines/falanghina/sheet-front.webp": {
    "base": "/img/wines/falanghina/sheet-front",
    "widths": [
      160,
      320,
      395
    ]
  },
  "/img/wines/greco-di-tufo/back.jpg": {
    "base": "/img/wines/greco-di-tufo/back",
    "widths": [
      160,
      320,
      640,
      1024,
      1440
    ]
  },
  "/img/wines/greco-di-tufo/card-back.webp": {
    "base": "/img/wines/greco-di-tufo/card-back",
    "widths": [
      160,
      320,
      354
    ]
  },
  "/img/wines/greco-di-tufo/card-front.webp": {
    "base": "/img/wines/greco-di-tufo/card-front",
    "widths": [
      160,
      320,
      401
    ]
  },
  "/img/wines/greco-di-tufo/front.jpg": {
    "base": "/img/wines/greco-di-tufo/front",
    "widths": [
      160,
      320,
      640,
      1024,
      1600,
      1920
    ]
  },
  "/img/wines/greco-di-tufo/sheet-front.webp": {
    "base": "/img/wines/greco-di-tufo/sheet-front",
    "widths": [
      160,
      320,
      401
    ]
  },
  "/img/wines/il-bianco-greco-cuvee/back.jpg": {
    "base": "/img/wines/il-bianco-greco-cuvee/back",
    "widths": [
      160,
      320,
      640,
      1024,
      1440
    ]
  },
  "/img/wines/il-bianco-greco-cuvee/card-back.webp": {
    "base": "/img/wines/il-bianco-greco-cuvee/card-back",
    "widths": [
      160,
      320,
      362
    ]
  },
  "/img/wines/il-bianco-greco-cuvee/card-front.webp": {
    "base": "/img/wines/il-bianco-greco-cuvee/card-front",
    "widths": [
      160,
      320,
      409
    ]
  },
  "/img/wines/il-bianco-greco-cuvee/front.jpg": {
    "base": "/img/wines/il-bianco-greco-cuvee/front",
    "widths": [
      160,
      320,
      640,
      1024,
      1600,
      1920
    ]
  },
  "/img/wines/il-bianco-greco-cuvee/sheet-front.webp": {
    "base": "/img/wines/il-bianco-greco-cuvee/sheet-front",
    "widths": [
      160,
      320,
      409
    ]
  },
  "/img/wines/il-rosso-aglianico/back.jpg": {
    "base": "/img/wines/il-rosso-aglianico/back",
    "widths": [
      160,
      320,
      640,
      1024,
      1440
    ]
  },
  "/img/wines/il-rosso-aglianico/card-back.webp": {
    "base": "/img/wines/il-rosso-aglianico/card-back",
    "widths": [
      160,
      320,
      350
    ]
  },
  "/img/wines/il-rosso-aglianico/card-front.webp": {
    "base": "/img/wines/il-rosso-aglianico/card-front",
    "widths": [
      160,
      320,
      411
    ]
  },
  "/img/wines/il-rosso-aglianico/front.jpg": {
    "base": "/img/wines/il-rosso-aglianico/front",
    "widths": [
      160,
      320,
      640,
      1024,
      1600,
      1920
    ]
  },
  "/img/wines/il-rosso-aglianico/sheet-front.webp": {
    "base": "/img/wines/il-rosso-aglianico/sheet-front",
    "widths": [
      160,
      320,
      411
    ]
  },
  "/img/wines/lugana/back.jpg": {
    "base": "/img/wines/lugana/back",
    "widths": [
      160,
      320,
      640,
      1024,
      1440
    ]
  },
  "/img/wines/lugana/card-back.webp": {
    "base": "/img/wines/lugana/card-back",
    "widths": [
      160,
      320,
      364
    ]
  },
  "/img/wines/lugana/card-front.webp": {
    "base": "/img/wines/lugana/card-front",
    "widths": [
      160,
      320,
      391
    ]
  },
  "/img/wines/lugana/front.jpg": {
    "base": "/img/wines/lugana/front",
    "widths": [
      160,
      320,
      640,
      1024,
      1600,
      1920
    ]
  },
  "/img/wines/lugana/sheet-front.webp": {
    "base": "/img/wines/lugana/sheet-front",
    "widths": [
      160,
      320,
      391
    ]
  },
  "/img/wines/lugana/story.jpg": {
    "base": "/img/wines/lugana/story",
    "widths": [
      160,
      320,
      640,
      1024,
      1425
    ]
  },
  "/img/wines/primitivo-14-5/back.jpg": {
    "base": "/img/wines/primitivo-14-5/back",
    "widths": [
      160,
      320,
      640,
      1024,
      1440
    ]
  },
  "/img/wines/primitivo-14-5/card-back.webp": {
    "base": "/img/wines/primitivo-14-5/card-back",
    "widths": [
      160,
      320,
      378
    ]
  },
  "/img/wines/primitivo-14-5/card-front.webp": {
    "base": "/img/wines/primitivo-14-5/card-front",
    "widths": [
      160,
      320,
      423
    ]
  },
  "/img/wines/primitivo-14-5/front.jpg": {
    "base": "/img/wines/primitivo-14-5/front",
    "widths": [
      160,
      320,
      640,
      1024,
      1600,
      1920
    ]
  },
  "/img/wines/primitivo-14-5/sheet-front.webp": {
    "base": "/img/wines/primitivo-14-5/sheet-front",
    "widths": [
      160,
      320,
      423
    ]
  },
  "/img/wines/primitivo-15-5/back.jpg": {
    "base": "/img/wines/primitivo-15-5/back",
    "widths": [
      160,
      320,
      640,
      1024,
      1440
    ]
  },
  "/img/wines/primitivo-15-5/card-back.webp": {
    "base": "/img/wines/primitivo-15-5/card-back",
    "widths": [
      160,
      320,
      348
    ]
  },
  "/img/wines/primitivo-15-5/card-front.webp": {
    "base": "/img/wines/primitivo-15-5/card-front",
    "widths": [
      160,
      320,
      423
    ]
  },
  "/img/wines/primitivo-15-5/front.jpg": {
    "base": "/img/wines/primitivo-15-5/front",
    "widths": [
      160,
      320,
      640,
      1024,
      1600,
      1920
    ]
  },
  "/img/wines/primitivo-15-5/sheet-front.webp": {
    "base": "/img/wines/primitivo-15-5/sheet-front",
    "widths": [
      160,
      320,
      423
    ]
  },
  "/img/wines/primitivo-salento/back.jpg": {
    "base": "/img/wines/primitivo-salento/back",
    "widths": [
      160,
      320,
      640,
      1024,
      1440
    ]
  },
  "/img/wines/primitivo-salento/card-back.webp": {
    "base": "/img/wines/primitivo-salento/card-back",
    "widths": [
      160,
      320,
      346
    ]
  },
  "/img/wines/primitivo-salento/card-front.webp": {
    "base": "/img/wines/primitivo-salento/card-front",
    "widths": [
      160,
      320,
      403
    ]
  },
  "/img/wines/primitivo-salento/front.jpg": {
    "base": "/img/wines/primitivo-salento/front",
    "widths": [
      160,
      320,
      640,
      1024,
      1600,
      1920
    ]
  },
  "/img/wines/primitivo-salento/sheet-front.webp": {
    "base": "/img/wines/primitivo-salento/sheet-front",
    "widths": [
      160,
      320,
      403
    ]
  },
  "/img/wines/rosato-puglia/back.jpg": {
    "base": "/img/wines/rosato-puglia/back",
    "widths": [
      160,
      320,
      640,
      1024,
      1440
    ]
  },
  "/img/wines/rosato-puglia/card-back.webp": {
    "base": "/img/wines/rosato-puglia/card-back",
    "widths": [
      160,
      320,
      350
    ]
  },
  "/img/wines/rosato-puglia/card-front.webp": {
    "base": "/img/wines/rosato-puglia/card-front",
    "widths": [
      160,
      320,
      392
    ]
  },
  "/img/wines/rosato-puglia/front.jpg": {
    "base": "/img/wines/rosato-puglia/front",
    "widths": [
      160,
      320,
      640,
      1024,
      1600,
      1920
    ]
  }
};
