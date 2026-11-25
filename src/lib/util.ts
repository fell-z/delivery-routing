import type {
  ApiBody,
  ClientBody,
  Job,
  JobParam,
  Location,
  LocationParam,
  TimeWindow,
  TimeWindowParam,
  Vehicle,
  VehicleParam,
} from "#lib/types.ts";

function timeStringToSeconds(timeString: string) {
  const parts = timeString.split(":");
  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);
  return hours * 60 * 60 + minutes * 60;
}

function timeWindowAsParam(timeWindow: TimeWindow): TimeWindowParam {
  return [timeStringToSeconds(timeWindow[0]), timeStringToSeconds(timeWindow[1])];
}

function locationAsParam(location: Location): LocationParam {
  return [location.lng, location.lat];
}

function vehicleAsParam(vehicle: Vehicle) {
  const { id, description, location, time_window, capacity } = vehicle;

  const locationParam = locationAsParam(location);

  const vehicleParam: VehicleParam = {
    id,
    description,
    start: locationParam,
    end: locationParam,
    profile: "driving-car",
    capacity
  };

  if (time_window[0] !== "" && time_window[1] !== "") {
    vehicleParam.time_window = timeWindowAsParam(time_window);
  }

  return vehicleParam;
}

function jobAsParam(job: Job) {
  const { id, description, location, time_window, delivery } = job;

  const jobParam: JobParam = {
    id,
    description,
    location: locationAsParam(location),
    delivery
  };

  if (time_window[0] !== "" && time_window[1] !== "") {
    jobParam.time_windows = [timeWindowAsParam(time_window)];
  }

  return jobParam;
}

export function toApiBody(params: ClientBody) {
  const apiBody: ApiBody = { vehicles: [], jobs: [], options: { g: true } };

  params.vehicles.forEach((v) => {
    apiBody.vehicles.push(vehicleAsParam(v));
  });

  params.jobs.forEach((j) => {
    apiBody.jobs.push(jobAsParam(j));
  });

  return apiBody;
}

export function polylineColor(index: number) {
  const lightness = index % 2 === 0 ? 80 : 40;
  const chroma = index % 2 === 0 ? 80 : 50;
  const hue = 40 * index + 120;
  return `oklch(${lightness}% ${chroma}% ${hue})`;
}

export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
