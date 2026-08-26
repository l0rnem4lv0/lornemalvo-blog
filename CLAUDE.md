# Lornemalvo Web — Contexto para Claude Code

## Proyecto
Portfolio y blog de ciberseguridad. Writeups, artículos, notas técnicas.
Aka del autor: Lornemalvo. Dominio: lornemalvo.com.

## Stack
- Astro 5 + TypeScript (modo estricto)
- Tailwind CSS 4
- Content Collections (MD + MDX) con validación Zod
- Expressive Code para syntax highlighting
- Pagefind para búsqueda estática
- Cloudflare Pages para hosting

## Paleta (variables CSS — solo oscuro)

--bg:         #050505
--bg-soft:    #0c0c0c
--bg-code:    #080c12
--fg:         #e5e5e5
--fg-muted:   #888888
--accent:     #00ff9c
--accent-dim: #1a3d2e
--border:     #1f1f1f
--danger:     #ff5555
--warning:    #f1fa8c

Los tokens viven en `:root` y son la única definición. No hay atributo
`data-theme`, ni toggle, ni persistencia en localStorage: cualquier
selector `[data-theme=...]` es residuo y debe eliminarse.

## Syntax highlighting
- Expressive Code con un solo tema: github-dark-default
- `themeCssSelector: false` — con un único tema se emite como estilos base
  sin envolver en un bloque `[data-theme]` que nadie llegaría a matchear

## Tipografía
- Sans: Inter (400, 500, 600, 700)
- Mono: JetBrains Mono (400, 500, 700)
- Escala: 0.875 / 1 / 1.125 / 1.25 / 1.5 / 1.875 / 2.25 / 3 rem
- Line-height cuerpo: 1.7
- Medida de línea ideal: 65-75 ch

## Convenciones de código
- Componentes Astro en PascalCase: Header.astro, PostCard.astro
- Tipos en src/types/
- Utilidades en src/lib/
- Estilos globales en src/styles/global.css (solo tokens y resets)
- El resto, Tailwind utility classes
- Imports absolutos desde src/ con alias `~/`

## Frontmatter de posts (schema Zod)
{
  title: string (max 100),
  date: Date,
  description: string (max 200),
  tags: string[],
  category: 'writeup' | 'article' | 'note',
  difficulty?: 'easy' | 'medium' | 'hard' | 'insane',
  draft: boolean (default false),
  updated?: Date
}

## Visual testing

agent-browser is available for browser automation.
Use it to verify layout, interactions and computed styles
before asking the user for manual verification.

## Vertical rhythm (prose / markdown rendering)

CRITICAL: vertical spacing must be SYMMETRIC around block elements.

Rule: spacing around "block" elements (code blocks, blockquotes, tables, headings)
is defined ON those elements, not via adjacency selectors on paragraphs.

Implementation:
- Each block element wrapper gets `margin-top: X; margin-bottom: X` (same value).
- X must be GREATER than any paragraph margin it could collapse with (e.g. 1.5rem > 1.25rem).
- This guarantees CSS margin-collapsing always resolves to X on both sides.
- Never use selectors like `p + figure { margin-top: ... }` to fix asymmetries —
  they only patch the symptom, not the cause.

Verified: .prose :global(.expressive-code) { margin: 1.5rem 0 }

## Search (Pagefind)

- Pagefind indexes only posts via data-pagefind-body in PostLayout
- Header and Footer marked with data-pagefind-ignore
- Search only works in production build (npm run build && npm run preview)
- rehype-autolink-headings anchors marked data-pagefind-ignore 
  to prevent "#" appearing in search results
- Modal closes on any result click (same-page anchors included)
- TOC scroll spy delayed 150ms on page load when URL has hash,
  to let browser complete anchor scroll before Observer initializes

## Comandos
- npm run dev — servidor local
- npm run build — build producción
- npm run preview — preview del build
- npm run lint — eslint
- npm run format — prettier

