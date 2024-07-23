import type { Plugin } from "vite";
import { transform } from "./transformer";
import { type FilterPattern, createFilter as rollupCreateFilter } from '@rollup/pluginutils';


export interface Options {
  include?: FilterPattern;
  exclude?: FilterPattern;
};

/**
 * Create a filter function from the given include and exclude patterns.
 * @param include - An array of minimatch or regex pattern strings. @default [/\.[mc]?[jt]sx$/] only handle .jsx, .tsx
 * @param exclude - An array of minimatch or regex pattern strings.
 */
function createFilter(
  include: Options['include'],
  exclude: Options['exclude'],
): ReturnType<typeof rollupCreateFilter> {
  return rollupCreateFilter(
    include ?? [/\.[mc]?[jt]sx$/],
    exclude
  );
}

export function svelteJsxSnippet(options: Options = {}): Plugin {
  const filter = createFilter(options.include, options.exclude);

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
      if (!filter(id)) return;

      return transform(code, {
        dev,
        generate: options?.ssr ? "server" : "client",
        typescript: /tsx$/.test(id),
      });
    },
  };
}
export default svelteJsxSnippet;
