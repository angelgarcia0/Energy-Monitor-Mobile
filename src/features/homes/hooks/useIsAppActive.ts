import { useEffect, useState } from "react";
import { AppState } from "react-native";

/**
 * `true` mientras la app está en primer plano.
 *
 * Las consultas periódicas se detienen en segundo plano: el módulo se sigue
 * publicando, pero alguien mirando el teléfono en la calle no debería pagar la
 * red de una pantalla que no puede ver.
 */
export function useIsAppActive(): boolean {
  const [active, setActive] = useState(() => AppState.currentState === "active");

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      setActive(state === "active");
    });
    return () => subscription.remove();
  }, []);

  return active;
}