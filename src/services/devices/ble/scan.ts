import type { Device } from "react-native-ble-plx";

import { ensureBlePermissions } from "./permissions";
import { getManager } from "./moduleSession";
import { BLE_NAME_PREFIX, SERVICE_UUID } from "./protocol";

/** Un módulo visto en el escaneo, antes de conectarse. */
export interface DiscoveredModule {
  id: string;
  /** Lo que anuncia el BLE; a veces es `null` si el móvil no lo expone. */
  name: string | null;
  rssi: number;
}

/** Motivos por los que el escaneo puede acabar sin módulos. */
export type ScanOutcome =
  | { status: "ok"; modules: DiscoveredModule[] }
  | { status: "permissionDenied" }
  | { status: "bluetoothOff" }
  | { status: "unsupported" }
  | { status: "error"; message: string };

/**
 * Busca módulos EnergyMonitor cercanos.
 *
 * A diferencia de los navegadores, aquí no hay un selector de dispositivos: el
 * móvil escanea y devuelve la lista. Por eso se filtra por servicio GATT, que es
 * lo único que el módulo publica de forma fiable.
 */
export async function scanForModules(timeoutMs = 8_000): Promise<ScanOutcome> {
  const ble = getManager();

  if (!(await ensureBlePermissions())) {
    return { status: "permissionDenied" };
  }

  const powerState = await ble.state();
  if (powerState === "PoweredOff" || powerState === "Unauthorized") {
    return { status: "bluetoothOff" };
  }
  if (powerState === "Unsupported") {
    return { status: "unsupported" };
  }

  const found = new Map<string, DiscoveredModule>();

  return new Promise<ScanOutcome>((resolve) => {
    const timer = setTimeout(async () => {
      await ble.stopDeviceScan();
      resolve({ status: "ok", modules: [...found.values()] });
    }, timeoutMs);

    ble.startDeviceScan(
      [SERVICE_UUID],
      { allowDuplicates: true },
      (error, scanned: Device | null) => {
        if (error) {
          clearTimeout(timer);
          void ble.stopDeviceScan();
          resolve({ status: "error", message: error.message });
          return;
        }
        // El callback llega con `device: null` cuando termina el escaneo.
        if (!scanned) return;

        // El nombre solo viene en el paquete de advertising si el móvil lo
        // expone; cuando no, se identifica igual por el servicio GATT.
        const name = scanned.name ?? scanned.localName ?? null;
        if (name && !name.startsWith(BLE_NAME_PREFIX)) return;

        found.set(scanned.id, {
          id: scanned.id,
          name,
          rssi: scanned.rssi ?? -100,
        });
      },
    );
  });
}