import Pre from "$lib/Pre.svelte";

export const page = (
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
        <Pre>
          <code>{`npm install svelte-jsx-snippet`}</code>
        </Pre>
        <p>tsconfig.json</p>
        <Pre>
          <code>{`{
  "compilerOptions": {
    // set jsx config
    "jsx": "react-jsx",
    "jsxImportSource": "svelte-jsx-snippet",
  },
  // include jsx/tsx files
  "include": ["**/*.svelte", "**/*.ts", "**/*.tsx"],
}`}</code>
        </Pre>
      </section>
      <section>
        <h2>API</h2>
        <h3>JSX</h3>
        <p>JSX will be Svelte snippet. The following two are synonymous:</p>
        <Pre>
          <code>{`const hello = <h3>Hello, world!</h3> // JSX`}</code>
        </Pre>
        <Pre>
          <code>{`{#snippet hello()}\n  <h3>Hello, world!</h3> <!-- Svelte -->\n{/snippet}`}</code>
        </Pre>
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
