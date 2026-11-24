<script lang="ts">
  import type { Base } from "#lib/types.ts";
  import Button from "#lib/components/Button.svelte";

  interface Props {
    title: string;
    markers: Base[];
  }

  let { title, markers }: Props = $props()

  function onDeleteClick(e: any) {
    const id = parseInt(e.target.value);
    const index = markers.findIndex((m) => m.id === id);
    markers.splice(index, 1);
  }
</script>

<div class="marker-list">
  <h2>{title}</h2>

  {#if markers.length > 0}
    <ol>
      {#each markers as marker (marker.id)}
        <li>
          <label>
            Description:
            <input type="text" bind:value={marker.description}>
          </label>
          {#if marker.time_window !== undefined}
            <label>
              Time window
              <span class="field--time">
                from
                <input type="time" bind:value={marker.time_window[0]}>
              </span>
              <span class="field--time">
                to
                <input type="time" bind:value={marker.time_window[1]}>
              </span>
            </label>
          {/if}
          <p>Latitude: {marker.location.lat}</p>
          <p>Longitude: {marker.location.lng}</p>
          <Button value={marker.id} onclick={onDeleteClick}>
            Delete
          </Button>
        </li>
      {/each}
    </ol>
  {:else}
    <p>No markers yet</p>
  {/if}
</div>

<style>
  .marker-list {
    padding: 8px;
    box-shadow: 0 0 2px 1px oklch(0% 0% 0 / 0.3);

    h2 {
      border-bottom: 2px solid oklch(0% 0% 0 / 0.2);
      margin-bottom: 8px;
    }

    li {
      border: 1px solid oklch(0% 0% 0 / 0.3);
      padding: 4px 8px;
      margin: 8px 0;

      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    label {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    input {
      width: 100%;
    }

    .field--time {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
</style>
