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
    ],
    "width": 447,
    "height": 406
  },
  "/img/aperitivo-sunset.jpg": {
    "base": "/img/aperitivo-sunset",
    "widths": [
      160,
      320,
      640,
      1024,
      1200
    ],
    "width": 1200,
    "height": 900
  },
  "/img/aperitivo.jpg": {
    "base": "/img/aperitivo",
    "widths": [
      160,
      320,
      640,
      1024,
      1200
    ],
    "width": 1200,
    "height": 900
  },
  "/img/dinner.webp": {
    "base": "/img/dinner",
    "widths": [
      160,
      320,
      640,
      1024,
      1400
    ],
    "width": 1400,
    "height": 1050
  },
  "/img/home/Maria Maria zwischen Reben und Meer.png": {
    "base": "/img/home/Maria Maria zwischen Reben und Meer",
    "widths": [
      160,
      320,
      640,
      1024,
      1600,
      1672
    ],
    "width": 1672,
    "height": 941
  },
  "/img/home/moment-bg.jpg": {
    "base": "/img/home/moment-bg",
    "widths": [
      160,
      320,
      640,
      1024,
      1448
    ],
    "width": 1448,
    "height": 1086
  },
  "/img/home/weinregion-apulien-trulli-olivenbaeume.webp": {
    "base": "/img/home/weinregion-apulien-trulli-olivenbaeume",
    "widths": [
      160,
      320,
      640,
      1024,
      1600
    ],
    "width": 1600,
    "height": 900
  },
  "/img/home/weinregion-kampanien-vesuv-kueste.webp": {
    "base": "/img/home/weinregion-kampanien-vesuv-kueste",
    "widths": [
      160,
      320,
      640,
      1024,
      1600
    ],
    "width": 1600,
    "height": 900
  },
  "/img/home/weinregion-gardasee-lombardei.webp": {
    "base": "/img/home/weinregion-gardasee-lombardei",
    "widths": [
      160,
      320,
      640,
      1024,
      1600
    ],
    "width": 1600,
    "height": 900
  },
  "/img/home/region-apulien.webp": {
    "base": "/img/home/region-apulien",
    "widths": [
      160,
      320,
      640,
      1024,
      1600
    ],
    "width": 1600,
    "height": 900
  },
  "/img/home/region-garda.webp": {
    "base": "/img/home/region-garda",
    "widths": [
      160,
      320,
      640,
      1024,
      1600
    ],
    "width": 1600,
    "height": 900
  },
  "/img/home/region-kampanien.webp": {
    "base": "/img/home/region-kampanien",
    "widths": [
      160,
      320,
      640,
      1024,
      1600
    ],
    "width": 1600,
    "height": 900
  },
  "/img/kontakt/kontakt-hero-375ml.webp": {
    "base": "/img/kontakt/kontakt-hero-375ml",
    "widths": [
      320,
      640,
      1024,
      1600,
      1672
    ],
    "width": 1672,
    "height": 941
  },
  "/img/kontakt/kontakt-momente.webp": {
    "base": "/img/kontakt/kontakt-momente",
    "widths": [
      320,
      640,
      1024,
      1600,
      1942
    ],
    "width": 1942,
    "height": 809
  },
  "/img/kontakt/kontakt-weinberatung.webp": {
    "base": "/img/kontakt/kontakt-weinberatung",
    "widths": [
      320,
      640,
      1024,
      1448
    ],
    "width": 1448,
    "height": 1086
  },
  "/img/logo.png": {
    "base": "/img/logo",
    "widths": [
      160,
      320,
      400
    ],
    "width": 400,
    "height": 163
  },
  "/img/magazin/abendessen.jpg": {
    "base": "/img/magazin/abendessen",
    "widths": [
      160,
      320,
      640,
      1024,
      1400
    ],
    "width": 1400,
    "height": 1050
  },
  "/img/magazin/campagnia1.jpg": {
    "base": "/img/magazin/campagnia1",
    "widths": [
      160,
      320,
      640,
      1024,
      1536
    ],
    "width": 1536,
    "height": 1024
  },
  "/img/magazin/cover-story.jpg": {
    "base": "/img/magazin/cover-story",
    "widths": [
      160,
      320,
      640,
      875
    ],
    "width": 875,
    "height": 823
  },
  "/img/magazin/handverlesen.jpg": {
    "base": "/img/magazin/handverlesen",
    "widths": [
      160,
      320,
      592
    ],
    "width": 592,
    "height": 403
  },
  "/img/magazin/imag3.jpeg": {
    "base": "/img/magazin/imag3",
    "widths": [
      160,
      320,
      640,
      1024,
      1508
    ],
    "width": 1508,
    "height": 1000
  },
  "/img/magazin/interviews/daniele-malavasi.jpg": {
    "base": "/img/magazin/interviews/daniele-malavasi",
    "widths": [
      160,
      320,
      640,
      652
    ],
    "width": 652,
    "height": 819
  },
  "/img/magazin/interviews/lugana-risotto.jpg": {
    "base": "/img/magazin/interviews/lugana-risotto",
    "widths": [
      160,
      320,
      640,
      1024,
      1448
    ],
    "width": 1448,
    "height": 1086
  },
  "/img/magazin/interviews/terroir-pozzolengo.jpg": {
    "base": "/img/magazin/interviews/terroir-pozzolengo",
    "widths": [
      160,
      320,
      640,
      1024,
      1536
    ],
    "width": 1536,
    "height": 1024
  },
  "/img/magazin/interviews/turbiana-trauben.jpg": {
    "base": "/img/magazin/interviews/turbiana-trauben",
    "widths": [
      160,
      320,
      640,
      1024,
      1508
    ],
    "width": 1508,
    "height": 1000
  },
  "/img/magazin/lagoDG.jpg": {
    "base": "/img/magazin/lagoDG",
    "widths": [
      160,
      320,
      640,
      1024,
      1536
    ],
    "width": 1536,
    "height": 1024
  },
  "/img/magazin/pranzo.jpg": {
    "base": "/img/magazin/pranzo",
    "widths": [
      160,
      320,
      640,
      1024,
      1400
    ],
    "width": 1400,
    "height": 1050
  },
  "/img/magazin/puglia1.jpg": {
    "base": "/img/magazin/puglia1",
    "widths": [
      160,
      320,
      640,
      1024,
      1536
    ],
    "width": 1536,
    "height": 1024
  },
  "/img/magazin/tavolata.jpg": {
    "base": "/img/magazin/tavolata",
    "widths": [
      160,
      320,
      640,
      915
    ],
    "width": 915,
    "height": 686
  },
  "/img/magazin/trauben-hand.jpg": {
    "base": "/img/magazin/trauben-hand",
    "widths": [
      160,
      320,
      555
    ],
    "width": 555,
    "height": 515
  },
  "/img/magazin/weinkeller.jpg": {
    "base": "/img/magazin/weinkeller",
    "widths": [
      160,
      320,
      640,
      641
    ],
    "width": 641,
    "height": 403
  },
  "/img/magazin/weinlese.jpg": {
    "base": "/img/magazin/weinlese",
    "widths": [
      160,
      320,
      640,
      677
    ],
    "width": 677,
    "height": 525
  },
  "/img/og/collection.jpg": {
    "base": "/img/og/collection",
    "widths": [
      160,
      320,
      640,
      1024,
      1200
    ],
    "width": 1200,
    "height": 630
  },
  "/img/og/default.jpg": {
    "base": "/img/og/default",
    "widths": [
      160,
      320,
      640,
      1024,
      1200
    ],
    "width": 1200,
    "height": 630
  },
  "/img/og/geschichte.jpg": {
    "base": "/img/og/geschichte",
    "widths": [
      160,
      320,
      640,
      1024,
      1200
    ],
    "width": 1200,
    "height": 630
  },
  "/img/og/magazin.jpg": {
    "base": "/img/og/magazin",
    "widths": [
      160,
      320,
      640,
      1024,
      1200
    ],
    "width": 1200,
    "height": 630
  },
  "/img/og/shop.jpg": {
    "base": "/img/og/shop",
    "widths": [
      160,
      320,
      640,
      1024,
      1200
    ],
    "width": 1200,
    "height": 630
  },
  "/img/og/wines/falanghina.jpg": {
    "base": "/img/og/wines/falanghina",
    "widths": [
      160,
      320,
      640,
      1024,
      1200
    ],
    "width": 1200,
    "height": 630
  },
  "/img/og/wines/greco-di-tufo.jpg": {
    "base": "/img/og/wines/greco-di-tufo",
    "widths": [
      160,
      320,
      640,
      1024,
      1200
    ],
    "width": 1200,
    "height": 630
  },
  "/img/og/wines/il-bianco-greco-cuvee.jpg": {
    "base": "/img/og/wines/il-bianco-greco-cuvee",
    "widths": [
      160,
      320,
      640,
      1024,
      1200
    ],
    "width": 1200,
    "height": 630
  },
  "/img/og/wines/il-rosso-aglianico.jpg": {
    "base": "/img/og/wines/il-rosso-aglianico",
    "widths": [
      160,
      320,
      640,
      1024,
      1200
    ],
    "width": 1200,
    "height": 630
  },
  "/img/og/wines/lugana.jpg": {
    "base": "/img/og/wines/lugana",
    "widths": [
      160,
      320,
      640,
      1024,
      1200
    ],
    "width": 1200,
    "height": 630
  },
  "/img/og/wines/primitivo-14-5.jpg": {
    "base": "/img/og/wines/primitivo-14-5",
    "widths": [
      160,
      320,
      640,
      1024,
      1200
    ],
    "width": 1200,
    "height": 630
  },
  "/img/og/wines/primitivo-15-5.jpg": {
    "base": "/img/og/wines/primitivo-15-5",
    "widths": [
      160,
      320,
      640,
      1024,
      1200
    ],
    "width": 1200,
    "height": 630
  },
  "/img/og/wines/primitivo-salento.jpg": {
    "base": "/img/og/wines/primitivo-salento",
    "widths": [
      160,
      320,
      640,
      1024,
      1200
    ],
    "width": 1200,
    "height": 630
  },
  "/img/og/wines/rosato-puglia.jpg": {
    "base": "/img/og/wines/rosato-puglia",
    "widths": [
      160,
      320,
      640,
      1024,
      1200
    ],
    "width": 1200,
    "height": 630
  },
  "/img/pranzo.webp": {
    "base": "/img/pranzo",
    "widths": [
      160,
      320,
      640,
      1024,
      1400
    ],
    "width": 1400,
    "height": 1050
  },
  "/img/regions/apulien.webp": {
    "base": "/img/regions/apulien",
    "widths": [
      160,
      320,
      640,
      1024,
      1400
    ],
    "width": 1400,
    "height": 788
  },
  "/img/regions/kampanien.webp": {
    "base": "/img/regions/kampanien",
    "widths": [
      160,
      320,
      640,
      1024,
      1400
    ],
    "width": 1400,
    "height": 788
  },
  "/img/regions/lugana.webp": {
    "base": "/img/regions/lugana",
    "widths": [
      160,
      320,
      640,
      1024,
      1400
    ],
    "width": 1400,
    "height": 788
  },
  "/img/regions/regionen-hero-poster.webp": {
    "base": "/img/regions/regionen-hero-poster",
    "widths": [
      160,
      320,
      640,
      1024,
      1280
    ],
    "width": 1280,
    "height": 720
  },
  "/img/sotria.webp": {
    "base": "/img/sotria",
    "widths": [
      160,
      320,
      640,
      1024,
      1400
    ],
    "width": 1400,
    "height": 1050
  },
  "/img/stemma.png": {
    "base": "/img/stemma",
    "widths": [
      134
    ],
    "width": 134,
    "height": 163
  },
  "/img/stilllife.jpg": {
    "base": "/img/stilllife",
    "widths": [
      160,
      320,
      640,
      700
    ],
    "width": 700,
    "height": 676
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
    ],
    "width": 3076,
    "height": 1088
  },
  "/img/weine/moment-aperitivo.jpg": {
    "base": "/img/weine/moment-aperitivo",
    "widths": [
      160,
      320,
      640,
      1024,
      1200
    ],
    "width": 1200,
    "height": 900
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
    ],
    "width": 2000,
    "height": 2000
  },
  "/img/wines/falanghina/card-back.webp": {
    "base": "/img/wines/falanghina/card-back",
    "widths": [
      160,
      320,
      488
    ],
    "width": 488,
    "height": 1400
  },
  "/img/wines/falanghina/card-front.webp": {
    "base": "/img/wines/falanghina/card-front",
    "widths": [
      160,
      320,
      395
    ],
    "width": 395,
    "height": 1400
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
    ],
    "width": 2000,
    "height": 2000
  },
  "/img/wines/falanghina/sheet-front.webp": {
    "base": "/img/wines/falanghina/sheet-front",
    "widths": [
      160,
      320,
      395
    ],
    "width": 395,
    "height": 1400
  },
  "/img/wines/greco-di-tufo/back.jpg": {
    "base": "/img/wines/greco-di-tufo/back",
    "widths": [
      160,
      320,
      640,
      1024,
      1440
    ],
    "width": 1440,
    "height": 1920
  },
  "/img/wines/greco-di-tufo/card-back.webp": {
    "base": "/img/wines/greco-di-tufo/card-back",
    "widths": [
      160,
      320,
      354
    ],
    "width": 354,
    "height": 1400
  },
  "/img/wines/greco-di-tufo/card-front.webp": {
    "base": "/img/wines/greco-di-tufo/card-front",
    "widths": [
      160,
      320,
      401
    ],
    "width": 401,
    "height": 1400
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
    ],
    "width": 1920,
    "height": 1920
  },
  "/img/wines/greco-di-tufo/sheet-front.webp": {
    "base": "/img/wines/greco-di-tufo/sheet-front",
    "widths": [
      160,
      320,
      401
    ],
    "width": 401,
    "height": 1400
  },
  "/img/wines/il-bianco-greco-cuvee/back.jpg": {
    "base": "/img/wines/il-bianco-greco-cuvee/back",
    "widths": [
      160,
      320,
      640,
      1024,
      1440
    ],
    "width": 1440,
    "height": 1920
  },
  "/img/wines/il-bianco-greco-cuvee/card-back.webp": {
    "base": "/img/wines/il-bianco-greco-cuvee/card-back",
    "widths": [
      160,
      320,
      362
    ],
    "width": 362,
    "height": 1400
  },
  "/img/wines/il-bianco-greco-cuvee/card-front.webp": {
    "base": "/img/wines/il-bianco-greco-cuvee/card-front",
    "widths": [
      160,
      320,
      409
    ],
    "width": 409,
    "height": 1400
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
    ],
    "width": 1920,
    "height": 1920
  },
  "/img/wines/il-bianco-greco-cuvee/sheet-front.webp": {
    "base": "/img/wines/il-bianco-greco-cuvee/sheet-front",
    "widths": [
      160,
      320,
      409
    ],
    "width": 409,
    "height": 1400
  },
  "/img/wines/il-rosso-aglianico/back.jpg": {
    "base": "/img/wines/il-rosso-aglianico/back",
    "widths": [
      160,
      320,
      640,
      1024,
      1440
    ],
    "width": 1440,
    "height": 1920
  },
  "/img/wines/il-rosso-aglianico/card-back.webp": {
    "base": "/img/wines/il-rosso-aglianico/card-back",
    "widths": [
      160,
      320,
      350
    ],
    "width": 350,
    "height": 1400
  },
  "/img/wines/il-rosso-aglianico/card-front.webp": {
    "base": "/img/wines/il-rosso-aglianico/card-front",
    "widths": [
      160,
      320,
      411
    ],
    "width": 411,
    "height": 1400
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
    ],
    "width": 1920,
    "height": 1920
  },
  "/img/wines/il-rosso-aglianico/sheet-front.webp": {
    "base": "/img/wines/il-rosso-aglianico/sheet-front",
    "widths": [
      160,
      320,
      411
    ],
    "width": 411,
    "height": 1400
  },
  "/img/wines/lugana/back.jpg": {
    "base": "/img/wines/lugana/back",
    "widths": [
      160,
      320,
      640,
      1024,
      1440
    ],
    "width": 1440,
    "height": 1920
  },
  "/img/wines/lugana/card-back.webp": {
    "base": "/img/wines/lugana/card-back",
    "widths": [
      160,
      320,
      364
    ],
    "width": 364,
    "height": 1400
  },
  "/img/wines/lugana/card-front.webp": {
    "base": "/img/wines/lugana/card-front",
    "widths": [
      160,
      320,
      391
    ],
    "width": 391,
    "height": 1400
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
    ],
    "width": 1920,
    "height": 1920
  },
  "/img/wines/lugana/sheet-front.webp": {
    "base": "/img/wines/lugana/sheet-front",
    "widths": [
      160,
      320,
      391
    ],
    "width": 391,
    "height": 1400
  },
  "/img/wines/lugana/story.jpg": {
    "base": "/img/wines/lugana/story",
    "widths": [
      160,
      320,
      640,
      1024,
      1425
    ],
    "width": 1425,
    "height": 945
  },
  "/img/wines/primitivo-14-5/back.jpg": {
    "base": "/img/wines/primitivo-14-5/back",
    "widths": [
      160,
      320,
      640,
      1024,
      1440
    ],
    "width": 1440,
    "height": 1920
  },
  "/img/wines/primitivo-14-5/card-back.webp": {
    "base": "/img/wines/primitivo-14-5/card-back",
    "widths": [
      160,
      320,
      378
    ],
    "width": 378,
    "height": 1400
  },
  "/img/wines/primitivo-14-5/card-front.webp": {
    "base": "/img/wines/primitivo-14-5/card-front",
    "widths": [
      160,
      320,
      423
    ],
    "width": 423,
    "height": 1400
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
    ],
    "width": 1920,
    "height": 1920
  },
  "/img/wines/primitivo-14-5/sheet-front.webp": {
    "base": "/img/wines/primitivo-14-5/sheet-front",
    "widths": [
      160,
      320,
      423
    ],
    "width": 423,
    "height": 1400
  },
  "/img/wines/primitivo-15-5/back.jpg": {
    "base": "/img/wines/primitivo-15-5/back",
    "widths": [
      160,
      320,
      640,
      1024,
      1440
    ],
    "width": 1440,
    "height": 1920
  },
  "/img/wines/primitivo-15-5/card-back.webp": {
    "base": "/img/wines/primitivo-15-5/card-back",
    "widths": [
      160,
      320,
      348
    ],
    "width": 348,
    "height": 1400
  },
  "/img/wines/primitivo-15-5/card-front.webp": {
    "base": "/img/wines/primitivo-15-5/card-front",
    "widths": [
      160,
      320,
      423
    ],
    "width": 423,
    "height": 1400
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
    ],
    "width": 1920,
    "height": 1920
  },
  "/img/wines/primitivo-15-5/sheet-front.webp": {
    "base": "/img/wines/primitivo-15-5/sheet-front",
    "widths": [
      160,
      320,
      423
    ],
    "width": 423,
    "height": 1400
  },
  "/img/wines/primitivo-salento/back.jpg": {
    "base": "/img/wines/primitivo-salento/back",
    "widths": [
      160,
      320,
      640,
      1024,
      1440
    ],
    "width": 1440,
    "height": 1920
  },
  "/img/wines/primitivo-salento/card-back.webp": {
    "base": "/img/wines/primitivo-salento/card-back",
    "widths": [
      160,
      320,
      346
    ],
    "width": 346,
    "height": 1400
  },
  "/img/wines/primitivo-salento/card-front.webp": {
    "base": "/img/wines/primitivo-salento/card-front",
    "widths": [
      160,
      320,
      403
    ],
    "width": 403,
    "height": 1400
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
    ],
    "width": 1920,
    "height": 1920
  },
  "/img/wines/primitivo-salento/sheet-front.webp": {
    "base": "/img/wines/primitivo-salento/sheet-front",
    "widths": [
      160,
      320,
      403
    ],
    "width": 403,
    "height": 1400
  },
  "/img/wines/rosato-puglia/back.jpg": {
    "base": "/img/wines/rosato-puglia/back",
    "widths": [
      160,
      320,
      640,
      1024,
      1440
    ],
    "width": 1440,
    "height": 1920
  },
  "/img/wines/rosato-puglia/card-back.webp": {
    "base": "/img/wines/rosato-puglia/card-back",
    "widths": [
      160,
      320,
      350
    ],
    "width": 350,
    "height": 1400
  },
  "/img/wines/rosato-puglia/card-front.webp": {
    "base": "/img/wines/rosato-puglia/card-front",
    "widths": [
      160,
      320,
      392
    ],
    "width": 392,
    "height": 1400
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
    ],
    "width": 1920,
    "height": 1920
  }
};
