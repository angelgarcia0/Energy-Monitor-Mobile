import { useRouter, usePathname } from "expo-router";
import { useEffect, type ReactNode } from "react";

import { useUser } from "@/context/UserContext";
import { onSessionExpired } from "@/services/http/httpClient";

/**
 * Rutas públicas: las de autenticación. Cualquier otra exige sesión.
 * Los nombres de archivo de `src/app` son planos, así que basta la ruta.
 */
const PUBLIC_ROUTES = new Set([
  "/",
  "/register",
  "/recover-password",
  "/verify-account",
  "/verify-recover-password",
  "/new-password",
]);

const normalize = (pathname: string) =>
  pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

/**
 * Equivalente mobile del `ProtectedRoute` de la Web: sin sesión no se entra a las
 * pantallas privadas, y una sesión caducada devuelve al login.
 *
 * Además refresca el perfil al recuperar la sesión, para que el Sidebar tenga
 * nombre y foto aunque la sesión sea anterior al último cambio.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const { isAuthenticated, isRestoring, refresh } = useUser();
  const router = useRouter();
  const pathname = normalize(usePathname());

  // El cliente HTTP no navega: avisa que la sesión se perdió y el guard lleva al login.
  useEffect(
    () => onSessionExpired(() => router.replace("/")),
    [router],
  );

  useEffect(() => {
    if (isRestoring) return;
    if (!isAuthenticated && !PUBLIC_ROUTES.has(pathname)) {
      router.replace("/");
    }
  }, [isAuthenticated, isRestoring, pathname, router]);

  useEffect(() => {
    if (isRestoring || !isAuthenticated) return;
    refresh().catch(() => {});
  }, [isAuthenticated, isRestoring, refresh]);

  if (isRestoring) return null;

  return <>{children}</>;
}