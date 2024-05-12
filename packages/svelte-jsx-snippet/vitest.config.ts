import { defineConfig } from "vitest/config";
import doctest from "vite-plugin-doctest";
export default defineConfig({
  plugins: [doctest()],
  test: {
    includeSource: ["src/**/*.ts"],
  },
});
