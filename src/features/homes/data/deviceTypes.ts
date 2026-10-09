import type { ComponentProps } from "react";
import type { MaterialCommunityIcons } from "@expo/vector-icons";

import type { ApplianceTypeResponse, HomeDevice } from "@/services/devices";
import { signalPercent } from "@/services/devices";
import type { ApplianceType } from "./deviceChartColors";

export type MaterialIconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

/**
 * `appliance_type.name` del catálogo del backend (`device-006-seed-appliance-types`)
 * → clave de la UI. Son cosas distintas: el backend manda `refrigerator` y la
 * interfaz habla de "nevera". El `name` es además la clave de traducción en
 * `devices.applianceTypes.*`, así que el catálogo no se puede usar tal cual.
 */
const UI_TYPE_BY_BACKEND_NAME: Record<string, ApplianceType> = {
  refrigerator: "fridge",
  washing_machine: "washer",
  television: "tv",
  microwave: "microwave",
  air_conditioner: "ac",
  computer: "pc",
  water_heater: "waterHeater",
  lighting: "lighting",
  other: "other",
};

/** Nombre del catálogo del backend → clave de la UI. `other` si no se conoce. */
export const uiApplianceType = (backendName: string): ApplianceType =>
  UI_TYPE_BY_BACKEND_NAME[backendName] ?? "other";

/** `idApplianceType` → clave de la UI, para cuando solo se tiene el id. */
export const uiApplianceTypeById = (
  idApplianceType: string,
  catalog: ApplianceTypeResponse[],
): ApplianceType => {
  const name = catalog.find((type) => type.idApplianceType === idApplianceType)?.name;
  return name ? uiApplianceType(name) : "other";
};

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

/**
 * `idApplianceType` del seed (`device-006-seed-appliance-types`), usado cuando
 * `GET /appliance-types` no llega: son claves foráneas fijas, así que el
 * formulario sigue pudiendo enviar un id válido.
 */
const STATIC_APPLIANCE_TYPE_IDS: Record<ApplianceType, string> = {
  fridge: "appl000001",
  ac: "appl000002",
  lighting: "appl000003",
  washer: "appl000004",
  tv: "appl000005",
  microwave: "appl000006",
  pc: "appl000007",
  waterHeater: "appl000008",
  other: "appl000009",
};

/**
 * Clave de la UI → `idApplianceType`. Delega en el catálogo cuando está y cae al
 * seed cuando no, para que el formulario nunca se quede sin id que enviar.
 */
export function applianceTypeIdFor(
  type: ApplianceType,
  catalog: ApplianceTypeResponse[],
): string {
  const match = catalog.find(
    (entry) => uiApplianceTypeById(entry.idApplianceType, catalog) === type,
  );
  return match?.idApplianceType ?? STATIC_APPLIANCE_TYPE_IDS[type];
}

/**
 * Habitaciones que se ofrecen al vincular. Se guardan como clave en
 * `device.location` y se traducen al pintar; un texto libre se muestra tal cual,
 * porque el backend guarda ubicación como texto de 50 caracteres, no como clave.
 */
export const ROOM_KEYS = [
  "livingRoom",
  "kitchen",
  "laundryRoom",
  "bedroom",
  "garage",
  "other",
] as const;

export type RoomKey = (typeof ROOM_KEYS)[number];

const isRoomKey = (value: string | null | undefined): value is RoomKey =>
  !!value && (ROOM_KEYS as readonly string[]).includes(value);

/** `"online" | "checking" | "offline"` para pintar. */
export type DeviceConnectivity = "online" | "checking" | "offline";

/**
 * El módulo publica cada 60 s. Si pasa ese tiempo sin noticias se saltó un
 * envío: se muestra "comprobando" hasta que el backend confirme desconectado,
 * porque el broker se entera del corte más tarde.
 */
const CHECKING_AFTER_MS = 75_000;
const OFFLINE_AFTER_MS = 150_000;

/** Dispositivo con la forma que pintan las pestañas. */
export interface Device {
  id: string;
  code: string;
  name: string;
  applianceType: ApplianceType;
  applianceTypeId: string;
  /** Clave de habitación si el backend la guardó como clave; si no, texto libre. */
  roomKey: RoomKey | null;
  location: string;
  status: DeviceConnectivity;
  /** 0-100. */
  signal: number;
  lastSeen: string | null;
  /** kW actuales; `null` si el módulo no reporta. */
  consumption: number | null;
  /** kWh de hoy. */
  todayEnergy: number;
}

function connectivity(device: HomeDevice, now: number): DeviceConnectivity {
  if (device.status !== "ONLINE" || device.lastSeen == null) return "offline";
  const age = now - new Date(device.lastSeen).getTime();
  if (age >= OFFLINE_AFTER_MS) return "offline";
  if (age >= CHECKING_AFTER_MS) return "checking";
  return "online";
}

/**
 * Une el listado de dispositivos con el consumo del resumen: el endpoint de
 * dispositivos no trae potencia ni energía, y el resumen no trae ni nombre ni
 * estado de conexión. Cada uno tiene la mitad de la fila.
 *
 * @param usage por `deviceId`, tomado de `summary.devices`
 */
export function toDevice(
  device: HomeDevice,
  usage: { currentPower: number | null; todayEnergy: number } | undefined,
  now: number,
): Device {
  const status = connectivity(device, now);
  const location = device.location;
  const roomIsKey = isRoomKey(location);

  return {
    id: device.idDevice,
    code: device.deviceCode,
    name: device.name,
    applianceType: uiApplianceType(device.applianceType),
    applianceTypeId: device.applianceTypeId,
    roomKey: roomIsKey ? location : null,
    location: location ?? "",
    status,
    signal: status === "offline" ? 0 : signalPercent(device.signalStrength),
    lastSeen: device.lastSeen,
    consumption:
      status !== "offline" && usage?.currentPower != null
        ? Number((usage.currentPower / 1000).toFixed(3))
        : null,
    todayEnergy: usage?.todayEnergy ?? 0,
  };
}

/**
 * Los nombres de electrodomésticos y habitaciones están en el locale `devices`,
 * así que se resuelven con el `t` del componente que los muestra en vez de un
 * mapa de strings fijo.
 */
export const getApplianceLabel = (t: (key: string) => string, type: ApplianceType) =>
  t(`devices:applianceTypes.${type}`);

export const getRoomLabel = (t: (key: string) => string, room: RoomKey) =>
  t(`devices:rooms.${room}`);

/** Etiqueta de la ubicación: la clave traducida si lo es, o el texto tal cual. */
export const getLocationLabel = (
  t: (key: string) => string,
  device: Device,
): string =>
  device.roomKey ? getRoomLabel(t, device.roomKey) : device.location;