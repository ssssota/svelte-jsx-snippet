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
    "jsx": "preserve",
    "jsxImportSource": "svelte-jsx-snippet",
  },
  // include jsx/tsx files
  "include": ["**/*.svelte", "**/*.ts", "**/*.tsx"],
}
```

vite.config.ts

```ts
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
// Put svelteJsxSnippet plugin
import { svelteJsxSnippet } from "svelte-jsx-snippet/vite";

export default defineConfig({
  plugins: [sveltekit(), svelteJsxSnippet()],
});
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
    children: <h1 class="text-xl font-bold">Hello, World!</h1>,
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
      children: <h1 class="text-xl font-bold">Hello, World!</h1>,
    },
  });
  expect(getByText("Hello, World!")).toBeInTheDocument();
});
```

## Constraints

- Support only Svelte5
  - because Snippet is a feature of Svelte5.
- You can't use Svelte's special syntax.
  - For example, `#if`, `#each`, `#await`, etc.

## License

MIT
