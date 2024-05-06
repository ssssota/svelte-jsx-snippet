import { JSXChildren } from "./jsx-runtime";

export function isVoidElement(tag: string): boolean {
  return /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i.test(
    tag,
  );
}

export function Fragment(props: Record<string, unknown>) {
  return props.children as JSXChildren;
}
