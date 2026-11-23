<script lang="ts">
  import type { HTMLSelectAttributes } from "svelte/elements";

  interface Props extends HTMLSelectAttributes {
    options: readonly any[];
  }

  let { value = $bindable(), options, ...rest }: Props = $props();

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  let formattedOptions = $derived(
    options.map((o) => ({ value: o, label: capitalize(String(o)) })),
  );
</script>

<select bind:value {...rest}>
  {#each formattedOptions as o}
    <option value={o.value}>{o.label}</option>
  {/each}
</select>

<style>
  select {
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
