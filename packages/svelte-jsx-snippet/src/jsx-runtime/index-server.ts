import type { Snippet } from "svelte";
import * as $ from "svelte/internal/server";
import { buildChildList, isVoidElement, renderProps } from "../utils";
import type { FunctionComponent, JsxDevOpts } from "./types";
import { FRAGMENT, hydrationMarkerE, hydrationMarkerS } from "../constants";

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
  return $.add_snippet_symbol(($$payload: { out: string }) => {
    const { children, ...rest } = props;
    const childList = buildChildList(children);
    if (type === FRAGMENT || type === Fragment) {
      for (const child of childList) {
        if (child.type === "dynamic") {
          $$payload.out += hydrationMarkerS;
          child.fn($$payload);
          $$payload.out += hydrationMarkerE;
        } else {
          $$payload.out += child.text;
        }
      }
      return;
    }
    if (typeof type === "string") {
      $$payload.out += `<${type}${renderProps(rest)}>`;
      if (isVoidElement(type)) return;
      for (const child of childList) {
        if (child.type === "dynamic") {
          $$payload.out += hydrationMarkerS;
          child.fn($$payload);
          $$payload.out += hydrationMarkerE;
        } else {
          $$payload.out += child.text;
        }
      }
      $$payload.out += `</${type}>`;
      return;
    }
    const snippet = (type as any)(props);
    snippet($$payload);
  });
};

export function Fragment(props: Record<string, unknown>) {
  return jsxDEV(FRAGMENT, props);
}

export { jsxDEV as jsx, jsxDEV as jsxDEV, jsxDEV as jsxs, jsxDEV as jsxsDEV };
