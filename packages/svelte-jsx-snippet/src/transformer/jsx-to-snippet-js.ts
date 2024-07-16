import { parse } from "@babel/parser";
import type { JSXElement, JSXFragment } from "@babel/types";
import { compile } from "svelte/compiler";
import { findFunctionDeclarationFromName } from "./find-function-declaration-from-name";
import { findTemplateDeclarations } from "./find-template-declarations";
import { findVariableDeclaratorFromName } from "./find-variable-declarator-from-name";
import { generateRandomName } from "./generate-random-name";
import { generate } from "./generator";
import { jsxToSvelte } from "./jsx-to-svelte";
import { renameIdentifierInPlace } from "./rename-identifier-in-place";

type Names =
  | { avoidString: string }
  | { componentName: string; snippetName: string; avoidString?: never };

export function jsxToSnippetJs(
  jsx: JSXElement | JSXFragment,
  options: {
    generate: "server" | "client";
    dev: boolean;
    names: Names;
  },
): { template: string; snippet: string } {
  const { componentName, snippetName } =
    options.names.avoidString !== undefined
      ? {
          componentName: generateRandomName(options.names.avoidString),
          snippetName: generateRandomName(options.names.avoidString),
        }
      : options.names;
  const { js } = compile(
    `{#snippet ${snippetName}()}${jsxToSvelte(jsx)}{/snippet}`,
    {
      generate: options.generate,
      dev: options.dev,
      name: componentName,
    },
  );
  const ast = parse(js.code, { plugins: ["jsx"], sourceType: "module" });

  if (options.generate === "server") {
    const fn = findFunctionDeclarationFromName(snippetName, ast.program);
    if (!fn) {
      throw new Error("Snippet function not found");
    }

    return {
      template: "",
      snippet: `$.add_snippet_symbol(${generate(fn).code})`,
    };
  }

  renameIdentifierInPlace(ast.program, (name) => {
    const matched = name.match(/^root_\d+$/);
    if (matched) return `${snippetName}_${matched[0]}`;
  });

  const templates = findTemplateDeclarations(ast.program);
  const snippetFn = findVariableDeclaratorFromName(snippetName, ast.program);
  if (templates.length === 0) {
    throw new Error("Template declaration not found");
  }
  if (!snippetFn?.init) {
    throw new Error("Snippet function not found");
  }

  return {
    template: templates
      .map((template) => {
        return generate(template).code.replace(
          `${componentName}.filename`,
          `"${componentName}"`,
        );
      })
      .join("\n"),
    snippet: generate(snippetFn.init).code.replace(
      new RegExp(componentName, "g"),
      "function(){}",
    ),
  };
}
