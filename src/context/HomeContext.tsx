import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useUser } from "@/context/UserContext";
import { useIsAppActive } from "@/features/homes/hooks/useIsAppActive";
import { HOME_TYPES } from "@/features/shared/homeTypes";
import type { ApiError } from "@/services/http";
import {
  homeApi,
  type CreateHomeRequest,
  type HomeMembership,
  type HomeType,
} from "@/services/home";

/**
 * Estado global de hogares, conectado al backend.
 *
 * Centraliza las llamadas del módulo para que ningún componente hable con el
 * cliente de API. Cada operación devuelve `null` si salió bien o el `ApiError`
 * si falló, para que quien la llama decida cómo mostrarlo en vez de tener que
 * distinguir excepciones.
 *
 * Lo que hacen los demás miembros (expulsarte, salirse, entregarte el hogar,
 * eliminarlo) no llega por ningún canal en vivo: la lista se vuelve a pedir
 * cada `SYNC_MS` con la app en primer plano y al volver a ella.
 */
export interface HomeContextValue {
  homes: HomeMembership[];
  /** `GET /home-types`, ya ordenado. Se carga junto con los hogares. */
  homeTypes: HomeType[];
  loading: boolean;
  error: ApiError | null;
  /** Sube en cada sincronización, para que los miembros del hogar se pongan al día a la vez. */
  syncCount: number;
  reload: () => Promise<void>;
  addHome: (request: CreateHomeRequest) => Promise<ApiError | null>;
  joinHome: (accessCode: string) => Promise<ApiError | null>;
  setFavorite: (homeId: string) => Promise<ApiError | null>;
  leaveHome: (homeId: string) => Promise<ApiError | null>;
  removeMember: (homeId: string, userId: string) => Promise<ApiError | null>;
  transferOwnership: (
    homeId: string,
    newOwnerId: string,
  ) => Promise<ApiError | null>;
}

const HomeContext = createContext<HomeContextValue | null>(null);

const SYNC_MS = 15_000;

// Misma lista que la anterior: se conserva la referencia para no repintar ni
// volver a pedir lo que depende de `homes` cada 15 segundos.
const sameHomes = (a: HomeMembership[], b: HomeMembership[]) =>
  JSON.stringify(a) === JSON.stringify(b);

export interface HomeProviderProps {
  children: ReactNode;
}

