import { parse } from "@babel/parser";
import { expect, it } from "vitest";
import { findTemplateDeclarations } from "./find-template-declarations";

it("find template declarations", () => {
  const code = `
import * as $ from 'svelte/internal/client';
var root_1 = $.template('<div><!></div>');
`;
  const ast = parse(code, { sourceType: "module" });
  const [template] = findTemplateDeclarations(ast.program);
  expect(template).toBeDefined();
  expect(code.slice(template.start!, template.end!)).toBe(
    "var root_1 = $.template('<div><!></div>');",
  );
});
