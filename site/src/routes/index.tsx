export const test = <h1>test</h1>;

export const Page = (
  <div>
    <header>
      <h1>svelte-jsx-snippet</h1>
      <p>Most of this page is written in JSX and built with SvelteKit 🚀</p>
      <nav style="display:flex;gap:1em;">
        <a href="https://github.com/ssssota/svelte-jsx-snippet">GitHub</a>
        <a href="https://www.npmjs.com/package/svelte-jsx-snippet">npm</a>
      </nav>
    </header>
    <main>
      <section>
        <h2>Setup</h2>
        <pre>
          <code>{`npm install svelte-jsx-snippet`}</code>
        </pre>
        <p>tsconfig.json</p>
        <pre>
          <code>{`{
  "compilerOptions": {
    // set jsx config
    "jsx": "react-jsx",
    "jsxImportSource": "svelte-jsx-snippet",
  },
  // include jsx/tsx files
  "include": ["**/*.svelte", "**/*.ts", "**/*.tsx"],
}`}</code>
        </pre>
      </section>
      <section>
        <h2>API</h2>
        <h3>JSX</h3>
        <p>JSX will be Svelte snippet. The following two are synonymous:</p>
        <pre>
          <code>{`const hello = <h3>Hello, world!</h3> // JSX`}</code>
        </pre>
        <pre>
          <code>{`{#snippet hello()}\n  <h3>Hello, world!</h3> <!-- Svelte -->\n{/snippet}`}</code>
        </pre>
        <h3>
          <code>jsx$(Component, snippetProps)</code>
        </h3>
        <p>
          <code>jsx$</code> function convert a Svelte component to a JSX
          function component.
        </p>
        <h3>
          <code>svelte(Component)</code>
        </h3>
        <p>
          <code>svelte$</code> function convert a JSX function component to a
          Svelte component.
        </p>
      </section>
    </main>
  </div>
);
