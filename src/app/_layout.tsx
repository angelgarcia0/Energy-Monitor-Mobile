import { HomeProvider } from "@/context/HomeContext";
import { NotificationCenterProvider } from "@/context/NotificationCenterContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserContext";
import i18n, { resolveInitialLanguage } from "@/i18n";
import { installForegroundHandler } from "@/services/notifications/pushRegistration";
import * as Notifications from "expo-notifications";
import { router, Stack, type Href } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";

import { AuthGate } from "@/components/layout/AuthGate/AuthGate";

/**
 * Ruta a la que lleva una alerta cuando el usuario la toca.
 *
 * La manda el backend en `data.path` (`ExpoPushSender.send`). Con las rutas
 * tipadas activadas, esa cadena no puede comprobarse en compilación, así que se
 * filtra en runtime: solo se acepta lo que empieza por `/`. Un dato corrupto no
 * debe abrir una pantalla inexistente ni, peor, saltar fuera de la app.
 */
function openNotification(data: unknown): void {
  const path = (data as { path?: unknown } | undefined)?.path;
  if (typeof path !== "string" || !path.startsWith("/")) return;
  router.push(path as Href);
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    // El idioma guardado o el del dispositivo se resuelven antes de pintar para
    // evitar el parpadeo en español de alguien que ya eligió otro idioma.
    resolveInitialLanguage().finally(() => {
      if (active) setReady(true);
    });

    // Sin esto, una alerta que llega con la app abierta no se muestra.
    installForegroundHandler();

    // La app puede abrirse desde una notificación: con ella en frío, la respuesta
    // ya está guardada y no llegará ningún evento.
    openNotification(
      Notifications.getLastNotificationResponse()?.notification.request.content.data,
    );

    const subscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        openNotification(response.notification.request.content.data);
      });

    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <UserProvider>
          <HomeProvider>
            <NotificationCenterProvider>
              <StatusBar style="light" />
              {ready ? (
                <AuthGate>
                  <Stack screenOptions={{ headerShown: false }} />
                </AuthGate>
              ) : null}
            </NotificationCenterProvider>
          </HomeProvider>
        </UserProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}