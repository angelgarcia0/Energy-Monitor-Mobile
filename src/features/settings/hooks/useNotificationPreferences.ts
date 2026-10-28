import { useCallback, useEffect, useState } from "react";

import { notificationApi } from "@/services/notifications";
import type {
  NotificationPreferences,
  UpdateNotificationPreferences,
} from "@/services/notifications";
import type { ApiError } from "@/services/http";

/**
 * Preferencias de canales de notificación.
 *
 * No es un contexto: solo las lee la pantalla de ajustes, y por eso no se
 * consulta al montar la app. La Web las mantiene en un provider porque ahí el
 * badge del menú necesita saber si hay canales activos; el móvil no consulta eso
 * en ninguna otra pantalla.
 */
export interface NotificationPreferencesState {
  preferences: NotificationPreferences | null;
  loading: boolean;
  /** Error de la carga inicial o del último guardado. */
  error: ApiError | null;
  reload: () => void;
  /**
   * Guarda y devuelve el error, o `null` si se guardó. No lanza, para que quien
   * llama pueda poner el mensaje en su sitio.
   */
  save: (
    next: UpdateNotificationPreferences,
  ) => Promise<ApiError | null>;
  /** Interruptor en curso, para bloquear solo esa fila. */
  pending: keyof UpdateNotificationPreferences | null;
}

export function useNotificationPreferences(): NotificationPreferencesState {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [pending, setPending] = useState<keyof UpdateNotificationPreferences | null>(
    null,
  );
  // Igual que en la bandeja: un cambio de referencia dispara la recarga.
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let active = true;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos estándar
    setLoading(true);
    notificationApi
      .getPreferences()
      .then((loaded) => {
        if (!active) return;
        setPreferences(loaded);
        setError(null);
      })
      .catch((err: unknown) => {
        if (active) setError(err as ApiError);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [nonce]);

  const reload = useCallback(() => {
    setNonce((n) => n + 1);
  }, []);

  const save = useCallback(async (next: UpdateNotificationPreferences) => {
    const changed = (Object.keys(next) as (keyof UpdateNotificationPreferences)[]).find(
      (key) => next[key] !== preferences?.[key],
    );
    setPending(changed ?? null);
    try {
      // La respuesta es lo que queda guardado, no lo que se pidió: si el
      // servidor normalizara algo, manda su versión.
      const saved = await notificationApi.updatePreferences(next);
      setPreferences(saved);
      setError(null);
      return null;
    } catch (err) {
      setError(err as ApiError);
      return err as ApiError;
    } finally {
      setPending(null);
    }
  }, [preferences]);

  return { preferences, loading, error, reload, save, pending };
}