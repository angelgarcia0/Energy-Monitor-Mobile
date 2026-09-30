import i18n, {
  changeLanguage as changeLanguageInstance,
  use as registerPlugin,
} from "i18next";
import { initReactI18next } from "react-i18next";

import {
  DEFAULT_LANGUAGE,
  detectDeviceLanguage,
  isSupportedLanguage,
  LANGUAGES,
  LANGUAGE_STORAGE_KEY,
  persistLanguage,
  readStoredLanguage,
} from "./languages";
import en from "./locales/en/account.json";
import enAuth from "./locales/en/auth.json";
import enAuthLayout from "./locales/en/authLayout.json";
import enConsumption from "./locales/en/consumption.json";
import enCreateHomeModal from "./locales/en/createHomeModal.json";
import enDashboard from "./locales/en/dashboard.json";
import enDevices from "./locales/en/devices.json";
import enEmptyState from "./locales/en/emptyState.json";
import enFavorites from "./locales/en/favorites.json";
import enHistory from "./locales/en/history.json";
import enHome from "./locales/en/home.json";
import enHomes from "./locales/en/homes.json";
import enHomeCard from "./locales/en/homeCard.json";
import enHomeNotFound from "./locales/en/homeNotFound.json";
import enJoinHomeModal from "./locales/en/joinHomeModal.json";
import enLanguageSwitcher from "./locales/en/languageSwitcher.json";
import enLinkDeviceModal from "./locales/en/linkDeviceModal.json";
import enNotifications from "./locales/en/notifications.json";
import enRecoverPassword from "./locales/en/recoverPassword.json";
import enSettings from "./locales/en/settings.json";
import enSidebar from "./locales/en/sidebar.json";
import enThresholds from "./locales/en/thresholds.json";
import enUsers from "./locales/en/users.json";
import enValidations from "./locales/en/validations.json";
import es from "./locales/es/account.json";
import esAuth from "./locales/es/auth.json";
import esAuthLayout from "./locales/es/authLayout.json";
import esConsumption from "./locales/es/consumption.json";
import esCreateHomeModal from "./locales/es/createHomeModal.json";
import esDashboard from "./locales/es/dashboard.json";
import esDevices from "./locales/es/devices.json";
import esEmptyState from "./locales/es/emptyState.json";
import esFavorites from "./locales/es/favorites.json";
import esHistory from "./locales/es/history.json";
import esHome from "./locales/es/home.json";
import esHomes from "./locales/es/homes.json";
import esHomeCard from "./locales/es/homeCard.json";
import esHomeNotFound from "./locales/es/homeNotFound.json";
import esJoinHomeModal from "./locales/es/joinHomeModal.json";
import esLanguageSwitcher from "./locales/es/languageSwitcher.json";
import esLinkDeviceModal from "./locales/es/linkDeviceModal.json";
import esNotifications from "./locales/es/notifications.json";
import esRecoverPassword from "./locales/es/recoverPassword.json";
import esSettings from "./locales/es/settings.json";
import esSidebar from "./locales/es/sidebar.json";
import esThresholds from "./locales/es/thresholds.json";
import esUsers from "./locales/es/users.json";
import esValidations from "./locales/es/validations.json";
import fr from "./locales/fr/account.json";
import frAuth from "./locales/fr/auth.json";
import frAuthLayout from "./locales/fr/authLayout.json";
import frConsumption from "./locales/fr/consumption.json";
import frCreateHomeModal from "./locales/fr/createHomeModal.json";
import frDashboard from "./locales/fr/dashboard.json";
import frDevices from "./locales/fr/devices.json";
import frEmptyState from "./locales/fr/emptyState.json";
import frFavorites from "./locales/fr/favorites.json";
import frHistory from "./locales/fr/history.json";
import frHome from "./locales/fr/home.json";
import frHomes from "./locales/fr/homes.json";
import frHomeCard from "./locales/fr/homeCard.json";
import frHomeNotFound from "./locales/fr/homeNotFound.json";
import frJoinHomeModal from "./locales/fr/joinHomeModal.json";
import frLanguageSwitcher from "./locales/fr/languageSwitcher.json";
import frLinkDeviceModal from "./locales/fr/linkDeviceModal.json";
import frNotifications from "./locales/fr/notifications.json";
import frRecoverPassword from "./locales/fr/recoverPassword.json";
import frSettings from "./locales/fr/settings.json";
import frSidebar from "./locales/fr/sidebar.json";
import frThresholds from "./locales/fr/thresholds.json";
import frUsers from "./locales/fr/users.json";
import frValidations from "./locales/fr/validations.json";
import pt from "./locales/pt/account.json";
import ptAuth from "./locales/pt/auth.json";
import ptAuthLayout from "./locales/pt/authLayout.json";
import ptConsumption from "./locales/pt/consumption.json";
import ptCreateHomeModal from "./locales/pt/createHomeModal.json";
import ptDashboard from "./locales/pt/dashboard.json";
import ptDevices from "./locales/pt/devices.json";
import ptEmptyState from "./locales/pt/emptyState.json";
import ptFavorites from "./locales/pt/favorites.json";
import ptHistory from "./locales/pt/history.json";
import ptHome from "./locales/pt/home.json";
import ptHomes from "./locales/pt/homes.json";
import ptHomeCard from "./locales/pt/homeCard.json";
import ptHomeNotFound from "./locales/pt/homeNotFound.json";
import ptJoinHomeModal from "./locales/pt/joinHomeModal.json";
import ptLanguageSwitcher from "./locales/pt/languageSwitcher.json";
import ptLinkDeviceModal from "./locales/pt/linkDeviceModal.json";
import ptNotifications from "./locales/pt/notifications.json";
import ptRecoverPassword from "./locales/pt/recoverPassword.json";
import ptSettings from "./locales/pt/settings.json";
import ptSidebar from "./locales/pt/sidebar.json";
import ptThresholds from "./locales/pt/thresholds.json";
import ptUsers from "./locales/pt/users.json";
import ptValidations from "./locales/pt/validations.json";

