---
title: "Test: ritmo vertical del prose"
date: 2024-12-01
description: "Post de prueba con blockquote, tabla, H2 y bloques de código para verificar el espaciado vertical."
tags: ["test", "css"]
category: note
draft: false
---

## Contexto

Este post verifica que el ritmo vertical entre párrafos, bloques de código, blockquotes y tablas es consistente y simétrico.

El espaciado alrededor de los bloques de código debería ser idéntico antes y después. Aquí va el primer bloque:

```bash
curl -s https://lornemalvo.com/api/health | jq '.status'
```

Este párrafo va inmediatamente después del bloque. La distancia desde el bloque hasta aquí debe ser igual a la distancia desde el párrafo anterior hasta el bloque de arriba.

## Blockquote

Un párrafo normal seguido de una cita:

> La seguridad perfecta es el enemigo de la seguridad suficiente. Un sistema demasiado restrictivo obliga a los usuarios a buscar atajos que lo hacen más vulnerable.

Otro párrafo después del blockquote. El espaciado vertical aquí también debe respirar correctamente.

## Tabla de comparación

Los distintos tipos de entry de Content Collections y sus IDs:

| API | Config | Entry ID | Render |
|-----|--------|----------|--------|
| Legacy (Astro 5) | `src/content/config.ts` | `entry.slug` | `entry.render()` |
| Nueva (Astro 6) | `src/content.config.ts` | `entry.id` | `render(entry)` |

Texto después de la tabla. La tabla no debería pegar contra este párrafo.

## Código después de heading

Un heading seguido directamente de código — el margen del heading debería dominar:

```python
from pathlib import Path

def find_flags(directory: str) -> list[str]:
    flags = []
    for path in Path(directory).rglob("flag.txt"):
        flags.append(path.read_text().strip())
    return flags

print(find_flags("/home"))
```

Párrafo final. Todo el ritmo vertical debería ser consistente a lo largo del post.
