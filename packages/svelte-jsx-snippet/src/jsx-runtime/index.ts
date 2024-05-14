import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";
import * as $ from "svelte/internal/client";
import { buildChildList, isVoidElement, renderProps } from "../utils";
import type { FunctionComponent, JSXChildren, JsxDevOpts } from "./types";
import { FRAGMENT, TEMPLATE_FRAGMENT, injectMarker } from "../constants";

const jsxDEV = <T extends string | FunctionComponent<any>>(
  type: T = FRAGMENT as T,
  props: T extends FunctionComponent<infer PROPS>
    ? PROPS
    : Record<any, unknown>,
  _key?: string | number | null | undefined,
  _isStatic?: boolean,
  _opts?: JsxDevOpts,
  _ctx?: unknown,
): Snippet<[]> => {
  const fragment = type === FRAGMENT || type === Fragment;
  const rootIsHtml = !fragment && typeof type === "string";
  const { children, ...rest } = props;
  const childList = buildChildList(children);
  const childrenContent = childList
    .map((child) => (child.type === "dynamic" ? injectMarker : child.text))
    .join("");
  const dynamicTokenIncludedAfter = (i: number) => {
    return childList.slice(i).some((child) => child.type === "dynamic");
  };
  const content = fragment
    ? childrenContent
    : rootIsHtml
      ? isVoidElement(type)
        ? `<${type}${renderProps(rest)}>`
        : `<${type}${renderProps(rest)}>${childrenContent}</${type}>`
      : injectMarker;
  const template = $.template(content, fragment ? TEMPLATE_FRAGMENT : 0);
  return $.add_snippet_symbol(($$anchor: unknown) => {
    const root = template();

    if (fragment || rootIsHtml) {
      let i = 0;
      let target: unknown;
      while (dynamicTokenIncludedAfter(i)) {
        const child = childList[i++];
        if (child === undefined) break;
        target =
          target == null
            ? fragment
              ? $.first_child(root)
              : $.child(root)
            : $.sibling(target, child.type === "text");
        if (child.type === "dynamic") child.fn(target);
      }
    } else {
      const snippet = (type as any)(props);
      snippet($$anchor);
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
