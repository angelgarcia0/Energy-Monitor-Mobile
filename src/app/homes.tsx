import { Redirect } from "expo-router";

/**
 * La lista de hogares vive en el inicio (dashboard) y cada hogar en /home/[id]. Esta ruta
 * solo existía como pantalla temporal; un enlace viejo a ella lleva al inicio en lugar de
 * mostrar un texto provisional.
 */
export default function HomesScreen() {
  return <Redirect href="/dashboard" />;
}
