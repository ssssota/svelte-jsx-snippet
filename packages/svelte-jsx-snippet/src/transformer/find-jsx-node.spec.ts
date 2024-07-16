import { parse } from "@babel/parser";
import { expect, it } from "vitest";
import { findJsxNode } from "./find-jsx-node";

it("find jsx node", async () => {
  const code = `const a = <div><skip /></div>`;
  const ast = parse(code, { plugins: ["jsx"] });
  const actual = findJsxNode(ast.program);
  expect(actual).toHaveLength(1);
  expect(code.slice(actual[0].start!, actual[0].end!)).toBe(
    "<div><skip /></div>",
  );
});
