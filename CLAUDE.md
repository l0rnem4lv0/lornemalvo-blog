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

## Paletas (variables CSS — dual mode)

### Oscuro (default)
--bg:         #0a0a0a
--bg-soft:    #111111
--bg-code:    #0d1117
--fg:         #e5e5e5
--fg-muted:   #888888
--accent:     #00ff9c
--accent-dim: #1a3d2e
--border:     #1f1f1f
--danger:     #ff5555
--warning:    #f1fa8c

### Claro
--bg:         #fafafa
--bg-soft:    #f0f0f0
--bg-code:    #f6f8fa
--fg:         #1a1a1a
--fg-muted:   #6a6a6a
--accent:     #00754d   /* darkened from #00875a for AA on #fafafa (5.51:1) */
--accent-dim: #c8e6d4
--border:     #e5e5e5
--danger:     #c41e3a
--warning:    #b45309

## Toggle de tema
- Atributo en <html>: data-theme="dark" | "light"
- Default: prefers-color-scheme del sistema
- Persistencia: localStorage["theme"]
- Script inline en <head> para evitar FOUC
- Botón toggle en Header

## Syntax highlighting
- Expressive Code en modo dual:
  - dark: github-dark-default
  - light: github-light-default
- Cambia automáticamente con data-theme

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

## Comandos
- npm run dev — servidor local
- npm run build — build producción
- npm run preview — preview del build
- npm run lint — eslint
- npm run format — prettier

## Principios de diseño
- Minimalismo agresivo: si no aporta, fuera
- Solo modo oscuro (al menos en v1)
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
- For dark-only screenshots (terminal, Burp, IDE dark theme), the subtle
  border prevents jarring transitions into light mode without needing
  theme-specific variants.

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

## No hacer
- No instalar React/Vue/Svelte salvo necesidad concreta
- No usar CSS-in-JS
- No añadir librerías de UI completas (shadcn, daisyui, etc.) — solo Tailwind
- No usar emojis en UI (solo iconos SVG)
- No animaciones gratuitas
- No hardcodear colores (siempre var(--token))
- No usar Tailwind dark: prefix (estamos con CSS variables, no con la estrategia de class de Tailwind)
