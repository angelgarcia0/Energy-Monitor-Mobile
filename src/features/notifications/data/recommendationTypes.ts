import type { Recommendation } from "@/services/recommendations";

/**
 * Recomendación en la forma que pinta la UI.
 *
 * El backend ya manda la clave del locale del cliente (`recommendation.peakHours`
 * y compañía), así que aquí no hay traducción de claves como en las alertas: la
 * clave se usa tal cual.
 */
export interface UiRecommendation {
  id: string;
  /** Clave bajo `notifications:` para título y mensaje. */
  key: string;
  home: string;
  homeId: string;
  /**
   * Nombre del equipo, o `null` cuando la recomendación es del hogar entero o
   * el equipo ya no existe. No es lo mismo que un nombre vacío: el mensaje usa
   * `recommendation.someDevice` en su lugar.
   */
  device: string | null;
  /** ISO-8601. */
  date: string;
  read: boolean;
}

/**
 * Backend → UI.
 *
 * @param homeName nombre del hogar, que aparece en todos los mensajes
 */
export function toUiRecommendation(
  recommendation: Recommendation,
  homeName: string,
): UiRecommendation {
  return {
    id: recommendation.idRecommendation,
    key: recommendation.messageKey,
    home: homeName,
    homeId: recommendation.homeId,
    device: recommendation.deviceName,
    date: recommendation.dateTime,
    read: recommendation.status === "READ",
  };
}