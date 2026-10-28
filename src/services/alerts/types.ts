/**
 * Contrato de alertas. Fuente de verdad: `alert/adapter/in/web/dto` y los
 * enums del dominio.
 */

/** `AlertType` del dominio. */
export type AlertType = "THRESHOLD" | "CONNECTIVITY" | "DEVICE" | "LIMIT";

/** `AlertStatus` del dominio. */
export type AlertStatus = "PENDING" | "RESOLVED";

/**
 * `GET /alerts`, `GET /alerts/{id}`, `PUT /alerts/{id}/read`
 *
 * El campo de estado se llama `alertStatus`, no `status`. `messageKey` es una
 * clave de i18n del servidor, no un texto: el cliente traduce, el backend nunca
 * manda prosa.
 */
export interface Alert {
  idAlert: string;
  homeId: string;
  deviceId: string | null;
  type: AlertType;
  /**
   * `alert.threshold.high`, `alert.threshold.critical`,
   * `alert.connectivity.offline`, `alert.device.linked`,
   * `alert.limit.daily`, `alert.limit.monthly`.
   */
  messageKey: string;
  /** ISO-8601. */
  dateTime: string;
  alertStatus: AlertStatus;
  consumptionLevelId: string | null;
  measurementId: string | null;
}

/** `DELETE /alerts?homeId=` → `{ "deleted": n }` */
export interface DeleteResolvedResult {
  deleted: number;
}