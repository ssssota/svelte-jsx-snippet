import { render } from "@testing-library/svelte";
import { expect, test } from "vitest";
import { $snippet, Fragment } from "svelte-jsx-snippet";

import H1 from "./H1.svelte";

test("no initial greeting", () => {
  const ctx = render(H1, {
    children: $snippet(<span>Hello, world!</span>),
  });
  expect(ctx.container.innerHTML).toMatchInlineSnapshot(
    `"<h1><span>Hello, world!</span><!----></h1>"`,
  );
});

test("fragment", () => {
  const ctx = render(H1, {
    children: $snippet(
      <Fragment>
        <span>Hello</span>
        <span>, world!</span>
      </Fragment>,
    ),
  });
  expect(ctx.container.innerHTML).toMatchInlineSnapshot(
    `"<h1><span>Hello</span><span>, world!</span><!----></h1>"`,
  );
});

test("implicit fragment", () => {
  const ctx = render(H1, {
    children: $snippet(
      <>
        <span>Hello</span>
        <span>, world!</span>
      </>,
    ),
  });
  expect(ctx.container.innerHTML).toMatchInlineSnapshot(
    `"<h1><span>Hello</span><span>, world!</span><!----></h1>"`,
  );
});
