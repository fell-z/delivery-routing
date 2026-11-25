<script lang="ts">
  import { onMount } from "svelte";
  import { Map, DivIcon, TileLayer, Marker } from "sveaflet";
  import type { Vehicle, Job } from "#lib/types.ts";
  import { decode } from "@googlemaps/polyline-codec";
  import { polylineColor } from "#lib/util.ts";
  import carFrontFill from "#lib/assets/car-front-fill.svg";
  import boxSeamFill from "#lib/assets/box-seam-fill.svg";
  import PolylineArrowhead from "#lib/components/PolylineArrowhead.svelte";

  interface Props {
    markers: (Job | Vehicle)[];
    routes?: any[];
    onMapClick: EventListener;
  }

  let { markers, routes, onMapClick }: Props = $props();

  const defaultCenter = [-14.240072, -53.180503];
  const defaultZoom = 5;

  let map             = $state<any>();
  let userLocation    = $state<[number, number] | undefined>();
  let polylineLatLngs = $derived<any[]>(
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
          {@const type = "capacity" in m ? "vehicle" : "job"}
          <div class="pin {type}-pin">
            <div class="pin-needle"></div>
            <span class="pin-badge">
              <img src={type === "vehicle" ? carFrontFill : boxSeamFill} alt="{type} icon" width="14" height="14">
            </span>
            <span>{m.description}</span>
          </div>
        </DivIcon>
      </Marker>
    {/each}

    {#each polylineLatLngs as latLngs, i (latLngs)}
      <PolylineArrowhead {latLngs} color={polylineColor(i)} />
    {/each}
  </Map>
</div>

<style>
  #map {
    width: 100%;
    height: 500px;
  }

  :global(.leaflet-div-icon) {
    background: none;
    border: none;

    :global(& > *) {
      width: 0;
      height: 0;
    }
  }

  .vehicle-pin {
    --clr-bg: lightskyblue;
    background-color: var(--clr-bg);
    color: black;
  }

  .job-pin {
    --clr-bg: orange;
    background-color: var(--clr-bg);
    color: white;
  }

  .pin {
    position: relative;
    top: -24px;

    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;

    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    border-radius: 999px;
    border: 2px solid white;

    box-shadow: 0 3px 10px rgba(15, 23, 42, 0.28);
    transform: translate(-50%, -50%);
    transition: transform 0.15s ease;

    &:hover {
      transform: translate(-50%,-50%) scale(1.1);
    }

    &:active {
      transform: translate(-50%,-50%) scale(1.0);
    }

    .pin-needle {
      position: absolute;
      z-index: -1;
      bottom: -35%;
      left: 43%;

      background-color: var(--clr-bg);
      width: 20px;
      height: 20px;
      border-bottom: 2px solid white;
      border-right: 2px solid white;

      transform: rotate(45deg);
    }
  }

  .pin-badge {
    font-size: 13px;

    width: 22px;
    height: 22px;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: white;
  }
</style>
