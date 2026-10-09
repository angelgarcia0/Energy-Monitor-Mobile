import { httpClient } from "@/services/http/httpClient";
import type {
  CreateHomeRequest,
  HomeMembership,
  HomeResponse,
  HomeThresholds,
  HomeType,
  JoinHomeRequest,
  UpdateThresholdsRequest,
  UserHome,
} from "./types";

/**
 * Cliente de API del módulo home. Ningún componente lo llama directamente:
 * todo pasa por `HomeContext`.
 *
 * Los ids viajan en la URL, así que se codifican: un id mal formado no puede
 * cambiar la ruta que se consulta.
 */

/** `POST /homes` — el dueño del hogar nuevo es quien lo crea. */
export async function createHome(
  request: CreateHomeRequest,
): Promise<HomeResponse> {
  const { data } = await httpClient.post<HomeResponse>("/homes", request);
  return data;
}

/** `GET /homes` — los hogares del usuario con su rol y su favorito. */
export async function listHomes(): Promise<HomeMembership[]> {
  const { data } = await httpClient.get<HomeMembership[]>("/homes");
  return data;
}

/** `POST /homes/join` — entra por código de acceso; responde 201 o 409. */
export async function joinHome(request: JoinHomeRequest): Promise<UserHome> {
  const { data } = await httpClient.post<UserHome>("/homes/join", request);
  return data;
}

/**
 * `PUT /homes/{id}/favorite` — alterna el favorito. Devuelve la membresía con
 * el valor ya cambiado, para no tener que adivinarlo en el cliente.
 */
export async function toggleFavorite(homeId: string): Promise<UserHome> {
  const { data } = await httpClient.put<UserHome>(
    `/homes/${encodeURIComponent(homeId)}/favorite`,
  );
  return data;
}

/** `DELETE /homes/{id}/members/{userId}` — solo el dueño; responde 204. */
export async function removeMember(
  homeId: string,
  userId: string,
): Promise<void> {
  await httpClient.delete(
    `/homes/${encodeURIComponent(homeId)}/members/${encodeURIComponent(userId)}`,
  );
}

/** `GET /homes/{id}/members` */
export async function listMembers(homeId: string): Promise<UserHome[]> {
  const { data } = await httpClient.get<UserHome[]>(
    `/homes/${encodeURIComponent(homeId)}/members`,
  );
  return data;
}

/** `DELETE /homes/{id}/members/me` — salir del hogar; 409 si eres el único dueño. */
export async function leaveHome(homeId: string): Promise<void> {
  await httpClient.delete(`/homes/${encodeURIComponent(homeId)}/members/me`);
}

/** `GET /homes/{id}/thresholds` */
export async function getThresholds(homeId: string): Promise<HomeThresholds> {
  const { data } = await httpClient.get<HomeThresholds>(
    `/homes/${encodeURIComponent(homeId)}/thresholds`,
  );
  return data;
}

/**
 * `PUT /homes/{id}/thresholds` — el dueño fija un límite y el backend deriva el
 * otro. No hay forma de volver a los valores del sistema: `resetToDefaults`
 * existe en el dominio pero ningún endpoint lo expone (ver `HomeController`).
 */
export async function updateThresholds(
  homeId: string,
  request: UpdateThresholdsRequest,
): Promise<HomeThresholds> {
  const { data } = await httpClient.put<HomeThresholds>(
    `/homes/${encodeURIComponent(homeId)}/thresholds`,
    request,
  );
  return data;
}

/** `GET /home-types` — el backend no garantiza orden. */
export async function listHomeTypes(): Promise<HomeType[]> {
  const { data } = await httpClient.get<HomeType[]>("/home-types");
  return data;
}

/** `GET /home-types/{id}` */
export async function getHomeType(idHomeType: string): Promise<HomeType> {
  const { data } = await httpClient.get<HomeType>(
    `/home-types/${encodeURIComponent(idHomeType)}`,
  );
  return data;
}