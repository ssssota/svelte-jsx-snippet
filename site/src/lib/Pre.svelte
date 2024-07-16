<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = { children: Snippet };
  let { children }: Props = $props();
  let pre = $state<HTMLPreElement>();
  const copy = () => {
    navigator.clipboard.writeText(pre?.textContent ?? "");
  };
</script>

<div class="wrapper">
  <pre bind:this={pre}>{@render children()}</pre>
  <button class="copy" title="copy" aria-label="Copy this code" onclick={copy}>
    📝
  </button>
</div>

<style>
  .wrapper {
    position: relative;
  }
  .copy {
    position: absolute;
    top: 0;
    right: 0;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin: 0;
  }
</style>
