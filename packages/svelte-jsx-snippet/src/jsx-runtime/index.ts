import type { Component, Snippet, SvelteComponent } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";
import { ERROR_MESSAGE } from "../utils";
import type { JSXChildren, JsxDevOpts } from "./types";

const FRAGMENT = "fragment";

const jsxDEV = <T extends string | Component<any>>(
  _type: T | undefined = FRAGMENT as T,
  _props: T extends Component<infer PROPS> ? PROPS : Record<any, unknown>,
  _key?: string | number | null | undefined,
  _isStatic?: boolean,
  _opts?: JsxDevOpts,
  _ctx?: unknown,
): Snippet<[]> => {
  throw new Error(ERROR_MESSAGE);
};

export function Fragment(props: Record<string, unknown>): Snippet<[]> {
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

type ComponentOrSvelteComponent = SvelteComponent & {
  $$prop_def: { children: JSXChildren };
};

declare global {
  namespace JSX {
    interface IntrinsicElements extends JsxIntrinsicElements {}
    type Element = Snippet<[]>;
    interface ElementClass extends ComponentOrSvelteComponent {}
    interface ElementAttributesProperty {
      $$prop_def: unknown;
    }
    interface ElementChildrenAttribute {
      children: JSXChildren;
    }
  }
}
