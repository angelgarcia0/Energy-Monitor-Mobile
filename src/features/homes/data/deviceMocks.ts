import type { ComponentProps } from "react";
import type { MaterialCommunityIcons } from "@expo/vector-icons";

import type { ApplianceType } from "./deviceChartColors";

export type MaterialIconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export interface Device {
  id: number;
  applianceType: ApplianceType;
  roomKey: string;
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

export const APPLIANCE_LABEL: Record<ApplianceType, string> = {
  fridge: "Nevera",
  washer: "Lavadora",
  tv: "Televisor",
  microwave: "Microondas",
  ac: "Aire acondicionado",
  pc: "Computador",
  waterHeater: "Calentador de agua",
  lighting: "Iluminación",
  other: "Otro",
};

export const INITIAL_DEVICES: Device[] = [
  { id: 1, applianceType: "fridge", roomKey: "kitchen", status: "online", signal: 82, consumption: 0.42 },
  { id: 2, applianceType: "washer", roomKey: "laundryRoom", status: "online", signal: 95, consumption: 1.15 },
  { id: 3, applianceType: "pc", roomKey: "bedroom", status: "offline", signal: 0, consumption: null },
];
