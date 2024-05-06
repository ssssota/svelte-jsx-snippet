export type JSXChildren =
  | object
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | JSXNode
  | JSXChildren[];
export interface DevJSX {
  fileName: string;
  lineNumber: number;
  columnNumber: number;
  stack?: string;
}
export type FunctionComponent<P = unknown> = (props: P) => JSXChildren;
const jsxSymbol = Symbol("jsx");
export interface JSXNode<
  T extends string | FunctionComponent | unknown = unknown,
> {
  _: typeof jsxSymbol;
  type: T;
  props: (T extends FunctionComponent<infer P> ? P : Record<any, unknown>) & {
    children?: JSXChildren;
  };
  key: string | null;
  dev?: DevJSX;
}
export const jsx = <T extends string | FunctionComponent<any>>(
  type: T,
  props: T extends FunctionComponent<infer PROPS>
    ? PROPS
    : Record<any, unknown>,
  key?: string | number | null,
): JSXNode<T> => {
  return {
    _: jsxSymbol,
    type,
    props,
    key: key === undefined ? null : String(key),
  };
};
interface JsxDevOpts {
  fileName: string;
  lineNumber: number;
  columnNumber: number;
}
export const jsxDEV = <
  T extends string | FunctionComponent<Record<any, unknown>>,
>(
  type: T,
  props: T extends FunctionComponent<infer PROPS>
    ? PROPS
    : Record<any, unknown>,
  key: string | number | null | undefined,
  _isStatic: boolean,
  opts: JsxDevOpts,
  _ctx: unknown,
): JSXNode<T> => {
  return {
    _: jsxSymbol,
    type,
    props,
    key: key === undefined ? null : String(key),
    dev: opts,
  };
};
export const jsxs = jsx;
export const jsxsDEV = jsxDEV;
export const isJsx = (value: unknown): value is JSXNode => {
  return (
    typeof value === "object" &&
    value !== null &&
    "_" in value &&
    value._ === jsxSymbol
  );
};
