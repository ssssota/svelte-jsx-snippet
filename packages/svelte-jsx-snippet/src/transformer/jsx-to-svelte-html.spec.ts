import { parse } from "@babel/parser";
import { expect, it } from "vitest";
import { findJsxNode } from "./find-jsx-node";
import { jsxToSvelteHtml } from "./jsx-to-svelte-html";

it("basic html element", () => {
  const code = `<div class="container"><h1><img src="hoge" />Hello world</h1></div>`;
  const ast = parse(code, { plugins: ["jsx"] });
  const [jsx] = findJsxNode(ast.program);
  const actual = jsxToSvelteHtml(jsx);
  expect(actual).toMatchInlineSnapshot(
    `"<div class="container"><h1><img src="hoge" />Hello world</h1></div>"`,
  );
});
