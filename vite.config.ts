import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  // Served from https://lvuCodes.github.io/hex-mirror/ on GitHub Pages, so the
  // production build needs the repo-name base path. Dev stays at root.
  base: command === "build" ? "/hex-mirror/" : "/",
  plugins: [react({ babel: { plugins: ["babel-plugin-styled-components"] } })],
  server: { port: 3000 },
  preview: { port: 3000 },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: false,
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
