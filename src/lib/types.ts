type Override<T, U extends Partial<Record<keyof T, unknown>>> = Omit<T, keyof U> & U;

export type Location = { lng: number; lat: number };
export type TimeWindow = [start: string, end: string];

// location is actually optional, but omitting defeats the whole purpose
export interface Base {
  id: number;
  description?: string;
  location: Location;
  time_window: TimeWindow;
}

export interface Job extends Base {
  delivery?: [weight: number]; // normally it would be number[], but in this use case, one is enough
}

export interface Vehicle extends Base {
  capacity?: [weight: number]; // see comment below for delivery
}

export interface ClientBody {
  jobs: Job[];
  vehicles: Vehicle[];
}

export type LocationParam = [lng: number, lat: number];
export type TimeWindowParam = [start: number, end: number];
export type JobParam = Override<Job, { location: LocationParam; time_window?: TimeWindowParam[] }>;
export type VehicleParam = Override<
  Omit<Vehicle, "location">,
  { start: LocationParam; end: LocationParam; time_window?: TimeWindowParam; profile?: string }
>;

export interface ApiBody {
  jobs: JobParam[];
  vehicles: VehicleParam[];
  options: {
    g: boolean;
  };
}

export const MARKER_TYPES = ["none", "job", "vehicle"] as const;
export type MarkerType = (typeof MARKER_TYPES)[number];
