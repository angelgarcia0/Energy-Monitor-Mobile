import { DEFAULT_THEME_ID, getThemeById, type ThemePalette } from "./palettes";

/**
 * Paleta vigente de la app. Es el equivalente mobile de `applyThemeVars` de la Web:
 * en el navegador basta con escribir las variables CSS en `document.documentElement`,
 * pero React Native no tiene variables CSS, así que los tokens se leen desde aquí.
 *
 * `StyleSheet.create` congela los valores en el momento de crearse, por eso los
 * estilos se reconstruyen al cambiar de paleta (ver `createThemeStyles`) en lugar de
 * leer los tokens de forma continua.
 */
let activePalette: ThemePalette = getThemeById(DEFAULT_THEME_ID);

export const getActivePalette = (): ThemePalette => activePalette;

export const getActiveColors = () => activePalette.colors;

/**
 * Fija la paleta vigente.
 *
 * La asignación es idempotente y sin efectos observables, así que se hace durante el
 * render del `ThemeProvider` y no en un `useEffect`: los effects del provider corren
 * después del render de sus hijos, y para entonces los hijos ya habrían construido sus
 * estilos con la paleta anterior.
 */
export const setActivePalette = (palette: ThemePalette): void => {
  activePalette = palette;
};