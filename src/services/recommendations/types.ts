/**
 * Contrato de recomendaciones. Fuente de verdad:
 * `recommendation/adapter/in/web/dto` y los enums del dominio.
 */

/** `RecommendationType` del dominio. */
export type RecommendationType =
  | "SAVING"
  | "PEAK_HOURS"
  | "HIGH_CONSUMPTION"
  | "HISTORICAL_COMPARISON"
  | "THRESHOLD";

/** `RecommendationStatus` del dominio. */
export type RecommendationStatus = "READ" | "UNREAD";

/**
 * `GET /recommendations`, `PUT /recommendations/{id}/read`
 *
 * No hay `GET /recommendations/{id}`: la ruta solo admite PUT y DELETE, así que
 * responder a un GET con 405 es lo correcto y no falta nada.
 *
 * El campo de estado se llama `status`, a diferencia de las alertas, donde es
 * `alertStatus`.
 */
export interface Recommendation {
  idRecommendation: string;
  homeId: string;
  /** `null` en las recomendaciones del hogar entero, no de un equipo. */
  deviceId: string | null;
  /**
   * Nombre del equipo, resuelto al leer. Es `null` cuando `deviceId` es `null`
   * y también cuando el equipo ya no existe, así que un `deviceId` presente no
   * garantiza un nombre.
   */
  deviceName: string | null;
  type: RecommendationType;
  /**
   * Clave de i18n, ya con el prefijo del locale del cliente:
   * `recommendation.peakHours`, `recommendation.standby`,
   * `recommendation.aboveAverage`, `recommendation.limitProjection`,
   * `recommendation.deviceIncrease`.
   *
   * No se deduce del tipo: `SAVING` produce `standby`, y no `saving`.
   */
  messageKey: string;
  /** ISO-8601. */
  dateTime: string;
  status: RecommendationStatus;
}

/** `DELETE /recommendations?homeId=` → `{ "deleted": n }` */
export interface DeleteReadResult {
  deleted: number;
}