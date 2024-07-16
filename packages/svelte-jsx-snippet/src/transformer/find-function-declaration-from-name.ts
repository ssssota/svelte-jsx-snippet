import type { FunctionDeclaration, Node } from "@babel/types";

export function findFunctionDeclarationFromName(
  name: string,
  node: Node | Node[],
): FunctionDeclaration | undefined {
  if (typeof node !== "object" || node === null) return;
  if (Array.isArray(node)) {
    for (const child of node) {
      const res = findFunctionDeclarationFromName(name, child);
      if (res) return res;
    }
    return;
  }
  if (node.type === "FunctionDeclaration" && node.id?.name === name) {
    return node;
  }
  return Object.values(node)
    .map((v) => findFunctionDeclarationFromName(name, v))
    .find((v) => v !== undefined);
}
