<script lang="ts">
  import type { Snippet } from "svelte";
  type Props = {
    children: Snippet;
  };
  let { children }: Props = $props();
</script>

<h1>{@render children()}</h1>
