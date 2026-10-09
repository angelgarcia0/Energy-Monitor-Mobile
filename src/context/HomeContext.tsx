import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useUser } from "@/context/UserContext";
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
 */
export interface HomeContextValue {
  homes: HomeMembership[];
  /** `GET /home-types`, ya ordenado. Se carga junto con los hogares. */
  homeTypes: HomeType[];
  loading: boolean;
  error: ApiError | null;
  reload: () => Promise<void>;
  addHome: (request: CreateHomeRequest) => Promise<ApiError | null>;
  joinHome: (accessCode: string) => Promise<ApiError | null>;
  setFavorite: (homeId: string) => Promise<ApiError | null>;
  leaveHome: (homeId: string) => Promise<ApiError | null>;
  removeMember: (homeId: string, userId: string) => Promise<ApiError | null>;
}

const HomeContext = createContext<HomeContextValue | null>(null);

export interface HomeProviderProps {
  children: ReactNode;
}

export function HomeProvider({ children }: HomeProviderProps) {
  // El catálogo no depende de la sesión: se puede leer aunque los hogares fallen.
  const { isAuthenticated, isRestoring } = useUser();

  const [homes, setHomes] = useState<HomeMembership[]>([]);
  const [homeTypes, setHomeTypes] = useState<HomeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

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

  const value = useMemo(
    () => ({
      homes,
      homeTypes,
      loading,
      error,
      reload: loadHomes,
      addHome,
      joinHome,
      setFavorite,
      leaveHome,
      removeMember,
    }),
    [
      homes,
      homeTypes,
      loading,
      error,
      loadHomes,
      addHome,
      joinHome,
      setFavorite,
      leaveHome,
      removeMember,
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