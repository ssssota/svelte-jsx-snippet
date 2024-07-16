import { parse } from "@babel/parser";
import { compile } from "svelte/compiler";
import { findFunctionDeclarationFromName } from "./find-function-declaration-from-name";
import { findTemplateDeclarations } from "./find-template-declarations";
import { findVariableDeclaratorFromName } from "./find-variable-declarator-from-name";
import { generateRandomName } from "./generate-random-name";

export function jsxToSnippetJs(
  jsx: string,
  options: {
    generate: "server" | "client";
    dev: boolean;
    componentName?: string;
    snippetName?: string;
    templateName?: string;
  },
): { template: string; snippet: string } {
  const componentName = options.componentName ?? generateRandomName(jsx);
  const snippetName = options.snippetName ?? generateRandomName(jsx);
  const { js } = compile(`{#snippet ${snippetName}()}${jsx}{/snippet}`, {
    generate: options.generate,
    dev: options.dev,
    name: componentName,
  });
  const ast = parse(js.code, { plugins: ["jsx"], sourceType: "module" });

  if (options.generate === "server") {
    const fn = findFunctionDeclarationFromName(snippetName, ast.program);
    if (!fn) {
      throw new Error("Snippet function not found");
    }

    return {
      template: "",
      snippet: `$.add_snippet_symbol(${js.code.slice(fn.start!, fn.end!)})`,
    };
  }

  const [template] = findTemplateDeclarations(ast.program);
  const snippetFn = findVariableDeclaratorFromName(snippetName, ast.program);
  if (!template) {
    throw new Error("Template declaration not found");
  }
  if (!snippetFn?.init) {
    throw new Error("Snippet function not found");
  }
  const newTemplateName = options.templateName ?? generateRandomName(jsx);

  return {
    template: js.code
      .slice(template.start!, template.end!)
      .replace(/root_1/, newTemplateName)
      .replace(`${componentName}.filename`, `"${componentName}"`),
    snippet: js.code
      .slice(snippetFn.init.start!, snippetFn.init.end!)
      .replace(/root_1/, newTemplateName)
      .replace(componentName, "function(){}"),
  };
}
