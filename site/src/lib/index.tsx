import { Fragment, svelte, type JSXChildren } from "svelte-jsx-snippet";

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

export const Fc = (props: { children: JSX.Element }) => (
  <span>{props.children}</span>
);
