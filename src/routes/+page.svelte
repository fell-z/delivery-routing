<script lang="ts">
  import { appClient } from "#lib/rpc.ts";
  import { MARKER_TYPES } from "#lib/types.ts";
  import type { Base, Job, Vehicle, MarkerType } from "#lib/types.ts";
  import DMap from "#lib/components/DMap.svelte";
  import MarkerList from "#lib/components/MarkerList.svelte";
  import SideBySide from "#lib/components/SideBySide.svelte";
  import Button from "#lib/components/Button.svelte";
  import Select from "#lib/components/Select.svelte";

  let routes     = $state<any[]>();
  let nextId     = $state(0);
  let markerType = $state<MarkerType>("none");
  let jobs       = $state<Job[]>([]);
  let vehicles   = $state<Vehicle[]>([]);
  let markers    = $derived([...jobs, ...vehicles]);

  function onMapClick(e: any) {
    const newMarker: Base = {
      id: nextId,
      location: e.latlng,
      time_window: ["", ""],
    };

    switch (markerType) {
      case "job":
        if (jobs.length >= 50) return;

        jobs.push({ ...newMarker, description: `Job ${nextId}`, delivery: [0] });
        break;
      case "vehicle":
        if (vehicles.length >= 3) return;

        vehicles.push({ ...newMarker, description: `Vehicle ${nextId}`, capacity: [0] });
        break;
      default:
        return;
    }

    nextId++;
  }

  async function calculateHandler() {
    if (jobs.length === 0 || vehicles.length === 0) return;

    const payload = { jobs, vehicles };
    console.log("Payload:\n\n");
    console.log(JSON.stringify(payload, null, 2));

    try {
      const response = await appClient.api.route.$post({ json: payload });
      const data: any = await response.json();
      routes = data.routes;

      console.log("Data:\n\n");
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      console.error(e);
    }
  }
</script>

<div class="controls">
  <h2>Controls</h2>
  <Select bind:value={markerType} options={MARKER_TYPES} />
  <Button onclick={calculateHandler}>Calculate routes</Button>
</div>

<DMap {markers} {routes} {onMapClick} />

<SideBySide>
  <MarkerList title="Jobs" markers={jobs} />
  <MarkerList title="Vehicles" markers={vehicles} />
</SideBySide>

<style>
  .controls {
    display: flex;
    align-items: center;
    gap: 12px;
    border-radius: 8px;
    box-shadow: 0 0 2px 2px oklch(0% 0% 0 / 0.18);
    padding: 8px 16px;
    margin: 16px 0;

    h2 {
      margin-right: 12px;
    }
  }
</style>
