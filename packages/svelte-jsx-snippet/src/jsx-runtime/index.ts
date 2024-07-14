import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";
import type { FunctionComponent, JSXChildren, JsxDevOpts } from "./types";

const FRAGMENT = "fragment";

const jsxDEV = <T extends string | FunctionComponent<any>>(
  _type: T = FRAGMENT as T,
  _props: T extends FunctionComponent<infer PROPS>
    ? PROPS
    : Record<any, unknown>,
  _key?: string | number | null | undefined,
  _isStatic?: boolean,
  _opts?: JsxDevOpts,
  _ctx?: unknown,
): Snippet<[]> => {
  throw new Error("Use svelte-jsx-snippet/vite as vite plugin");
};

export function Fragment(props: Record<string, unknown>) {
  return jsxDEV(FRAGMENT, props);
}

export { jsxDEV as jsx, jsxDEV as jsxDEV, jsxDEV as jsxs, jsxDEV as jsxsDEV };

export type JsxIntrinsicElements = {
  [K in keyof SvelteHTMLElements]: K extends `svelte:${string}`
    ? never
    : Omit<
        SvelteHTMLElements[K],
        `on:${string}` | `bind:${string}` | `sapper:${string}` | "children"
      > & { children?: JSXChildren };
};

declare global {
  namespace JSX {
    interface IntrinsicElements extends JsxIntrinsicElements {}
    type Element = Snippet<[]>;
    interface ElementChildrenAttribute {
      children: JSXChildren;
    }
  }
}
