/**
 * Contrato del módulo home.
 *
 * La fuente de verdad son los DTO del backend (`home/adapter/in/web`), no los
 * typedef de la Web: allí `UserHome` no tiene los datos de persona y
 * `HomeThresholds` todavía describe el par diario/mensual, cuando el endpoint
 * ya recibe un solo periodo (ver `UpdateThresholdsRequest`).
 */

/** `Role` del dominio. El backend lo devuelve en mayúsculas, sin traducir. */
export type Role = "OWNER" | "MEMBER";

/** Periodo del límite que fijó el dueño; el otro se deriva en el backend. */
export type LimitPeriod = "DAILY" | "MONTHLY";

/** `POST /homes` — el hogar recién creado. Sin rol ni favorito. */
export interface HomeResponse {
  idHome: string;
  name: string;
  homeTypeId: string;
  address: string;
  accessCode: string;
  description: string | null;
  creationDate: string;
}

/**
 * Elemento de `GET /homes`: el hogar más la membresía del usuario que pregunta.
 * Los tres campos `userResponsible*` vienen null si el hogar quedó sin dueño
 * visible para este usuario.
 */
export interface HomeMembership extends HomeResponse {
  role: Role;
  favorite: boolean;
  userResponsible: string | null;
  userResponsibleLastName: string | null;
  userResponsibleEmail: string | null;
}

/**
 * Un miembro. Es la respuesta de `GET /homes/{id}/members` y también la de
 * `join` y `favorite`, que devuelven la membresía afectada.
 */
export interface UserHome {
  userId: string;
  homeId: string;
  role: Role;
  favorite: boolean;
  name: string | null;
  lastName: string | null;
  email: string | null;
}

/**
 * `GET` y `PUT /homes/{id}/thresholds`.
 *
 * El backend guarda un único límite y deriva el otro a 30 días
 * (`HomeThresholds.setLimit`), así que `dailyLimit` y `monthlyLimit` siempre
 * llegan coherentes entre sí.
 */
export interface HomeThresholds {
  idThreshold: string;
  homeId: string;
  dailyLimit: number;
  monthlyLimit: number;
  useSystemDefault: boolean;
  limitPeriod: LimitPeriod;
}

/** `GET /home-types`. `idHomeType` no es el nombre: ver `homeTypes.ts`. */
export interface HomeType {
  idHomeType: string;
  name: string;
}

export interface CreateHomeRequest {
  name: string;
  homeTypeId: string;
  address: string;
  description?: string;
}

export interface JoinHomeRequest {
  accessCode: string;
}

/**
 * `PUT /homes/{id}/thresholds` no recibe el par: recibe el periodo que se está
 * fijando y su valor. Mandar `dailyLimit`/`monthlyLimit` da 400.
 */
export interface UpdateThresholdsRequest {
  limitPeriod: LimitPeriod;
  limit: number;
}