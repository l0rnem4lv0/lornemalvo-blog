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
- `defaultProps: { frame: 'code' }` — todos los bloques se renderizan igual.
  Por defecto el plugin de frames promociona los lenguajes de shell (bash, sh,
  powershell…) a marco de terminal, que añade una barra de título con puntos de
  ventana y hace que los bloques bash no se parezcan a los demás. Se puede
  recuperar por bloque con `frame="terminal"` en la valla del fence.
- Los overrides de `.frame.is-terminal` en `global.css` se mantienen aunque hoy
  no se use ningún marco de terminal: son los que dan el fondo correcto si
  alguien pone `frame="terminal"` en un bloque suelto.

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
- One ink, never a colour ramp. Every glyph is drawn in `--plasma-ink` (read
  live, falling back to `--accent`); the level selects the glyph and nothing
  else. A ramp whose dark end sat near the background luminance did not read as
  characters, it read as the background being a slightly different colour — the
  tint this effect must not have. With one ink each pixel is either a legible
  glyph or untouched background, so `--bg` is the only background colour there
  is to control. Verified by profiling a page: the red channel is 0.00 across
  the full width and unlit columns read exactly `--bg`.
- Keep `--plasma-ink` clearly brighter than `--bg`. Moving it toward the
  background luminance reintroduces the tint.
- Tuning knobs are component props (`opacity`, `cellSize`, `speed`, `scale`,
  `levels`, `contrast`, `scanlines`, `flicker`). `opacity` is the subtlety dial.
- Cost controls: 24fps cap, DPR capped at 1.5, blank glyph level skipped, one
  pre-rendered sprite per level (drawImage, not fillText), rAF paused on
  `visibilitychange`.
- `prefers-reduced-motion: reduce` draws a single static frame — texture stays,
  motion stops.

### Why there is no flat veil

The field is not one colour. Sampled across a post (vertical mean per column,
text hidden) the green channel swings from 5.00 in unlit regions to 8.19 at a
plasma peak. So **no flat fill can match it** — pinned at the average it reads
light against a dark patch and dark against a bright one. An earlier flat
`--bg` veil, and a later one matched to the measured average via a `--bg-flat`
token, both failed for this reason. Don't reintroduce either.

Two consequences shape the current design:

- **Reading column** — `AsciiPlasma` masks its own canvas instead of covering
  it. `[data-post-article]` is measured on resize into `--veil-l` / `--veil-r`,
  and `.ascii-plasma[data-veiled]` dims that band via `mask-image`. The
  large-scale structure runs straight through the column, so there is no edge.
  `--veil-dim` is how much effect survives inside it (0 gone, 1 untouched),
  `--veil-soft` how far the transition takes. Horizontal only — the column
  spans the full scroll height, so it never needs a scroll listener.
- **Header** — opaque, because page content scrolls under it, so it would be a
  flat band. `.header-fx` inside it mirrors the matching strip of the field
  with one `drawImage` per frame and copies the layer's opacity at runtime.
  The header keeps `background-color: var(--bg)`: the mirror composites the
  field on top, so tinting the base as well would double-count it.

Neither needs `overflow-x: clip` on `main` — nothing bleeds past its column
any more. That rule existed only for the old veil and is gone.

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

- Avatar: `src/content/about/avatar.jpg` (839x839), rendered through `<Image>`
  at 300x300 and displayed at 150px by `.avatar`, so it is 2x on retina
  without needing a `densities` srcset. Astro emits WebP: ~3.6KB served.
- `.avatar` carries `object-fit: cover` so a non-square replacement crops
  rather than stretches.
- Asset filenames must be lowercase. macOS is case-insensitive and Cloudflare
  Pages builds on Linux, so a `.JPG` file imported as `.jpg` builds locally
  and fails on deploy.
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
