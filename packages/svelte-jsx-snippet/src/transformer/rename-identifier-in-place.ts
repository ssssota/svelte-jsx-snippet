import type { Node } from "@babel/types";
import { traverse } from "@babel/types";

export function renameIdentifierInPlace(
  ast: Node,
  replacer: (name: string) => string | null | undefined,
): void {
  traverse(ast, (node) => {
    if (node.type === "Identifier") {
      const newName = replacer(node.name);
      if (newName) node.name = newName;
    }
  });
}
