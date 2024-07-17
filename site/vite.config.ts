import { sveltekit } from "@sveltejs/kit/vite";
import { svelteJsxSnippet } from "svelte-jsx-snippet/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit(), svelteJsxSnippet()],
  base: "./",
});