const esResources = {
  account: es,
  auth: esAuth,
  authLayout: esAuthLayout,
  consumption: esConsumption,
  createHomeModal: esCreateHomeModal,
  dashboard: esDashboard,
  devices: esDevices,
  emptyState: esEmptyState,
  favorites: esFavorites,
  history: esHistory,
  home: esHome,
  homeCard: esHomeCard,
  homes: esHomes,
  homeNotFound: esHomeNotFound,
  joinHomeModal: esJoinHomeModal,
  languageSwitcher: esLanguageSwitcher,
  linkDeviceModal: esLinkDeviceModal,
  notifications: esNotifications,
  recoverPassword: esRecoverPassword,
  settings: esSettings,
  sidebar: esSidebar,
  thresholds: esThresholds,
  users: esUsers,
  validations: esValidations,
};

const enResources = {
  account: en,
  auth: enAuth,
  authLayout: enAuthLayout,
  consumption: enConsumption,
  createHomeModal: enCreateHomeModal,
  dashboard: enDashboard,
  devices: enDevices,
  emptyState: enEmptyState,
  favorites: enFavorites,
  history: enHistory,
  home: enHome,
  homeCard: enHomeCard,
  homes: enHomes,
  homeNotFound: enHomeNotFound,
  joinHomeModal: enJoinHomeModal,
  languageSwitcher: enLanguageSwitcher,
  linkDeviceModal: enLinkDeviceModal,
  notifications: enNotifications,
  recoverPassword: enRecoverPassword,
  settings: enSettings,
  sidebar: enSidebar,
  thresholds: enThresholds,
  users: enUsers,
  validations: enValidations,
};

const frResources = {
  account: fr,
  auth: frAuth,
  authLayout: frAuthLayout,
  consumption: frConsumption,
  createHomeModal: frCreateHomeModal,
  dashboard: frDashboard,
  devices: frDevices,
  emptyState: frEmptyState,
  favorites: frFavorites,
  history: frHistory,
  home: frHome,
  homeCard: frHomeCard,
  homes: frHomes,
  homeNotFound: frHomeNotFound,
  joinHomeModal: frJoinHomeModal,
  languageSwitcher: frLanguageSwitcher,
  linkDeviceModal: frLinkDeviceModal,
  notifications: frNotifications,
  recoverPassword: frRecoverPassword,
  settings: frSettings,
  sidebar: frSidebar,
  thresholds: frThresholds,
  users: frUsers,
  validations: frValidations,
};

const ptResources = {
  account: pt,
  auth: ptAuth,
  authLayout: ptAuthLayout,
  consumption: ptConsumption,
  createHomeModal: ptCreateHomeModal,
  dashboard: ptDashboard,
  devices: ptDevices,
  emptyState: ptEmptyState,
  favorites: ptFavorites,
  history: ptHistory,
  home: ptHome,
  homeCard: ptHomeCard,
  homes: ptHomes,
  homeNotFound: ptHomeNotFound,
  joinHomeModal: ptJoinHomeModal,
  languageSwitcher: ptLanguageSwitcher,
  linkDeviceModal: ptLinkDeviceModal,
  notifications: ptNotifications,
  recoverPassword: ptRecoverPassword,
  settings: ptSettings,
  sidebar: ptSidebar,
  thresholds: ptThresholds,
  users: ptUsers,
  validations: ptValidations,
};

void registerPlugin(initReactI18next).init({
  compatibilityJSON: "v4",
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: ["es", "en", "fr", "pt"],
  // Los recursos son estáticos: no hace falta backend ni detección asíncrona
  // para traducir, así que `t()` es síncrono incluso fuera de componentes.
  resources: {
    es: esResources,
    en: enResources,
    fr: frResources,
    pt: ptResources,
  },
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

/**
 * Resuelve el idioma inicial: preferencia guardada > locale del dispositivo >
 * español. Se ejecuta antes de montar el provider para no parpadear con un
 * idioma que el usuario no eligió.
 */
export async function resolveInitialLanguage(): Promise<string> {
  const stored = await readStoredLanguage();
  const initial = stored ?? detectDeviceLanguage();

  if (isSupportedLanguage(initial) && initial !== i18n.language) {
    await changeLanguageInstance(initial);
  }

  return i18n.language;
}

/** Cambio de idioma disparado por el usuario: traduce y persiste a la vez. */
export async function changeLanguage(id: string): Promise<void> {
  if (!isSupportedLanguage(id)) return;

  await changeLanguageInstance(id);
  await persistLanguage(id);
}

export {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  LANGUAGE_STORAGE_KEY,
  isSupportedLanguage,
};

export default i18n;
