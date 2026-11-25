<script lang="ts">
  import { Polyline } from "sveaflet";

  interface Props {
    latLngs: any[];
    color: string;
    frequency?: string;
  }

  let { latLngs, color, frequency = "150m" }: Props = $props();
  let polyline = $state<any>();

  $effect(() => {
    if (!polyline) return;

    polyline.arrowheads({
      frequency,
      fill: true,
      size: "18px",
      // yawn: 40,
      offsets: { start: "100m", end: "50m" },
    });

    return () => {
      polyline?.deleteArrowheads?.();
    };
  });
</script>

<Polyline {latLngs} options={{ color }} bind:instance={polyline} />
