# Hex Mirror

Provide a hex color and Hex Mirror computes its **contrast mirror set** — the complementary and contrast-balanced counterparts of that color, rendered as live color swatches. It is a small single-page app for exploring how a color relates to its mirror across RGB, HSL, and complement calculations.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite 6** (dev server, build, preview)
- **Redux Toolkit** + **React Redux** for state
- **styled-components** for styling
- **Vitest** + **Testing Library** for tests

## Prerequisites

- **Node.js** 18+ (developed on Node 26)
- **npm** 9+

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open **http://localhost:3000**. The app loads with a random hex color on start; type any 6-digit hex code into the input to see its mirror set update live.

## Available Scripts

| Script               | Description                                                            |
| -------------------- | ---------------------------------------------------------------------- |
| `npm run dev`        | Start the Vite dev server on port 3000 with hot reload.                |
| `npm run build`      | Type-check (`tsc --noEmit`) and produce a production build in `dist/`. |
| `npm run preview`    | Serve the production build locally on port 3000.                       |
| `npm test`           | Run the Vitest suite once.                                             |
| `npm run test:watch` | Run Vitest in watch mode.                                              |
| `npm run typecheck`  | Type-check without emitting output.                                    |
| `npm run lint`       | Lint the project with ESLint.                                          |
| `npm run format`     | Format the project with Prettier.                                      |

## Deployment

The app is deployed to **GitHub Pages** at **https://lvuCodes.github.io/hex-mirror/**.

Deployment is automated by [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): every push to `main` builds the app and publishes `dist/` to Pages. The production build sets Vite's `base` to `/hex-mirror/` to match the project-site URL (the dev server continues to serve from `/`).

**One-time setup:** in the repository, go to **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**. After that, each push to `main` redeploys automatically.

## Project Structure

```
src/
  index.tsx              App entry point
  App.tsx                Root component
  store.ts               Redux store configuration
  hooks.ts               Typed Redux hooks + selectors
  slices/                Redux slices (color input)
  components/            UI components (DisplayCard, Input, ColorBox)
  utils/                 Color math (hexadecimal, decimal, hsl, complement)
  test/                  Test setup
```

Color calculations live in `src/utils/` and are covered by co-located `*.test.ts` files. A module dependency map is in [`reference/architecture-dependencies.md`](reference/architecture-dependencies.md).