## Principios de diseño
- Minimalismo agresivo: si no aporta, fuera
- Solo modo oscuro
- Respeta prefers-reduced-motion
- Accesibilidad AA mínimo (contraste, focus states, navegación por teclado)
- Mobile-first
- Zero JS por defecto, solo client:* donde sea estrictamente necesario

## Astro 6 conventions (Content Layer API)

- Schema location: src/content.config.ts (NOT src/content/config.ts)
- Use glob loader from 'astro/loaders'
- Entry IDs: entry.id (NOT entry.slug)
- Rendering: import { render } from 'astro:content'
  Usage: const { Content, headings } = await render(entry)
- Reference: https://docs.astro.build/en/guides/content-collections/

### Post folder structure (folder-per-slug)

Each post is a folder containing index.md and its assets:

```
src/content/posts/
  htb-writeup-editorial/
    index.md
    scan-screenshot.png
    burp-request.png
```

- Glob loader pattern: `**/index.md` with `generateId` stripping `/index`
  so `entry.id` stays a clean slug (`htb-writeup-editorial`).
- This is what lets body markdown reference images via plain relative
  paths (`./scan-screenshot.png`).

## Image handling in posts

- Location: `src/content/posts/[slug]/*.{png,jpg,webp}` — co-located with `index.md`.
- Markdown syntax: `![alt text](./filename.png)` — Astro resolves the path
  relative to the markdown file.
- Astro 6 optimises automatically: WebP conversion, intrinsic `width`/`height`
  (CLS prevention), `loading="lazy"`, `decoding="async"`. No `<img>` boilerplate
  needed.
- Captions: italic paragraph on the line directly after the image:
  ```markdown
  ![alt](./screenshot.png)
  *Caption descriptivo aquí.*
  ```
  Styled via the `img + em` selector in `Prose.astro`: block, centered,
  `--fg-muted`, `--text-sm`. No `<figure>` component needed.
- All images get `border: 1px solid var(--border)` and
  `border-radius: var(--radius-md)` by default in `.prose`.
- Always include descriptive `alt` text — empty `alt=""` is allowed only for
  purely decorative images.
- Screenshots are dark-only (terminal, Burp, IDE dark theme), which matches
  the site palette; the subtle border keeps them from bleeding into the page
  background.

## Background effect (AsciiPlasma)

- `src/components/AsciiPlasma.astro`, mounted once in `BaseLayout` before `<Header />`.
- Canvas at `position: fixed; z-index: -1` — paints above the propagated `html`
  background and below all content, so no wrapper needs its own stacking context.
- Colours are read live from `--plasma-base` / `--accent` / `--accent-white`, never
  hardcoded, so the layer follows the palette. `--plasma-base` is the darkest stop
  and exists solely for this effect — darken it to calm the background without
  touching link/button underlines, which use `--accent-dim`.
- Tuning knobs are component props (`opacity`, `cellSize`, `speed`, `scale`,
  `levels`, `contrast`, `scanlines`, `flicker`). `opacity` is the subtlety dial.
- Cost controls: 24fps cap, DPR capped at 1.5, blank glyph level skipped, one
  pre-rendered sprite per level (drawImage, not fillText), rAF paused on
  `visibilitychange`.
- `prefers-reduced-motion: reduce` draws a single static frame — texture stays,
  motion stops.
- The layer publishes `--bg-flat` on `:root` at runtime: the tone it actually
  composites to over `--bg`, measured from its own pixels. Opaque surfaces that
  must not read as a flat patch across the field use `var(--bg-flat, var(--bg))`
  — currently the Header and the post reading veil. It is computed rather than
  hardcoded so retuning opacity, `--plasma-base` or the glyph ramp cannot
  silently desync it. At near-black levels this matters more than the raw
  numbers suggest: 5 -> 7 is a ~40% luminance change.

### Reading veil (posts only)

- `.post::before` in `PostLayout` paints `--bg` over the plasma behind the
  article, so body copy sits on a flat background. Posts only — other pages
  keep the effect edge to edge.
