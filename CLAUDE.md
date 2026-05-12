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
--accent:     #00875a
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

## Pinned dependencies (do not auto-upgrade)

- @tailwindcss/vite: 4.1.18 exact (4.3.x breaks with Astro 6.3.x rolldown resolver)
- tailwindcss: 4.1.18 exact

## NPM conventions

- Critical dependencies installed with --save-exact (no ^ or ~)
- Verify package.json after install
- Always commit package-lock.json

## No hacer
- No instalar React/Vue/Svelte salvo necesidad concreta
- No usar CSS-in-JS
- No añadir librerías de UI completas (shadcn, daisyui, etc.) — solo Tailwind
- No usar emojis en UI (solo iconos SVG)
- No animaciones gratuitas
- No hardcodear colores (siempre var(--token))
- No usar Tailwind dark: prefix (estamos con CSS variables, no con la estrategia de class de Tailwind)
