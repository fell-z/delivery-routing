<script lang="ts">
  import "../reset.css";
  import favicon from "#lib/assets/favicon.svg";
  import type { LayoutProps } from "./$types";
  import "leaflet-arrowheads";

  let { children }: LayoutProps = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>Delivery Routing</title>
</svelte:head>

<header>
  <h1>Roteamento de Entregas</h1>
</header>

<main>
  {@render children()}
</main>

<style>
  :root {
    font-family: system-ui, sans-serif;
  }

  header {
    h1 {
      margin-top: 24px;
      text-align: center;
    }
  }

  main {
    padding: 16px;
  }
</style>
