import { httpClient } from "@/services/http/httpClient";
import type {
  NotificationPreferences,
  UpdateNotificationPreferences,
} from "./types";

/**
 * Preferencias de los canales por los que el usuario recibe sus alertas.
 *
 * `/notifications/push/*` queda fuera a propósito: son la suscripción VAPID de
 * cada navegador. Un teléfono no se suscribe ahí, y sin una clave pública no
 * hay nada que registrar.
 */

/** `GET /notifications/preferences` — no lleva `homeId`: es por usuario. */
export async function getPreferences(): Promise<NotificationPreferences> {
  const { data } = await httpClient.get<NotificationPreferences>(
    "/notifications/preferences",
  );
  return data;
}

/**
 * `PUT /notifications/preferences` — devuelve las preferencias ya guardadas,
 * no un acknowledgment, así que la respuesta es la que manda y no lo que se
 * pidió. Ambos campos son obligatorios: enviar uno solo es un 400.
 */
export async function updatePreferences(
  preferences: UpdateNotificationPreferences,
): Promise<NotificationPreferences> {
  const { data } = await httpClient.put<NotificationPreferences>(
    "/notifications/preferences",
    preferences,
  );
  return data;
}