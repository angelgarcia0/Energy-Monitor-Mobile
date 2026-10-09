import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useHomes } from "@/context/HomeContext";
import { alertApi } from "@/services/alerts";
import type { ApiError } from "@/services/http";
import { useIsAppActive } from "@/features/homes/hooks/useIsAppActive";
import { toUiAlert, type UiAlert } from "@/features/notifications/data/alertTypes";

/** La Web consulta cada 30 s; aquí igual, y se detiene en segundo plano. */
const POLL_MS = 30_000;

/**
 * Bandeja de alertas de todos los hogares del usuario.
 *
 * El backend no tiene bandeja global: cada alerta pertenece a un hogar, así que
 * se consulta uno por uno y se unen. La comparte la pantalla de notificaciones y
 * la insignia del sidebar, para que el contador no requiera una segunda carga.
 */
export interface AlertsContextValue {
  alerts: UiAlert[];
  loading: boolean;
  error: ApiError | null;
  reload: () => void;
  /** Avisos informativos: "marcar como leída". */
  markRead: (id: string) => Promise<ApiError | null>;
  /** Una alerta resuelta o leída. */
  remove: (id: string) => Promise<ApiError | null>;
  /** Todas las resueltas o leídas, de todos los hogares. */
  removeAllResolved: () => Promise<ApiError | null>;
  /** Pendientes de resolver: lo que cuenta la insignia. */
  pendingCount: number;
}

const AlertsContext = createContext<AlertsContextValue | null>(null);

export interface AlertsProviderProps {
  children: ReactNode;
}

export function AlertsProvider({ children }: AlertsProviderProps) {
  const { homes } = useHomes();
  const isActive = useIsAppActive();

  const [alerts, setAlerts] = useState<UiAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  // Los ids de los hogares ya consultados: evita repetir la petición cuando la
  // lista de hogares se reconstruye con la misma referencia.
  const [nonce, setNonce] = useState(0);

  const homeKey = homes.map((home) => home.idHome).join(",");

  const load = useCallback(async () => {
    if (homes.length === 0) {
      setAlerts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const byHome = await Promise.all(
        homes.map(async (home) => {
          const list = await alertApi.listAlerts(home.idHome);
          return list.map((alert) => toUiAlert(alert, home.name));
        }),
      );
      setAlerts(byHome.flat());
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
    // `homeKey` identifica la lista; `homes` cambia de referencia en cada render
    // del contexto y volvería a pedirlo todo en cada uno.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeKey]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos estándar
    void load();
  }, [load, nonce]);

  useEffect(() => {
    if (!isActive) return;
    const timer = setInterval(() => setNonce((n) => n + 1), POLL_MS);
    return () => clearInterval(timer);
  }, [isActive]);

  const reload = useCallback(() => {
    setNonce((n) => n + 1);
  }, []);

  const markRead = useCallback(async (id: string) => {
    try {
      await alertApi.markAlertRead(id);
      setAlerts((prev) =>
        prev.map((entry) => (entry.id === id ? { ...entry, resolved: true } : entry)),
      );
      return null;
    } catch (err) {
      return err as ApiError;
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    try {
      await alertApi.deleteAlert(id);
      setAlerts((prev) => prev.filter((entry) => entry.id !== id));
      return null;
    } catch (err) {
      return err as ApiError;
    }
  }, []);

  const removeAllResolved = useCallback(async () => {
    const homeIds = [...new Set(alerts.filter((entry) => entry.resolved).map((e) => e.homeId))];
    if (homeIds.length === 0) return null;
    try {
      await Promise.all(homeIds.map((homeId) => alertApi.deleteResolvedAlerts(homeId)));
      setAlerts((prev) => prev.filter((entry) => !entry.resolved));
      return null;
    } catch (err) {
      return err as ApiError;
    }
  }, [alerts]);

  const pendingCount = useMemo(
    () => alerts.filter((entry) => !entry.resolved).length,
    [alerts],
  );

  const value = useMemo(
    () => ({
      alerts,
      loading,
      error,
      reload,
      markRead,
      remove,
      removeAllResolved,
      pendingCount,
    }),
    [alerts, loading, error, reload, markRead, remove, removeAllResolved, pendingCount],
  );

  return <AlertsContext.Provider value={value}>{children}</AlertsContext.Provider>;
}

export function useAlerts(): AlertsContextValue {
  const ctx = useContext(AlertsContext);
  if (!ctx) throw new Error("useAlerts debe usarse dentro de <AlertsProvider>");
  return ctx;
}