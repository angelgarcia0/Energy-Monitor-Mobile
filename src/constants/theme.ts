import type { TextStyle, ViewStyle } from "react-native";

import { createColorsProxy, createThemeStyles } from "@/theme/createThemeStyles";
import { Spacing } from "./spacing";
import { Typography } from "./typography";

const createViewShadow = (
  boxShadow: string,
  elevation: number,
): Pick<ViewStyle, "boxShadow" | "elevation"> => ({
  boxShadow,
  elevation,
});

const createTextShadow = (elevation: number): Pick<TextStyle, "elevation"> => ({
  elevation,
});

export { createThemeStyles };

export const Theme = {
  // Lectura dinámica de la paleta activa (ver `theme/createThemeStyles`): los tokens
  // resuelven contra la paleta elegida en Ajustes → Temas, no contra una constante.
  colors: createColorsProxy(),
  spacing: Spacing,
  typography: Typography,

  radius: {
    sm: 6,
    md: 10,
    lg: 16,
  },

  shadow: {
    sm: createViewShadow("0px 0px 2px rgba(0, 0, 0, 0.05)", 1),
    md: createViewShadow("0px 0px 6px rgba(0, 0, 0, 0.1)", 4),
    mdUp: createViewShadow("0px -2px 6px rgba(0, 0, 0, 0.1)", 4),
    lg: createViewShadow("0px 0px 15px rgba(0, 0, 0, 0.25)", 10),
    none: createViewShadow("none", 0),
  },

  shadowText: {
    sm: createTextShadow(1),
    md: createTextShadow(4),
    lg: createTextShadow(10),
  },
};

export default Theme;
