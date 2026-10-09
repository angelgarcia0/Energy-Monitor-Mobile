import { useMemo, useSyncExternalStore } from "react";

import {
  getCurrentPerson,
  getSessionSnapshot,
  subscribeSession,
} from "./session";

/**
 * Usuario en sesión que se actualiza solo.
 *
 * `raw` es la huella de la sesión: cambia con cada `saveSession`/`clearSession`, así
 * que basta como dependencia para releer la persona.
 */
export function useCurrentPerson() {
  const raw = useSyncExternalStore(subscribeSession, getSessionSnapshot);

  return useMemo(
    () => getCurrentPerson(),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `raw` es la huella de la sesión
    [raw],
  );
}