import { parse } from "@babel/parser";
import MagicString from "magic-string";
import type { VitePlugin } from "unplugin";
import { compile } from "svelte/compiler";
import { traverse } from "@babel/types";
import type {
  FunctionDeclaration,
  JSXElement,
  JSXFragment,
  Node,
  VariableDeclaration,
  VariableDeclarator,
} from "@babel/types";

export const svelteJsxSnippetPlugin = (): VitePlugin => {
  let dev = false;
  return {
    name: "svelte-jsx-snippet",
    enforce: "pre",
    configResolved(config) {
      dev = config.command === "serve";
    },
    /**
     * Transform JSX to snippet (generated) js
     */
    transform(code, id, options) {
      // only handle .jsx, .tsx
      if (!/\.[mc]?[jt]sx$/.test(id)) return null;

      // Parse jsx/tsx file
      const ast = parse(code, {
        plugins: /tsx$/.test(id) ? ["jsx", "typescript"] : ["jsx"],
        sourceType: "module",
        sourceFilename: id,
      });
      const body = ast.program.body;

      // Find JSX nodes
      const jsxNodes = findJsxNode(body);
      // Do nothing if no JSX nodes
      if (jsxNodes.length === 0) return null;

      // Transform code
      const s = new MagicString(code); // use MagicString to generate source map
      const generate = options?.ssr ? "server" : "client";

      for (const node of jsxNodes) {
        const jsx = code.slice(node.start!, node.end!);
        const snippet = jsxToSnippetJs(jsx, { generate, dev });
        s.prependLeft(0, snippet.template);
        s.update(node.start!, node.end!, snippet.snippet);
      }

      s.prependLeft(0, `import * as $ from 'svelte/internal/${generate}';\n`);

      return {
        code: s.toString(),
        map: s.generateMap(),
      };
    },
  };
};
export default svelteJsxSnippetPlugin;

function jsxToSnippetJs(
  jsx: string,
  options: { generate: "server" | "client"; dev: boolean },
): { template: string; snippet: string } {
  const componentName = generateRandomName(jsx);
  const snippetName = generateRandomName(jsx);
  const { js } = compile(`{#snippet ${snippetName}()}${jsx}{/snippet}`, {
    ...options,
    name: componentName,
  });
  const ast = parse(js.code, { plugins: ["jsx"], sourceType: "module" });

  if (options.generate === "server") {
    const fn = findNamedFunctionDeclaration(snippetName, ast.program);
    if (!fn) {
      throw new Error("Snippet function not found");
    }

    return {
      template: "",
      snippet: `$.add_snippet_symbol(${js.code.slice(fn.start!, fn.end!)})`,
    };
  }

  const [template] = findTemplateDeclarations(ast.program);
  const snippetFn = findNamedVariableDeclarator(snippetName, ast.program);
  if (!template) {
    throw new Error("Template declaration not found");
  }
  if (!snippetFn?.init) {
    throw new Error("Snippet function not found");
  }
  const newTemplateName = generateRandomName(jsx);

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

function findJsxNode(node: any): (JSXElement | JSXFragment)[] {
  if (typeof node !== "object" || node === null) return [];
  if (node.type === "JSXElement" || node.type === "JSXFragment") {
    return [node];
  }
  if (Array.isArray(node)) {
    return node.flatMap(findJsxNode);
  }
  return Object.values(node).flatMap(findJsxNode);
}

function findTemplateDeclarations(node: Node): VariableDeclaration[] {
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

const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_";
function generateRandomName(code: string, length = 4): string {
  const ret = Array.from(
    { length },
    () => charset[Math.floor(Math.random() * charset.length)],
  ).join("");
  if (code.includes(ret)) {
    return generateRandomName(code, length + 1);
  }
  return ret;
}

function findNamedFunctionDeclaration(
  name: string,
  node: Node | Node[],
): FunctionDeclaration | undefined {
  if (typeof node !== "object" || node === null) return;
  if (Array.isArray(node)) {
    for (const child of node) {
      const res = findNamedFunctionDeclaration(name, child);
      if (res) return res;
    }
    return;
  }
  if (node.type === "FunctionDeclaration" && node.id?.name === name) {
    return node;
  }
  return Object.values(node)
    .map((v) => findNamedFunctionDeclaration(name, v))
    .find((v) => v !== undefined);
}

function findNamedVariableDeclarator(
  name: string,
  node: Node | Node[],
): VariableDeclarator | undefined {
  if (typeof node !== "object" || node === null) return;
  if (Array.isArray(node)) {
    for (const child of node) {
      const res = findNamedVariableDeclarator(name, child);
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
    .map((v) => findNamedVariableDeclarator(name, v))
    .find((v) => v !== undefined);
}
