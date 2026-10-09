import { useCallback, useEffect, useState } from "react";

import type { ApiError } from "@/services/http";
import {
  measurementApi,
  type ConsumptionPeriod,
  type HomeConsumptionHistory,
  type HomeConsumptionSummary,
} from "@/services/measurement";
import { useIsAppActive } from "./useIsAppActive";

/**
 * Resumen de consumo del hogar. No depende del periodo, así que se carga una vez
 * por hogar y se reutiliza al cambiar de pestaña.
 *
 * El módulo publica cada 60 s; se consulta cada 30 para no llegar tarde al dato
 * sin multiplicar la red.
 */
const SUMMARY_REFRESH_MS = 30_000;

export interface ConsumptionSummaryState {
  summary: HomeConsumptionSummary | null;
  loading: boolean;
  error: ApiError | null;
  reload: () => Promise<void>;
}

export function useConsumptionSummary(homeId: string): ConsumptionSummaryState {
  const isActive = useIsAppActive();
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

  // Solo con la app en primer plano: una consulta que no se ve es batería
  // gastada sin nada a cambio.
  useEffect(() => {
    if (!isActive) return;
    const timer = setInterval(() => {
      void reload();
    }, SUMMARY_REFRESH_MS);
    return () => clearInterval(timer);
  }, [isActive, reload]);

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