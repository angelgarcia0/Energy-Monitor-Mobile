import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Home } from "@/features/dashboard/components/HomeCard/HomeCard";
import type { CreateHomeFormValues } from "@/features/dashboard/validation/createHomeSchema";

export interface HomeContextValue {
  homes: Home[];
  addHome: (home: Home) => void;
  toggleFavorite: (id: number) => void;
  addOwnedHome: (values: CreateHomeFormValues) => void;
  addJoinedHome: () => void;
}

const HomeContext = createContext<HomeContextValue | null>(null);

export interface HomeProviderProps {
  children: ReactNode;
}

export function HomeProvider({ children }: HomeProviderProps) {
  const [homes, setHomes] = useState<Home[]>([]);

  const addHome = useCallback((home: Home) => {
    setHomes((currentHomes) => [...currentHomes, home]);
  }, []);

  const toggleFavorite = useCallback((id: number) => {
    setHomes((currentHomes) =>
      currentHomes.map((home) =>
        home.id === id ? { ...home, favorite: !home.favorite } : home,
      ),
    );
  }, []);

  const addOwnedHome = useCallback((values: CreateHomeFormValues) => {
    setHomes((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: values.name,
        address: values.address,
        description: values.description,
        homeTypeId: values.homeType,
        otherHomeType: values.otherType,
        userResponsible: "Tú",
        variant: "owned",
        favorite: false,
      },
    ]);
  }, []);

  const addJoinedHome = useCallback(() => {
    setHomes((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "Hogar unido",
        userResponsible: "Responsable del hogar",
        address: "Av. Central 45, Oficina 3",
        description: "Hogar al que te has unido como usuario regular.",
        variant: "joined",
        favorite: false,
      },
    ]);
  }, []);

  const value = useMemo(
    () => ({ homes, addHome, toggleFavorite, addOwnedHome, addJoinedHome }),
    [homes, addHome, toggleFavorite, addOwnedHome, addJoinedHome],
  );

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
}

export function useHomes(): HomeContextValue {
  const ctx = useContext(HomeContext);
  if (!ctx) throw new Error("useHomes debe usarse dentro de <HomeProvider>");
  return ctx;
}
