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
import { recommendationApi } from "@/services/recommendations";
import { useIsAppActive } from "@/features/homes/hooks/useIsAppActive";
import { toUiAlert, type UiAlert } from "@/features/notifications/data/alertTypes";
import {
  toUiRecommendation,
  type UiRecommendation,
} from "@/features/notifications/data/recommendationTypes";

/** La Web consulta cada 30 s; aquí igual, y se detiene en segundo plano. */
const POLL_MS = 30_000;

/**
 * Bandeja de alertas y recomendaciones de todos los hogares del usuario.
 *
 * El backend no tiene bandeja global: cada elemento pertenece a un hogar, así
 * que se consulta uno por uno y se unen. La comparten la pantalla de
 * notificaciones y la insignia del sidebar, para que el contador no requiera una
 * segunda carga.
 *
 * Alertas y recomendaciones viven aquí juntas, y no en dos contextos, porque la
 * insignia cuenta las dos cosas y porque la Web resolvió exactamente esto:
 * dos contextos serían dos bucles de sondeo sobre los mismos hogares.
 */
export interface NotificationCenterContextValue {
  alerts: UiAlert[];
  recommendations: UiRecommendation[];
  loading: boolean;
  error: ApiError | null;
  reload: () => void;
  /** Avisos informativos: "marcar como leída". */
  markRead: (id: string) => Promise<ApiError | null>;
  /** Una alerta resuelta o leída. */
  remove: (id: string) => Promise<ApiError | null>;
  /** Todas las alertas resueltas o leídas, de todos los hogares. */
  removeAllResolved: () => Promise<ApiError | null>;
  /** Recomendación: "marcar como leída". */
  markRecommendationRead: (id: string) => Promise<ApiError | null>;
  /** Todas las sin leer, de todos los hogares. */
  markAllRecommendationsRead: () => Promise<ApiError | null>;
  /** Una recomendación leída. */
  removeRecommendation: (id: string) => Promise<ApiError | null>;
  /** Todas las leídas, de todos los hogares. */
  removeAllReadRecommendations: () => Promise<ApiError | null>;
  /** Alertas sin resolver más recomendaciones sin leer: lo que cuenta la insignia. */
  pendingCount: number;
}

const NotificationCenterContext =
  createContext<NotificationCenterContextValue | null>(null);

export interface NotificationCenterProviderProps {
  children: ReactNode;
}

export function NotificationCenterProvider({
  children,
}: NotificationCenterProviderProps) {
  const { homes } = useHomes();
  const isActive = useIsAppActive();

  const [alerts, setAlerts] = useState<UiAlert[]>([]);
  const [recommendations, setRecommendations] = useState<UiRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  // Cada vez que sube, el siguiente efecto vuelve a pedir las bandejas: así el
  // sondeo y "reintentar" comparten un solo camino de recarga.
  const [nonce, setNonce] = useState(0);

  const homeKey = homes.map((home) => home.idHome).join(",");

  const load = useCallback(async () => {
    if (homes.length === 0) {
      setAlerts([]);
      setRecommendations([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Dos peticiones por hogar. No hay consulta global que las evite.
      const byHome = await Promise.all(
        homes.map(async (home) => {
          const [alertList, recommendationList] = await Promise.all([
            alertApi.listAlerts(home.idHome),
            recommendationApi.listRecommendations(home.idHome),
          ]);
          return {
            alerts: alertList.map((alert) => toUiAlert(alert, home.name)),
            recommendations: recommendationList.map((recommendation) =>
              toUiRecommendation(recommendation, home.name),
            ),
          };
        }),
      );
      setAlerts(byHome.flatMap((home) => home.alerts));
      setRecommendations(byHome.flatMap((home) => home.recommendations));
    } catch (err) {
      // No se vacían las listas: un fallo de red deja lo anterior en pantalla
      // en vez de dejar la bandeja en blanco.
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

  const markRecommendationRead = useCallback(async (id: string) => {
    try {
      await recommendationApi.markRecommendationRead(id);
      setRecommendations((prev) =>
        prev.map((entry) => (entry.id === id ? { ...entry, read: true } : entry)),
      );
      return null;
    } catch (err) {
      return err as ApiError;
    }
  }, []);

  const markAllRecommendationsRead = useCallback(async () => {
    const unread = recommendations.filter((entry) => !entry.read);
    if (unread.length === 0) return null;
    try {
      // El backend no tiene un "marcar todas": es una llamada por recomendación.
      await Promise.all(unread.map((entry) => recommendationApi.markRecommendationRead(entry.id)));
      setRecommendations((prev) => prev.map((entry) => ({ ...entry, read: true })));
      return null;
    } catch (err) {
      return err as ApiError;
    }
  }, [recommendations]);

  const removeRecommendation = useCallback(async (id: string) => {
    try {
      await recommendationApi.deleteRecommendation(id);
      setRecommendations((prev) => prev.filter((entry) => entry.id !== id));
      return null;
    } catch (err) {
      return err as ApiError;
    }
  }, []);

  const removeAllReadRecommendations = useCallback(async () => {
    const homeIds = [...new Set(recommendations.filter((e) => e.read).map((e) => e.homeId))];
    if (homeIds.length === 0) return null;
    try {
      await Promise.all(
        homeIds.map((homeId) => recommendationApi.deleteReadRecommendations(homeId)),
      );
      setRecommendations((prev) => prev.filter((entry) => !entry.read));
      return null;
    } catch (err) {
      return err as ApiError;
    }
  }, [recommendations]);

  const pendingCount = useMemo(
    () =>
      alerts.filter((entry) => !entry.resolved).length +
      recommendations.filter((entry) => !entry.read).length,
    [alerts, recommendations],
  );

  const value = useMemo(
    () => ({
      alerts,
      recommendations,
      loading,
      error,
      reload,
      markRead,
      remove,
      removeAllResolved,
      markRecommendationRead,
      markAllRecommendationsRead,
      removeRecommendation,
      removeAllReadRecommendations,
      pendingCount,
    }),
    [
      alerts,
      recommendations,
      loading,
      error,
      reload,
      markRead,
      remove,
      removeAllResolved,
      markRecommendationRead,
      markAllRecommendationsRead,
      removeRecommendation,
      removeAllReadRecommendations,
      pendingCount,
    ],
  );

  return (
    <NotificationCenterContext.Provider value={value}>
      {children}
    </NotificationCenterContext.Provider>
  );
}

export function useNotificationCenter(): NotificationCenterContextValue {
  const ctx = useContext(NotificationCenterContext);
  if (!ctx) {
    throw new Error(
      "useNotificationCenter debe usarse dentro de <NotificationCenterProvider>",
    );
  }
  return ctx;
}