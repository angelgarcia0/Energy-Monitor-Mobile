/**
 * Traduce un error de la API a una clave de i18n (namespace `errors`).
 *
 * El backend no devuelve códigos estables, solo status y un texto en inglés, así
 * que el mapeo es por operación + status. El texto del servidor (`message`,
 * `error`, `detail`) nunca se usa, ni siquiera como último recurso.
 *
 * Orden: clave de la operación para ese status → sin conexión → `default` de la
 * operación → genérica por status.
 */

/** Operaciones con clave propia. `default` cubre cualquier otro status. */
export type ApiOperation =
  | "login"
  | "googleLogin"
  | "register"
  | "emailVerify"
  | "emailResend"
  | "passwordForgot"
  | "passwordReset"
  | "passwordChange"
  | "accountDelete"
  | "accountUpdate"
  | "homeCreate"
  | "homeJoin"
  | "homeLeave"
  | "memberRemove"
  | "ownershipTransfer"
  | "thresholdsUpdate"
  | "deviceLink"
  | "deviceUnlink"
  | "deviceEdit"
  | "deviceReconnect";

/** Claves por status de una operación; `default` cubre cualquier otro status. */
type OperationStatuses = Partial<Record<number, string>> & { default?: string };

const OPERATIONS: Partial<Record<ApiOperation, OperationStatuses>> = {
  login: { 401: "login.invalidCredentials", 403: "login.inactive" },
  googleLogin: {
    401: "googleLogin.rejected",
    403: "login.inactive",
    409: "googleLogin.emailTaken",
    503: "googleLogin.unavailable",
  },
  register: { 409: "register.emailTaken", 422: "password.policy" },
  emailVerify: { 400: "emailVerify.invalidCode", 429: "generic.rateLimited" },
  emailResend: { 429: "generic.rateLimited" },
  passwordForgot: { 429: "generic.rateLimited" },
  passwordReset: {
    400: "passwordReset.invalidToken",
    422: "password.policy",
    default: "passwordReset.failed",
  },
  passwordChange: {
    401: "passwordChange.wrongCurrent",
    422: "password.policy",
    default: "passwordChange.failed",
  },
  accountDelete: {
    401: "accountDelete.wrongPassword",
    409: "accountDelete.lastOwner",
    default: "accountDelete.failed",
  },
  accountUpdate: {
    400: "accountUpdate.invalid",
    409: "accountUpdate.emailTaken",
    default: "accountUpdate.failed",
  },
  homeCreate: { 404: "homeCreate.typeNotFound", 409: "homeCreate.codeCollision" },
  homeJoin: { 404: "homeJoin.codeNotFound", 409: "homeJoin.alreadyMember" },
  homeLeave: { 404: "homeLeave.notMember", 409: "homeLeave.lastOwner" },
  memberRemove: {
    403: "memberRemove.notOwner",
    404: "memberRemove.notFound",
    409: "memberRemove.isOwner",
  },
  ownershipTransfer: {
    403: "ownershipTransfer.notOwner",
    404: "ownershipTransfer.notMember",
    409: "ownershipTransfer.alreadyOwner",
    default: "ownershipTransfer.failed",
  },
  thresholdsUpdate: { 400: "thresholdsUpdate.invalid", 403: "thresholdsUpdate.notOwner" },
  deviceLink: {
    403: "deviceLink.notOwner",
    409: "deviceLink.otherHome",
    default: "deviceLink.failed",
  },
  deviceUnlink: { 403: "deviceUnlink.notOwner", default: "deviceUnlink.failed" },
  deviceEdit: { 403: "deviceEdit.notOwner", default: "deviceEdit.failed" },
  deviceReconnect: {
    403: "deviceReconnect.notOwner",
    default: "deviceReconnect.failed",
  },
};

const GENERIC: Record<number, string> = {
  400: "generic.badRequest",
  401: "generic.unauthorized",
  403: "generic.forbidden",
  404: "generic.notFound",
  405: "generic.badRequest",
  409: "generic.conflict",
  422: "generic.badRequest",
  429: "generic.rateLimited",
};

/** Status del error: ApiError (`status`) o error crudo de axios (`response.status`). */
function statusOf(error: unknown): number | null {
  const err = error as { status?: unknown; response?: { status?: number } } | null;
  if (err?.response) return err.response.status ?? null;
  return typeof err?.status === "number" ? err.status : null;
}

export function errorMessageKey(error: unknown, operation?: ApiOperation): string {
  const status = statusOf(error);
  const specific = (operation && OPERATIONS[operation]) ?? {};
  const key =
    (status != null && specific[status]) ||
    (status == null && "generic.network") ||
    specific.default ||
    (status != null ? GENERIC[status] : undefined) ||
    "generic.server";
  return `errors:${key}`;
}

/** Valores de interpolación para la clave (minutos de espera en un 429). */
export function errorMessageValues(error: unknown): { minutes: number } {
  const seconds =
    (error as { retryAfter?: number } | null)?.retryAfter ?? 900;
  return { minutes: Math.ceil(seconds / 60) };
}

/** Texto traducido del error, listo para mostrar. */
export const errorMessage = (
  t: (key: string, values?: Record<string, unknown>) => string,
  error: unknown,
  operation?: ApiOperation,
): string => t(errorMessageKey(error, operation), errorMessageValues(error));