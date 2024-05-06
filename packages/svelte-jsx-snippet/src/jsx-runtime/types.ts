import type { Snippet } from "svelte";

export type JSXChildren =
  | object
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | Snippet<[]>
  | JSXChildren[];
export interface DevJSX {
  fileName: string;
  lineNumber: number;
  columnNumber: number;
  stack?: string;
}
export type FunctionComponent<P = unknown> = (props: P) => Snippet<[]>;
