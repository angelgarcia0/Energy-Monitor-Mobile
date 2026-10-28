import { httpClient } from "@/services/http/httpClient";
import type { DeleteReadResult, Recommendation } from "./types";

/**
 * Cliente de recomendaciones.
 *
 * Igual que las alertas, la consulta es por hogar: quien las reúne en una sola
 * bandeja es `NotificationCenterContext`.
 */

const recommendation = (idRecommendation: string) =>
  `/recommendations/${encodeURIComponent(idRecommendation)}`;

/** `GET /recommendations?homeId=` */
export async function listRecommendations(
  homeId: string,
): Promise<Recommendation[]> {
  const { data } = await httpClient.get<Recommendation[]>("/recommendations", {
    params: { homeId },
  });
  return data;
}

/** `PUT /recommendations/{id}/read` */
export async function markRecommendationRead(
  idRecommendation: string,
): Promise<Recommendation> {
  const { data } = await httpClient.put<Recommendation>(
    `${recommendation(idRecommendation)}/read`,
  );
  return data;
}

/** `DELETE /recommendations/{id}` — solo recomendaciones ya leídas. */
export async function deleteRecommendation(
  idRecommendation: string,
): Promise<void> {
  await httpClient.delete(recommendation(idRecommendation));
}

/** `DELETE /recommendations?homeId=` — borra todas las leídas del hogar. */
export async function deleteReadRecommendations(
  homeId: string,
): Promise<DeleteReadResult> {
  const { data } = await httpClient.delete<DeleteReadResult>("/recommendations", {
    params: { homeId },
  });
  return data;
}