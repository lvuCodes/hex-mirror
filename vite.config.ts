import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command, isPreview }) => ({
  // Served from https://lvuCodes.github.io/hex-mirror/ on GitHub Pages, so the
  // production build needs the repo-name base path. `vite preview` serves that
  // build (and the smoke suite runs against it), so it needs the same base; only
  // the dev server stays at root.
  base: command === "build" || isPreview ? "/hex-mirror/" : "/",
  plugins: [react()],
  server: { port: 3000 },
  preview: { port: 3000 },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: false,
    // Inline the package so Vite transforms its bundled CSS imports; left
    // externalized, Node's ESM loader chokes on `@lvucodes/ui`'s `.css` side effects.
    server: { deps: { inline: ["@lvucodes/ui"] } },
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      all: true,
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.{test,spec}.{ts,tsx}", "src/index.tsx", "src/vite-env.d.ts"],
      reporter: ["text", "html"],
      thresholds: { statements: 100, branches: 95, functions: 100, lines: 100 },
    },
  },
}));
