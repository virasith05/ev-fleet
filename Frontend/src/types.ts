export type EvStatus = "IDLE" | "DRIVING" | "CHARGING" | "MAINTENANCE";

export interface Ev {
  id: number;
  registration: string;
  model: string;
  batteryCapacityKWh: number;
  currentBatteryPercent: number;
  status: EvStatus;
  lastKnownLatitude?: number | null;
  lastKnownLongitude?: number | null;
  lastSeenAt?: string | null;
}

export type ChargerStatus = "AVAILABLE" | "IN_USE" | "FAULTY";

export interface Charger {
  id: number;
  locationName: string;
  maxPowerKW: number;
  status: ChargerStatus;
}

export interface Driver {
  id: number;
  name: string;
  phone: string;
  licenseId: string;
  active: boolean;
}

export type TripStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface Trip {
  id: number;
  ev: Ev;
  driver: Driver;
  startTime: string;
  endTime?: string | null;
  status: TripStatus;
  origin?: string | null;
  destination?: string | null;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface AtRiskVehicle {
  evId: number;
  registration: string;
  currentBatteryPercent: number;
  lastSeenAt?: string | null;
  tripId: number;
  tripStartTime: string;
  tripOrigin?: string | null;
  tripDestination?: string | null;
}
