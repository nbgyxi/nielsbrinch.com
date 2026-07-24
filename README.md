# nielsbrinch.com

Single-page personal site for Niels Brinch — independent developer in Copenhagen.
Built to be served statically from GitHub Pages.

## What's here

| File | Purpose |
| --- | --- |
| `index.html` | The complete site. Self-contained: all styling is inline, all images are embedded as data URLs. Only external dependencies are Google Fonts and a Spotify album embed (both load over the network). |
| `CNAME` | Custom domain for GitHub Pages (`nielsbrinch.com`). Delete this if you deploy to a `*.github.io` URL instead. |
| `.nojekyll` | Tells GitHub Pages to serve files as-is (skip Jekyll processing). |
| `build.js` | Regenerates `index.html` from the design-tool export in `extracted/`. |
| `dev-server.js` | Zero-dependency static server for local preview (`npm run dev`). |
| `package.json` | npm scripts (`dev`, `build`). |

## Local preview

```bash
npm run dev
```

Serves the site at **http://localhost:6174** (override with `PORT=xxxx npm run dev`).
No dependencies to install — it's a plain Node static server.
| `extracted/` | The original design-tool ("DC") export the site was baked from — build input only, not served. |

## Deploy to GitHub Pages

1. Create a repository (e.g. `nielsbrinch.com`) and push these files to the default branch.
2. In **Settings → Pages**, set **Source** to *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. For the custom domain, keep `CNAME` and point your DNS at GitHub Pages
   (`A` records to GitHub's IPs, or a `CNAME` record to `<user>.github.io`).
   Without a custom domain, delete the `CNAME` file — the site will be served at
   `https://<user>.github.io/<repo>/`.

## Rebuilding

The site was exported from a design tool as custom elements (`x-dc`, `sc-for`,
`image-slot`, …) that require a runtime. `build.js` bakes that into plain static
HTML — inlining the sidecar images, expanding the roster loop, and stripping the
runtime scripts. To regenerate after editing the export:

```bash
node build.js
```
