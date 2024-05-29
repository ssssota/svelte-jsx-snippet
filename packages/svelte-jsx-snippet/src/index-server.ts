import * as $ from "svelte/internal/server";
import type { FunctionComponent } from "./jsx-runtime/types";
import type { Component } from "svelte";
import { jsx as _jsx } from "./jsx-runtime/index-server";
import { hydrationMarkerE, hydrationMarkerS } from "./constants";
import { add_snippet_symbol } from "./utils";

export const jsx$ = <P extends Record<string, unknown>, S extends keyof P>(
  Component: Component<P>,
  snippetProps: readonly S[],
): FunctionComponent<Omit<P, "children" & S>> => {
  return (props: P) => {
    const propertyEntries = Object.entries(props).map(([key, value]) => {
      if (snippetProps.includes(key as S)) {
        if (typeof value === "function") {
          return [key, value] as const;
        }
        return [
          key,
          add_snippet_symbol(($$payload: { out: string }) => {
            $$payload.out += String(value);
          }),
        ] as const;
      }
      return [key, value] as const;
    });
    return add_snippet_symbol(($$payload: { out: string }) => {
      $$payload.out += hydrationMarkerS;
      Component($$payload, Object.fromEntries(propertyEntries) as P);
      $$payload.out += hydrationMarkerE;
    });
  };
};

export const svelte$ = <T>(fc: FunctionComponent<T>): Component<T> => {
  return ($$payload: { out: string }, $$props: T) => {
    $.push(true);
    const snippet = fc($$props) as any;

    $$payload.out += hydrationMarkerS;
    snippet($$payload);
    $$payload.out += hydrationMarkerE;
    $.pop();
    return {};
  };
};

export { Fragment } from "./jsx-runtime/index-server";
