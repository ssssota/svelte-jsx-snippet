import { Fragment, jsx$, type JSXChildren } from "svelte-jsx-snippet";
import H1 from "$lib/H1.svelte";

export const htmlElementWithoutChildren = <span></span>;
export const htmlElementWithTextChild = <span>text</span>;
export const htmlElementWithElementChild = (
  <span>
    <span></span>
  </span>
);
export const htmlElementWithElementChildren = (
  <span>
    <span></span>
    <span></span>
  </span>
);
export const htmlElementWithMixedChildren = (
  <span>
    text
    <span></span>
    text
    <span></span>
    text
  </span>
);
const Component = (props: { children?: JSXChildren }) => (
  <span>{props.children}</span>
);
export const htmlElementWithComponentChild = (
  <span>
    <Component />
  </span>
);
export const htmlElementWithComponentChildren = (
  <span>
    <Component />
    <Component />
  </span>
);
export const componentWithoutChildren = <Component />;
export const componentWithTextChild = <Component>text</Component>;
export const componentWithElementChild = (
  <Component>
    <span></span>
  </Component>
);
export const componentWithElementChildren = (
  <Component>
    <span></span>
    <span></span>
  </Component>
);
export const componentWithMixedChildren = (
  <Component>
    text
    <span></span>
    text
    <span></span>
    text
  </Component>
);
export const componentWithComponentChild = (
  <Component>
    <Component />
  </Component>
);
export const fragment = <Fragment></Fragment>;
export const fragmentWithTextChild = <Fragment>text</Fragment>;
export const implicitFragment = <></>;
export const implicitFragmentWithTextChild = <>text</>;
const H1$ = jsx$(H1, ["children"]);
export const svelteComponent = <H1$></H1$>;
export const svelteComponentWithTextChild = <H1$>text</H1$>;
export const svelteComponentWithElementChild = (
  <H1$>
    <span></span>
  </H1$>
);

export const Fc = (props: { children: JSX.Element }) => (
  <span>{props.children}</span>
);
