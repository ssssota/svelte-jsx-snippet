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
  } from "$lib";
</script>

<!-- {#snippet test()}
  <span>text</span>
{/snippet}
{@render test()} -->

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
