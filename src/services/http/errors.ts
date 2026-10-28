/**
 * Modelo de error común de los módulos de la API.
 *
 * Toda función del cliente de API resuelve con los datos o lanza un `ApiError`
 * con esta forma. El texto que se muestra al usuario NO viaja aquí: sale de i18n
 * con `errorMessageKey` (./errorMessages.ts). El cuerpo del backend se descarta.
 */
export class ApiError extends Error {
  /** HTTP status (null si no hubo respuesta). */
  readonly status: number | null;
  /** Segundos de espera pedidos por el servidor (429). */
  readonly retryAfter: number | null;

  constructor(status: number | null, message: string, retryAfter: number | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

interface AxiosLikeError {
  response?: {
    status?: number;
    headers?: Record<string, unknown>;
  };
  request?: unknown;
  code?: string;
  message?: string;
}

/** El backend fija Retry-After en 900 s; si no viene, se usa ese mismo valor. */
const FALLBACK_RETRY_AFTER_SECONDS = 900;

/**
 * Convierte cualquier error de axios/red en un `ApiError` consistente.
 * Solo conserva el status (y Retry-After en un 429).
 */
export function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (error && typeof error === "object") {
    const err = error as AxiosLikeError;

    if (err.response) {
      const status = err.response.status ?? null;

      if (status === 429) {
        const wait = Number(err.response.headers?.["retry-after"]);
        return new ApiError(
          429,
          "HTTP 429",
          wait > 0 ? wait : FALLBACK_RETRY_AFTER_SECONDS,
        );
      }
      return new ApiError(status, `HTTP ${status}`);
    }

    if (err.request || err.code === "ERR_NETWORK") {
      return new ApiError(null, "Network error");
    }
  }

  return new ApiError(null, "Unexpected error");
}