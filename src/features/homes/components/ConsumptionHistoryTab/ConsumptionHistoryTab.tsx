import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { Chart } from "@/components/Chart/Chart";
import { Loader } from "@/components/Loader/Loader";
import { Theme } from "@/constants/theme";
import { errorMessage } from "@/services/http";
import type { ConsumptionPeriod } from "@/services/measurement";
import { useConsumptionHistory } from "../../hooks/useConsumption";
import { styles } from "./ConsumptionHistoryTab.styles";

export interface ConsumptionHistoryTabProps {
  homeId: string;
}

type FilterKey = ConsumptionPeriod;

interface SubFilter {
  key: string;
  /** `[desde, hasta)`; `Infinity` llega hasta el final del periodo. */
  range: [number, number];
}

const FILTERS: FilterKey[] = ["day", "week", "month", "year"];

const SUBFILTERS: Record<FilterKey, SubFilter[] | null> = {
  day: [
    { key: "0-6", range: [0, 6] },
    { key: "6-12", range: [6, 12] },
    { key: "12-18", range: [12, 18] },
    { key: "18-24", range: [18, 24] },
  ],
  week: null,
  month: [
    { key: "sem1", range: [0, 7] },
    { key: "sem2", range: [7, 14] },
    { key: "sem3", range: [14, 21] },
    { key: "sem4", range: [21, Infinity] },
  ],
  year: [
    { key: "q1", range: [0, 3] },
    { key: "q2", range: [3, 6] },
    { key: "q3", range: [6, 9] },
    { key: "q4", range: [9, 12] },
  ],
};

/**
 * Las claves del bucket son neutras a propósito (`day` → "0".."23",
 * `week`/`month` → "YYYY-MM-DD", `year` → "YYYY-MM"): la etiqueta se genera al
 * renderizar con el idioma activo, no se guarda traducida.
 *
 * `new Date("2026-10-01")` se interpreta como UTC y en zonas negativas se
 * atrasa un día, así que la fecha se arma por partes en hora local.
 */
function bucketLabel(key: string, period: FilterKey, locale: string): string {
  if (period === "day") {
    const hour = Number(key);
    return `${String(hour).padStart(2, "0")}:00`;
  }

  const [year, month, day = "1"] = key.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  if (period === "week") {
    return date.toLocaleDateString(locale, { weekday: "short" });
  }
  if (period === "month") {
    return date.toLocaleDateString(locale, { day: "2-digit" });
  }
  return date.toLocaleDateString(locale, { month: "short" });
}

const BAR_SLOT_WIDTH = Theme.spacing.xl + Theme.spacing.lg;

