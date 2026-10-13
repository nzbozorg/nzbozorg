# nzbozorg.ir

Personal portfolio of **Amir NoZohour** — full-stack and Android developer working with Kotlin, React, Python, SQL, HTML, CSS, and JavaScript.

## Local preview

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Deployment

This is a dependency-free static site prepared for GitHub Pages. The `CNAME` file points Pages to `nzbozorg.ir`.

After enabling GitHub Pages for the `main` branch, configure these DNS records at the domain registrar:

| Type | Host | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | nzbozorg.github.io |

Once DNS resolves, enable **Enforce HTTPS** in repository Settings → Pages.
