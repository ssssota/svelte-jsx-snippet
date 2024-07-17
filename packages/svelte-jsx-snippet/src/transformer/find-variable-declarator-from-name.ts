import type { Node, VariableDeclarator } from "@babel/types";

export function findVariableDeclaratorFromName(
  name: string,
  node: Node | Node[],
): VariableDeclarator | undefined {
  if (typeof node !== "object" || node === null) return;
  if (Array.isArray(node)) {
    for (const child of node) {
      const res = findVariableDeclaratorFromName(name, child);
      if (res) return res;
    }
    return;
  }
  if (
    node.type === "VariableDeclarator" &&
    node.id.type === "Identifier" &&
    node.id.name === name
  ) {
    return node;
  }
  return Object.values(node)
    .map((v) => findVariableDeclaratorFromName(name, v))
    .find((v) => v !== undefined);
}
