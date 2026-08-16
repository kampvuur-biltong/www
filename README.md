# Kampvuur Biltong public website

Static, dependency-free public website shell for `kampvuur-biltong.co.za`.

## Existing repo assets required

This bundle intentionally references the brand assets that already exist in the repository:

- `images/Untitled design.svg`
- `images/Untitled design - 3.png`

Do not delete or rename those files without updating the HTML/JS references.

## Features

- Shared header and footer injected from `assets/site.js`
- Responsive navigation with mobile drawer
- Persistent light/dark theme toggle
- SVG favicon + PNG fallback / Apple touch icon
- Semantic HTML and accessible focus/navigation behaviour
- Open Graph and Twitter metadata
- Schema.org `Store` structured data
- `robots.txt`, `sitemap.xml`, and PWA web manifest
- Reduced-motion handling and responsive layout from mobile through desktop
- No runtime dependencies or external font/CDN requirements

## Suggested deployment

Serve the repository root over HTTPS at `https://kampvuur-biltong.co.za/`. Validate DNS, TLS, canonical redirects, `robots.txt`, `sitemap.xml`, and Search Console after deployment.
