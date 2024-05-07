import type { ComponentType, Snippet, SvelteComponent } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";
import * as $ from "svelte/internal/client";
import { buildChildList, renderProps } from "../utils";
import type { FunctionComponent, JSXChildren, JsxDevOpts } from "./types";

const injectMarker = "<!>";
const TEMPLATE_FRAGMENT = 1;
const FRAGMENT = "fragment";

const jsxDEV = <
  T extends
    | string
    | FunctionComponent<any>
    | ComponentType<SvelteComponent<any>>,
>(
  type: T = FRAGMENT as T,
  props: T extends FunctionComponent<infer PROPS>
    ? PROPS
    : T extends ComponentType<SvelteComponent<infer PROPS>>
      ? PROPS
      : Record<any, unknown>,
  _key?: string | number | null | undefined,
  _isStatic?: boolean,
  _opts?: JsxDevOpts,
  _ctx?: unknown,
): Snippet<[]> => {
  const rootIsHtml = typeof type === "string";
  const fragment = type === FRAGMENT || type === Fragment;
  const { children, ...rest } = props;
  const childList = buildChildList(children);
  const childrenContent = childList
    .map((child) => (child.type === "dynamic" ? injectMarker : child.text))
    .join("");
  const dynamicIncluded = childList.some((child) => child.type === "dynamic");
  const content = fragment
    ? childrenContent
    : rootIsHtml
      ? `<${type}${renderProps(rest)}>${childrenContent}</${type}>`
      : injectMarker;
  const template = $.template(content, rootIsHtml ? 0 : TEMPLATE_FRAGMENT);
  return $.add_snippet_symbol(($$anchor: unknown) => {
    const root = template();

    if (fragment || rootIsHtml) {
      if (childList.length > 0) {
        let i = 0;
        let target = $.child(root);
        while (true) {
          const child = childList[i++];
          if (child.type === "dynamic") child.fn(target);
          if (i >= childList.length) break;
          target = $.sibling(target, childList[i]?.type === "text");
        }
      }
    } else {
      if (type.length === 2) {
        // Svelte component
        (type as any)($$anchor, props);
      } else {
        // Function component
        const snippet = (type as any)(props);
        snippet($$anchor);
      }
    }
    $.append($$anchor, root);
  });
};

export function Fragment(props: Record<string, unknown>) {
  return jsxDEV(FRAGMENT, props);
}

export { jsxDEV as jsx, jsxDEV as jsxDEV, jsxDEV as jsxs, jsxDEV as jsxsDEV };

export type JsxIntrinsicElements = {
  [K in keyof SvelteHTMLElements]: K extends `svelte:${string}`
    ? never
    : Omit<SvelteHTMLElements[K], `on:${string}` | `bind:${string}`>;
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
