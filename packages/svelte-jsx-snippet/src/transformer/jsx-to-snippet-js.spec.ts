import { parse } from "@babel/parser";
import { expect, it } from "vitest";
import { findJsxNode } from "./find-jsx-node";
import { jsxToSnippetJs } from "./jsx-to-snippet-js";

const [jsx] = findJsxNode(
  parse(
    `
<div>
  test
  <SomeComponent>
    <p>child</p>
  </SomeComponent>
  <>
    fragment
  </>
</div>`,
    { plugins: ["jsx"] },
  ).program,
);

it("generate:server", () => {
  const actualDev = jsxToSnippetJs(jsx, {
    generate: "server",
    dev: true,
    names: { componentName: "COMPONENT", snippetName: "SNIPPET" },
  });
  expect(actualDev.template).toBe("");
  expect(actualDev.snippet).toMatchInlineSnapshot(`
    "$.add_snippet_symbol(function SNIPPET($$payload) {
      $$payload.out += \`<div>\`;
      $.push_element($$payload, "div", 1, 20);
      $$payload.out += \`test \`;
      $.validate_component(SomeComponent)($$payload, {
        children: $.add_snippet_symbol(($$payload, $$slotProps) => {
          $$payload.out += \`<p>\`;
          $.push_element($$payload, "p", 4, 4);
          $$payload.out += \`child</p>\`;
          $.pop_element();
        }),
        $$slots: {
          default: true
        }
      });
      $$payload.out += \`<!----> fragment</div>\`;
      $.pop_element();
    })"
  `);
  const actual = jsxToSnippetJs(jsx, {
    generate: "server",
    dev: false,
    names: { componentName: "COMPONENT", snippetName: "SNIPPET" },
  });
  expect(actual.template).toBe("");
  expect(actual.snippet).toMatchInlineSnapshot(`
    "$.add_snippet_symbol(function SNIPPET($$payload) {
      $$payload.out += \`<div>test \`;
      SomeComponent($$payload, {
        children: ($$payload, $$slotProps) => {
          $$payload.out += \`<p>child</p>\`;
        },
        $$slots: {
          default: true
        }
      });
      $$payload.out += \`<!----> fragment</div>\`;
    })"
  `);
});

it("generate:client", () => {
  const actualDev = jsxToSnippetJs(jsx, {
    generate: "client",
    dev: true,
    names: { componentName: "COMPONENT", snippetName: "SNIPPET" },
  });
  expect(actualDev.template).toMatchInlineSnapshot(
    `
    "var SNIPPET_root_2 = $.add_locations($.template(\`<p>child</p>\`), "COMPONENT", [[4, 4]]);
    var SNIPPET_root_1 = $.add_locations($.template(\`<div>test <!> fragment</div>\`), "COMPONENT", [[1, 20]]);"
  `,
  );
  expect(actualDev.snippet).toMatchInlineSnapshot(`
    "$.wrap_snippet(function(){}, $$anchor => {
      var div = SNIPPET_root_1();
      var node = $.sibling($.child(div));
      $.validate_component(SomeComponent)(node, {
        children: $.wrap_snippet(function(){}, ($$anchor, $$slotProps) => {
          var p = SNIPPET_root_2();
          $.append($$anchor, p);
        }),
        $$slots: {
          default: true
        },
        $$legacy: true
      });
      $.next();
      $.reset(div);
      $.append($$anchor, div);
    })"
  `);
  const actual = jsxToSnippetJs(jsx, {
    generate: "client",
    dev: false,
    names: { componentName: "COMPONENT", snippetName: "SNIPPET" },
  });
  expect(actual.template).toMatchInlineSnapshot(
    `
    "var SNIPPET_root_2 = $.template(\`<p>child</p>\`);
    var SNIPPET_root_1 = $.template(\`<div>test <!> fragment</div>\`);"
  `,
  );
  expect(actual.snippet).toMatchInlineSnapshot(`
    "$$anchor => {
      var div = SNIPPET_root_1();
      var node = $.sibling($.child(div));
      SomeComponent(node, {
        children: ($$anchor, $$slotProps) => {
          var p = SNIPPET_root_2();
          $.append($$anchor, p);
        },
        $$slots: {
          default: true
        },
        $$legacy: true
      });
      $.next();
      $.reset(div);
      $.append($$anchor, div);
    }"
  `);
});
