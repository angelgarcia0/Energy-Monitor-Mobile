import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface ThemePalette {
  id: string;
  name: string;
  subtitle: string;
  mode: "light" | "dark";
  sidebar: string;
  main: string;
  indicators: string[];
  colors: ThemeColors;
}

export type ThemeColors = {
  primary: string;
  primaryHover: string;
  primaryDark: string;
  primarySoft: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  background: string;
  backgroundLeft: string;
  surface: string;
  gradient: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  cardSoft: string;
  cardSelected: string;
  dangerSoft: string;
  dangerSoftHover: string;
  dangerText: string;
  successSoft: string;
  successText: string;
  warningSoft: string;
  warningText: string;
  infoSoft: string;
  infoText: string;
};

const energyLight: ThemePalette = {
  id: "energy-light",
  name: "EnergyMonitor",
  subtitle: "Claro · Predeterminado",
  mode: "light",
  sidebar: "#3F6BAE",
  main: "#0078D7",
  indicators: ["#0078D7", "#32CD32", "#E2E8F0"],
  colors: {
    primary: "#0078D7",
    primaryHover: "#3399FF",
    primaryDark: "#0A2540",
    primarySoft: "#E8F3FF",
    secondary: "#32CD32",
    success: "#2ECC71",
    warning: "#FFD700",
    danger: "#E63946",
    info: "#17A2B8",
    background: "#F8F9FA",
    backgroundLeft: "#3F6BAE",
    surface: "#FFFFFF",
    gradient: "#E6F0FA",
    textPrimary: "#212529",
    textSecondary: "#6C757D",
    border: "#E5E7EB",
    cardSoft: "#E8F3FF",
    cardSelected: "#F7FBFF",
    dangerSoft: "#FCEBEB",
    dangerSoftHover: "#F7C1C1",
    dangerText: "#A32D2D",
    successSoft: "#EAF3DE",
    successText: "#3B6D11",
    warningSoft: "#FFF4D6",
    warningText: "#854F0B",
    infoSoft: "#D1ECF1",
    infoText: "#0C5460",
  },
};

const ecoLight: ThemePalette = {
  id: "eco-light",
  name: "Eco Hogar",
  subtitle: "Claro · Tema 2",
  mode: "light",
  sidebar: "#2E7D32",
  main: "#32CD32",
  indicators: ["#1B5E20", "#2ECC71", "#A5D6A7"],
  colors: {
    primary: "#2E7D32",
    primaryHover: "#43A047",
    primaryDark: "#1B5E20",
    primarySoft: "#E8F5E9",
    secondary: "#2ECC71",
    success: "#2ECC71",
    warning: "#FFD700",
    danger: "#E63946",
    info: "#17A2B8",
    background: "#F1F8F2",
    backgroundLeft: "#2E7D32",
    surface: "#FFFFFF",
    gradient: "#E8F5E9",
    textPrimary: "#1A2E1B",
    textSecondary: "#5A7A5C",
    border: "#C8E6C9",
    cardSoft: "#E8F5E9",
    cardSelected: "#F1F8F2",
    dangerSoft: "#FCEBEB",
    dangerSoftHover: "#F7C1C1",
    dangerText: "#A32D2D",
    successSoft: "#E8F5E9",
    successText: "#2E7D32",
    warningSoft: "#FFF4D6",
    warningText: "#854F0B",
    infoSoft: "#D1ECF1",
    infoText: "#0C5460",
  },
};

const energyDark: ThemePalette = {
  id: "energy-dark",
  name: "EnergyMonitor Dark",
  subtitle: "Oscuro · Tema 1",
  mode: "dark",
  sidebar: "#0F172A",
  main: "#1E293B",
  indicators: ["#0078D7", "#32CD32", "#64748B"],
  colors: {
    primary: "#3B82F6",
    primaryHover: "#60A5FA",
    primaryDark: "#1E40AF",
    primarySoft: "rgba(59,130,246,0.15)",
    secondary: "#32CD32",
    success: "#6EE7B7",
    warning: "#FCD34D",
    danger: "#FCA5A5",
    info: "#67E8F9",
    background: "#0F172A",
    backgroundLeft: "#0F172A",
    surface: "#1E293B",
    gradient: "#1E293B",
    textPrimary: "#F1F5F9",
    textSecondary: "#94A3B8",
    border: "#334155",
    cardSoft: "rgba(59,130,246,0.15)",
    cardSelected: "#0B1220",
    dangerSoft: "rgba(230,57,70,0.15)",
    dangerSoftHover: "rgba(230,57,70,0.28)",
    dangerText: "#FCA5A5",
    successSoft: "rgba(46,204,113,0.15)",
    successText: "#6EE7B7",
    warningSoft: "rgba(255,215,0,0.15)",
    warningText: "#FCD34D",
    infoSoft: "rgba(23,162,184,0.15)",
    infoText: "#67E8F9",
  },
};

const ecoDark: ThemePalette = {
  id: "eco-dark",
  name: "Eco Dark",
  subtitle: "Oscuro · Tema 2",
  mode: "dark",
  sidebar: "#102A1A",
  main: "#183321",
  indicators: ["#32CD32", "#2ECC71", "#1E4029"],
  colors: {
    primary: "#22C55E",
    primaryHover: "#4ADE80",
    primaryDark: "#14532D",
    primarySoft: "rgba(34,197,94,0.15)",
    secondary: "#2ECC71",
    success: "#4ADE80",
    warning: "#FCD34D",
    danger: "#FCA5A5",
    info: "#67E8F9",
    background: "#0A1F0F",
    backgroundLeft: "#102A1A",
    surface: "#183321",
    gradient: "#183321",
    textPrimary: "#ECFDF5",
    textSecondary: "#6EE7B7",
    border: "#1E4029",
    cardSoft: "rgba(34,197,94,0.15)",
    cardSelected: "#0B1220",
    dangerSoft: "rgba(230,57,70,0.15)",
    dangerSoftHover: "rgba(230,57,70,0.28)",
    dangerText: "#FCA5A5",
    successSoft: "rgba(34,197,94,0.15)",
    successText: "#4ADE80",
    warningSoft: "rgba(255,215,0,0.15)",
    warningText: "#FCD34D",
    infoSoft: "rgba(23,162,184,0.15)",
    infoText: "#67E8F9",
  },
};

export const THEMES: ThemePalette[] = [energyLight, ecoLight, energyDark, ecoDark];

const STORAGE_KEY = "energymonitor_theme";
const DEFAULT_THEME_ID = "energy-light";

interface ThemeContextValue {
  themeId: string;
  setThemeId: (id: string) => void;
  currentTheme: ThemePalette;
  themes: ThemePalette[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<string>(DEFAULT_THEME_ID);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) setThemeId(stored);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, themeId).catch(() => {});
  }, [themeId]);

  const currentTheme =
    THEMES.find((theme) => theme.id === themeId) ?? energyLight;

  const value = useMemo(
    () => ({ themeId, setThemeId, currentTheme, themes: THEMES }),
    [themeId, currentTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  return ctx;
}