import type { Plugin } from "vite";
import { name } from "../package.json";

export function svelteJsxSnippet(): Plugin {
  return {
    name,
    enforce: "pre",
    resolveId(id, importer, options) {
      if (id !== name) return;
      return this.resolve(
        options.ssr ? `${name}/server` : `${name}`,
        importer,
        options,
      );
    },
  };
}
export default svelteJsxSnippet;
