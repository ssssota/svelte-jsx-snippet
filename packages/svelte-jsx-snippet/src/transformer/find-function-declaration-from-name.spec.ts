import { parse } from "@babel/parser";
import { expect, it } from "vitest";
import { findFunctionDeclarationFromName } from "./find-function-declaration-from-name";

it("should find named function declarator", () => {
  const ast = parse("function a() {}", {
    sourceType: "module",
  });
  expect(findFunctionDeclarationFromName("a", ast.program)).toBeDefined();
  expect(findFunctionDeclarationFromName("b", ast.program)).toBeUndefined();
});
