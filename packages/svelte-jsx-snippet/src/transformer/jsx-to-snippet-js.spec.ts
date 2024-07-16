import { expect, it } from "vitest";
import { jsxToSnippetJs } from "./jsx-to-snippet-js";

it("generate:server", () => {
  const jsx = "<div>test</div>";
  const actualDev = jsxToSnippetJs(jsx, {
    generate: "server",
    dev: true,
    componentName: "TestComponent",
    snippetName: "snippet",
    templateName: "template",
  });
  expect(actualDev.template).toBe("");
  expect(actualDev.snippet).toMatchInlineSnapshot(`
    "$.add_snippet_symbol(function snippet($$payload) {
    		$$payload.out += \`<div>\`;
    		$.push_element($$payload, "div", 1, 20);
    		$$payload.out += \`test</div>\`;
    		$.pop_element();
    	})"
  `);
  const actual = jsxToSnippetJs(jsx, {
    generate: "server",
    dev: false,
    componentName: "TestComponent",
    snippetName: "snippet",
    templateName: "template",
  });
  expect(actual.template).toBe("");
  expect(actual.snippet).toMatchInlineSnapshot(`
    "$.add_snippet_symbol(function snippet($$payload) {
    		$$payload.out += \`<div>test</div>\`;
    	})"
  `);
});

it("generate:client", () => {
  const jsx = "<div>test</div>";
  const actualDev = jsxToSnippetJs(jsx, {
    generate: "client",
    dev: true,
    componentName: "TestComponent",
    snippetName: "snippet",
    templateName: "template",
  });
  expect(actualDev.template).toMatchInlineSnapshot(
    `"var template = $.add_locations($.template(\`<div>test</div>\`), "TestComponent", [[1, 20]]);"`,
  );
  expect(actualDev.snippet).toMatchInlineSnapshot(`
    "$.wrap_snippet(function(){}, ($$anchor) => {
    		var div = template();

    		$.append($$anchor, div);
    	})"
  `);
  const actual = jsxToSnippetJs(jsx, {
    generate: "client",
    dev: false,
    componentName: "TestComponent",
    snippetName: "snippet",
    templateName: "template",
  });
  expect(actual.template).toMatchInlineSnapshot(
    `"var template = $.template(\`<div>test</div>\`);"`,
  );
  expect(actual.snippet).toMatchInlineSnapshot(`
    "($$anchor) => {
    		var div = template();

    		$.append($$anchor, div);
    	}"
  `);
});
