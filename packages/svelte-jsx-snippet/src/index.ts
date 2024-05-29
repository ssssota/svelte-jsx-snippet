import * as $ from "svelte/internal/client";
import type { FunctionComponent } from "./jsx-runtime/types";
import type { Component } from "svelte";
import { jsx as _jsx, Fragment } from "./jsx-runtime";
import { add_snippet_symbol } from "./utils";

/**
 * Convert a Svelte component to a JSX function component
 *
 * **\* The function component made by this function will be static.**
 *
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
        const template = $.template(value, 1);
        return [
          key,
          add_snippet_symbol(($$anchor: unknown) => {
            $.append($$anchor, template());
          }),
        ] as const;
      }
      return [key, value] as const;
    });
    return add_snippet_symbol(($$anchor: unknown) => {
      const fragment = $.comment();
      const root = $.first_child(fragment);

      Component(root, Object.fromEntries(propertyEntries) as P);

      $.append($$anchor, fragment);
    });
  };
};

/**
 * Convert a JSX function component to a Svelte component
 *
 * **\* The svelte component made by this function will be static.**
 *
 * @param Component Function component
 * @returns Svelte component that can be used .svelte files
 * @example
 * ```jsx
 * const SomeComponent = (props) => <span>{props.children}</span>;
 * ```
 *
 * ```svelte
 * <script>
 *   import { svelte } from "svelte-jsx-snippet";
 *   import SomeComponent from "./SomeComponent";
 *   const SomeComponent$ = svelte(SomeComponent);
 * </script>
 * <SomeComponent$>test</SomeComponent$>
 * ```
 */
export const svelte$ = <P extends Record<string, unknown>>(
  Component: FunctionComponent<P>,
): Component<P> => {
  return ($$anchor: unknown, $$props: P) => {
    const props = $.rest_props($$props, []);
    const fragment = $.comment();
    const node = $.first_child(fragment);
    const snippet = Component(props) as any;
    snippet(node);
    $.append($$anchor, fragment);
    return {};
  };
};

export { Fragment };
export {
  JSXChildren,
  FunctionComponent,
  FunctionComponent as FC,
  ComponentProps,
  PropsWithChildren,
} from "./jsx-runtime/types";
