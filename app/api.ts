import { Hono } from "hono";
import { env } from "hono/adapter";

type Location = [number, number]; // [long, lat]
type TimeWindow = [number, number]; // [start, end]

// start and end can be equal for circular route
type Vehicle = {
  id: number;
  profile: "driving-car"; // could be one of several profiles available, but this is enough
  start: Location;
  end: Location;
  capacity: [number]; // see comment below for delivery
  time_window?: TimeWindow; // maybe not needed, but need to test and make sure
};

type Job = {
  id: number;
  location: Location;
  service: number;
  delivery: [number]; // normally it would be number[], but in this use case, one is enough
  time_windows: TimeWindow[];
};

interface ApiBody {
  vehicles: Vehicle[];
  jobs: Job[];
  options: {
    g: boolean;
  };
}

type VehicleParam = {
  startPos: Location;
};

type JobParam = {
  location: Location;
  timeWindow?: TimeWindow;
};

interface RouteParams {
  vehicle: VehicleParam;
  jobs: JobParam[];
}

function toApiBody(params: RouteParams): ApiBody {
  const apiBody: ApiBody = { vehicles: [], jobs: [], options: { g: true } };

  apiBody.vehicles.push({
    id: 1,
    profile: "driving-car",
    start: params.vehicle.startPos,
    end: params.vehicle.startPos,
    capacity: [2 * params.jobs.length],
  });

  params.jobs.forEach((j, i) => {
    let timeWindows = undefined;
    if (j.timeWindow) {
      timeWindows = [j.timeWindow];
    }

    apiBody.jobs.push(<Job>{
      id: i + 1,
      location: j.location,
      service: 0,
      delivery: [1],
      time_windows: timeWindows,
    });
  });

  return apiBody;
}

function defaultHeaders(): Headers {
  const h = new Headers();
  h.append("Accept", "application/json");
  h.append("Accept", "application/geo+json");
  h.append("Content-Type", "application/json");
  return h;
}

const api = new Hono()
  .post("/route", async (c) => {
    const actionURL = "https://api.heigit.org/vroom/v0";
    const { API_KEY } = env<{ API_KEY: string }>(c);

    const params: RouteParams = await c.req.json();
    const body = toApiBody(params);

    try {
      const headers = defaultHeaders();
      headers.append("Authorization", API_KEY);

      const response = await fetch(actionURL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`FetchError => Response status: ${response.status}`);
      }

      const data = await response.json();
      if (data.code !== 0) {
        let errorType = "";
        switch (data.code) {
          case 1:
            errorType = "InternalError";
            break;
          case 2:
            errorType = "InputError";
            break;
          case 3:
            errorType = "RoutingError";
            break;
        }

        throw new Error(`ApiError => A ${errorType} occurred.\nError message: ${data?.error}`);
      }

      return c.json(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  });

export default api;