export function ConsumptionHistoryTab({ homeId }: ConsumptionHistoryTabProps) {
  const { t, i18n } = useTranslation(["history", "devices"]);
  const { width } = useWindowDimensions();

  const [activeFilter, setActiveFilter] = useState<FilterKey>("month");
  const [activeSubFilter, setActiveSubFilter] = useState<string | null>(null);
  const { history, loading, error, reload } = useConsumptionHistory(
    homeId,
    activeFilter,
  );

  const subFilters = SUBFILTERS[activeFilter];
  const selectedSub = subFilters?.find((sf) => sf.key === activeSubFilter);

  const rows = useMemo(() => {
    const buckets = history?.buckets ?? [];
    if (!selectedSub) return buckets;
    const [start, end] = selectedSub.range;
    return buckets.slice(start, Math.min(end, buckets.length));
  }, [history, selectedSub]);

  // Sin `GET /homes/{id}/devices` no hay forma de saber a qué electrodoméstico
  // pertenece cada `deviceId`, así que el desglose es por bucket, no por equipo.
  const series = useMemo(
    () =>
      rows.map((bucket) => ({
        label: bucketLabel(bucket.key, activeFilter, i18n.language),
        total: Number(
          bucket.devices.reduce((sum, d) => sum + d.energy, 0).toFixed(3),
        ),
      })),
    [rows, activeFilter, i18n.language],
  );

  const totalPeriod = useMemo(
    () => series.reduce((sum, point) => sum + point.total, 0),
    [series],
  );

  const average = series.length ? totalPeriod / series.length : 0;
  const previousTotal = history?.previousTotal ?? null;

  // La comparación solo tiene sentido sobre el periodo completo: con un
  // subfiltro, `previousTotal` es de todo el periodo y no de laportion elegida.
  const comparison = useMemo(() => {
    if (activeSubFilter || previousTotal === null) return t("history:stats.periodTotal");
    if (previousTotal === 0) return t("history:stats.noPrevious");
    const pct = Math.round(((totalPeriod - previousTotal) / previousTotal) * 100);
    return t("history:stats.vsPrevious", {
      sign: pct > 0 ? "↑" : pct < 0 ? "↓" : "=",
      pct: Math.abs(pct),
    });
  }, [activeSubFilter, previousTotal, totalPeriod, t]);

  const handleFilter = (filter: FilterKey) => {
    setActiveFilter(filter);
    setActiveSubFilter(null);
  };

  const needsScroll = series.length > 8;
  const chartWidth = needsScroll
    ? series.length * BAR_SLOT_WIDTH
    : width - Theme.spacing.md * 4;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {FILTERS.map((filter) => (
          <Pressable
            key={filter}
            onPress={() => handleFilter(filter)}
            style={[styles.chip, activeFilter === filter && styles.chipActive]}
          >
            <Text style={[styles.chipText, activeFilter === filter && styles.chipTextActive]}>
              {t(`history:filters.${filter}`)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <Text style={styles.date}>
        {t(`history:dates.${activeFilter}`)}
      </Text>

      {subFilters ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {subFilters.map((sf) => (
            <Pressable
              key={sf.key}
              onPress={() => setActiveSubFilter(sf.key)}
              style={[styles.chip, activeSubFilter === sf.key && styles.chipSoftActive]}
            >
              <Text style={[styles.chipText, activeSubFilter === sf.key && styles.chipSoftActiveText]}>
                {t(`history:subfilters.${activeFilter}.${sf.key}`)}
              </Text>
            </Pressable>
          ))}
          {activeSubFilter ? (
            <Pressable onPress={() => setActiveSubFilter(null)} style={styles.chip}>
              <Text style={styles.clearText}>
                {t("history:subfilters.showAll")}
              </Text>
            </Pressable>
          ) : null}
        </ScrollView>
      ) : null}

      <Card>
        <Text style={styles.title}>{t("history:chart.title")}</Text>

        {loading ? <Loader text={t("history:state.loading")} /> : null}

        {error ? (
          <View style={styles.empty}>
            <Text style={styles.empty} accessibilityRole="alert">
              {errorMessage(t, error)}
            </Text>
            <Button variant="secondary" onPress={() => void reload()}>
              {t("history:state.retry")}
            </Button>
          </View>
        ) : null}

        {!loading && !error && series.length === 0 ? (
          <Text style={styles.empty}>{t("history:chart.empty")}</Text>
        ) : null}

        {!loading && !error && series.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Chart
              type="bar"
              width={chartWidth}
              height={300}
              style={styles.chart}
              data={{
                labels: series.map((point) => point.label),
                datasets: [{ data: series.map((point) => point.total) }],
              }}
            />
          </ScrollView>
        ) : null}
      </Card>

      {!loading && !error && series.length > 0 ? (
        <>
          <Card>
            <Text style={styles.statLabel}>
              {t("history:stats.totalConsumption")}
            </Text>
            <Text style={styles.statValue}>{totalPeriod.toFixed(2)} kWh</Text>
            <Text style={styles.statSub}>{comparison}</Text>
          </Card>
          <Card>
            <Text style={styles.statLabel}>{t("history:stats.average")}</Text>
            <Text style={styles.statValue}>{average.toFixed(2)} kWh</Text>
            <Text style={styles.statSub}>{t("history:stats.periodAverage")}</Text>
          </Card>
        </>
      ) : null}
    </ScrollView>
  );
}