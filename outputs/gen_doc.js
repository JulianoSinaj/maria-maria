const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  LevelFormat, PageBreak, ExternalHyperlink
} = require("docx");

// ---------- palette ----------
const WINE = "6B1F2A";   // deep wine red
const WINE2 = "8C2F3D";
const INK = "222222";
const GRAY = "555555";
const LIGHT = "F3EBEC";   // light wine tint for table headers
const RULE = "C9A227";    // gold rule

// ---------- helpers ----------
const H1 = (t) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 320, after: 140 },
  children: [new TextRun({ text: t, bold: true, color: WINE, size: 30 })],
});
const H2 = (t) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 240, after: 100 },
  children: [new TextRun({ text: t, bold: true, color: WINE2, size: 26 })],
});
const P = (runs, opts = {}) => new Paragraph({
  spacing: { after: 120, line: 276 },
  children: Array.isArray(runs) ? runs : [new TextRun({ text: runs, size: 22, color: INK })],
  ...opts,
});
const T = (text, opts = {}) => new TextRun({ text, size: 22, color: INK, ...opts });
const bullet = (runs) => new Paragraph({
  numbering: { reference: "bullets", level: 0 },
  spacing: { after: 80, line: 272 },
  children: Array.isArray(runs) ? runs : [new TextRun({ text: runs, size: 22, color: INK })],
});
const numItem = (runs) => new Paragraph({
  numbering: { reference: "steps", level: 0 },
  spacing: { after: 80, line: 272 },
  children: Array.isArray(runs) ? runs : [new TextRun({ text: runs, size: 22, color: INK })],
});

const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const cellBorders = {
  top: { style: BorderStyle.SINGLE, size: 2, color: "E3D6D8" },
  bottom: { style: BorderStyle.SINGLE, size: 2, color: "E3D6D8" },
  left: { style: BorderStyle.SINGLE, size: 2, color: "E3D6D8" },
  right: { style: BorderStyle.SINGLE, size: 2, color: "E3D6D8" },
};

function cell(text, widthDxa, { header = false, bold = false, align = AlignmentType.LEFT } = {}) {
  const runs = Array.isArray(text)
    ? text
    : [new TextRun({ text, size: 19, bold: bold || header, color: header ? "FFFFFF" : INK })];
  return new TableCell({
    width: { size: widthDxa, type: WidthType.DXA },
    borders: cellBorders,
    shading: header
      ? { type: ShadingType.CLEAR, fill: WINE, color: "auto" }
      : { type: ShadingType.CLEAR, fill: "FFFFFF", color: "auto" },
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({ alignment: align, children: runs })],
  });
}

function makeTable(colWidths, headers, rows) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => cell(h, colWidths[i], { header: true })),
  });
  const bodyRows = rows.map((r, ri) =>
    new TableRow({
      children: r.map((c, i) => {
        const shaded = ri % 2 === 1;
        const cc = cell(c, colWidths[i]);
        if (shaded) cc.root.forEach(() => {});
        return new TableCell({
          width: { size: colWidths[i], type: WidthType.DXA },
          borders: cellBorders,
          shading: { type: ShadingType.CLEAR, fill: shaded ? LIGHT : "FFFFFF", color: "auto" },
          margins: { top: 60, bottom: 60, left: 100, right: 100 },
          children: [new Paragraph({ children: [new TextRun({ text: String(c), size: 19, color: INK })] })],
        });
      }),
    })
  );
  return new Table({
    columnWidths: colWidths,
    width: { size: colWidths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    rows: [headerRow, ...bodyRows],
  });
}

const goldRule = () => new Paragraph({
  spacing: { before: 40, after: 160 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: RULE } },
  children: [new TextRun({ text: "", size: 2 })],
});

// ---------- content ----------
const children = [];

// Title block
children.push(new Paragraph({
  spacing: { before: 200, after: 40 },
  children: [new TextRun({ text: "MARIA MARIA WINE", bold: true, color: WINE, size: 24, characterSpacing: 40 })],
}));
children.push(new Paragraph({
  spacing: { after: 60 },
  children: [new TextRun({ text: "Backend Technology Recommendation", bold: true, color: INK, size: 44 })],
}));
children.push(new Paragraph({
  spacing: { after: 120 },
  children: [new TextRun({ text: "E-commerce platform · Self-hosted on Hetzner + Coolify", color: GRAY, size: 22, italics: true })],
}));
children.push(goldRule());
children.push(new Paragraph({
  spacing: { after: 200 },
  children: [new TextRun({ text: "Prepared July 20, 2026 · Working draft for review", color: GRAY, size: 18 })],
}));

