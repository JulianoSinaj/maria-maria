# Publishing Maria Maria to GitHub

This folder **is** the complete website — a Next.js 14 + Tailwind project with a
self-contained static preview. You can push it to GitHub as-is.

## What's in here
```
app/          the 5 pages (Home, Unsere Weine, Regionen, Magazin, Kontakt)
components/   Header, Footer, Logo, Bottle, Icons (incl. the Manduria stemma)
public/       hero.jpg + img/  (assets served by Next.js)
img/          the same assets, used by the static preview HTML
*.html        preview.html, weine.html, regionen.html, magazin.html, kontakt.html
tailwind.config.js · next.config.js · postcss.config.js · package.json
.gitignore    excludes node_modules, build output, scratch files, and the
              WhatsApp reference screenshots
```

## (Optional) rename the folder to `maria`
In File Explorer, right-click the `maria-maria` folder → Rename → `maria`.
The folder name doesn't affect the code or the eventual GitHub repo name.

## Publish (first time)
Open a terminal **in this folder** and run:

```bash
git init
git add .
git commit -m "Maria Maria website — 5 pages"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Create the empty `<repo-name>` repository on github.com first (without a README,
so the first push isn't rejected).

## Run it locally
```bash
npm install
npm run dev      # http://localhost:3000
```

## Just want to look, no build
Open **preview.html** in any browser and click through the nav — every page is a
static mirror that needs no install.

## Deploy (optional)
The easiest host for a Next.js repo is Vercel: import the GitHub repo at
vercel.com/new and it builds and deploys automatically.
