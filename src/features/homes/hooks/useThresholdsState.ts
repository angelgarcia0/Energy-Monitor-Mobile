import { useCallback, useEffect, useMemo, useState } from "react";

import type { ApiError } from "@/services/http";
import { homeApi, type LimitPeriod } from "@/services/home";
import type { Thresholds } from "../data/thresholds";

/**
 * Umbrales del hogar contra el backend.
 *
 * El backend guarda **un** límite y deriva el otro a 30 días
 * (`HomeThresholds.setLimit`), así que la respuesta siempre trae un par
 * coherente. Aquí se expone ese par con los nombres que usa la pantalla, más el
 * periodo que el dueño fijó para saber cuál campo es editable.
 *
 * No hay forma de volver a los valores del sistema: `resetToDefaults` existe en
 * el dominio pero ningún endpoint lo llama. Por eso `useDefaults` se lee pero no
 * se puede volver a activar desde el cliente.
 */
export interface ThresholdsState {
  thresholds: Thresholds | null;
  /** Periodo con el límite editable, según lo último que fijó el dueño. */
  limitPeriod: LimitPeriod;
  loading: boolean;
  error: ApiError | null;
  saving: boolean;
  saveError: ApiError | null;
  reload: () => Promise<void>;
  /** `true` si se guardó: la pantalla solo confirma en ese caso. */
  save: (period: LimitPeriod, limit: number) => Promise<boolean>;
}

export function useThresholdsState(homeId: string): ThresholdsState {
  const [thresholds, setThresholds] = useState<Thresholds | null>(null);
  const [limitPeriod, setLimitPeriod] = useState<LimitPeriod>("DAILY");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await homeApi.getThresholds(homeId);
      setThresholds({
        daily: data.dailyLimit,
        monthly: data.monthlyLimit,
        useDefaults: data.useSystemDefault,
      });
      setLimitPeriod(data.limitPeriod);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [homeId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos estándar
    void load();
  }, [load]);

  const save = useCallback(
    async (period: LimitPeriod, limit: number) => {
      setSaving(true);
      setSaveError(null);
      try {
        const data = await homeApi.updateThresholds(homeId, {
          limitPeriod: period,
          limit,
        });
        setThresholds({
          daily: data.dailyLimit,
          monthly: data.monthlyLimit,
          useDefaults: data.useSystemDefault,
        });
        setLimitPeriod(data.limitPeriod);
        return true;
      } catch (err) {
        setSaveError(err as ApiError);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [homeId],
  );

  return useMemo(
    () => ({
      thresholds,
      limitPeriod,
      loading,
      error,
      saving,
      saveError,
      reload: load,
      save,
    }),
    [thresholds, limitPeriod, loading, error, saving, saveError, load, save],
  );
}