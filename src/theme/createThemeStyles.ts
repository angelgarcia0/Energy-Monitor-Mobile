import { StyleSheet } from "react-native";

import type { ThemeColors } from "@/constants/colors";
import { getActiveColors, getActivePalette } from "./activePalette";
import type { ThemePalette } from "./palettes";

/**
 * Convierte un `StyleSheet.create` en algo que sigue a la paleta activa.
 *
 * En la Web los tokens son variables CSS: escribir `--color-primary` en
 * `document.documentElement` repinta todo el documento sin tocar los estilos. React
 * Native no tiene ese mecanismo y `StyleSheet.create` congela los valores en el momento
 * de crearlos, así que aquí se reproduce el mismo efecto reconstruyendo la hoja de
 * estilos cuando cambia la paleta.
 *
 * El resultado se usa igual que un `StyleSheet` normal, por eso los `.styles.ts` solo
 * cambian la línea de apertura y nada de cómo se consumen:
 *
 * ```ts
 * export const styles = createThemeStyles(() =>
 *   StyleSheet.create({ card: { backgroundColor: Theme.colors.surface } }),
 * );
 * ```
 *
 * La fábrica tiene que ser perezosa: si el objeto de estilos se creara al importar el
 * módulo, `Theme.colors` se leería una sola vez (con la paleta por defecto) y el
 * `StyleSheet.create` reconstruido no cambiaría ningún color.
 *
 * Solo repinta lo que vuelve a renderizarse: las pantallas deben leerse con `useTheme` y
 * remontarse al cambiar de paleta para que React relea estos estilos.
 */
export function createThemeStyles<T extends StyleSheet.NamedStyles<any>>(
  build: () => T,
): T {
  let builtFor: ThemePalette | null = null;
  let built: T | null = null;

  const sheet = (): T => {
    const palette = getActivePalette();
    if (built === null || builtFor !== palette) {
      builtFor = palette;
      built = build();
    }
    return built;
  };

  return new Proxy({} as T, {
    get: (_target, key) => (sheet() as Record<PropertyKey, unknown>)[key],
    has: (_target, key) => key in sheet(),
    ownKeys: () => Reflect.ownKeys(sheet()),
    getOwnPropertyDescriptor: (_target, key) => {
      const descriptor = Reflect.getOwnPropertyDescriptor(sheet(), key);
      // El target del proxy está vacío, así que toda clave reportada debe ser
      // reconfigurable para no violar los invariantes de `Object.getOwnPropertyDescriptor`.
      return descriptor ? { ...descriptor, configurable: true } : undefined;
    },
  });
}

/**
 * `Theme.colors` como lectura dinámica de la paleta activa: cubre los tokens que se leen
 * en el render (`<Ionicons color={Theme.colors.primary} />`, gráficos, etc.) en lugar de
 * dentro de un `StyleSheet`.
 */
export function createColorsProxy(): ThemeColors {
  return new Proxy({} as ThemeColors, {
    get: (_target, key) => (getActiveColors() as Record<PropertyKey, unknown>)[key],
    has: (_target, key) => key in getActiveColors(),
    ownKeys: () => Reflect.ownKeys(getActiveColors()),
    getOwnPropertyDescriptor: (_target, key) => {
      const descriptor = Reflect.getOwnPropertyDescriptor(getActiveColors(), key);
      return descriptor ? { ...descriptor, configurable: true } : undefined;
    },
  });
}