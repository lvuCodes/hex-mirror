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

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server on port 3000 with hot reload. |
| `npm run build` | Type-check (`tsc --noEmit`) and produce a production build in `dist/`. |
| `npm run preview` | Serve the production build locally on port 3000. |
| `npm test` | Run the Vitest suite once. |
| `npm run test:watch` | Run Vitest in watch mode. |
| `npm run typecheck` | Type-check without emitting output. |
| `npm run lint` | Lint the project with ESLint. |
| `npm run format` | Format the project with Prettier. |

## Project Structure

```
src/
  index.tsx              App entry point
  App.tsx                Root component
  store.ts               Redux store configuration
  hooks.ts               Typed Redux hooks + selectors
  slices/                Redux slices (color input, compare list)
  components/            UI components (DisplayCard, Input, ColorBox, ...)
  utils/                 Color math (hexadecimal, decimal, rgb, hsl, complement, compare)
  test/                  Test setup
```

Color calculations live in `src/utils/` and are covered by co-located `*.test.ts` files.
