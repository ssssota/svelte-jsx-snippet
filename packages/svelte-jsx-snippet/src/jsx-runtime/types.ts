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
export interface JsxDevOpts {
  fileName: string;
  lineNumber: number;
  columnNumber: number;
}
export type FunctionComponent<P = unknown> = (props: P) => Snippet<[]>;
export type ComponentProps<T extends FunctionComponent> =
  T extends FunctionComponent<infer P> ? P : never;
export type PropsWithChildren<P = unknown> = P & { children?: JSXChildren };