// Executive summary
children.push(H1("At a glance"));
children.push(P([
  T("For an online wine store that you want to "), T("own and self-host", { bold: true }),
  T(" on Hetzner with Coolify, the best-fit backend is a "),
  T("headless commerce engine built on Node.js / TypeScript: ", { bold: true }),
  T("Medusa (v2)", { bold: true, color: WINE }),
  T(", paired with a "), T("Next.js", { bold: true }),
  T(" storefront. It runs entirely on open-source infrastructure — "),
  T("PostgreSQL", { bold: true }), T(", "), T("Redis", { bold: true }), T(", and "),
  T("MinIO", { bold: true }),
  T(" — all of which Coolify provisions in one click with automated backups."),
]));
children.push(P([
  T("This gives you one language across the whole stack, no per-sale platform fees, no vendor lock-in, and full control of the customer data and compliance logic that selling alcohol requires."),
]));

// Recommendation box (as a shaded single-cell table)
children.push(new Table({
  columnWidths: [9360],
  width: { size: 9360, type: WidthType.DXA },
  rows: [new TableRow({ children: [new TableCell({
    width: { size: 9360, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: WINE },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: WINE },
      left: { style: BorderStyle.SINGLE, size: 18, color: WINE },
      right: { style: BorderStyle.SINGLE, size: 4, color: WINE },
    },
    shading: { type: ShadingType.CLEAR, fill: LIGHT, color: "auto" },
    margins: { top: 140, bottom: 140, left: 180, right: 160 },
    children: [
      new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "Recommended stack", bold: true, color: WINE, size: 22 })] }),
      new Paragraph({ children: [
        T("Backend: ", { bold: true }), T("Medusa v2 (Node.js / TypeScript)   ·   "),
        T("Storefront: ", { bold: true }), T("Next.js   ·   "),
        T("Data: ", { bold: true }), T("PostgreSQL + Redis   ·   "),
        T("Files: ", { bold: true }), T("MinIO (S3-compatible)"),
      ]}),
      new Paragraph({ spacing: { before: 40 }, children: [
        T("Deploy: ", { bold: true }), T("Coolify on a Hetzner VPS   ·   "),
        T("Payments: ", { bold: true }), T("Stripe   ·   "),
        T("Email: ", { bold: true }), T("Resend / Postmark"),
      ]}),
    ],
  })] })],
}));
children.push(P("", { spacing: { after: 80 } }));

// Assumptions
children.push(H1("What this is based on"));
children.push(P("You told me the following, and the recommendation follows from it. If any of these change, the answer can shift — I have noted where."));
children.push(bullet([T("Product: ", { bold: true }), T("an e-commerce store to sell wine online (you were not certain, so I have kept the stack flexible enough to also serve as a brand/content site).")]));
children.push(bullet([T("Language: ", { bold: true }), T("no preference — recommend the best fit.")]));
children.push(bullet([T("Hosting: ", { bold: true }), T("self-hosted on Hetzner, deployed and managed with Coolify.")]));
children.push(bullet([T("Note: ", { bold: true }), T("selling alcohol adds legal requirements (age checks, shipping rules, tax) that shape the build as much as the technology does — covered later.")]));

