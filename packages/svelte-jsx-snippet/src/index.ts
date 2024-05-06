import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";
import * as internal from "svelte/internal/client";
import {
  isJsx,
  type FunctionComponent,
  type JSXChildren,
  type JSXNode,
} from "./jsx-runtime";
import { Fragment, isVoidElement } from "./utils";

export function $snippet(jsx: JSXNode): Snippet<[]> {
  const isFragment = jsx.type == null || jsx.type === Fragment;
  const content = renderToString(jsx);
  const template = internal.template(content, isFragment ? 1 : 0);
  return internal.add_snippet_symbol(($$anchor: unknown) => {
    const root = template();
    internal.append($$anchor, root);
  });
}

function renderProps(props: Record<string, unknown>): string {
  return Object.entries(props)
    .filter(([_, value]) => value != null)
    .filter(([key]) => !key.startsWith("on"))
    .map(([key, value]) => ` ${key}="${value === true ? "" : value}"`)
    .join("");
}
function renderToString(jsx: JSXNode): string {
  const { children, ...props } = jsx.props;
  if (typeof jsx.type === "string") {
    if (isVoidElement(jsx.type)) return `<${jsx.type}${renderProps(props)}>`;
    return `<${jsx.type}${renderProps(props)}>${childrenRenderToString(children)}</${jsx.type}>`;
  }
  const fc = (jsx.type as FunctionComponent) || Fragment;
  return childrenRenderToString(fc(jsx.props));
}
function childrenRenderToString(children: JSXChildren): string {
  if (children == null) return "";
  switch (typeof children) {
    case "bigint":
    case "boolean":
    case "number":
    case "string":
    case "function":
      return children.toString();
    case "symbol":
      throw new Error("Unexpected type");
  }
  if (Array.isArray(children)) {
    if (children.length === 0) return "";
    return children.map(childrenRenderToString).join("");
  }
  if (isJsx(children)) return renderToString(children);
  return children.toString();
}

export { Fragment } from "./utils";

export type JsxIntrinsicElements = {
  [K in keyof SvelteHTMLElements]: K extends `svelte:${string}`
    ? never
    : Omit<SvelteHTMLElements[K], `on:${string}` | `bind:${string}`>;
};

declare global {
  namespace JSX {
    interface IntrinsicElements extends JsxIntrinsicElements {}
  }
}
