# The Machine

A developer portfolio you boot into. Power the machine on, watch it run
through a POST sequence, then walk through its internals — `/about`,
`/skills`, `/projects`, `/contact` — as physical chambers wired together by
corridors. Every room maps to a real content module; a full 2D fallback
covers accessibility, mobile, and low-end GPUs with identical content.

Live at `https://<username>.github.io/the-machine/`.

## Stack

- React 19 + TypeScript + Vite 8
- React Three Fiber 9 / drei 10 / postprocessing 3 (three.js scene)
- Tailwind CSS 4 (`@tailwindcss/vite`, no config file)
- zustand 5 (app state read inside the R3F frame loop)
- motion (HUD/overlay transitions only — the 3D scene is animated by hand
  inside `useFrame`, per the "no Framer Motion in the 3D layer" rule)

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

```bash
npm run build     # tsc -b && vite build → dist/
npm run preview   # serve the production build locally
```

## Controls

| Input | Action |
|---|---|
| `W A S D` / arrow keys | Move |
| `Q E` / `← →` | Turn |
| Click + drag | Look around |
| Click a floor beacon or the minimap | Auto-travel to that room |
| `[?]` (top-right) | Controls help |
| `2D MODE` (top-right) | Switch to the accessible scrollable fallback |
| `Esc` (during boot) | Skip the BIOS sequence |

## How it's organized

```
src/
├── app.tsx                 mode gate (3D vs 2D) + lazy-loads the machine
├── boot/                    BIOS/POST boot screen (DOM, not 3D)
├── data/                    single source of content — feeds BOTH modes
├── state/store.ts           zustand: room, boot phase, quality, mode
├── lib/                     capability detection, hash routing, wall clamping
├── machine/                 the 3D world (lazy-loaded chunk)
│   ├── layout.ts             room/corridor coordinates — the "floor plan"
│   ├── rooms/                one file per chamber
│   └── components/           process cards, commit tower, consoles, panels
├── hud/                     HUD overlay: room label, minimap, project modal
└── fallback/                2D scrollable site (same data, no 3D dependency)
```

Content lives once, in `src/data/`, and both the 3D rooms and the 2D
fallback render from it — there's no separate content to keep in sync.

## Content

All content lives in `src/data/*.ts`, typed and shared by both render
modes:

| File | Contents |
|---|---|
| `src/data/profile.ts` | Bio, career narrative, timeline |
| `src/data/skills.ts` | Verified skills (proficiency %, years) and self-directed/lab skills, as a discriminated union on `tier` |
| `src/data/projects.ts` | Real repos and taglines; `COMMIT_WEEKS` is still a deterministic mock generator — swapping it for a real GitHub API call is tracked in `IDEA.md` |
| `src/data/contact.ts` | Email, GitHub, LinkedIn |

## Accessibility & performance

- 2D mode is the default whenever `prefers-reduced-motion: reduce`, the
  device looks mobile-class (coarse pointer + narrow viewport), or WebGL2
  isn't available (including software rasterizers) — see
  `src/lib/detect-capability.ts`.
- The 3D canvas is code-split (`React.lazy`) and preloaded during the boot
  screen, so it never blocks first paint.
- `PerformanceMonitor` (drei) steps down DPR and disables postprocessing on
  underpowered GPUs at runtime.
- The 2D fallback is a plain semantic document — full keyboard nav,
  landmark sections, real `<a>` links, no canvas dependency.

## Deploying to GitHub Pages

The repo is configured for `https://<username>.github.io/the-machine/`
(subpath hosting, no custom domain):

- `vite.config.ts` sets `base: '/the-machine/'`, and every asset reference
  (fonts, in particular — see `src/machine/fonts.ts`) is built from
  `import.meta.env.BASE_URL` rather than a hardcoded absolute path, so
  nothing 404s under the subpath.
- Routing is hash-based (`#/about`, `#/skills`, …) with no server-side
  routes, so GitHub Pages' lack of SPA routing support isn't an issue —
  every URL still resolves to the single `index.html`.
- `.github/workflows/deploy.yml` builds and deploys on every push to
  `main` via the official `actions/upload-pages-artifact` +
  `actions/deploy-pages` actions.

To enable it: **Settings → Pages → Source: GitHub Actions**, then push to
`main`.

If this ever moves to a custom domain instead: set `base: '/'` in
`vite.config.ts` and add a `public/CNAME` file with the domain.

## License

Personal portfolio — content is not licensed for reuse; code structure is
free to reference.
