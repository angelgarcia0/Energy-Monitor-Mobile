import { httpClient } from "@/services/http/httpClient";
import { ApiError } from "@/services/http/errors";
import type {
  PushDeviceAvailability,
  PushDeviceAvailabilityResponse,
  PushDeviceToken,
  RegisterPushDevice,
} from "./types";

/**
 * Endpoints de la instalación de este teléfono.
 *
 * Deliberadamente aparte de `notificationApi.ts`: aquellos son preferencias, que
 * son del servidor, y estos registran una dirección de entrega, que es del
 * dispositivo. Son cosas distintas con ciclos de vida distintos.
 */

/**
 * `POST /notifications/push/devices` — registra el token de esta instalación.
 *
 * Sin cuerpo de vuelta (204). Se vuelve a llamar en cada arranque con sesión:
 * por eso un token rotado se reinscribe solo y una instalación que cambió de
 * cuenta deja de pertenecer a la anterior. Es idempotente por token.
 */
export async function registerDevice(device: RegisterPushDevice): Promise<void> {
  await httpClient.post("/notifications/push/devices", device);
}

/**
 * `POST /notifications/push/devices/remove` — da de baja el token.
 *
 * `/remove` y no `DELETE`, para que sea gemelo exacto del alta y el backend
 * pueda tratarlos igual.
 *
 * El backend solo borra la fila si el token es de quien llama: un token ajeno
 * devuelve 204 y no hace nada, así que aquí no hace falta comprobar nada.
 */
export async function unregisterDevice(token: PushDeviceToken): Promise<void> {
  await httpClient.post("/notifications/push/devices/remove", { token });
}

/**
 * `GET /notifications/push/devices/available` — ¿puede el servidor entregar a
 * esta app ahora mismo?
 *
 * Responde 404 cuando no hay credencial del relay configurada. Eso no es un
 * error de la app, es una respuesta: el push de los teléfonos no está disponible
 * en ese despliegue, y la app debe dejar de pedir permisos en vez de pedir algo
 * que no va a llegar.
 */
export async function isAppPushAvailable(): Promise<PushDeviceAvailability> {
  try {
    const { data } = await httpClient.get<PushDeviceAvailabilityResponse>(
      "/notifications/push/devices/available",
    );
    return data.available;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return false;
    throw error;
  }
}