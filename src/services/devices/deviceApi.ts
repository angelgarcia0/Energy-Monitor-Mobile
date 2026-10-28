import { httpClient } from "@/services/http/httpClient";
import type {
  ApplianceTypeResponse,
  HomeDevice,
  LinkDeviceRequest,
  LinkDeviceResponse,
  UpdateDeviceRequest,
} from "./types";

/**
 * Cliente de dispositivos de un hogar.
 *
 * No incluye el alta por Bluetooth: eso vive en el módulo nativo del teléfono
 * (el paso de escaneo de redes no existe en iOS, donde ninguna app puede leer el
 * SSID). Aquí quedan las llamadas HTTP, que son las que registran y desbloquean
 * el dispositivo en el backend.
 */

const home = (homeId: string) => `/homes/${encodeURIComponent(homeId)}`;
const device = (homeId: string, deviceId: string) =>
  `${home(homeId)}/devices/${encodeURIComponent(deviceId)}`;

/** `GET /appliance-types` — catálogo. El backend no garantiza orden. */
export async function listApplianceTypes(): Promise<ApplianceTypeResponse[]> {
  const { data } = await httpClient.get<ApplianceTypeResponse[]>(
    "/appliance-types",
  );
  return data;
}

/** `GET /homes/{id}/devices` — dispositivos con su conectividad. */
export async function listHomeDevices(homeId: string): Promise<HomeDevice[]> {
  const { data } = await httpClient.get<HomeDevice[]>(`${home(homeId)}/devices`);
  return data;
}

/**
 * `POST /homes/{id}/devices` — vincula un módulo (solo el dueño).
 * La respuesta trae `apiKey` y `broker`, que se escriben al módulo por
 * Bluetooth y no se vuelven a mostrar.
 */
export async function linkDevice(
  homeId: string,
  request: LinkDeviceRequest,
): Promise<LinkDeviceResponse> {
  const { data } = await httpClient.post<LinkDeviceResponse>(
    `${home(homeId)}/devices`,
    request,
  );
  return data;
}

/** `PUT /homes/{id}/devices/{deviceId}` — tipo, nombre o ubicación. */
export async function updateDevice(
  homeId: string,
  deviceId: string,
  request: UpdateDeviceRequest,
): Promise<HomeDevice> {
  const { data } = await httpClient.put<HomeDevice>(
    device(homeId, deviceId),
    request,
  );
  return data;
}

/**
 * `POST /homes/{id}/devices/{deviceId}/credentials` — api key y broker nuevos
 * para un módulo ya vinculado, para escribirlo por Bluetooth junto a otra red.
 * La key anterior deja de valer y no cuenta como una vinculación nueva.
 */
export async function reissueCredentials(
  homeId: string,
  deviceId: string,
): Promise<LinkDeviceResponse> {
  const { data } = await httpClient.post<LinkDeviceResponse>(
    `${device(homeId, deviceId)}/credentials`,
  );
  return data;
}

/** `DELETE /homes/{id}/devices/{deviceId}` — desvincular (solo el dueño). */
export async function unlinkDevice(
  homeId: string,
  deviceId: string,
): Promise<void> {
  await httpClient.delete(device(homeId, deviceId));
}

/** dBm → porcentaje aproximado de señal (−100 dBm = 0 %, −50 dBm = 100 %). */
export function signalPercent(dbm: number | null): number {
  if (dbm == null) return 0;
  return Math.max(0, Math.min(100, 2 * (dbm + 100)));
}