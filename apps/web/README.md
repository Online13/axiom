# web

The Axiom website is one Astro application:

- the landing page is served at `/` from `src/modules/landing`;
- the Fumadocs documentation is served at `/docs` from `src/modules/docs` and `content/docs`.

Astro route files stay in `src/pages`. They only assemble code owned by the corresponding feature folder. Shared public assets live in `public`.

```bash
bun web dev
bun web build
```

The local server uses `http://localhost:4321` unless `PORT` overrides it.
