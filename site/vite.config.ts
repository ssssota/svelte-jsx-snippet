import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { svelteJsxSnippetPlugin } from "svelte-jsx-snippet/vite";

export default defineConfig({
  plugins: [sveltekit(), svelteJsxSnippetPlugin()],
  base: "./",
});
