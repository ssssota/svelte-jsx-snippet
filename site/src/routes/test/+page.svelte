<script lang="ts">
  import {
    htmlElementWithElementChild,
    htmlElementWithTextChild,
    htmlElementWithoutChildren,
    htmlElementWithElementChildren,
    htmlElementWithMixedChildren,
    htmlElementWithComponentChild,
    htmlElementWithComponentChildren,
    componentWithoutChildren,
    componentWithTextChild,
    componentWithElementChild,
    componentWithElementChildren,
    componentWithMixedChildren,
    componentWithComponentChild,
    fragment,
    fragmentWithTextChild,
    Fc,
  } from "$lib";
  import H1 from "$lib/H1.svelte";
  import Transparent from "$lib/Transparent.svelte";
  import { svelte$ } from "svelte-jsx-snippet";
  const Fc$ = svelte$(Fc);
  let value = $state("test");
</script>

<!-- Hydration checks -->
{@render htmlElementWithoutChildren()}
{@render htmlElementWithTextChild()}
{@render htmlElementWithElementChild()}
{@render htmlElementWithElementChildren()}
{@render htmlElementWithMixedChildren()}
{@render htmlElementWithComponentChild()}
{@render htmlElementWithComponentChildren()}
{@render componentWithoutChildren()}
{@render componentWithTextChild()}
{@render componentWithElementChild()}
{@render componentWithElementChildren()}
{@render componentWithMixedChildren()}
{@render componentWithComponentChild()}
{@render fragment()}
{@render fragmentWithTextChild()}

<!-- Dynamically checks -->
<Fc$><H1>{value}</H1></Fc$>
<Fc$><h1>{value}</h1></Fc$>
<Fc$>{value}</Fc$>
<Fc$><Transparent>{value}</Transparent></Fc$>
<input bind:value />
