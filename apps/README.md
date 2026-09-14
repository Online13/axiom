# Apps

Applications in the monorepo. Each folder is a standalone Bun workspace with its own `package.json`.

| App | Purpose | Stack |
| --- | --- | --- |
| [docs](docs/) | Public Axiom documentation | Astro + Fumadocs |
| [landing](landing/) | Axiom presentation page | Astro |

## docs

The reference site for Axiom users. It covers:

- what Axiom offers: foundations, core, atoms, molecules, organisms, templates, blocks;
- a page for each component, with preview, API and usage;
- the source code to copy into your project, alongside the `npx axiom add` CLI.

Content comes from the spec in [`/docs`](../docs/README.md).

## landing

A single Astro page that presents Axiom: its positioning, its promise (*Build mobile experiences, not isolated components*) and links to the documentation.

## Running an app

From the repo root, pass the script name after the app shortcut:

```bash
bun docs dev        # docs dev server → http://localhost:4322
bun landing dev     # landing dev server → http://localhost:4321
bun landing build   # landing production build
```

Ports are fixed in each app's `astro.config.mjs`, so both servers can run at the same time. Cross-links default to these local URLs; set `PUBLIC_DOCS_URL` (landing) and `PUBLIC_LANDING_URL` (docs) for other environments.

These shortcuts are defined in the root `package.json` with `bun run --filter './apps/<app>'`.
