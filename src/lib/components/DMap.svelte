<script lang="ts">
  import { onMount } from "svelte";
  import { Map, DivIcon, TileLayer, Marker, Polyline } from "sveaflet";
  import type { Base } from "#lib/types.ts";
  import { decode } from "@googlemaps/polyline-codec";
  import { polylineColor } from "#lib/util.ts";

  interface Props {
    markers: Base[];
    routes?: any[];
    onMapClick: EventListener;
  }

  let { markers, routes, onMapClick }: Props = $props();

  const defaultCenter = [-14.240072, -53.180503];
  const defaultZoom = 5;

  let map: any = $state();
  let userLocation: [number, number] | undefined = $state();
  let polylines: any[] = $derived(
    routes ? routes.map((r) => decode(r.geometry, 5)) : [],
  );

  onMount(() => {
    if (!("geolocation" in navigator)) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        userLocation = [latitude, longitude];
        map?.flyTo(userLocation, defaultZoom + 10);
      },
      (e) => console.error(e),
    );
  });

  function onMarkerDrag(id: number) {
    return (e: any) => {
      const marker = markers.find((marker) => marker.id === id);

      if (marker) {
        marker.location = e.latlng;
      }
    };
  }
</script>

<div id="map">
  <Map
    options={{ center: defaultCenter, zoom: defaultZoom }}
    bind:instance={map}
    onclick={onMapClick}
  >
    <TileLayer
      url={"https://tile.openstreetmap.org/{z}/{x}/{y}.png"}
      options={{
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }}
    />
    {#each markers as m (m.id)}
      <Marker
        latLng={m.location}
        options={{ draggable: true }}
        ondrag={onMarkerDrag(m.id)}
      >
        <DivIcon>
          {m.description}
        </DivIcon>
      </Marker>
    {/each}

    {#each polylines as p, i}
      <Polyline latLngs={p} options={{ color: polylineColor(i) }} />
    {/each}
  </Map>
</div>

<style>
  #map {
    width: 100%;
    height: 500px;
  }
</style>
