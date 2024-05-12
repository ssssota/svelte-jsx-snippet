import * as $ from "svelte/internal/server";
import { FunctionComponent } from "./jsx-runtime/types";
import { ComponentType, SvelteComponent } from "svelte";
import { jsx as _jsx } from "./jsx-runtime/index-server";

export const jsx$ = <P extends Record<string, unknown>, S extends keyof P>(
  Component: ComponentType<SvelteComponent<P>>,
  snippetProps: readonly S[],
): FunctionComponent<Omit<P, "children" & S>> => {
  return (props: P) => {
    const _props = Object.entries(props).map(([key, value]) => {
      if (snippetProps.includes(key as S)) {
        if (typeof value === "function") {
          return [key, value] as const;
        }
        return [
          key,
          $.add_snippet_symbol(($$payload: { out: string }) => {
            $$payload.out += String(value);
          }),
        ] as const;
      }
      return [key, value] as const;
    });
    return _jsx(Component, Object.fromEntries(_props) as P);
  };
};

export const svelte$ = <T>(
  fc: FunctionComponent<T>,
): ComponentType<SvelteComponent<T>> => {
  return (($$payload: { out: string }, $$props: T) => {
    $.push(true);
    const snippet = fc($$props) as any;

    $$payload.out += `<!--[-->`;
    snippet($$payload);
    $$payload.out += `<!--]-->`;
    $.pop();
  }) as any;
};

export { Fragment } from "./jsx-runtime/index-server";
