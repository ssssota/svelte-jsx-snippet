# svelte-jsx-snippet

Write JSX as Svelte snippets for testing.

## Setup

```sh
npm install -D svelte-jsx-snippet
```

tsconfig.json

```jsonc
{
  "compilerOptions": {
    // set jsx config
    "jsx": "react-jsx",
    "jsxImportSource": "svelte-jsx-snippet",
  },
  // include jsx/tsx files
  "include": ["**/*.svelte", "**/*.ts", "**/*.tsx"],
}
```

## Usage

For example: `MyComponent.svelte`

```svelte
<script>
  const { children } = $props();
</script>
<section>{@render children}</section>
```

### For Storybook

```jsx
import MyComponent from "./MyComponent.svelte";
export default {
  component: MyComponent,
};
export const Default = {
  props: {
    children: <h1>Hello, World!</h1>,
  },
};
```

### For Vitest

```jsx
import { test, expect } from "vitest";
import { render } from "@testing-library/svelte";
import MyComponent from "./MyComponent.svelte";
test("render snippet ", () => {
  const { getByText } = render(MyComponent, {
    props: {
      children: <h1>Hello, World!</h1>,
    },
  });
  expect(getByText("Hello, World!")).toBeInTheDocument();
});
```

### Use svelte component in JSX

```jsx
import MyComponent from "./MyComponent.svelte";
import { jsx$ } from "svelte-jsx-snippet";
const MyComponent$ = jsx$(MyComponent, ["children"]);
const snippet = (
  <MyComponent$>
    <h1>Hello, World!</h1>
  </MyComponent$>
);
```

### Make a JSX component

```tsx
import type { FC, JSXChildren } from "svelte-jsx-snippet";
const SnippetComponent = (props: { children?: JSXChildren }) => {
  return <section>{children}</section>;
};
const snippet = (
  <SnippetComponent>
    <h1>Hello, World!</h1>
  </SnippetComponent>
);
```

### Use JSX component in Svelte

```tsx
const SnippetComponent = (props: { children?: JSX.Element }) => {
  return <section>{children}</section>;
};
```

```svelte
<script>
  import SnippetComponent from "./SnippetComponent.tsx";
  import { svelte$ } from "svelte-jsx-snippet";
  const SnippetComponent$ = svelte$(SnippetComponent, ["children"]);
</script>

<SnippetComponent$>
  <h1>Hello, World!</h1>
</SnippetComponent$>
```

## Constraints

- Support only Svelte5
  - because Snippet is a feature of Svelte5.
- Snippet must be static
  - because it does not follow the Svelte reactivity system.

## License

MIT
