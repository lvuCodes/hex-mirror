import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react({ babel: { plugins: ["babel-plugin-styled-components"] } })],
  server: { port: 3000 },
  preview: { port: 3000 },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: false,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