- The bleed and the fade distance are the same token per axis
  (`--veil-fade-x` / `--veil-fade-y`), so the gradient hits full opacity
  exactly at the text column edge whatever the column width is. Change one and
  the other follows; they must stay equal or the fade lands on the words.
- Both are `--space-6` (24px). Raise them for a softer, wider fade; lower them
  for a tighter edge.
- The veil fills `--bg-flat`, not `--bg` — see below.
- Horizontal fade is in the gradient, vertical fade in the mask — deliberately
  avoids `mask-composite`.
- Stacking: canvas is `z-index: -2`, veil is `-1`. Both are negative so they sit
  under all content; the order between them is what keeps the veil on top.
- `main` needs `overflow-x: clip` or the veil's bleed widens the document on
  narrow viewports (measured: 80px of horizontal overflow at 390px wide without
  it). It must be `clip`, not `hidden` — `hidden` would create a scroll
  container and break the sticky TOC.

## Pinned dependencies (do not auto-upgrade)

- @tailwindcss/vite: 4.1.18 exact (4.3.x breaks with Astro 6.3.x rolldown resolver)
- tailwindcss: 4.1.18 exact

## NPM conventions

- Critical dependencies installed with --save-exact (no ^ or ~)
- Verify package.json after install
- Always commit package-lock.json

## PostCard conventions

- Stretched link via `h2 a::after { position: absolute; inset: 0; z-index: 0 }`
- `article` needs `position: relative` for stretched link to work
- Tags need `position: relative; z-index: 1` to be clickable over stretched link
- Reading time and date formatting live in `src/lib/posts.ts` (`getReadingTime`, `formatDate`)
- Difficulty colors: easy (accent sutil), medium (warning), hard (color-mix danger+fg-muted), insane (danger puro)
- Post titles in cards: `--fg` at rest, `--accent` on hover. Never `--accent` at rest.

## Site config

- All configurable constants in `src/config.ts` (SITE_CONFIG)
- `RECENT_POSTS_COUNT` controls posts shown on home — editorial config, not env var
- Social URLs in SITE_CONFIG — update before deploy

## About page

- Avatar placeholder: iniciales "LM" SVG en src/pages/about.astro
- Real avatar goes in src/content/about/avatar.png (min 240x240px)
- When avatar is ready: update img src in about.astro hero section
- Use image-rendering: pixelated for pixel art
- HTB profile: https://app.hackthebox.com/u/l0rnemalv0
- Contact email: vilallavepablo@gmail.com

## Security headers

- Configured in `public/_headers` (Cloudflare Pages format — copied as-is to `dist/`)
- Applies to all routes via `/*` pattern
- `X-Frame-Options: DENY` — clickjacking prevention (redundant with `frame-ancestors 'none'` in CSP)
- CSP allows `unsafe-inline` for scripts: required by the reading progress bar, the
  TOC scroll spy and the ASCII plasma background — all Astro-bundled inline scripts
- No external origin is allowed in `script-src`/`connect-src`, so third-party effect
  or widget CDNs cannot be dropped in without weakening the policy. Reimplement
  self-hosted instead.
- All resources are self-hosted: fonts via Fontsource (local woff2), images local,
  no external CDN — so `default-src 'self'` is safe
- `worker-src 'self' blob:` — required by Pagefind search web worker
- To tighten CSP in future: extract inline scripts to external `.js` files and replace
  `unsafe-inline` with specific hashes or nonces

## No hacer
- No instalar React/Vue/Svelte salvo necesidad concreta
- No usar CSS-in-JS
- No añadir librerías de UI completas (shadcn, daisyui, etc.) — solo Tailwind
- No usar emojis en UI (solo iconos SVG)
- No animaciones gratuitas
- No hardcodear colores (siempre var(--token))
- No usar Tailwind dark: prefix (estamos con CSS variables, no con la estrategia de class de Tailwind)
