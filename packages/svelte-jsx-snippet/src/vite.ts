import type { Plugin } from "vite";
import { transform } from "./transformer";

export function svelteJsxSnippet(): Plugin {
  let dev = false;
  return {
    name: "svelte-jsx-snippet",
    enforce: "pre",
    configResolved(config) {
      dev = config.command === "serve";
    },
    /**
     * Transform JSX to snippet (generated) js
     */
    transform(code, id, options) {
      // only handle .jsx, .tsx
      if (!/\.[mc]?[jt]sx$/.test(id)) return null;

      return transform(code, {
        dev,
        generate: options?.ssr ? "server" : "client",
        typescript: /tsx$/.test(id),
      });
    },
  };
}
export default svelteJsxSnippet;
