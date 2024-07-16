import type {
  JSXElement,
  JSXExpressionContainer,
  JSXFragment,
  JSXSpreadChild,
  JSXText,
} from "@babel/types";
import { generate } from "./generator";

export function jsxToSvelte(
  jsx:
    | JSXElement
    | JSXFragment
    | JSXText
    | JSXExpressionContainer
    | JSXSpreadChild,
): string {
  if (jsx.type === "JSXExpressionContainer") {
    throw new Error("Not supported");
  }
  if (jsx.type === "JSXText") {
    return jsx.value;
  }
  if (jsx.type === "JSXSpreadChild") {
    return `{${generate(jsx.expression).code}}`;
  }
  if (jsx.type === "JSXFragment") {
    return jsx.children.map(jsxToSvelte).join("");
  }
  return [
    generate(jsx.openingElement).code,
    ...jsx.children.map(jsxToSvelte),
    jsx.closingElement ? generate(jsx.closingElement).code : "",
  ].join("");
}
