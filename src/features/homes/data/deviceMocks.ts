import type { ComponentProps } from "react";
import type { MaterialCommunityIcons } from "@expo/vector-icons";

import type { ApplianceType } from "./deviceChartColors";

export type MaterialIconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export type RoomKey =
  | "livingRoom"
  | "kitchen"
  | "bedroom"
  | "garage"
  | "laundryRoom"
  | "other";

export interface Device {
  id: number;
  name?: string;
  applianceType: ApplianceType;
  roomKey: RoomKey;
  status: "online" | "offline";
  signal: number;
  consumption: number | null;
}

export const APPLIANCE_ICON: Record<ApplianceType, MaterialIconName> = {
  fridge: "fridge-outline",
  washer: "washing-machine",
  tv: "television",
  microwave: "microwave",
  ac: "air-conditioner",
  pc: "monitor",
  waterHeater: "water-boiler",
  lighting: "lightbulb-outline",
  other: "power-plug-outline",
};

export const APPLIANCE_TYPE_IDS = Object.keys(APPLIANCE_ICON) as ApplianceType[];

export const ROOM_KEYS: RoomKey[] = [
  "livingRoom",
  "kitchen",
  "bedroom",
  "garage",
  "laundryRoom",
  "other",
];

/**
 * Los nombres de electrodomésticos y habitaciones están en el locale
 * `devices`, así que se resuelven con el `t` del componente que los muestra en
 * vez de un mapa de strings fijo.
 */
export const getApplianceLabel = (t: (key: string) => string, type: ApplianceType) =>
  t(`devices:applianceTypes.${type}`);

export const getRoomLabel = (t: (key: string) => string, room: RoomKey) =>
  t(`devices:rooms.${room}`);

export const INITIAL_DEVICES: Device[] = [
  { id: 1, applianceType: "fridge", roomKey: "kitchen", status: "online", signal: 82, consumption: 0.42 },
  { id: 2, applianceType: "washer", roomKey: "laundryRoom", status: "online", signal: 95, consumption: 1.15 },
  { id: 3, applianceType: "pc", roomKey: "bedroom", status: "offline", signal: 0, consumption: null },
];
