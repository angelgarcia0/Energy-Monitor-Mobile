import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";

export interface LanguageOption {
  id: string;
  name: string;
  locale: string;
  code: string;
}

/**
 * Única fuente de verdad de los idiomas soportados. `LanguageSettings` y
 * `LanguageSwitcher` consumen esta lista, y `STORAGE_KEY` es la misma clave que
 * ya persistía la selección de idioma, para no crear un segundoalmacén.
 */
export const LANGUAGES: LanguageOption[] = [
  { id: "es", name: "Español", locale: "es-CO", code: "CO" },
  { id: "en", name: "English", locale: "en-US", code: "US" },
  { id: "pt", name: "Português", locale: "pt-BR", code: "BR" },
  { id: "fr", name: "Français", locale: "fr-FR", code: "FR" },
];

export const LANGUAGE_STORAGE_KEY = "lang";

export const DEFAULT_LANGUAGE = "es";

export const SUPPORTED_LANGUAGE_IDS = LANGUAGES.map((lang) => lang.id);

export function isSupportedLanguage(value: string | null | undefined): boolean {
  return !!value && SUPPORTED_LANGUAGE_IDS.includes(value);
}

/**
 * Idioma del dispositivo solo se usa cuando el usuario nunca eligió uno: una
 * preferencia guardada siempre gana sobre el locale del sistema.
 */
export function detectDeviceLanguage(): string {
  const deviceCodes = getLocales()
    .map((locale) => locale.languageCode)
    .filter((code): code is string => !!code);

  return deviceCodes.find((code) => isSupportedLanguage(code)) ?? DEFAULT_LANGUAGE;
}

export async function readStoredLanguage(): Promise<string | null> {
  try {
    const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isSupportedLanguage(stored) ? stored : null;
  } catch {
    return null;
  }
}

export async function persistLanguage(id: string): Promise<void> {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, id);
  } catch {
    // Sin persistencia el idioma sigue activo en memoria durante la sesión.
  }
}
