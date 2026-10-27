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

/** Mes y año muestran el rango real del periodo; día y semana, un texto relativo. */
const RANGE_OPTIONS: Partial<Record<FilterKey, Intl.DateTimeFormatOptions>> = {
  month: { day: "numeric", month: "long", year: "numeric" },
  year: { month: "long", year: "numeric" },
};

/**
 * Las claves del bucket son neutras a propósito (`day` → "0".."23",
 * `week`/`month` → "YYYY-MM-DD", `year` → "YYYY-MM"): la etiqueta se genera al
 * renderizar con el idioma activo, no se guarda traducida.
 *
 * `new Date("2026-10-01")` se interpreta como UTC y en zonas negativas se
 * atrasa un día, así que la fecha se arma por partes en hora local.
 */
function keyToDate(key: string): Date {
  const [year, month, day = "1"] = key.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function bucketLabel(key: string, period: FilterKey, locale: string): string {
  if (period === "day") {
    const hour = Number(key);
    return `${String(hour).padStart(2, "0")}:00`;
  }

  const date = keyToDate(key);
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
  // `null` sigue al electrodoméstico que más consumió en el periodo.
  const [manualType, setManualType] = useState<string | null>(null);
  const { history, loading, error, reload } = useConsumptionHistory(
    homeId,
    activeFilter,
  );

  const subFilters = SUBFILTERS[activeFilter];
  const selectedSub = subFilters?.find((sf) => sf.key === activeSubFilter);

  // El bucket trae `{deviceId, energy}`; el tipo de electrodoméstico sale del
  // listado de dispositivos. Un `deviceId` que ya no está en la lista
  // (desvinculado durante el periodo) no cuenta en ningún tipo, igual que en la Web.
  const typeByDevice = useMemo(
    () => new Map(devices.map((device) => [device.id, device.applianceType])),
    [devices],
  );

  // Tipos realmente vinculados, en orden de catálogo para comparar de un vistazo.
  const categoryTypes = useMemo(() => {
    const present = new Set(devices.map((device) => device.applianceType));
    return APPLIANCE_TYPE_IDS.filter((type) => present.has(type));
  }, [devices]);

  const allBuckets = useMemo(() => history?.buckets ?? [], [history]);

  const rows = useMemo(() => {
    if (!selectedSub) return allBuckets;
    const [start, end] = selectedSub.range;
    return allBuckets.slice(start, Math.min(end, allBuckets.length));
  }, [allBuckets, selectedSub]);

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
        };
      }),
    [rows, typeByDevice, activeFilter, i18n.language],
  );

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

  const totalPeriod = ranking.reduce((sum, item) => sum + item.total, 0);
  const averagePerType = totalPeriod / (ranking.length || 1);

  const selectedType = manualType ?? ranking[0]?.type ?? null;
  const chartValues = selectedType
    ? series.map((point) => Number((point.perType[selectedType] ?? 0).toFixed(3)))
    : [];

  // Encabezado del gráfico: mes y año se calculan del primer y último punto del
  // periodo; día y semana usan los textos relativos traducidos.
  const dateRangeText = useMemo(() => {
    const options = RANGE_OPTIONS[activeFilter];
    if (!options || allBuckets.length === 0) return t(`history:dates.${activeFilter}`);
    const format = (key: string) => keyToDate(key).toLocaleDateString(i18n.language, options);
    const first = format(allBuckets[0].key);
    const last = format(allBuckets[allBuckets.length - 1].key);
    return first === last ? first : `${first} – ${last}`;
  }, [activeFilter, allBuckets, t, i18n.language]);

  // Comparación con el periodo anterior completo. Con un subfiltro no aplica:
  // `previousTotal` es de todo el periodo, no de la porción elegida.
  // trend: "up" (consume más, en rojo), "down" (consume menos, en verde) o null.
  const previousTotal = history?.previousTotal ?? null;
  const comparison = useMemo((): { text: string; trend: "up" | "down" | null } | null => {
    if (activeSubFilter) return { text: t("history:stats.intervalOnly"), trend: null };
    if (previousTotal === null) return null;
    if (previousTotal === 0) return { text: t("history:stats.noPrevious"), trend: null };
    const pct = Math.round(((totalPeriod - previousTotal) / previousTotal) * 100);
    return {
      text: t("history:stats.vsPrevious", {
        sign: pct > 0 ? "↑" : pct < 0 ? "↓" : "=",
        pct: Math.abs(pct),
      }),
      trend: pct > 0 ? "up" : pct < 0 ? "down" : null,
    };
  }, [activeSubFilter, previousTotal, totalPeriod, t]);

  // Al cambiar de periodo o de intervalo se vuelve a seguir al mayor consumidor.
  const selectFilter = (filter: FilterKey) => {
    setActiveFilter(filter);
    setActiveSubFilter(null);
    setManualType(null);
  };
  const selectSubFilter = (subFilter: string | null) => {
    setActiveSubFilter(subFilter);
    setManualType(null);
  };

  const needsScroll = series.length > 8;
  const chartWidth = needsScroll
    ? series.length * BAR_SLOT_WIDTH
    : width - Theme.spacing.md * 4;

  const ready = !loading && !error && history !== null;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {FILTERS.map((filter) => (
          <Pressable
            key={filter}
            onPress={() => selectFilter(filter)}
            accessibilityRole="button"
            accessibilityState={{ selected: activeFilter === filter }}
            style={[styles.chip, activeFilter === filter && styles.chipActive]}
          >
            <Text style={[styles.chipText, activeFilter === filter && styles.chipTextActive]}>
              {t(`history:filters.${filter}`)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {subFilters ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {/* "Todo" siempre visible: cambiar de intervalo no mueve los botones. */}
          {[null, ...subFilters.map((sf) => sf.key)].map((key) => (
            <Pressable
              key={key ?? "all"}
              onPress={() => selectSubFilter(key)}
              accessibilityRole="button"
              accessibilityState={{ selected: activeSubFilter === key }}
              style={[styles.chip, activeSubFilter === key && styles.chipSoftActive]}
            >
              <Text style={[styles.chipText, activeSubFilter === key && styles.chipSoftActiveText]}>
                {key
                  ? t(`history:subfilters.${activeFilter}.${key}`)
                  : t("history:subfilters.showAll")}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}

      <Card>
        <Text style={styles.title}>{t(`history:chart.title.${activeFilter}`)}</Text>
        <Text style={styles.date}>{dateRangeText}</Text>

        {categoryTypes.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {categoryTypes.map((type) => (
              <Pressable
                key={type}
                onPress={() => setManualType(type)}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedType === type }}
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

        {ready && chartValues.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Chart
              type="bar"
              width={chartWidth}
              height={300}
              style={styles.chart}
              decimalPlaces={2}
              // Con muchas barras los valores se encimarían; el eje Y da la escala.
              showValues={false}
              data={{
                labels: series.map((point) => point.label),
                datasets: [{ data: chartValues }],
              }}
            />
          </ScrollView>
        ) : null}

        {ready && chartValues.length === 0 ? (
          <Text style={styles.empty}>
            {t(devices.length ? "history:chart.noData" : "history:chart.empty")}
          </Text>
        ) : null}
      </Card>

      {ready && ranking.length > 0 ? (
        <Card>
          <Text style={styles.title}>{t("history:summary.title")}</Text>

          <View style={styles.statMain}>
            <Text style={styles.statLabel}>{t("history:stats.totalConsumption")}</Text>
            <Text style={styles.statValue}>{totalPeriod.toFixed(2)} kWh</Text>
            {comparison ? (
              <Text
                style={[
                  styles.statSub,
                  comparison.trend === "up" && styles.trendUp,
                  comparison.trend === "down" && styles.trendDown,
                ]}
              >
                {comparison.text}
              </Text>
            ) : null}
          </View>

          <View style={styles.statRow}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>{t("history:stats.periodAverage")}</Text>
              <Text style={styles.statSmallValue}>{averagePerType.toFixed(2)} kWh</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>{t("history:stats.topConsumer")}</Text>
              <Text style={styles.statSmallValue} numberOfLines={1}>
                {ranking[0].name}
              </Text>
            </View>
          </View>

          <Text style={[styles.title, styles.rankingTitle]}>
            {t("history:ranking.title")}
          </Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, styles.colPosition]}>
              {t("history:ranking.headers.position")}
            </Text>
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
    </ScrollView>
  );
}
