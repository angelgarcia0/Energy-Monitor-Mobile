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
import { useUser } from "@/context/UserContext";
import { alertApi } from "@/services/alerts";
import type { ApiError } from "@/services/http";
import { activityApi } from "@/services/notifications";
import { recommendationApi } from "@/services/recommendations";
import { useIsAppActive } from "@/features/homes/hooks/useIsAppActive";
import { toUiActivity, type UiActivity } from "@/features/notifications/data/activityTypes";
import { toUiAlert, type UiAlert } from "@/features/notifications/data/alertTypes";
import {
  ACCOUNT_SCOPE,
  ALL_SCOPE,
  inScope,
  type NotificationScope,
} from "@/features/notifications/data/notificationScope";
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
 *
 * La actividad (bienvenida, hogares, miembros, dispositivos) sí es una sola
 * bandeja por usuario, y se pide aunque aún no tenga hogares: la bienvenida es
 * de la cuenta.
 *
 * Las acciones en bloque reciben un alcance (`notificationScope`): todos los
 * hogares si se omite, uno, o la cuenta.
 */
export interface NotificationCenterContextValue {
  alerts: UiAlert[];
  recommendations: UiRecommendation[];
  activity: UiActivity[];
  loading: boolean;
  error: ApiError | null;
  reload: () => void;
  /** Avisos informativos: "marcar como leída". */
  markRead: (id: string) => Promise<ApiError | null>;
  /** Una alerta resuelta o leída. */
  remove: (id: string) => Promise<ApiError | null>;
  /** Todas las alertas resueltas o leídas del alcance. */
  removeAllResolved: (scope?: NotificationScope) => Promise<ApiError | null>;
  /** Recomendación: "marcar como leída". */
  markRecommendationRead: (id: string) => Promise<ApiError | null>;
  /** Todas las sin leer del alcance. */
  markAllRecommendationsRead: (scope?: NotificationScope) => Promise<ApiError | null>;
  /** Una recomendación leída. */
  removeRecommendation: (id: string) => Promise<ApiError | null>;
  /** Todas las leídas del alcance. */
  removeAllReadRecommendations: (scope?: NotificationScope) => Promise<ApiError | null>;
  /** Actividad: "marcar como leída". */
  markActivityRead: (id: string) => Promise<ApiError | null>;
  /** Toda la actividad sin leer del alcance. */
  markAllActivityRead: (scope?: NotificationScope) => Promise<ApiError | null>;
  /** Una actividad leída. */
  removeActivity: (id: string) => Promise<ApiError | null>;
  /** Toda la actividad leída del alcance. */
  removeAllReadActivity: (scope?: NotificationScope) => Promise<ApiError | null>;
  /**
   * Alertas sin resolver, recomendaciones y actividad sin leer: lo que cuenta
   * la insignia.
   */
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
  const { isAuthenticated } = useUser();
  const isActive = useIsAppActive();

  const [alerts, setAlerts] = useState<UiAlert[]>([]);
  const [recommendations, setRecommendations] = useState<UiRecommendation[]>([]);
  const [activity, setActivity] = useState<UiActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  // Cada vez que sube, el siguiente efecto vuelve a pedir las bandejas: así el
  // sondeo y "reintentar" comparten un solo camino de recarga.
  const [nonce, setNonce] = useState(0);

  const homeKey = homes.map((home) => home.idHome).join(",");

