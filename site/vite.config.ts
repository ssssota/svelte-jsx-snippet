import { sveltekit } from "@sveltejs/kit/vite";
import { svelteTesting } from "@testing-library/svelte/vite";
import { svelteJsxSnippet } from "svelte-jsx-snippet/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [sveltekit(), svelteTesting(), svelteJsxSnippet()],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    environment: "jsdom",
    alias: {
      "@testing-library/svelte": "@testing-library/svelte/svelte5",
    },
  },
});
