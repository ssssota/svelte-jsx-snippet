import generate from "@babel/generator";
import { parse } from "@babel/parser";
import { expect, it } from "vitest";
import { renameIdentifierInPlace } from "./rename-identifier-in-place";

it("should rename identifier in place", () => {
  const code = `const fn = () => {}; fn();`;
  const ast = parse(code, { sourceType: "module" });
  renameIdentifierInPlace(ast, () => "newFn");
  const renamed = generate(ast).code;
  expect(renamed).toBe(`const newFn = () => {};\nnewFn();`);
});
