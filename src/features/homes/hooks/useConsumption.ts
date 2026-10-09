import { useCallback, useEffect, useState } from "react";

import type { ApiError } from "@/services/http";
import {
  measurementApi,
  type ConsumptionPeriod,
  type HomeConsumptionHistory,
  type HomeConsumptionSummary,
} from "@/services/measurement";

/**
 * Resumen de consumo del hogar. No depende del periodo, así que se carga una vez
 * por hogar y se reutiliza al cambiar de pestaña.
 */
export interface ConsumptionSummaryState {
  summary: HomeConsumptionSummary | null;
  loading: boolean;
  error: ApiError | null;
  reload: () => Promise<void>;
}

export function useConsumptionSummary(homeId: string): ConsumptionSummaryState {
  const [summary, setSummary] = useState<HomeConsumptionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSummary(await measurementApi.getConsumptionSummary(homeId));
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [homeId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos estándar
    void reload();
  }, [reload]);

  return { summary, loading, error, reload };
}

/**
 * Historial de consumo. Se recarga al cambiar de periodo; mientras llega el
 * pedido se conserva el anterior solo si es del mismo filtro, para que cambiar
 * de día a mes no muestre un mes con etiquetas de día.
 */
export interface ConsumptionHistoryState {
  history: HomeConsumptionHistory | null;
  loading: boolean;
  error: ApiError | null;
  reload: () => Promise<void>;
}

export function useConsumptionHistory(
  homeId: string,
  period: ConsumptionPeriod,
): ConsumptionHistoryState {
  const [history, setHistory] = useState<HomeConsumptionHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setHistory(await measurementApi.getConsumptionHistory(homeId, period));
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [homeId, period]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos estándar
    void reload();
  }, [reload]);

  return {
    // La respuesta del periodo pedido manda; la anterior solo se muestra si es
    // del mismo periodo.
    history: history && history.period === period ? history : null,
    loading,
    error,
    reload,
  };
}