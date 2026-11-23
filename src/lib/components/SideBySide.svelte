<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="side-by-side">
  {@render children()}
</div>

<style>
  .side-by-side {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: start;
    gap: 12px;
    margin-top: 12px;
  }
</style>
