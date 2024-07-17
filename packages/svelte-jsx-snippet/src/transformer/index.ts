import { parse } from "@babel/parser";
import MagicString, { SourceMap } from "magic-string";
import { compile } from "svelte/compiler";
import { findFunctionDeclarationFromName } from "./find-function-declaration-from-name";
import { findJsxNode } from "./find-jsx-node";
import { findTemplateDeclarations } from "./find-template-declarations";
import { findVariableDeclaratorFromName } from "./find-variable-declarator-from-name";
import { generateRandomName } from "./generate-random-name";
import { generate as generateFromAst } from "./generator";
import { jsxToSvelteHtml } from "./jsx-to-svelte-html";
import { renameIdentifierInPlace } from "./rename-identifier-in-place";

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
  const componentName = generateRandomName(code);

  // Find JSX nodes
  const jsxNodes = findJsxNode(
    parse(code, {
      plugins: typescript ? ["jsx", "typescript"] : ["jsx"],
      sourceType: "module",
    }).program,
  );
  // Do nothing if no JSX nodes
  if (jsxNodes.length === 0) return null;

  const snippetNameMap = jsxNodes.map((jsx, i) => {
    return [`${componentName}_snippet_${i}`, jsx] as const;
  });

  // Transform code
  const s = new MagicString(code); // use MagicString to generate source map

  const { js } = compile(
    snippetNameMap
      .map(([snippetName, jsx]) => {
        return `{#snippet ${snippetName}()}${jsxToSvelteHtml(jsx)}{/snippet}`;
      })
      .join("\n"),
    { generate, dev, name: componentName },
  );
  const ast = parse(js.code, { sourceType: "module" });

  if (generate === "server") {
    for (const [snippetName, jsx] of snippetNameMap) {
      const fn = findFunctionDeclarationFromName(snippetName, ast.program);
      if (!fn) {
        throw new Error("Snippet function not found");
      }
      s.update(
        jsx.start!,
        jsx.end!,
        `${dev ? "$.add_snippet_symbol" : ""}(${generateFromAst(fn).code})`,
      );
    }
  } else {
    renameIdentifierInPlace(ast.program, (name) => {
      if (name.match(/^root_\d+$/)) return `${componentName}_${name}`;
    });

    const templates = findTemplateDeclarations(ast.program);
    if (templates.length === 0) {
      throw new Error("Template declaration not found");
    }
    s.prependLeft(
      0,
      templates.map((template) => generateFromAst(template).code).join("\n"),
    );

    for (const [snippetName, jsx] of snippetNameMap) {
      const snippetFn = findVariableDeclaratorFromName(
        snippetName,
        ast.program,
      );
      if (!snippetFn?.init) {
        throw new Error("Snippet function not found");
      }
      s.update(jsx.start!, jsx.end!, generateFromAst(snippetFn.init).code);
    }

    if (dev) {
      s.prependLeft(
        0,
        `function ${componentName}(){}\n${componentName}.filename = "${componentName}";\n`,
      );
    }
  }

  s.prependLeft(0, `import * as $ from 'svelte/internal/${generate}';\n`);

  return {
    code: s.toString(),
    map: s.generateMap(),
  };
}
