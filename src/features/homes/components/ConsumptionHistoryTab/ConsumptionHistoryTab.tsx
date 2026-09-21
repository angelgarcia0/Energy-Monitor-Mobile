import React, { useState } from "react";
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";

import { Card } from "@/components/Card/Card";
import { Chart } from "@/components/Chart/Chart";
import { Theme } from "@/constants/theme";
import { getDeviceColor, type ApplianceType } from "../../data/deviceChartColors";
import { APPLIANCE_LABEL, APPLIANCE_TYPE_IDS, INITIAL_DEVICES } from "../../data/deviceMocks";
import { styles } from "./ConsumptionHistoryTab.styles";

export interface ConsumptionHistoryTabProps {}

type FilterKey = "day" | "week" | "month" | "year";

interface HistoryRow {
  label: string;
  values: Partial<Record<ApplianceType, number>>;
}

interface SubFilter {
  key: string;
  label: string;
  range: [number, number];
}

const FILTERS: { key: FilterKey; label: string; date: string }[] = [
  { key: "day", label: "Día", date: "Últimas 24 horas" },
  { key: "week", label: "Semana", date: "Últimos 7 días" },
  { key: "month", label: "Mes", date: "Abril 01, 2026 - Abril 30, 2026" },
  { key: "year", label: "Año", date: "Enero 2026 - Diciembre 2026" },
];

const SUBFILTERS: Record<FilterKey, SubFilter[] | null> = {
  day: [
    { key: "0-6", label: "0h - 6h", range: [0, 6] },
    { key: "6-12", label: "6h - 12h", range: [6, 12] },
    { key: "12-18", label: "12h - 18h", range: [12, 18] },
    { key: "18-24", label: "18h - 24h", range: [18, 24] },
  ],
  week: null,
  month: [
    { key: "sem1", label: "Semana 1", range: [0, 7] },
    { key: "sem2", label: "Semana 2", range: [7, 14] },
    { key: "sem3", label: "Semana 3", range: [14, 21] },
    { key: "sem4", label: "Semana 4", range: [21, 30] },
  ],
  year: [
    { key: "q1", label: "Ene - Mar", range: [0, 3] },
    { key: "q2", label: "Abr - Jun", range: [3, 6] },
    { key: "q3", label: "Jul - Sep", range: [6, 9] },
    { key: "q4", label: "Oct - Dic", range: [9, 12] },
  ],
};

const WEEK_DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const randomValue = (base: number, range: number) => Math.floor(Math.random() * range) + base;

function generateMockData(types: ApplianceType[]): Record<FilterKey, HistoryRow[]> {
  const build = (label: string, base: number, range: number): HistoryRow => ({
    label,
    values: Object.fromEntries(types.map((type) => [type, randomValue(base, range)])),
  });

  return {
    day: Array.from({ length: 24 }, (_, i) => build(`${i}:00`, 0, 8)),
    week: WEEK_DAYS.map((name) => build(name, 5, 20)),
    month: Array.from({ length: 30 }, (_, i) => build(String(i + 1).padStart(2, "0"), 10, 30)),
    year: MONTHS.map((name) => build(name, 100, 200)),
  };
}

const BAR_SLOT_WIDTH = Theme.spacing.xl + Theme.spacing.lg;

export function ConsumptionHistoryTab(_props: ConsumptionHistoryTabProps) {
  const { width } = useWindowDimensions();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("month");
  const [activeSubFilter, setActiveSubFilter] = useState<string | null>(null);
  const [manualType, setManualType] = useState<ApplianceType | null>(null);

  const present = new Set(INITIAL_DEVICES.map((d) => d.applianceType));
  const [categoryTypes] = useState(() => APPLIANCE_TYPE_IDS.filter((id) => present.has(id)));
  const [mockData] = useState(() => generateMockData(categoryTypes));

  const subFilters = SUBFILTERS[activeFilter];
  const fullData = mockData[activeFilter];
  const selectedSub = subFilters?.find((sf) => sf.key === activeSubFilter);
  const rows = selectedSub ? fullData.slice(selectedSub.range[0], selectedSub.range[1]) : fullData;

  const ranking = categoryTypes
    .map((type) => ({
      type,
      name: APPLIANCE_LABEL[type],
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
              {filter.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <Text style={styles.date}>{FILTERS.find((f) => f.key === activeFilter)?.date}</Text>

      {subFilters ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {subFilters.map((sf) => (
            <Pressable
              key={sf.key}
              onPress={() => handleSubFilter(sf.key)}
              style={[styles.chip, activeSubFilter === sf.key && styles.chipSoftActive]}
            >
              <Text style={[styles.chipText, activeSubFilter === sf.key && styles.chipSoftActiveText]}>
                {sf.label}
              </Text>
            </Pressable>
          ))}
          {activeSubFilter ? (
            <Pressable onPress={() => handleSubFilter(null)} style={styles.chip}>
              <Text style={styles.clearText}>Mostrar todo</Text>
            </Pressable>
          ) : null}
        </ScrollView>
      ) : null}

      <Card>
        <Text style={styles.title}>DISTRIBUCIÓN DE CONSUMO POR DISPOSITIVO</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {categoryTypes.map((type) => (
            <Pressable
              key={type}
              onPress={() => setManualType(type)}
              style={[styles.chip, selectedType === type && styles.chipSoftActive]}
            >
              <View style={[styles.dot, { backgroundColor: getDeviceColor(type) }]} />
              <Text style={[styles.chipText, selectedType === type && styles.chipSoftActiveText]}>
                {APPLIANCE_LABEL[type]}
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
          <Text style={styles.empty}>Vincula un dispositivo para ver su historial de consumo</Text>
        )}
      </Card>

      {ranking.length > 0 ? (
        <>
          <Card>
            <Text style={styles.title}>RANKING DE CONSUMO</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerText, styles.colPosition]}>#</Text>
              <Text style={[styles.headerText, styles.colName]}>DISPOSITIVO</Text>
              <Text style={[styles.headerText, styles.colTotal]}>TOTAL</Text>
              <Text style={[styles.headerText, styles.colPercent]}>%</Text>
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
                        style={[styles.fill, { width: `${pct}%`, backgroundColor: getDeviceColor(item.type) }]}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </Card>

          <Card>
            <Text style={styles.statLabel}>CONSUMO TOTAL PERIODO</Text>
            <Text style={styles.statValue}>{totalPeriod.toFixed(1)} kWh</Text>
            <Text style={styles.statSub}>↑ 10% vs periodo anterior</Text>
          </Card>
          <Card>
            <Text style={styles.statLabel}>PROMEDIO</Text>
            <Text style={styles.statValue}>{(totalPeriod / (ranking.length || 1)).toFixed(1)} kWh</Text>
            <Text style={styles.statSub}>Promedio del periodo</Text>
          </Card>
          <Card>
            <Text style={styles.statLabel}>MAYOR CONSUMIDOR</Text>
            <Text style={styles.statValue}>{ranking[0].name}</Text>
            <Text style={styles.statSub}>{ranking[0].total.toFixed(1)} kWh</Text>
          </Card>
        </>
      ) : null}
    </ScrollView>
  );
}