// Why Medusa
children.push(H1("Why Medusa is the best fit"));
children.push(P([T("Medusa is an open-source, API-first commerce engine — one of the fastest-growing in the space. It fits your constraints better than the alternatives for a few concrete reasons:")]));
children.push(bullet([T("One language, whole stack. ", { bold: true }), T("Medusa is TypeScript and so is a Next.js storefront. Your team learns and hires for a single ecosystem instead of splitting backend and frontend skills.")]));
children.push(bullet([T("Built to be self-hosted. ", { bold: true }), T("It ships as Docker containers and depends only on PostgreSQL and Redis — both of which Coolify runs as one-click services. Nothing about it fights your Hetzner + Coolify setup.")]));
children.push(bullet([T("No lock-in, no per-sale fee. ", { bold: true }), T("It is MIT-licensed and free. Unlike Shopify or BigCommerce, you pay for a server, not a cut of every bottle sold.")]));
children.push(bullet([T("Right shape for wine. ", { bold: true }), T("Because you own the backend, you can model wine-specific attributes (vintage, varietal, region, ABV, allergens) and — critically — build the age-gate and shipping-restriction rules directly into the checkout instead of bolting on a plugin.")]));
children.push(bullet([T("Extensible where it matters. ", { bold: true }), T("A module and plugin system covers payments (Stripe), search, notifications, and a wine-club/subscription model when you want recurring shipments.")]));
children.push(P([T("Trade-off to be honest about: ", { italics: true, bold: true }), T("Medusa is a developer's tool. It rewards a team that can write code. If Maria Maria has little or no engineering capacity, see the WooCommerce and Shopify notes in the alternatives — they trade control for a faster, lower-skill launch.", { italics: true })]));

// Alternatives
children.push(H1("Alternatives considered"));
children.push(P("All of the self-hosted options below are legitimate. The table is the short version; notes follow."));
children.push(makeTable(
  [1450, 1350, 1550, 2650, 2360],
  ["Platform", "Language", "Architecture", "Best when…", "Watch-outs"],
  [
    ["Medusa v2  ✓", "TypeScript", "Headless, REST + modules", "You want full control and a modern JS/TS stack", "Needs real dev resources"],
    ["Vendure", "TypeScript", "Headless, GraphQL", "Team prefers GraphQL and strict structure", "No native subscriptions"],
    ["Saleor", "Python / Django", "Headless, GraphQL", "Team is Python-first, complex catalogs", "Heavier to run and operate"],
    ["Bagisto", "PHP / Laravel", "Traditional MVC", "Team already lives in Laravel/PHP", "Less 'headless', dated feel"],
    ["WooCommerce", "PHP / WordPress", "Monolith + plugins", "Content-heavy, fast, low-code launch", "Plugin sprawl, scales poorly"],
  ]
));
children.push(P([T("Vendure ", { bold: true }), T("is the closest runner-up and an easy switch if your team prefers GraphQL. "), T("Saleor ", { bold: true }), T("is powerful but a heavier operational load — pick it only if you are already a Python shop. "), T("WooCommerce ", { bold: true }), T("deserves a mention as the pragmatic escape hatch: if you need a wine shop live in weeks with minimal engineering, WordPress + WooCommerce (plus a wine/age-verification plugin) runs happily on Coolify too. And "), T("Shopify ", { bold: true }), T("remains the zero-ops baseline you are choosing to trade away — you give up monthly fees and control in exchange for someone else handling uptime, PCI, and compliance.")]));

// Architecture
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(H1("Architecture on Hetzner + Coolify"));
children.push(P("Everything below runs as a service inside Coolify on your Hetzner server. Coolify handles the Docker orchestration, SSL certificates, domains, and scheduled backups, so you manage services from a dashboard rather than by hand."));
children.push(makeTable(
  [2350, 2650, 4360],
  ["Component", "Technology", "Role"],
  [
    ["Commerce API + Admin", "Medusa v2 (server process)", "Products, carts, orders, customers, promotions, admin dashboard"],
    ["Background worker", "Medusa v2 (worker process)", "Durable workflows, retries, emails, webhooks — run as a separate instance"],
    ["Storefront", "Next.js", "The customer-facing shop; talks to the Medusa API"],
    ["Primary database", "PostgreSQL (Coolify 1-click)", "System of record for all commerce data"],
    ["Cache / events / jobs", "Redis or Valkey (Coolify 1-click)", "Workflow engine, session cache, event bus"],
    ["Object storage", "MinIO (Coolify 1-click)", "Product images and media (S3-compatible)"],
    ["Search (optional)", "Meilisearch (Coolify 1-click)", "Fast product search and filtering by region/varietal"],
    ["Payments", "Stripe (Medusa plugin)", "Checkout, cards, refunds; confirm alcohol approval"],
    ["Transactional email", "Resend / Postmark / SES", "Order confirmations, shipping, password resets"],
    ["Edge / DNS / CDN", "Cloudflare", "DNS, caching, WAF, DDoS protection in front of Hetzner"],
    ["Monitoring / uptime", "Uptime Kuma + Coolify alerts", "Health checks and notifications"],
  ]
));
children.push(P([T("Data flow: ", { bold: true }), T("shoppers hit the Next.js storefront → it calls the Medusa API → Medusa reads/writes PostgreSQL, uses Redis for jobs and caching, and serves images from MinIO. Stripe handles payment; the worker sends email and fires webhooks. Cloudflare sits in front of the whole thing.")]));

