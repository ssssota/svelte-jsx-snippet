import { render } from "@testing-library/svelte";
import { expect, test } from "vitest";
import { Fragment, jsx } from "svelte-jsx-snippet";

import H1 from "./H1.svelte";

test("single element", () => {
  const ctx = render(H1, {
    children: <span>Hello, world!</span>,
  });
  expect(ctx.container.innerHTML).toMatchInlineSnapshot(
    `"<h1><span>Hello, world!</span><!----></h1>"`,
  );
});

test("nested element", () => {
  const ctx = render(H1, {
    children: (
      <div>
        Hello
        <span>, world!</span>
      </div>
    ),
  });
  expect(ctx.container.innerHTML).toMatchInlineSnapshot(
    `"<h1><div>Hello<span>, world!</span><!----></div><!----></h1>"`,
  );
});

test("fragment", () => {
  const ctx = render(H1, {
    children: (
      <Fragment>
        Hello
        <span>, world!</span>
      </Fragment>
    ),
  });
  expect(ctx.container.innerHTML).toMatchInlineSnapshot(
    `"<h1>Hello<span>, world!</span><!----><!----></h1>"`,
  );
});

test("implicit fragment", () => {
  const ctx = render(H1, {
    children: (
      <>
        Hello
        <span>, world!</span>
      </>
    ),
  });
  expect(ctx.container.innerHTML).toMatchInlineSnapshot(
    `"<h1>Hello<span>, world!</span><!----><!----></h1>"`,
  );
});

test("function component", () => {
  const FunctionComponent = (props: { name: string }) => (
    <span>Hello, {props.name}!</span>
  );
  const ctx = render(H1, {
    children: <FunctionComponent name="snippet" />,
  });
  expect(ctx.container.innerHTML).toMatchInlineSnapshot(
    `"<h1><span>Hello, snippet!</span><!----><!----></h1>"`,
  );
});

test("svelte component", () => {
  const H1$ = jsx(H1, ["children"]);
  const ctx = render(H1, {
    children: <H1$>test</H1$>,
  });
  expect(ctx.container.innerHTML).toMatchInlineSnapshot(
    `"<h1><h1>test<!----></h1><!----><!----><!----></h1>"`,
  );
});
