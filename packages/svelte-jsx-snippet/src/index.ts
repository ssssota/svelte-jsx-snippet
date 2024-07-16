import { Snippet } from "svelte";
import { Fragment } from "./jsx-runtime";
import { ERROR_MESSAGE } from "./utils";

export function $snippet<Args extends any[] = []>(
  _: (...args: Args) => Snippet<[]>,
): Snippet<Args> {
  throw new Error(ERROR_MESSAGE);
}

export function Render(_: { $: ReturnType<Snippet> }): Snippet<[]> {
  throw new Error(ERROR_MESSAGE);
}

export {
  ComponentProps,
  FunctionComponent as FC,
  FunctionComponent,
  JSXChildren,
  PropsWithChildren,
} from "./jsx-runtime/types";
export { Fragment };