// Sizing / cost
children.push(H2("Hetzner server sizing and rough cost"));
children.push(P([T("Medusa recommends at least 4 GB of RAM; once you add PostgreSQL, Redis, MinIO, the storefront, and Coolify itself on one box, "), T("8 GB is the comfortable starting point.", { bold: true }), T(" Start on a single shared-vCPU server and scale up — Hetzner lets you resize in place.")]));
children.push(makeTable(
  [1750, 3050, 1560, 3000],
  ["Tier", "Example plan", "~ / month", "Fits"],
  [
    ["Start", "CX32 / CPX31 / CAX21 — 4 vCPU, 8 GB, ~80 GB NVMe", "≈ €10–20", "Launch + early traffic, all-in-one"],
    ["Grow", "CCX / CPX — 8 vCPU, 16 GB", "≈ €25–50", "Steady sales; move DB to its own service"],
    ["Scale", "Dedicated vCPU (CCX) + separate DB host", "€60+", "High traffic, peak drops, HA"],
  ]
));
children.push(P([T("Prices are approximate as of mid-2026; Hetzner adjusted its cloud pricing during 2026, so confirm current rates. ", { italics: true }), T("Every plan includes NVMe RAID10 storage and 20 TB of traffic. The ARM plans (CAX-series) are the best value and run Node/Postgres/Redis fine — just confirm your Docker images build for ARM.", { italics: true })]));
children.push(P([T("Backups: ", { bold: true }), T("point Coolify's automated PostgreSQL backups at an S3 bucket — Hetzner Object Storage or Backblaze B2 — so your data lives off the server. Enable Hetzner's snapshot/backup option for the volume as a second layer.")]));

// Wine-specific
children.push(H1("Selling wine: the part that isn't about code"));
children.push(P([T("For an alcohol store, compliance is a first-class feature, not an afterthought — and the exact rules depend on where you sell and ship. Whatever the jurisdiction, plan for these:")]));
children.push(bullet([T("Age verification at two points. ", { bold: true }), T("A birth-date gate on the site/checkout, and — for shipments — an adult signature (21+ in the US) collected by the carrier at delivery. For stricter markets, add an ID-verification provider (e.g., Persona, AgeChecked).")]));
children.push(bullet([T("Shipping restrictions engine. ", { bold: true }), T("You must be able to block or allow orders by destination. In the US this is state-by-state direct-to-consumer (DtC) rules; in the EU it is VAT/excise and country rules. Owning the Medusa backend is exactly what lets you enforce this in the cart.")]));
children.push(bullet([T("Tax is complicated. ", { bold: true }), T("Alcohol carries excise/duty on top of sales tax/VAT. Integrate a tax service (Avalara or Sovos handle US DtC alcohol; use a VAT/OSS setup for the EU) rather than hand-coding rates.")]));
children.push(bullet([T("Payments that allow alcohol. ", { bold: true }), T("Stripe supports alcohol businesses but requires proper account setup and review; some sellers use a specialist alcohol-friendly merchant account. Confirm approval before launch so you are not blocked at go-live.")]));
children.push(bullet([T("Records and chargebacks. ", { bold: true }), T("Keep customer, age-check, and delivery records; alcohol sees more chargebacks, so plan fraud tooling.")]));
children.push(P([T("None of this changes the recommended stack — it argues "), T("for", { italics: true }), T(" it. A headless, code-owned backend like Medusa is far easier to bend to these rules than a closed platform.")]));
children.push(P([T("This is general information, not legal advice — confirm the specific alcohol-shipping, licensing, and tax rules for the markets you will sell into before launch.", { italics: true, color: GRAY })]));

