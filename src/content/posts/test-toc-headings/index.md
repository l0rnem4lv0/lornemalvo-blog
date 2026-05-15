---
title: "Test: jerarquía de headings y TOC"
date: 2025-01-10
description: "Post de prueba con h1, h2, h3 y h4 para verificar qué niveles entran en el índice lateral y cuáles se ignoran."
tags: ["test", "toc"]
category: note
draft: false
---

# Heading h1 dentro del cuerpo

El TOC debería ignorar este h1. El h1 visible del post es el del header — los h1 que aparezcan dentro del markdown no entran en el índice, igual que h4, h5 y h6.

Este párrafo va justo después del h1 inline para verificar el ritmo vertical entre un heading suelto y el texto que le sigue.

## Primer h2 — Enumeración

Un h2 normal. Este sí debería aparecer en el índice lateral, indexado al nivel base (sin sangría).

Texto suficiente para que al hacer scroll este heading active el link correspondiente en el TOC vía IntersectionObserver. El root margin es `-20% 0px -70% 0px`, así que cuando este heading entra en la banda activa (entre 20% y 30% del viewport desde el top), el link debería marcarse.

### h3 dentro del primer h2

Un h3 nested bajo el h2 anterior. En el TOC aparece sangrado a la izquierda respecto al h2 padre, con `padding-left: var(--space-4)`.

Texto de relleno para dar altura suficiente al scroll spy y separar los headings entre sí.

#### h4 que el TOC debe ignorar

Este h4 NO debería aparecer en el TOC. `getHeadings()` filtra por `depth === 2 || depth === 3`. Si aparece, hay un bug en el filtro.

Un párrafo después del h4 para verificar que el espaciado y el render del heading siguen funcionando aunque el TOC no lo liste.

### Segundo h3 del primer bloque

Otro h3 bajo el primer h2, para verificar que el TOC admite varios h3 consecutivos sangrados bajo el mismo h2.

Más texto para que el scroll spy tenga margen al activar este link.

## Segundo h2 — Análisis

Otro h2. En el TOC aparece a la altura del primero, sin sangría. Cambiar entre los dos h2 mientras se hace scroll debería ser fluido: solo un link activo a la vez, y siempre el más cercano al top del viewport.

### h3 con texto largo para probar el wrap del TOC

Un h3 con un texto deliberadamente largo para verificar que el link en el TOC hace wrap correctamente, mantiene el `line-height: snug` y la sangría del borde izquierdo cuando está activo.

Párrafo suficientemente largo para que el scroll spy lo active sin saltar al siguiente heading inmediatamente. Cuando este heading está cerca del top, su link en el TOC debe pintarse con `--accent` y el `border-left` `--accent`.

Un segundo párrafo para mantener distancia con el siguiente heading y dar tiempo al observer.

#### h4 de nuevo, también ignorado

El TOC tampoco debe listar este h4. Es un test de robustez del filtro: aunque haya varios h4 en distintas posiciones del documento, ninguno entra.

## Tercer h2 — Conclusiones

El último h2. Si has llegado hasta aquí haciendo scroll, deberías haber visto:

- En el TOC, **solo** los h2 y h3 listados (cinco entradas en total).
- Ningún h1, h4, h5 ni h6 en el índice.
- El link activo cambiando suavemente conforme avanzas.
- El border-left con `--accent` marcando el link activo.

### Sub-resumen final

Un último h3 para cerrar el documento. Verifica que el último heading también se activa al hacer scroll hasta el final del post.

##### h5 que también debe ignorarse

Para completar el test, un h5 al final. Tampoco debe aparecer en el TOC.

###### h6 al cierre

Y un h6 para redondear. Si ninguno de los h1, h4, h5 o h6 aparece en el índice lateral, el filtro `getHeadings()` está funcionando como toca.
