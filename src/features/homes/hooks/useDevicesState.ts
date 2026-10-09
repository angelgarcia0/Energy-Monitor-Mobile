import { useCallback, useEffect, useMemo, useState } from "react";

import type { ApiError } from "@/services/http";
import {
  deviceApi,
  type ApplianceTypeResponse,
  type HomeDevice,
  type LinkDeviceRequest,
  type UpdateDeviceRequest,
} from "@/services/devices";
import type { HomeConsumptionSummary } from "@/services/measurement";
import { toDevice, type Device } from "../data/deviceTypes";
import { useIsAppActive } from "./useIsAppActive";

/** Dispositivos: estado ligero, casi en tiempo real. */
const DEVICES_REFRESH_MS = 5000;

export interface DevicesState {
  devices: Device[];
  /** `GET /appliance-types`, sin ordenar. */
  catalog: ApplianceTypeResponse[];
  loading: boolean;
  error: ApiError | null;
  reload: () => Promise<void>;
  /** `null` si se vinculó, o el `ApiError` si falló. */
  linkDevice: (request: LinkDeviceRequest) => Promise<ApiError | null>;
  unlinkDevice: (deviceId: string) => Promise<ApiError | null>;
  updateDevice: (
    deviceId: string,
    request: UpdateDeviceRequest,
  ) => Promise<ApiError | null>;
}

/**
 * Dispositivos del hogar con su consumo.
 *
 * El resumen lo recibe la pantalla en vez de pedirlo otra vez: el endpoint de
 * dispositivos no trae potencia, y el de consumo no trae nombre ni estado de
 * conexión, así que la fila se arma con los dos. Pedirlo aquí duplicaría la
 * petición en cada pantalla.
 */
export function useDevicesState(
  homeId: string,
  summary: HomeConsumptionSummary | null,
): DevicesState {
  const isActive = useIsAppActive();
  const [list, setList] = useState<HomeDevice[]>([]);
  const [catalog, setCatalog] = useState<ApplianceTypeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  // Hora de la última consulta: con ella se calcula "comprobando" sin leer el
  // reloj en cada render.
  const [now, setNow] = useState(() => Date.now());

  const loadDevices = useCallback(async () => {
    const devices = await deviceApi.listHomeDevices(homeId);
    setList(devices);
    setNow(Date.now());
    return devices;
  }, [homeId]);

  const loadCatalog = useCallback(async () => {
    try {
      setCatalog(await deviceApi.listApplianceTypes());
    } catch {
      // El catálogo es una ayuda para el formulario: si no llega, los tipos
      // conocidos se resuelven igual contra el catálogo estático.
    }
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([loadDevices(), loadCatalog()]);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [loadDevices, loadCatalog]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos estándar
    void reload();
  }, [reload]);

  // El estado de conexión se jubila por sí solo: si nadie pregunta, un
  // dispositivo que se cayó sigue marcado "online" para siempre.
  useEffect(() => {
    if (!isActive) return;
    const timer = setInterval(() => setNow(Date.now()), DEVICES_REFRESH_MS);
    return () => clearInterval(timer);
  }, [isActive]);

  const devices = useMemo(() => {
    const usage = new Map(
      (summary?.devices ?? []).map((entry) => [entry.deviceId, entry]),
    );
    return list.map((device) => toDevice(device, usage.get(device.idDevice), now));
  }, [list, summary, now]);

  const linkDevice = useCallback(
    async (request: LinkDeviceRequest) => {
      try {
        await deviceApi.linkDevice(homeId, request);
        await loadDevices();
        return null;
      } catch (err) {
        return err as ApiError;
      }
    },
    [homeId, loadDevices],
  );

  const unlinkDevice = useCallback(
    async (deviceId: string) => {
      try {
        await deviceApi.unlinkDevice(homeId, deviceId);
        setList((prev) => prev.filter((device) => device.idDevice !== deviceId));
        return null;
      } catch (err) {
        return err as ApiError;
      }
    },
    [homeId],
  );

  const updateDevice = useCallback(
    async (deviceId: string, request: UpdateDeviceRequest) => {
      try {
        const updated = await deviceApi.updateDevice(homeId, deviceId, request);
        setList((prev) =>
          prev.map((device) => (device.idDevice === deviceId ? updated : device)),
        );
        return null;
      } catch (err) {
        return err as ApiError;
      }
    },
    [homeId],
  );

  return {
    devices,
    catalog,
    loading,
    error,
    reload,
    linkDevice,
    unlinkDevice,
    updateDevice,
  };
}