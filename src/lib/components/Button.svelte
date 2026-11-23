<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props extends HTMLButtonAttributes {
    children: Snippet;
  }

  let { children, type = "button", ...rest }: Props = $props();
</script>

<button {type} {...rest}>
  {@render children()}
</button>

<style>
  button {
    --clr-bg: oklch(89% 24% 304 / 0.7);
    padding: 4px 6px;
    background-color: var(--clr-bg);
    border: none;
    border-radius: 5px;
    box-shadow: 0 0 1px 1px oklch(0% 0% 0 / 0.6);

    &:hover {
      background-color: oklch(from var(--clr-bg) calc(l * 0.9) c h / alpha);
    }

    &:active {
      opacity: 0.9;
    }
  }
</style>
