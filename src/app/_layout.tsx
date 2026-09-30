import { HomeProvider } from "@/context/HomeContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserContext";
import i18n, { resolveInitialLanguage } from "@/i18n";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    // El idioma guardado o el del dispositivo se resuelven antes de pintar para
    // evitar el parpadeo en español de alguien que ya eligió otro idioma.
    resolveInitialLanguage().finally(() => {
      if (active) setReady(true);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <HomeProvider>
          <UserProvider>
            <StatusBar style="light" />
            {ready ? <Stack screenOptions={{ headerShown: false }} /> : null}
          </UserProvider>
        </HomeProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}