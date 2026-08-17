# Kampvuur site quality hardening

Audited against the `kampvuur-biltong/www` main-branch snapshot deployed on 16 August 2026.

## Browser/UI verification completed

- Responsive widths checked: 1440, 768, 390 and 320 CSS px
- Horizontal overflow: none at all tested widths
- Product grid: 3 columns desktop, 2 tablet, 1 mobile
- Theme toggle: pass
- Sticky header state: pass
- Mobile menu open/close: pass
- Mobile menu `aria-expanded` / `aria-hidden`: pass
- Escape close and focus restoration: pass
- Minimum visible button/icon target: 44px or larger
- `prefers-reduced-motion`: respected
- Runtime page errors during tested interactions: none
- WhatsApp CTAs: six `wa.me` links receive six inline WhatsApp brand glyphs
- `localStorage` access failure is guarded, so preference storage cannot break navigation/theme/animation bootstrap

## Static SEO verification completed

- Single H1: pass
- Viewport: pass
- Meta robots: pass
- Canonical: present
- Title: 65 characters
- Meta description: 135 characters
- Open Graph/Twitter metadata: present
- Store JSON-LD: parses successfully
- Sitemap XML: parses successfully
- robots.txt: references the production sitemap



Configured category thresholds:

- Performance >= 90
- Accessibility >= 95
- Best Practices >= 95
- SEO >= 95

Core Web Vitals / responsiveness warnings:

- LCP <= 2.5 s
- CLS <= 0.10
- TBT <= 200 ms


## Semrush status

The connected Semrush subscription currently has insufficient API units to execute the Site Audit crawl. Additional API units are required before that crawl can run.

## Deployment/indexing note

GitHub Pages currently serves `https://kampvuur-biltong.github.io/www/` without a custom-domain CNAME, while the canonical metadata, robots.txt and sitemap target `https://kampvuur-biltong.co.za/`. Configure the intended production domain/DNS before treating GitHub Pages as the canonical indexed production endpoint.
