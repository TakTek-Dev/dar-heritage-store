# DAR brand spec

Client: Filistin Miras Merkezi, DÂR (Palestinian Heritage Centre), Altın Sk. No:11/A, Bahçelievler, İstanbul.
Instagram: @filistinmirasmerkezi_dar. Languages: Arabic (primary), Turkish, English.
Product: e-commerce for Palestinian heritage products (embroidered pieces). Then admin dashboard and payment gateway.

## Assets
| Asset | Path | Notes |
|---|---|---|
| Full logo (vector) | `assets/brand/dar-logo-full.svg` | Extracted from client PDF, text as paths |
| Logo source | `20260918-144606-dar.pdf`, `20260918-144607-dar.png` | From client |
| Star mark as stitch chart | `assets/js/stitch.js` → `motifs.star` | 44 x 45 grid, quantized from the logo PNG |
| Product photos / videos | MISSING | Needed from client for the homepage |

## Colors (from logo PDF fills)
- Zaytoun `#364639`, Henna `#B25426`. Everything else derived, see `assets/css/tokens.css`.

## Type
Thmanyah (Serif Display / Serif Text / Sans), free for commercial use per font.thmanyah.com FAQ.
Files self-hosted in `assets/fonts/`. Re-check the license page before launch.

## Client wishes
- Thmanyah-like typography.
- About: touches of Palestinian thob embroidery.
- Product videos on the homepage (reference: ggseye.com).
- Thob embroidery must be visible and own the site; recognizable without the logo.

## System
`design-system.html` is the living reference. Core idea: the stitch (8px) is the unit for spacing, corners, icons and motion.
Motif names and meanings must be reviewed by DAR before publishing.
