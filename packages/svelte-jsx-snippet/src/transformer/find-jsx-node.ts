import type { JSXElement, JSXFragment, Node } from "@babel/types";

export function findJsxNode(node: Node): (JSXElement | JSXFragment)[] {
  if (typeof node !== "object" || node === null) return [];
  if (node.type === "JSXElement" || node.type === "JSXFragment") {
    return [node];
  }
  if (Array.isArray(node)) {
    return node.flatMap(findJsxNode);
  }
  return Object.values(node).flatMap(findJsxNode);
}
