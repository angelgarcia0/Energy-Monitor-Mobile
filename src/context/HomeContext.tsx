import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";

import type {
  Home,
  HomeTextField,
} from "@/features/dashboard/components/HomeCard/HomeCard";
import type { CreateHomeFormValues } from "@/features/dashboard/validation/createHomeSchema";

export interface HomeContextValue {
  homes: Home[];
  addHome: (home: Home) => void;
  toggleFavorite: (id: number) => void;
  addOwnedHome: (values: CreateHomeFormValues) => void;
  addJoinedHome: () => void;
  removeHome: (id: number) => void;
}

const HomeContext = createContext<HomeContextValue | null>(null);

export interface HomeProviderProps {
  children: ReactNode;
}

export function HomeProvider({ children }: HomeProviderProps) {
  const { t } = useTranslation();
  const [storedHomes, setStoredHomes] = useState<Home[]>([]);

  /**
   * Los hogares de ejemplo guardan claves, no textos: al cambiar de idioma se
   * vuelven a resolver aquí. Los datos que escribe el usuario (nombre, dirección)
   * se guardan tal cual y nunca se traducen.
   */
  const homes = useMemo<Home[]>(
    () =>
      storedHomes.map((home) => {
        if (!home.mockFields) return home;

        const resolved: Home = { ...home };
        (Object.keys(home.mockFields) as HomeTextField[]).forEach((field) => {
          const key = home.mockFields?.[field];
          if (key) resolved[field] = t(key);
        });
        return resolved;
      }),
    [storedHomes, t],
  );

  const addHome = useCallback((home: Home) => {
    setStoredHomes((currentHomes) => [...currentHomes, home]);
  }, []);

  const toggleFavorite = useCallback((id: number) => {
    setStoredHomes((currentHomes) =>
      currentHomes.map((home) =>
        home.id === id ? { ...home, favorite: !home.favorite } : home,
      ),
    );
  }, []);

  const addOwnedHome = useCallback((values: CreateHomeFormValues) => {
    setStoredHomes((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: values.name,
        address: values.address,
        description: values.description,
        homeTypeId: values.homeType,
        otherHomeType: values.otherType,
        userResponsible: "",
        variant: "owned",
        favorite: false,
        mockFields: { userResponsible: "dashboard:home.you" },
      },
    ]);
  }, []);

  const addJoinedHome = useCallback(() => {
    setStoredHomes((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        address: "",
        description: "",
        userResponsible: "",
        variant: "joined",
        favorite: false,
        mockFields: {
          name: "dashboard:home.joinedName",
          userResponsible: "dashboard:home.responsible",
          address: "dashboard:homeAddress",
          description: "dashboard:home.joinedDescription",
        },
      },
    ]);
  }, []);

  // Quita el hogar del listado compartido. Se usa tanto para "eliminar hogar"
  // (dueño) como para "salirme del hogar" (no dueño): en ambos casos el hogar
  // deja de mostrarse en Dashboard y Sidebar.
  const removeHome = useCallback((id: number) => {
    setStoredHomes((prev) => prev.filter((home) => home.id !== id));
  }, []);

  const value = useMemo(
    () => ({ homes, addHome, toggleFavorite, addOwnedHome, addJoinedHome, removeHome }),
    [homes, addHome, toggleFavorite, addOwnedHome, addJoinedHome, removeHome],
  );

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
}

export function useHomes(): HomeContextValue {
  const ctx = useContext(HomeContext);
  if (!ctx) throw new Error("useHomes debe usarse dentro de <HomeProvider>");
  return ctx;
}
