// Tokens de color de la UI. La forma de `ThemeColors` es el contrato de todas las
// paletas: si se agrega un token aquí, hay que agregarlo también en
// `src/theme/palettes.ts`.

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

  // Contenido (texto e iconos) dibujado sobre superficies de marca: el sidebar
  // (`backgroundLeft`), el gradiente del brand, y botones o badges `primary`.
  // `surface` es el fondo de las tarjetas, así que en los temas oscuros se volvía negro
  // sobre fondo negro; la Web usa blanco fijo en estos casos (Sidebar.module.css,
  // AuthLayout.module.css, Button.module.css, HomeCard.module.css).
  onBrand: string;
  onBrandMuted: string;

  // Contenido dibujado sobre un relleno `danger`: el contador de alertas del
  // sidebar. No puede ser `onBrand` fijo porque en los temas oscuros `danger` es
  // un rosa claro (`#FCA5A5`) y el blanco se perdería.
  onDanger: string;
};

// Paleta clara de EnergyMonitor. Es también la paleta por defecto de la app:
// `Theme.colors` la expone hasta que el usuario elija otra en Ajustes.
export const Colors: ThemeColors = {
  primary: "#0078d7",
  primaryHover: "#3399ff",
  primaryDark: "#0a2540",

  secondary: "#32cd32",

  success: "#2ecc71",
  warning: "#ffd700",
  danger: "#e63946",
  info: "#17a2b8",

  background: "#f8f9fa",
  backgroundLeft: "#3f6bae",
  surface: "#ffffff",
  gradient: "#e6f0fa",

  textPrimary: "#212529",
  textSecondary: "#6c757d",
  border: "#e5e7eb",

  cardSoft: "#e8f3ff",
  cardSelected: "#f7fbff",
  primarySoft: "#E8F3FF",

  dangerSoft: "#FCEBEB",
  dangerSoftHover: "#F7C1C1",
  dangerText: "#A32D2D",
  successSoft: "#EAF3DE",
  successText: "#3B6D11",
  warningSoft: "#FFF4D6",
  warningText: "#854F0B",
  infoSoft: "#D1ECF1",
  infoText: "#0C5460",

  onBrand: "#FFFFFF",
  onBrandMuted: "rgba(255, 255, 255, 0.8)",
  onDanger: "#FFFFFF",
};

export default Colors;