  const load = useCallback(async () => {
    // El proveedor también envuelve el inicio de sesión: sin sesión no hay
    // bandeja que pedir.
    if (!isAuthenticated) {
      setAlerts([]);
      setRecommendations([]);
      setActivity([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const homeNames = new Map(homes.map((home) => [home.idHome, home.name]));
      // Dos peticiones por hogar, que no tienen consulta global que las evite,
      // y una para la actividad de todos.
      const [byHome, activityList] = await Promise.all([
        Promise.all(
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
        ),
        activityApi.listActivity(),
      ]);
      setAlerts(byHome.flatMap((home) => home.alerts));
      setRecommendations(byHome.flatMap((home) => home.recommendations));
      setActivity(activityList.map((entry) => toUiActivity(entry, homeNames)));
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
  }, [homeKey, isAuthenticated]);

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

  const removeAllResolved = useCallback(async (scope?: NotificationScope) => {
    const homeIds = [
      ...new Set(
        alerts.filter((entry) => entry.resolved && inScope(entry, scope)).map((e) => e.homeId),
      ),
    ];
    if (homeIds.length === 0) return null;
    try {
      await Promise.all(homeIds.map((homeId) => alertApi.deleteResolvedAlerts(homeId)));
      setAlerts((prev) => prev.filter((entry) => !entry.resolved || !inScope(entry, scope)));
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

  const markAllRecommendationsRead = useCallback(async (scope?: NotificationScope) => {
    const unread = recommendations.filter((entry) => !entry.read && inScope(entry, scope));
    if (unread.length === 0) return null;
    try {
      // El backend no tiene un "marcar todas": es una llamada por recomendación.
      await Promise.all(unread.map((entry) => recommendationApi.markRecommendationRead(entry.id)));
      setRecommendations((prev) =>
        prev.map((entry) => (inScope(entry, scope) ? { ...entry, read: true } : entry)),
      );
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

  const removeAllReadRecommendations = useCallback(async (scope?: NotificationScope) => {
    const homeIds = [
      ...new Set(
        recommendations.filter((e) => e.read && inScope(e, scope)).map((e) => e.homeId),
      ),
    ];
    if (homeIds.length === 0) return null;
    try {
      await Promise.all(
        homeIds.map((homeId) => recommendationApi.deleteReadRecommendations(homeId)),
      );
      setRecommendations((prev) => prev.filter((entry) => !entry.read || !inScope(entry, scope)));
      return null;
    } catch (err) {
      return err as ApiError;
    }
  }, [recommendations]);

  const markActivityRead = useCallback(async (id: string) => {
    try {
      await activityApi.markActivityRead(id);
      setActivity((prev) =>
        prev.map((entry) => (entry.id === id ? { ...entry, read: true } : entry)),
      );
      return null;
    } catch (err) {
      return err as ApiError;
    }
  }, []);

  const markAllActivityRead = useCallback(async (scope?: NotificationScope) => {
    const unread = activity.filter((entry) => !entry.read && inScope(entry, scope));
    if (unread.length === 0) return null;
    try {
      // Lo de la cuenta no tiene hogar con el que pedirlo de una vez: va una por una.
      if (scope === ACCOUNT_SCOPE) {
        await Promise.all(unread.map((entry) => activityApi.markActivityRead(entry.id)));
      } else {
        await activityApi.markAllActivityRead(scope && scope !== ALL_SCOPE ? scope : undefined);
      }
      setActivity((prev) =>
        prev.map((entry) => (inScope(entry, scope) ? { ...entry, read: true } : entry)),
      );
      return null;
    } catch (err) {
      return err as ApiError;
    }
  }, [activity]);

  const removeActivity = useCallback(async (id: string) => {
    try {
      await activityApi.deleteActivity(id);
      setActivity((prev) => prev.filter((entry) => entry.id !== id));
      return null;
    } catch (err) {
      return err as ApiError;
    }
  }, []);

  const removeAllReadActivity = useCallback(async (scope?: NotificationScope) => {
    const read = activity.filter((entry) => entry.read && inScope(entry, scope));
    if (read.length === 0) return null;
    try {
      // El backend borra de una en una: no hay "eliminar las leídas" de actividad.
      await Promise.all(read.map((entry) => activityApi.deleteActivity(entry.id)));
      const removed = new Set(read.map((entry) => entry.id));
      setActivity((prev) => prev.filter((entry) => !removed.has(entry.id)));
      return null;
    } catch (err) {
      return err as ApiError;
    }
  }, [activity]);

  const pendingCount = useMemo(
    () =>
      alerts.filter((entry) => !entry.resolved).length +
      recommendations.filter((entry) => !entry.read).length +
      activity.filter((entry) => !entry.read).length,
    [alerts, recommendations, activity],
  );

  const value = useMemo(
    () => ({
      alerts,
      recommendations,
      activity,
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
      markActivityRead,
      markAllActivityRead,
      removeActivity,
      removeAllReadActivity,
      pendingCount,
    }),
    [
      alerts,
      recommendations,
      activity,
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
      markActivityRead,
      markAllActivityRead,
      removeActivity,
      removeAllReadActivity,
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