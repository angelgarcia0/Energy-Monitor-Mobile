import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";

import { Card } from "@/components/Card/Card";
import { Chart } from "@/components/Chart/Chart";
import { Theme } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { getDeviceColor, type ApplianceType } from "../../data/deviceChartColors";
import { APPLIANCE_TYPE_IDS, getApplianceLabel, type Device } from "../../data/deviceMocks";
import { styles } from "./ConsumptionHistoryTab.styles";

export interface ConsumptionHistoryTabProps {
  devices: Device[];
}

type FilterKey = "day" | "week" | "month" | "year";

interface HistoryRow {
  label: string;
  values: Partial<Record<ApplianceType, number>>;
}

type MockValues = Record<FilterKey, Partial<Record<ApplianceType, number>>[]>;

interface SubFilter {
  key: string;
  range: [number, number];
}

const FILTERS: { key: FilterKey; dateKey: string }[] = [
  { key: "day", dateKey: "day" },
  { key: "week", dateKey: "week" },
  { key: "month", dateKey: "month" },
  { key: "year", dateKey: "year" },
];

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
    { key: "sem4", range: [21, 30] },
  ],
  year: [
    { key: "q1", range: [0, 3] },
    { key: "q2", range: [3, 6] },
    { key: "q3", range: [6, 9] },
    { key: "q4", range: [9, 12] },
  ],
};

const WEEK_DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
const MONTH_KEYS = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
] as const;

const randomValue = (base: number, range: number) => Math.floor(Math.random() * range) + base;

/**
 * Solo los valores se generan una vez: las etiquetas se resuelven en cada
 * render para que un cambio de idioma no deje el histórico en el idioma
 * anterior ni regenere el consumo de los dispositivos.
 */
function generateMockValues(types: ApplianceType[]): MockValues {
  const build = (length: number, base: number, range: number) =>
    Array.from({ length }, () =>
      Object.fromEntries(types.map((type) => [type, randomValue(base, range)])),
    );

  return {
    day: build(24, 0, 8),
    week: build(WEEK_DAY_KEYS.length, 5, 20),
    month: build(30, 10, 30),
    year: build(MONTH_KEYS.length, 100, 200),
  };
}

const BAR_SLOT_WIDTH = Theme.spacing.xl + Theme.spacing.lg;

