import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { Chart } from "@/components/Chart/Chart";
import { Loader } from "@/components/Loader/Loader";
import { Theme } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { errorMessage } from "@/services/http";
import type { ConsumptionPeriod } from "@/services/measurement";
import { getDeviceColor } from "../../data/deviceChartColors";
import {
  APPLIANCE_TYPE_IDS,
  getApplianceLabel,
  type Device,
} from "../../data/deviceTypes";
import { useConsumptionHistory } from "../../hooks/useConsumption";
import { styles } from "./ConsumptionHistoryTab.styles";

export interface ConsumptionHistoryTabProps {
  homeId: string;
  /**
   * Los buckets traen `{deviceId, energy}` y sin el listado de dispositivos no
   * hay forma de saber a qué electrodoméstico pertenece cada id. Sin esto el
   * gráfico es el total del hogar y no hay ranking.
   */
  devices: Device[];
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

export function ConsumptionHistoryTab({ homeId, devices }: ConsumptionHistoryTabProps) {
  const { t, i18n } = useTranslation(["history", "devices"]);
  const { width } = useWindowDimensions();
  const { currentTheme } = useTheme();
  const mode = currentTheme.mode;

  const [activeFilter, setActiveFilter] = useState<FilterKey>("month");
  const [activeSubFilter, setActiveSubFilter] = useState<string | null>(null);
  const { history, loading, error, reload } = useConsumptionHistory(
    homeId,
    activeFilter,
  );

  const subFilters = SUBFILTERS[activeFilter];
  const selectedSub = subFilters?.find((sf) => sf.key === activeSubFilter);

  // El bucket trae `{deviceId, energy}`; el tipo de electrodoméstico sale del
  // listado de dispositivos. Un `deviceId` que ya no está en la lista (desvinculado
  // durante el periodo) no se cuela en ningún tipo: su energía se suma al total
  // del hogar pero no aparece en el ranking, que es lo que se ve.
  const typeByDevice = useMemo(
    () => new Map(devices.map((device) => [device.id, device.applianceType])),
    [devices],
  );

  // Tipos realmente vinculados, en orden de catálogo para comparar de un vistazo.
  const categoryTypes = useMemo(() => {
    const present = new Set(devices.map((device) => device.applianceType));
    return APPLIANCE_TYPE_IDS.filter((type) => present.has(type));
  }, [devices]);

  const [manualType, setManualType] = useState<string | null>(null);

  const rows = useMemo(() => {
    const buckets = history?.buckets ?? [];
    if (!selectedSub) return buckets;
    const [start, end] = selectedSub.range;
    return buckets.slice(start, Math.min(end, buckets.length));
  }, [history, selectedSub]);

  const series = useMemo(
    () =>
      rows.map((bucket) => {
        const perType: Partial<Record<string, number>> = {};
        bucket.devices.forEach(({ deviceId, energy }) => {
          const type = typeByDevice.get(deviceId);
          if (type) perType[type] = (perType[type] ?? 0) + energy;
        });
        return {
          label: bucketLabel(bucket.key, activeFilter, i18n.language),
          perType,
          total: Number(bucket.devices.reduce((sum, d) => sum + d.energy, 0).toFixed(3)),
        };
      }),
    [rows, typeByDevice, activeFilter, i18n.language],
  );

  const totalPeriod = useMemo(
    () => series.reduce((sum, point) => sum + point.total, 0),
    [series],
  );

  const average = series.length ? totalPeriod / series.length : 0;
  const previousTotal = history?.previousTotal ?? null;

  const ranking = useMemo(
    () =>
      categoryTypes
        .map((type) => ({
          type,
          name: getApplianceLabel(t, type),
          total: series.reduce((sum, point) => sum + (point.perType[type] ?? 0), 0),
        }))
        .sort((a, b) => b.total - a.total),
    [categoryTypes, series, t],
  );

  // Sin selección manual sigue al electrodoméstico que más consumió.
  const selectedType = manualType ?? ranking[0]?.type ?? null;
  const chartValues = selectedType
    ? series.map((point) => Number((point.perType[selectedType] ?? 0).toFixed(3)))
    : [];

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

        {!loading && !error && series.length > 0 && categoryTypes.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {categoryTypes.map((type) => (
              <Pressable
                key={type}
                onPress={() => setManualType(type)}
                style={[styles.chip, selectedType === type && styles.chipSoftActive]}
              >
                <View style={[styles.dot, { backgroundColor: getDeviceColor(type, mode) }]} />
                <Text style={[styles.chipText, selectedType === type && styles.chipSoftActiveText]}>
                  {getApplianceLabel(t, type)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        ) : null}

        {!loading && !error && series.length === 0 ? (
          <Text style={styles.empty}>{t("history:chart.empty")}</Text>
        ) : null}

        {!loading && !error && chartValues.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Chart
              type="bar"
              width={chartWidth}
              height={300}
              style={styles.chart}
              data={{
                labels: series.map((point) => point.label),
                datasets: [{ data: chartValues }],
              }}
            />
          </ScrollView>
        ) : null}

        {!loading && !error && chartValues.length === 0 && series.length > 0 ? (
          <Text style={styles.empty}>{t("history:chart.noData")}</Text>
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

      {!loading && !error && ranking.length > 0 ? (
        <Card>
          <Text style={styles.title}>{t("history:ranking.title")}</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, styles.colPosition]}>#</Text>
            <Text style={[styles.headerText, styles.colName]}>
              {t("history:ranking.headers.device")}
            </Text>
            <Text style={[styles.headerText, styles.colTotal]}>
              {t("history:ranking.headers.total")}
            </Text>
            <Text style={[styles.headerText, styles.colPercent]}>
              {t("history:ranking.headers.percentage")}
            </Text>
          </View>
          {ranking.map((item, index) => {
            const pct = totalPeriod ? (item.total / totalPeriod) * 100 : 0;
            return (
              <View key={item.type} style={styles.row}>
                <Text style={[styles.cellText, styles.colPosition]}>{index + 1}</Text>
                <Text style={[styles.cellText, styles.colName]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.cellText, styles.colTotal]}>
                  {item.total.toFixed(2)} kWh
                </Text>
                <View style={styles.colPercent}>
                  <Text style={styles.cellText}>{pct.toFixed(1)}%</Text>
                  <View style={styles.track}>
                    <View
                      style={[
                        styles.fill,
                        { width: `${pct}%`, backgroundColor: getDeviceColor(item.type, mode) },
                      ]}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </Card>
      ) : null}

      {!loading && !error && ranking.length > 0 ? (
        <Card>
          <Text style={styles.statLabel}>{t("history:stats.topConsumer")}</Text>
          <Text style={styles.statValue}>{ranking[0].name}</Text>
          <Text style={styles.statSub}>{ranking[0].total.toFixed(2)} kWh</Text>
        </Card>
      ) : null}
    </ScrollView>
  );
}