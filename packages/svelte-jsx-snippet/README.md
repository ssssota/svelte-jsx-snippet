# svelte-jsx-snippet

Write JSX as Svelte snippets for testing.

## Usage

```svelte
<script>
  const { children } = $props();
</script>
<section>{@render children}</section>
```

For Storybook.

```jsx
import MyComponent from "./MyComponent.svelte";
import $snippet from "svelte-jsx-snippet";
export default {
  component: MyComponent,
};
export const Default = {
  props: {
    children: $snippet(<h1>Hello, World!</h1>),
  },
};
```

For Vitest.

```jsx
import { test, expect } from "vitest";
import { render } from "@testing-library/svelte";
import MyComponent from "./MyComponent.svelte";
import $snippet from "svelte-jsx-snippet";
test("render snippet ", () => {
  const { getByText } = render(MyComponent, {
    props: {
      children: $snippet(<h1>Hello, World!</h1>),
    },
  });
  expect(getByText("Hello, World!")).toBeInTheDocument();
});
```

## Setup

```sh
npm install -D svelte-jsx-snippet
```

vite.config.js

```js
import { svelteJsxSnippet } from "svelte-jsx-snippet/vite";
import { defineConfig } from "vite";
export default defineConfig({
  plugins: [svelteJsxSnippet()],
});
```

tsconfig.json

```jsonc
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "svelte-jsx-snippet",
  },
  "include": ["**/*.svelte", "**/*.ts", "**/*.tsx"],
}
```

## Constraints

- Support only Svelte5
  - because Snippet is a feature of Svelte5.
- Snippet must be static
  - because it does not follow the Svelte reactivity system.

## License

MIT
