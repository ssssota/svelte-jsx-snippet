import { parse } from "@babel/parser";
import { expect, it } from "vitest";
import { findVariableDeclaratorFromName } from "./find-variable-declarator-from-name";

it("should find named variable declarator", () => {
  const ast = parse("const a = 1;", {
    sourceType: "module",
  });
  expect(findVariableDeclaratorFromName("a", ast.program)).toBeDefined();
  expect(findVariableDeclaratorFromName("b", ast.program)).toBeUndefined();
});
