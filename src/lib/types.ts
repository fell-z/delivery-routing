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

// Both fields 'delivery' and 'capacity' are an array of multidimensional numbers.
// In other words, each number can mean anything you want.
// In this case it is weight in the 1st position.
export interface Job extends Base {
  delivery: [weight: number];
}

export interface Vehicle extends Base {
  capacity: [weight: number];
}

export interface ClientBody {
  jobs: Job[];
  vehicles: Vehicle[];
}

export type LocationParam = [lng: number, lat: number];
export type TimeWindowParam = [start: number, end: number];
export type JobParam = Override<
  Omit<Job, "time_window">,
  { location: LocationParam; time_windows?: TimeWindowParam[] }
>;
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
