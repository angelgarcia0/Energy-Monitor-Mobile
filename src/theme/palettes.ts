import { Colors, type ThemeColors } from "@/constants/colors";

export type ThemeMode = "light" | "dark";

export interface ThemePalette {
  id: string;
  name: string;
  subtitle: string;
  mode: ThemeMode;
  // Colores de la vista previa de la tarjeta en Ajustes → Temas.
  sidebar: string;
  main: string;
  indicators: string[];
  colors: ThemeColors;
}

// Mismas paletas que la Web (src/context/ThemeContext.jsx): cada tema sobreescribe
// los tokens de `global.css` mediante variables CSS. En mobile no hay variables CSS,
// así que cada paleta trae el juego completo de tokens y `activePalette` decide cuál
// está vigente (ver `createThemeStyles`).

const energyLight: ThemePalette = {
  id: "energy-light",
  name: "EnergyMonitor",
  subtitle: "Claro · Predeterminado",
  mode: "light",
  sidebar: "#3F6BAE",
  main: "#0078D7",
  indicators: ["#0078D7", "#32CD32", "#E2E8F0"],
  // Los tokens de la paleta por defecto viven en `constants/colors`.
  colors: { ...Colors },
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
    onBrand: "#FFFFFF",
    onBrandMuted: "rgba(255, 255, 255, 0.8)",
    onDanger: "#FFFFFF",
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
    onBrand: "#FFFFFF",
    onBrandMuted: "rgba(255, 255, 255, 0.8)",
    // `danger` es rosa claro en los temas oscuros: el texto sobre él va oscuro.
    onDanger: "#1F2937",
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
    onBrand: "#FFFFFF",
    onBrandMuted: "rgba(255, 255, 255, 0.8)",
    onDanger: "#1F2937",
  },
};

export const THEMES: ThemePalette[] = [energyLight, ecoLight, energyDark, ecoDark];

export const DEFAULT_THEME_ID = energyLight.id;

export const getThemeById = (id: string): ThemePalette =>
  THEMES.find((theme) => theme.id === id) ?? energyLight;