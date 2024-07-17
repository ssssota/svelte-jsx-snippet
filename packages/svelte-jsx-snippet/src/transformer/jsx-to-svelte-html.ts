import type {
  JSXElement,
  JSXExpressionContainer,
  JSXFragment,
  JSXSpreadChild,
  JSXText,
} from "@babel/types";
import { generate } from "./generator";

export function jsxToSvelteHtml(
  jsx:
    | JSXElement
    | JSXFragment
    | JSXText
    | JSXExpressionContainer
    | JSXSpreadChild,
): string {
  if (jsx.type === "JSXExpressionContainer") {
    return `{${generate(jsx.expression).code}}`;
  }
  if (jsx.type === "JSXText") {
    return jsx.value;
  }
  if (jsx.type === "JSXSpreadChild") {
    throw new Error("Not supported");
  }
  if (jsx.type === "JSXFragment") {
    return jsx.children.map(jsxToSvelteHtml).join("");
  }
  return [
    generate(jsx.openingElement).code,
    ...jsx.children.map(jsxToSvelteHtml),
    jsx.closingElement ? generate(jsx.closingElement).code : "",
  ].join("");
}
