# Art Direction & Design System

The visual identity of **Indian Spice Export** marries timeless heritage with contemporary wholesale trade confidence. Inspired by vintage botanical trade folios and the ancient maritime spice corridors of Malabar and Kalinga (Odisha), the aesthetic balances luxurious calm with dense operational clarity.

---

## 1. Color Palette & Brand Tokens

| Token | Hex | Role | Usage |
|---|---|---|---|
| `--color-forest-950` | `#0a1b13` | Deep Evergreen Foundation | Hero sections, Admin sidebar, high-contrast footers |
| `--color-forest-900` | `#10281d` | Dominant Brand Forest | Primary headings, prominent containers, cards |
| `--color-forest-800` | `#183d2c` | Interactive Forest | Primary buttons, active navigation, badges |
| `--color-gold-500` | `#c49a45` | Warm Spice Gold | Accents, borders, badges, scroll progress hairline |
| `--color-gold-400` | `#d5b362` | Highlight Gold | Active states, hover highlights, leaf emblem |
| `--color-ivory-100` | `#faf7f2` | Warm Paper Ivory | Primary card background, clean reading surfaces |
| `--color-ivory-200` | `#f6f1e7` | Soft Linen Page Base | Document body background, page layout |
| `--color-ivory-300` | `#ede4d3` | Divider Ivory | Subtle hairline borders, container outlines |
| `--color-terracotta` | `#9b452e` | Earth Clay / Red Chilli | Alert accents, harvest highlights, filter resets |
| `--color-charcoal` | `#292b25` | Peppercorn Charcoal | High-legibility body prose, readable typography |

---

## 2. Typography Scale

- **Display Serif**: `Playfair Display`, Georgia, serif
  - Used for hero headlines, section statements, and product titles.
  - Rendered with editorial italic emphasis on botanical terms and geographic GI provenance.
- **Precision Sans**: `Inter`, system-ui, sans-serif
  - Used for dense technical specifications, purity percentages, Incoterms, and navigation.
- **Tabular Mono**: `JetBrains Mono`, `Consolas`, monospace
  - Used for HS Codes, reference numbers, registration licenses, and numerical weights.

### Fluid Heading Hierarchy
- `.font-display`: `clamp(2.75rem, 5vw + 1rem, 5.5rem)`
- `.font-h1`: `clamp(2.25rem, 3.5vw + 1rem, 4rem)`
- `.font-h2`: `clamp(1.875rem, 2.2vw + 1rem, 3rem)`
- `.font-h3`: `clamp(1.25rem, 1.2vw + 0.8rem, 1.75rem)`
- `.font-eyebrow`: `0.75rem`, letter spacing `0.22em`, uppercase tracking

---

## 3. Motion System & Micro-Interactions

1. **Easing Curve**:
   - `[0.22, 1, 0.36, 1]`: Bespoke luxury ease-out curve. Rapid initial response decelerating smoothly to zero velocity without robotic bounce.
2. **Branded Preloader**:
   - Pulses an artisanal botanical leaf emblem with golden veins.
   - Runs for a strictly bounded `1.1s` (maximum `1.2s`), executing only once per browser session via `sessionStorage`. Disabled automatically when `prefers-reduced-motion` is active.
3. **Cinematic Ken-Burns Hero**:
   - Applies an infinite 22-second subtle scale-and-pan transform (`scale(1.02)` to `scale(1.07)`) behind translucent forest gradients, bringing stillness to life.
4. **Desktop Magnetic Buttons**:
   - Interactive primary buttons track pointer coordinates (`pointer: fine`), gently pulling toward the cursor by 18% of cursor offset to create tactile weight.
5. **Hairline Gold Scroll Progress**:
   - A 2px gradient hairline (`#c49a45` to `#e5cb8c`) anchors to the top edge of the viewport, visualizing reading progression through long commercial catalogs.