// Risks
children.push(H1("Risks and honest caveats"));
children.push(bullet([T("You own the operations. ", { bold: true }), T("Self-hosting means uptime, patching, and backups are yours. Coolify eases this a lot, but it is not zero — budget for a person who owns the server.")]));
children.push(bullet([T("Single-server single point of failure. ", { bold: true }), T("Fine to launch on one box; put backups off-server from day one and plan the move to a separate database as you grow.")]));
children.push(bullet([T("Developer dependency. ", { bold: true }), T("Medusa needs engineering. If that capacity is thin, WooCommerce (still self-hosted on Coolify) or Shopify (not self-hosted) get you selling faster.")]));
children.push(bullet([T("Compliance is the real risk. ", { bold: true }), T("The technical build is the easy part; the alcohol rules are where projects get stuck. Scope that work early.")]));

// Next steps
children.push(H1("Suggested next steps"));
children.push(numItem([T("Confirm scope: ", { bold: true }), T("pure e-commerce, or store + brand/content site? This decides how much the storefront does.")]));
children.push(numItem([T("Confirm markets: ", { bold: true }), T("which countries/states you will ship to — this drives compliance and tax choices.")]));
children.push(numItem([T("Stand up the box: ", { bold: true }), T("provision a Hetzner CX32/CAX21, install Coolify, add PostgreSQL, Redis, and MinIO as one-click services.")]));
children.push(numItem([T("Deploy Medusa + storefront: ", { bold: true }), T("connect the Git repo to Coolify; run Medusa as server + worker; deploy the Next.js starter storefront.")]));
children.push(numItem([T("Wire commerce essentials: ", { bold: true }), T("Stripe (get alcohol approval), transactional email, and the age-gate + shipping-restriction logic.")]));
children.push(numItem([T("Harden: ", { bold: true }), T("off-server backups, Cloudflare in front, monitoring, and a staging environment before you take real orders.")]));

// Sources
children.push(H1("References"));
const src = (label, url) => new Paragraph({
  spacing: { after: 60 }, numbering: { reference: "bullets", level: 0 },
  children: [
    T(label + " — "),
    new ExternalHyperlink({ link: url, children: [new TextRun({ text: url, style: "Hyperlink", size: 18 })] }),
  ],
});
children.push(src("Medusa deployment & requirements (Postgres, Redis, Node 20+, S3)", "https://docs.medusajs.com/learn/deployment/general"));
children.push(src("Medusa self-hosting cost breakdown, 2026", "https://www.buildwithmatija.com/blog/medusajs-pricing-cloud-self-host-costs-2026"));
children.push(src("Coolify — one-click services, backups, features", "https://coolify.io/docs"));
children.push(src("Coolify 2026 overview (v4, 280+ services)", "https://nextgrowth.ai/what-is-coolify/"));
children.push(src("Self-hosted e-commerce comparison (Medusa/Vendure/Saleor/Bagisto), 2026", "https://cozycommerce.dev/blog/self-hosted-ecommerce-platform"));
children.push(src("Hetzner Cloud plans & pricing, 2026", "https://www.hetzner.com/cloud/regular-performance"));
children.push(src("Age verification for alcohol direct shippers", "https://www.avalara.com/us/en/learn/whitepapers/getting-it-right-the-4-steps-to-age-verification-for-direct-shippers.html"));
children.push(src("Alcohol e-commerce compliance checklist", "https://www.bottlecapps.com/blogs/ecommerce-alcohol-compliance-checklist-age-verification-to-shipping-laws/"));

// ---------- document ----------
const doc = new Document({
  creator: "Maria Maria Wine",
  title: "Backend Technology Recommendation",
  styles: {
    default: { document: { run: { font: "Calibri", size: 22, color: INK } } },
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { run: { color: WINE }, paragraph: { indent: { left: 340, hanging: 220 } } } }],
      },
      {
        reference: "steps",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 360, hanging: 240 } } } }],
      },
    ],
  },
  sections: [{
    properties: { page: {
      size: { width: 12240, height: 15840 },
      margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
    } },
    children,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("/sessions/determined-cool-allen/mnt/outputs/Maria_Maria_Backend_Recommendation.docx", buf);
  console.log("WROTE docx, bytes:", buf.length);
});
