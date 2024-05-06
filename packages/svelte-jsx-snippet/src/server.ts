import * as internal from "svelte/internal/server";
import {
  isJsx,
  type FunctionComponent,
  type JSXChildren,
  type JSXNode,
} from "./jsx-runtime";
import { Fragment, isVoidElement } from "./utils";

export function $snippet(template: JSXNode) {
  return internal.add_snippet_symbol(($$payload: { out: string }) => {
    $$payload.out += renderToString(template);
  });
}

function renderProps(props: Record<string, unknown>): string {
  return Object.entries(props)
    .filter(([key]) => !key.startsWith("on"))
    .map(([key, value]) =>
      internal.attr(key, value, typeof value === "boolean"),
    )
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
      return internal.escape(children);
    case "symbol":
      throw new Error("Unexpected type");
  }
  if (Array.isArray(children)) {
    return children.map(childrenRenderToString).join("");
  }
  if (isJsx(children)) return renderToString(children);
  return internal.escape(children);
}

export { Fragment } from "./utils";
