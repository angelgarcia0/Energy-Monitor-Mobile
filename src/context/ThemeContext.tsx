import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { setActivePalette } from "@/theme/activePalette";
import {
  DEFAULT_THEME_ID,
  THEMES,
  getThemeById,
  type ThemePalette,
} from "@/theme/palettes";

interface ThemeContextValue {
  themeId: string;
  setThemeId: (id: string) => void;
  currentTheme: ThemePalette;
  themes: ThemePalette[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "energymonitor_theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<string>(DEFAULT_THEME_ID);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (active && stored) setThemeId(stored);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setRestored(true);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    // Hasta restaurar no se guarda nada: si se persistiera la paleta por defecto al
    // montar, correría en paralelo con la lectura y la podría pisar, dejando al usuario
    // con el tema predeterminado al reabrir la app.
    if (!restored) return;
    AsyncStorage.setItem(STORAGE_KEY, themeId).catch(() => {});
  }, [themeId, restored]);

  const currentTheme = useMemo(() => {
    const theme = getThemeById(themeId);
    // Durante el render y no en un effect: los hijos se renderizan antes de que corran
    // los effects del provider y deben construirse con la paleta que ya está activa.
    setActivePalette(theme);
    return theme;
  }, [themeId]);

  const value = useMemo(
    () => ({ themeId, setThemeId, currentTheme, themes: THEMES }),
    [themeId, currentTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  return ctx;
}

/**
 * Paleta activa y forma de cambiar de tema.
 *
 * Nota para las pantallas: además de leer la paleta con este hook, la pantalla debe
 * remontarse al cambiarla, normalmente con `key={currentTheme.id}`.
 *
 * `StyleSheet.create` congela los tokens que recibe, así que al cambiar de paleta los
 * estilos se reconstruyen (`createThemeStyles`), pero eso solo surte efecto en lo que
 * vuelve a renderizarse. Y con React Compiler activo el render de cada componente se
 * memoiza según sus dependencias reactivas (i18n, router, insets...): la paleta no está
 * entre ellas, así que una pantalla puede reutilizar su JSX cacheado y quedarse con los
 * estilos anteriores. La `key` fuerza el remontaje y garantiza el repintado completo.
 */
export function useTheme() {
  return useThemeContext();
}