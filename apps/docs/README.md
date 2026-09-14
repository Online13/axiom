# docs

Axiom documentation site, built with Astro and Fumadocs.

```bash
bun docs dev   # from the repo root → http://localhost:4322
```

## Structure

Pages live in `content/docs`. The sidebar order and section separators are defined in `content/docs/meta.json`; each folder has its own `meta.json` and an `index.mdx` overview.

| Section | Folders |
| --- | --- |
| Get Started | `index`, `installation`, `cli`, `styling` |
| System | `foundations`, `core`, `hooks` |
| Components | `atoms`, `molecules`, `organisms`, `templates` |
| Experience | `patterns`, `blocks` |

Component pages go inside their layer folder (e.g. `content/docs/atoms/button.mdx`).

## Styling

`src/styles/global.css` maps the Fumadocs color variables to the landing palette (`#0a0a0a` ground, `#262626` lines, `#8a8a8a` muted text), removes corner radii, and uses Inter and JetBrains Mono.
