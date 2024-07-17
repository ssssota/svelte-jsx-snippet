import type { Node, VariableDeclaration } from "@babel/types";
import { traverse } from "@babel/types";

export function findTemplateDeclarations(node: Node): VariableDeclaration[] {
  const ret: VariableDeclaration[] = [];
  traverse(node, (node, ancestors) => {
    if (node.type !== "MemberExpression") return;
    if (node.object.type !== "Identifier") return;
    if (node.object.name !== "$") return;
    if (node.property.type !== "Identifier") return;
    if (node.property.name !== "template") return;
    const variableDeclaration = ancestors
      .map((a) => a.node)
      .find((node) => node.type === "VariableDeclaration");
    if (variableDeclaration) ret.push(variableDeclaration);
  });
  return ret;
}
