# Kampvuur Biltong — Figma implementation overlay

Target design:
- Figma file: `giAyD94Vqg8LA9p9Wo2IPB`
- Desktop node: `1:135`
- User-selected section: `1:1110`

Target repository:
- `https://github.com/kampvuur-biltong/www.git`

## What this overlay implements

- 139px black desktop masthead with Kampvuur logo and the Figma navigation.
- Full-width hero with exact Figma hero raster, overlay, centred headline, copy and CTA.
- "Who Buys Kampvuur Biltong?" two-column business/reseller section.
- Brown three-step reseller workflow with rounded white cards.
- Nine-product responsive catalogue matching the Figma colour palette and spacing.
- About section using the Figma packaging imagery.
- Callback form section with the dark-brown background and Figma product photograph.
- Gift-pack promotional section using the Figma gift background and product artwork.
- Accessible FAQ accordions.
- Figma-style dark footer.
- Responsive breakpoints for tablet and mobile.
- Reduced-motion support, visible focus states, semantic landmarks and alt text.
- Existing business contact details and structured-data fundamentals retained.
- Static callback form opens a prefilled WhatsApp message; no data is stored.

## Figma design tokens used

- Black `#000000`
- White `#FFFFFF`
- Pearl Bush `#E7DFD8`
- Thunder `#231F20`
- Fantasy `#FDFAF8`
- Nutmeg `#7B4528`
- Zircon `#FAFBFF`
- Soft Amber `#CBC1AE`
- Copper `#C2783E`
- Bronzetone `#4A320D`
- Emperor `#4E4B4D`
- Cararra `#E6E4DD`
- Inter for the core UI, Montserrat for the lead form.

## Required step: preserve the exact Figma raster assets

The Figma MCP exposes the original image fills using short-lived download URLs. Run:

```powershell
.\fetch-figma-assets.ps1
```

This writes the images into `images/figma/`. Commit those downloaded files; do **not** deploy with the temporary Figma URLs.

## Apply to a local clone

From the parent directory containing this overlay and your `www` clone:

```powershell
Copy-Item .\kampvuur-figma-implementation\index.html .\www\index.html -Force
Copy-Item .\kampvuur-figma-implementation\assets\styles.css .\www\assets\styles.css -Force
Copy-Item .\kampvuur-figma-implementation\assets\site.js .\www\assets\site.js -Force
Copy-Item .\kampvuur-figma-implementation\images\figma .\www\images\figma -Recurse -Force

Set-Location .\www
git add index.html assets/styles.css assets/site.js images/figma
git commit -m "feat: implement Kampvuur Figma landing page"
git push
```

## GitHub connector limitation encountered

The connected GitHub integration successfully reads the repository, but every write route attempted returned:

`403 Resource not accessible by integration`

This included branch creation, Contents API file replacement, and low-level Git blob creation. No repository mutation was made by ChatGPT during this run.
