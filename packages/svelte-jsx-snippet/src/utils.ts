import { FunctionComponent } from "./jsx-runtime/types";
import { escape } from "svelte/internal/server";

export function isVoidElement(tag: string): boolean {
  return /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i.test(
    tag,
  );
}
export const Fragment: FunctionComponent<Record<string, unknown>> = (_) =>
  void 0 as any;

type ChildToken =
  | { type: "text"; text: string }
  | { type: "dynamic"; fn: Function };
export function buildChildList(children: unknown): ChildToken[] {
  if (children == null) return [];
  const ret: ChildToken[] = (Array.isArray(children) ? children : [children])
    .map((child) => {
      if (typeof child === "function") return { type: "dynamic", fn: child };
      return { type: "text", text: escape(child) };
    })
    .reduce((acc, child) => {
      const last = acc[acc.length - 1];
      if (last?.type === "text" && child.type === "text") {
        last.text += child.text; // Merge adjacent text nodes
      } else {
        acc.push(child);
      }
      return acc;
    }, []);
  return ret;
}

export function renderProps(props: Record<string, unknown>): string {
  return Object.entries(props)
    .filter(([_, value]) => value != null)
    .filter(([key]) => !key.startsWith("on"))
    .map(
      ([key, value]) =>
        ` ${key}="${value === true ? "" : escape(value, true)}"`,
    )
    .join("");
}

export { escape };