export function HomeProvider({ children }: HomeProviderProps) {
  // El catálogo no depende de la sesión: se puede leer aunque los hogares fallen.
  const { isAuthenticated, isRestoring } = useUser();
  const isActive = useIsAppActive();

  const [homes, setHomes] = useState<HomeMembership[]>([]);
  const [homeTypes, setHomeTypes] = useState<HomeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [syncCount, setSyncCount] = useState(0);

  const loadHomes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setHomes(await homeApi.listHomes());
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadHomeTypes = useCallback(async () => {
    try {
      setHomeTypes(await homeApi.listHomeTypes());
    } catch {
      // El catálogo es una ayuda para el formulario: si no llega, se usa el
      // estático. Sus ids son los del seed (`home-005-seed-home-type`), así que
      // `POST /homes` sigue aceptándolos y el usuario no queda sin poder crear.
      setHomeTypes(
        HOME_TYPES.map(({ id, key }) => ({ idHomeType: id, name: key })),
      );
    }
  }, []);

  // Espera a que la sesión esté restaurada: pedir los hogares antes de que el
  // token esté en memoria daría un 401 y vaciaría la pantalla.
  useEffect(() => {
    if (isRestoring) return;
    if (!isAuthenticated) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect -- al cerrar sesión se borra el estado en memoria */
      setHomes([]);
      setLoading(false);
      return;
    }
    void loadHomes();
    void loadHomeTypes();
  }, [isAuthenticated, isRestoring, loadHomes, loadHomeTypes]);

  /**
   * Recarga en segundo plano: sin `loading`, que cambiaría la pantalla por el
   * indicador de carga, y un fallo deja la lista anterior (la siguiente vuelta
   * lo reintenta).
   */
  const syncHomes = useCallback(async () => {
    try {
      const next = await homeApi.listHomes();
      setHomes((prev) => (sameHomes(prev, next) ? prev : next));
      setError(null);
    } catch {
      // Red o backend caídos: se sigue mostrando lo último que se supo.
    }
    setSyncCount((n) => n + 1);
  }, []);

  // Cada SYNC_MS en primer plano; en segundo plano no se consulta. Al volver a
  // primer plano se pone al día enseguida (al arrancar no: ya carga `loadHomes`).
  const wasInBackground = useRef(false);
  useEffect(() => {
    if (!isActive) {
      wasInBackground.current = true;
      return;
    }
    if (isRestoring || !isAuthenticated) return;
    if (wasInBackground.current) {
      wasInBackground.current = false;
      void syncHomes();
    }
    const timer = setInterval(() => void syncHomes(), SYNC_MS);
    return () => clearInterval(timer);
  }, [isAuthenticated, isRestoring, isActive, syncHomes]);

  /** `POST /homes` — el hogar nuevo entra al listado. */
  const addHome = useCallback(
    async (request: CreateHomeRequest) => {
      try {
        await homeApi.createHome(request);
        await loadHomes();
        return null;
      } catch (err) {
        return err as ApiError;
      }
    },
    [loadHomes],
  );

  /** `POST /homes/join` */
  const joinHome = useCallback(
    async (accessCode: string) => {
      try {
        await homeApi.joinHome({ accessCode });
        await loadHomes();
        return null;
      } catch (err) {
        return err as ApiError;
      }
    },
    [loadHomes],
  );

  /**
   * `PUT /homes/{id}/favorite`. El backend devuelve la membresía ya cambiada,
   * así que se aplica su `favorite` en vez de alternar a ciegas: dos toques
   * rápidos dejarían el corazón al revés.
   */
  const setFavorite = useCallback(async (homeId: string) => {
    try {
      const updated = await homeApi.toggleFavorite(homeId);
      setHomes((prev) =>
        prev.map((home) =>
          home.idHome === homeId
            ? { ...home, favorite: updated.favorite }
            : home,
        ),
      );
      return null;
    } catch (err) {
      return err as ApiError;
    }
  }, []);

  /** `DELETE /homes/{id}/members/me` */
  const leaveHome = useCallback(
    async (homeId: string) => {
      try {
        await homeApi.leaveHome(homeId);
        await loadHomes();
        return null;
      } catch (err) {
        return err as ApiError;
      }
    },
    [loadHomes],
  );

  /** `DELETE /homes/{id}/members/{userId}` */
  const removeMember = useCallback(
    async (homeId: string, userId: string) => {
      try {
        await homeApi.removeMember(homeId, userId);
        return null;
      } catch (err) {
        return err as ApiError;
      }
    },
    [],
  );

  /**
   * `PUT /homes/{id}/owner` — al entregar el hogar quien lo hace pasa a simple
   * miembro, así que se recargan los hogares para que el rol reflejado (y con él
   * el resto de pantallas) se actualice, igual que en la Web.
   */
  const transferOwnership = useCallback(
    async (homeId: string, newOwnerId: string) => {
      try {
        await homeApi.transferOwnership(homeId, newOwnerId);
        await loadHomes();
        return null;
      } catch (err) {
        return err as ApiError;
      }
    },
    [loadHomes],
  );

  const value = useMemo(
    () => ({
      homes,
      homeTypes,
      loading,
      error,
      syncCount,
      reload: loadHomes,
      addHome,
      joinHome,
      setFavorite,
      leaveHome,
      removeMember,
      transferOwnership,
    }),
    [
      homes,
      homeTypes,
      loading,
      error,
      syncCount,
      loadHomes,
      addHome,
      joinHome,
      setFavorite,
      leaveHome,
      removeMember,
      transferOwnership,
    ],
  );

  return (
    <HomeContext.Provider value={value}>{children}</HomeContext.Provider>
  );
}

export function useHomes(): HomeContextValue {
  const ctx = useContext(HomeContext);
  if (!ctx) throw new Error("useHomes debe usarse dentro de <HomeProvider>");
  return ctx;
}