export function ConsumptionHistoryTab({ devices }: ConsumptionHistoryTabProps) {
  const { t } = useTranslation(["history", "devices"]);
  const { width } = useWindowDimensions();
  const { currentTheme } = useTheme();
  // Los gráficos usan la variante de la paleta activa para los colores por electrodoméstico.
  const mode = currentTheme.mode;
  const [activeFilter, setActiveFilter] = useState<FilterKey>("month");
  const [activeSubFilter, setActiveSubFilter] = useState<string | null>(null);
  const [manualType, setManualType] = useState<ApplianceType | null>(null);

  // Los valores mock se generan una sola vez para todos los tipos posibles; las
  // series de un dispositivo vinculado después ya existen y se recortan según
  // los tipos que hay en `devices`.
  const [mockValues] = useState(() => generateMockValues(APPLIANCE_TYPE_IDS));
  const categoryTypes = useMemo(() => {
    const present = new Set(devices.map((device) => device.applianceType));
    return APPLIANCE_TYPE_IDS.filter((id) => present.has(id));
  }, [devices]);

  const subFilters = SUBFILTERS[activeFilter];
  const fullRows = mockValues[activeFilter];
  const selectedSub = subFilters?.find((sf) => sf.key === activeSubFilter);
  const startIndex = selectedSub?.range[0] ?? 0;
  const endIndex = selectedSub?.range[1] ?? fullRows.length;
  const rows = useMemo<HistoryRow[]>(
    () =>
      fullRows.slice(startIndex, endIndex).map((values, offset) => {
        const index = startIndex + offset;
        const label =
          activeFilter === "day"
            ? `${index}:00`
            : activeFilter === "month"
              ? String(index + 1).padStart(2, "0")
              : activeFilter === "week"
                ? t(`history:weekDays.${WEEK_DAY_KEYS[index]}`)
                : t(`history:months.${MONTH_KEYS[index]}`);

        return { label, values };
      }),
    [fullRows, startIndex, endIndex, activeFilter, t],
  );

  const ranking = categoryTypes
    .map((type) => ({
      type,
      name: getApplianceLabel(t, type),
      total: rows.reduce((sum, row) => sum + (row.values[type] ?? 0), 0),
    }))
    .sort((a, b) => b.total - a.total);

  const selectedType = manualType ?? ranking[0]?.type ?? null;
  const totalPeriod = ranking.reduce((acc, item) => acc + item.total, 0);

  const handleFilter = (filter: FilterKey) => {
    setActiveFilter(filter);
    setActiveSubFilter(null);
    setManualType(null);
  };

  const handleSubFilter = (key: string | null) => {
    setActiveSubFilter(key);
    setManualType(null);
  };

  const needsScroll = rows.length > 8;
  const chartWidth = needsScroll ? rows.length * BAR_SLOT_WIDTH : width - Theme.spacing.md * 4;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {FILTERS.map((filter) => (
          <Pressable
            key={filter.key}
            onPress={() => handleFilter(filter.key)}
            style={[styles.chip, activeFilter === filter.key && styles.chipActive]}
          >
            <Text style={[styles.chipText, activeFilter === filter.key && styles.chipTextActive]}>
              {t(`history:filters.${filter.key}`)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <Text style={styles.date}>
        {t(
          `history:dates.${FILTERS.find((f) => f.key === activeFilter)?.dateKey ?? "day"}`,
        )}
      </Text>

      {subFilters ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {subFilters.map((sf) => (
            <Pressable
              key={sf.key}
              onPress={() => handleSubFilter(sf.key)}
              style={[styles.chip, activeSubFilter === sf.key && styles.chipSoftActive]}
            >
              <Text style={[styles.chipText, activeSubFilter === sf.key && styles.chipSoftActiveText]}>
                {t(`history:subfilters.${activeFilter}.${sf.key}`)}
              </Text>
            </Pressable>
          ))}
          {activeSubFilter ? (
            <Pressable onPress={() => handleSubFilter(null)} style={styles.chip}>
              <Text style={styles.clearText}>
                {t("history:subfilters.showAll")}
              </Text>
            </Pressable>
          ) : null}
        </ScrollView>
      ) : null}

      <Card>
        <Text style={styles.title}>{t("history:chart.title")}</Text>

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

        {selectedType ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Chart
              type="bar"
              width={chartWidth}
              height={300}
              style={styles.chart}
              data={{
                labels: rows.map((row) => row.label),
                datasets: [{ data: rows.map((row) => row.values[selectedType] ?? 0) }],
              }}
            />
          </ScrollView>
        ) : (
          <Text style={styles.empty}>{t("history:chart.empty")}</Text>
        )}
      </Card>

      {ranking.length > 0 ? (
        <>
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
                  <Text style={[styles.cellText, styles.colTotal]}>{item.total.toFixed(1)} kWh</Text>
                  <View style={styles.colPercent}>
                    <Text style={styles.cellText}>{pct.toFixed(1)}%</Text>
                    <View style={styles.track}>
                      <View
                        style={[styles.fill, { width: `${pct}%`, backgroundColor: getDeviceColor(item.type, mode) }]}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </Card>

          <Card>
            <Text style={styles.statLabel}>
              {t("history:stats.totalConsumption")}
            </Text>
            <Text style={styles.statValue}>{totalPeriod.toFixed(1)} kWh</Text>
            <Text style={styles.statSub}>
              {t("history:stats.vsPrevious")}
            </Text>
          </Card>
          <Card>
            <Text style={styles.statLabel}>{t("history:stats.average")}</Text>
            <Text style={styles.statValue}>{(totalPeriod / (ranking.length || 1)).toFixed(1)} kWh</Text>
            <Text style={styles.statSub}>
              {t("history:stats.periodAverage")}
            </Text>
          </Card>
          <Card>
            <Text style={styles.statLabel}>
              {t("history:stats.topConsumer")}
            </Text>
            <Text style={styles.statValue}>{ranking[0].name}</Text>
            <Text style={styles.statSub}>{ranking[0].total.toFixed(1)} kWh</Text>
          </Card>
        </>
      ) : null}
    </ScrollView>
  );
}
