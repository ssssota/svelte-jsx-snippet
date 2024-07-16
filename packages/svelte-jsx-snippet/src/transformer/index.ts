import { parse } from "@babel/parser";
import MagicString, { SourceMap } from "magic-string";
import { findJsxNode } from "./find-jsx-node";
import { jsxToSnippetJs } from "./jsx-to-snippet-js";

export type TransformOptions = {
  generate: "server" | "client";
  dev: boolean;
  typescript: boolean;
};
export function transform(
  code: string,
  options?: TransformOptions,
): {
  code: string;
  map: SourceMap;
} | null {
  const {
    generate = "client",
    dev = false,
    typescript = false,
  } = options || {};
  // Parse jsx/tsx file
  const ast = parse(code, {
    plugins: typescript ? ["jsx", "typescript"] : ["jsx"],
    sourceType: "module",
  });

  // Find JSX nodes
  const jsxNodes = findJsxNode(ast.program);
  // Do nothing if no JSX nodes
  if (jsxNodes.length === 0) return null;

  // Transform code
  const s = new MagicString(code); // use MagicString to generate source map

  for (const node of jsxNodes) {
    const snippet = jsxToSnippetJs(node, {
      generate,
      dev,
      names: { avoidString: code },
    });
    s.prependLeft(0, snippet.template);
    s.update(node.start!, node.end!, snippet.snippet);
  }

  s.prependLeft(0, `import * as $ from 'svelte/internal/${generate}';\n`);

  return {
    code: s.toString(),
    map: s.generateMap(),
  };
}
