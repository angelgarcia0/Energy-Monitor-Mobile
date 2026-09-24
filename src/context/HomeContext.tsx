import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Home } from "@/features/dashboard/components/HomeCard/HomeCard";

interface HomeContextValue {
  homes: Home[];
  addHome: (home: Home) => void;
  toggleFavorite: (id: number) => void;
}

const HomeContext = createContext<HomeContextValue | null>(null);

export function HomeProvider({ children }: { children: ReactNode }) {
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

  const value = useMemo(
    () => ({ homes, addHome, toggleFavorite }),
    [homes, addHome, toggleFavorite],
  );

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
}

export function useHomes() {
  const context = useContext(HomeContext);

  if (!context) {
    throw new Error("useHomes debe usarse dentro de <HomeProvider>");
  }

  return context;
}
