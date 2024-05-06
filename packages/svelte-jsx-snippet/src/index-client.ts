import * as $ from "svelte/internal/client";
import { FunctionComponent } from "./jsx-runtime/types";
import { ComponentType, SvelteComponent } from "svelte";
import { jsx as _jsx } from "./jsx-runtime/index-client";

/**
 * Convert a Svelte component to a JSX function component
 * @param Component Svelte component
 * @param snippetProps Property names that should be treated as snippets
 * @returns Function component that can be used in JSX
 * @example
 * ```jsx
 * import SomeComponent from "./SomeComponent.svelte";
 * const SomeComponent$ = jsx(SomeComponent, ["children"]);
 * const App = () => <SomeComponent$>test</SomeComponent$>;
 * ```
 */
export const jsx = <P extends Record<string, unknown>, S extends keyof P>(
  Component: ComponentType<SvelteComponent<P>>,
  snippetProps: readonly S[],
): FunctionComponent<Omit<P, "children" & S>> => {
  return (props: P) => {
    const _props = Object.entries(props).map(([key, value]) => {
      if (snippetProps.includes(key as S)) {
        if (typeof value === "function") {
          return [key, value] as const;
        }
        const template = $.template(value, 1);
        return [
          key,
          $.add_snippet_symbol(
            ($$anchor: unknown) => void $.append($$anchor, template()),
          ),
        ] as const;
      }
      return [key, value] as const;
    });
    return _jsx(Component, Object.fromEntries(_props) as P);
  };
};
export { Fragment } from "./utils";
export {
  JSXChildren,
  FunctionComponent,
  FunctionComponent as FC,
} from "./jsx-runtime/types";
