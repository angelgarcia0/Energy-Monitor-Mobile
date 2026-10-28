import { httpClient } from "@/services/http/httpClient";
import type { ActivityNotification } from "./types";

/**
 * Actividad de la cuenta, los hogares y los dispositivos del usuario. A
 * diferencia de alertas y recomendaciones es una sola bandeja por usuario: no
 * hace falta pedirla hogar por hogar.
 */

/** `GET /notifications/activity` — toda, o la de un hogar con `homeId`. */
export async function listActivity(homeId?: string): Promise<ActivityNotification[]> {
  const { data } = await httpClient.get<ActivityNotification[]>("/notifications/activity", {
    params: homeId ? { homeId } : undefined,
  });
  return data;
}

/** `PUT /notifications/activity/{id}/read`. */
export async function markActivityRead(id: string): Promise<void> {
  await httpClient.put(`/notifications/activity/${encodeURIComponent(id)}/read`);
}

/**
 * `PUT /notifications/activity/read` — todas las sin leer, o las de un hogar.
 * Devuelve cuántas marcó.
 */
export async function markAllActivityRead(homeId?: string): Promise<number> {
  const { data } = await httpClient.put<{ read: number }>("/notifications/activity/read", null, {
    params: homeId ? { homeId } : undefined,
  });
  return data.read;
}

/** `DELETE /notifications/activity/{id}`. */
export async function deleteActivity(id: string): Promise<void> {
  await httpClient.delete(`/notifications/activity/${encodeURIComponent(id)}`);
}
