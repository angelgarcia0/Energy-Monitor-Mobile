import { httpClient } from "@/services/http/httpClient";
import type { Alert, AlertStatus, DeleteResolvedResult } from "./types";

/**
 * Cliente de alertas.
 *
 * Todas las consultas son por hogar: el backend no tiene bandeja global, así
 * que quien las reúne es `AlertsContext`.
 */

const alert = (idAlert: string) => `/alerts/${encodeURIComponent(idAlert)}`;

/** `GET /alerts?homeId=` — `status` es opcional y filtra en el servidor. */
export async function listAlerts(
  homeId: string,
  status?: AlertStatus,
): Promise<Alert[]> {
  const { data } = await httpClient.get<Alert[]>("/alerts", {
    params: { homeId, ...(status ? { status } : {}) },
  });
  return data;
}

/** `GET /alerts/{id}` */
export async function getAlert(idAlert: string): Promise<Alert> {
  const { data } = await httpClient.get<Alert>(alert(idAlert));
  return data;
}

/**
 * `PUT /alerts/{id}/read` — solo para avisos informativos (`DEVICE`): las
 * demás las resuelve el sistema solo y no se pueden marcar a mano.
 */
export async function markAlertRead(idAlert: string): Promise<Alert> {
  const { data } = await httpClient.put<Alert>(`${alert(idAlert)}/read`);
  return data;
}

/** `DELETE /alerts/{id}` — solo alertas ya resueltas o leídas. */
export async function deleteAlert(idAlert: string): Promise<void> {
  await httpClient.delete(alert(idAlert));
}

/** `DELETE /alerts?homeId=` — borra todas las resueltas o leídas del hogar. */
export async function deleteResolvedAlerts(
  homeId: string,
): Promise<DeleteResolvedResult> {
  const { data } = await httpClient.delete<DeleteResolvedResult>("/alerts", {
    params: { homeId },
  });
  return data;
}