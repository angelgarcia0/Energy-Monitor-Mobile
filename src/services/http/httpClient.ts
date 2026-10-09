import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { API_BASE_URL } from "@/config/env";
import {
  clearSession,
  getSession,
  saveSession,
} from "@/services/auth/session";
import { normalizeError } from "./errors";

/**
 * Instancia HTTP única.
 * - Interceptor de request: añade Authorization en un solo lugar. El backend
 *   identifica al usuario por el `sub` del JWT; no se envía ninguna cabecera de id.
 * - Interceptor de response: renueva el access token (una sola vez a la vez)
 *   y traduce errores al modelo común.
 */
export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Endpoints públicos de autenticación: no llevan credenciales, porque una sesión
 * guardada que ya no vale (token vencido o cuenta borrada) haría fallar el registro
 * o el login con 401. Ahí un 401 significa "credenciales/código malos", no
 * "token vencido".
 */
const PUBLIC_AUTH =
  /\/auth\/(login|register|refresh|password\/(forgot|reset)|email\/(verify|verification\/resend))$/;

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

httpClient.interceptors.request.use((config) => {
  if (PUBLIC_AUTH.test(config.url ?? "")) return config;

  const token = getSession()?.accessToken;
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * La sesión se perdió y no se puede recuperar. Lo publica el guard de rutas para
 * llevar al login; el cliente HTTP no navega, para poder probarse sin router.
 */
type SessionExpiredListener = () => void;
const sessionExpiredListeners = new Set<SessionExpiredListener>();

export function onSessionExpired(listener: SessionExpiredListener): () => void {
  sessionExpiredListeners.add(listener);
  return () => {
    sessionExpiredListeners.delete(listener);
  };
}

function notifySessionExpired(): void {
  clearSession();
  sessionExpiredListeners.forEach((listener) => listener());
}

let refreshing: Promise<void> | null = null;

/**
 * Renueva los tokens. El refresh token rota y el backend revoca toda la familia
 * si se reutiliza uno ya gastado, así que: una sola llamada en curso y el token
 * se lee del almacenamiento justo antes de enviarlo.
 *
 * No hace falta el bloqueo entre pestañas de la Web: aquí solo hay un hilo de JS.
 *
 * @param staleAccess access token con el que falló la petición
 */
function refreshTokens(staleAccess?: string): Promise<void> {
  refreshing ??= (async () => {
    const current = getSession();
    if (!current?.refreshToken) throw new Error("sin sesión");

    // Otra petición ya renovó mientras esperábamos.
    if (staleAccess && current.accessToken !== staleAccess) return;

    const { data } = await axios.post<{
      accessToken: string;
      refreshToken: string;
    }>(`${API_BASE_URL}/auth/refresh`, {
      refreshToken: current.refreshToken,
    });

    // Si hubo logout mientras tanto, no resucitar la sesión.
    if (getSession()?.refreshToken !== current.refreshToken) return;

    saveSession({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  })().finally(() => {
    refreshing = null;
  });

  return refreshing;
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const { config, response } = error;
    const retriable = config as RetriableConfig | undefined;

    if (
      response?.status === 401 &&
      retriable &&
      !retriable._retry &&
      !PUBLIC_AUTH.test(retriable.url ?? "") &&
      getSession()?.refreshToken
    ) {
      retriable._retry = true;
      const stale = String(retriable.headers?.Authorization ?? "").replace(
        "Bearer ",
        "",
      );

      try {
        await refreshTokens(stale);
      } catch (refreshError) {
        // Sin respuesta (red caída) no se cierra la sesión: el token sigue siendo válido.
        const refreshAxios = refreshError as AxiosError;
        if (refreshAxios.response || (refreshError as Error).message === "sin sesión") {
          notifySessionExpired();
        }
        // Si el refresh respondió, el rechazo muestra el error original de la
        // petición; si no, el del refresh (que es una caída de red).
        return Promise.reject(
          normalizeError(refreshAxios.response ? error : refreshError),
        );
      }

      if (!getSession()) return Promise.reject(normalizeError(error));

      delete retriable.headers.Authorization; // el interceptor pone el nuevo
      return httpClient(retriable);
    }

    return Promise.reject(normalizeError(error));
  },
);