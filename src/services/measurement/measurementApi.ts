import { httpClient } from "@/services/http/httpClient";
import type {
  ConsumptionPeriod,
  HomeConsumptionHistory,
  HomeConsumptionSummary,
} from "./types";

/**
 * Cliente de consumo de un hogar.
 *
 * En la web estas dos llamadas viven dentro del cliente de dispositivos
 * (`services/devices/deviceApi.js`); aquí van aparte porque solo consumen
 * mediciones y no necesitan el tipo de electrodoméstico de cada dispositivo.
 */

const home = (homeId: string) => `/homes/${encodeURIComponent(homeId)}`;

/**
 * Zona horaria del dispositivo: decide dónde empiezan "hoy" y "este mes", así
 * que mandarla mal desplaza los cortes un día. Si el runtime no puede
 * resolverla se usa UTC, que es el mismo valor por defecto del backend.
 */
export function deviceZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

/**
 * `GET /homes/{id}/consumption/summary` — potencia actual en W, kWh de hoy y del
 * mes, los límites del hogar y las últimas 24 horas.
 */
export async function getConsumptionSummary(
  homeId: string,
  zone: string = deviceZone(),
): Promise<HomeConsumptionSummary> {
  const { data } = await httpClient.get<HomeConsumptionSummary>(
    `${home(homeId)}/consumption/summary`,
    { params: { zone } },
  );
  return data;
}

/**
 * `GET /homes/{id}/consumption/history` — energía por bucket y el total del
 * periodo anterior para comparar.
 *
 * Los buckets vienen por dispositivo, no por electrodoméstico: sin
 * `GET /homes/{id}/devices` no hay forma de saber a qué tipo pertenece cada
 * `deviceId`.
 */
export async function getConsumptionHistory(
  homeId: string,
  period: ConsumptionPeriod,
  zone: string = deviceZone(),
): Promise<HomeConsumptionHistory> {
  const { data } = await httpClient.get<HomeConsumptionHistory>(
    `${home(homeId)}/consumption/history`,
    { params: { period, zone } },
  );
  return data;
}