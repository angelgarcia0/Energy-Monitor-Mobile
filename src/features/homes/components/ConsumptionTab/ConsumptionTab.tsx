import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";

import { Card } from "@/components/Card/Card";
import { Chart } from "@/components/Chart/Chart";
import { Loader } from "@/components/Loader/Loader";
import { Theme } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { errorMessage } from "@/services/http";
import type { HomeConsumptionSummary } from "@/services/measurement";
import { getDeviceColor } from "../../data/deviceChartColors";
import { APPLIANCE_ICON, getApplianceLabel, type Device } from "../../data/deviceTypes";
import { Button } from "@/components/Button/Button";
import { useConsumptionSummary } from "../../hooks/useConsumption";
import { styles } from "./ConsumptionTab.styles";

export interface ConsumptionTabProps {
  homeId: string;
  /**
   * Los dispositivos siguen viniendo del módulo `devices`, que todavía no está
   * integrado: alimentan el reparto por electrodoméstico y el conteo de
   * conectados, que el resumen de consumo no trae.
   */
  devices: Device[];
}

/** Watts → kW con 3 decimales; `null` se conserva (sin datos ≠ cero). */
const toKw = (watts: number | null) =>
  watts === null ? null : Number((watts / 1000).toFixed(3));

interface LimitBarProps {
  label: string;
  used: number;
  limit: number | null;
  noData: string;
}

function LimitBar({ label, used, limit, noData }: LimitBarProps) {
  const pct = limit ? Math.min(Math.round((used / limit) * 100), 100) : 0;

  return (
    <View style={styles.limitCard}>
      <View style={styles.limitTop}>
        <Text style={styles.limitLabel}>{label}</Text>
        <Text style={styles.limitPct}>{limit ? `${pct}%` : "—"}</Text>
      </View>
      <View style={styles.limitTrack}>
        <View style={[styles.limitFill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.limitValues}>
        {limit ? `${Number(used.toFixed(2))} / ${limit} kWh` : noData}
      </Text>
    </View>
  );
}

export function ConsumptionTab({ homeId, devices }: ConsumptionTabProps) {
  const { t } = useTranslation(["consumption", "devices"]);
  const { width } = useWindowDimensions();
  const { currentTheme } = useTheme();
  const { summary, loading, error, reload } = useConsumptionSummary(homeId);

  // Los gráficos usan la variante de la paleta activa para los colores por electrodoméstico.
  const mode = currentTheme.mode;
  const chartWidth = width - Theme.spacing.md * 4;

  const activeDevices = devices.filter((d) => d.status === "online").length;

  const totals = new Map<(typeof devices)[number]["applianceType"], number>();
  devices.forEach((d) => {
    totals.set(d.applianceType, (totals.get(d.applianceType) ?? 0) + (d.consumption ?? 0));
  });
  const totalAll = [...totals.values()].reduce((a, b) => a + b, 0);
  const distribution = [...totals.entries()].map(([type, consumption]) => ({
    type,
    name: getApplianceLabel(t, type),
    consumption: Number(consumption.toFixed(2)),
    percentage: totalAll ? Number(((consumption / totalAll) * 100).toFixed(1)) : 0,
  }));

  // Las horas vienen en W y pueden venir en null. Si ninguna tiene dato no se
  // pinta un gráfico en cero: se ve como "no hay mediciones".
  const horas = summary?.lastHours ?? [];
  const hayDatos = horas.some((h) => h.averagePower !== null);
  const kwValues = horas.map((h) => toKw(h.averagePower) ?? 0);
  const hourLabels = horas.map((h, i) =>
    i % 3 === 0
      ? new Date(h.hourStart).toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        })
      : "",
  );
  // ponytail: dataset invisible que fuerza el eje Y a 0..múltiplo de 4, porque el
  // Chart genérico no expone fromZero/decimalPlaces; añadir esas props y quitar esto.
  const yTop = kwValues.length ? Math.ceil(Math.max(...kwValues) / 4) * 4 : 0;

  if (loading) return <Loader text={t("consumption:state.loading")} />;

  if (error) {
    return (
      <View style={styles.content}>
        <Text style={styles.sectionTitle} accessibilityRole="alert">
          {errorMessage(t, error)}
        </Text>
        <Button variant="secondary" onPress={() => void reload()}>
          {t("consumption:state.retry")}
        </Button>
      </View>
    );
  }

  const data: HomeConsumptionSummary | null = summary;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Card style={[styles.kpiCard, { borderColor: Theme.colors.warning }]}>
        <Text style={styles.kpiLabel}>{t("consumption:kpi.currentPower")}</Text>
        <Text style={styles.kpiValue}>
          {data?.currentPower !== null && data?.currentPower !== undefined
            ? toKw(data.currentPower)
            : "—"}
          <Text style={styles.kpiUnit}> kW</Text>
        </Text>
        <Text style={styles.kpiSub}>
          {data?.level
            ? `${t("consumption:kpi.level")} ${t(`consumption:kpi.levels.${data.level}`)}`
            : t("consumption:kpi.noData")}
        </Text>
      </Card>

      <Card style={[styles.kpiCard, { borderColor: Theme.colors.primary }]}>
        <Text style={styles.kpiLabel}>{t("consumption:kpi.todayConsumption")}</Text>
        <Text style={styles.kpiValue}>
          {data ? Number(data.todayEnergy.toFixed(2)) : "—"}
          <Text style={styles.kpiUnit}> kWh</Text>
        </Text>
        <Text style={styles.kpiSub}>
          {t("consumption:kpi.currentLimit")}
          {data?.dailyLimit ? `${data.dailyLimit} kWh` : " —"}
        </Text>
      </Card>

      <Card style={[styles.kpiCard, { borderColor: Theme.colors.secondary }]}>
        <Text style={styles.kpiLabel}>{t("consumption:kpi.devices")}</Text>
        <Text style={styles.kpiValue}>
          {activeDevices}
          <Text style={styles.kpiUnit}> / {devices.length}</Text>
        </Text>
        <Text style={styles.kpiSub}>
          {devices.length === 0
            ? t("consumption:kpi.noDevices")
            : activeDevices === devices.length
              ? t("consumption:kpi.allOperational")
              : t("consumption:kpi.someOffline", {
                  count: devices.length - activeDevices,
                })}
        </Text>
      </Card>

      <Card>
        <Text style={styles.chartTitle}>
          {t("consumption:charts.globalConsumption")}{" "}
          <Text style={styles.chartTitleMuted}>
            {t("consumption:charts.last24h")}
          </Text>
        </Text>
        <Text style={styles.chartSubtitle}>
          {t("consumption:charts.activePower")}
        </Text>
        {hayDatos ? (
          <Chart
            type="area"
            width={chartWidth}
            height={180}
            style={styles.chart}
            data={{
              labels: hourLabels,
              datasets: [
                { data: kwValues, strokeWidth: 2 },
                {
                  data: kwValues.map((_, i) => (i % 2 ? yTop : 0)),
                  color: () => "transparent",
                  strokeWidth: 0,
                },
              ],
            }}
          />
        ) : (
          <Text style={styles.chartSubtitle}>{t("consumption:kpi.noData")}</Text>
        )}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>
          {t("consumption:charts.currentDistribution")}
        </Text>
        <Chart
          type="pie"
          width={chartWidth}
          height={180}
          style={styles.chart}
          data={distribution.map((d) => ({
            name: `${d.name} ${d.percentage}%`,
            value: d.percentage,
            color: getDeviceColor(d.type, mode),
          }))}
        />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>
          {t("consumption:charts.deviceConsumption")}
        </Text>
        <Text style={styles.chartSubtitle}>
          {t("consumption:deviceChartValues")}
        </Text>
        <Chart
          type="bar"
          width={chartWidth}
          height={200}
          style={styles.chart}
          data={{
            labels: distribution.map((d) => d.name),
            datasets: [{ data: distribution.map((d) => Math.round(d.consumption * 1000)) }],
          }}
        />
        <View style={styles.deviceLegend}>
          {distribution.map((d) => (
            <View key={d.type} style={styles.deviceLegendItem}>
              <MaterialCommunityIcons
                name={APPLIANCE_ICON[d.type]}
                size={Theme.typography.size.md}
                color={getDeviceColor(d.type, mode)}
              />
              <Text style={styles.deviceLegendText}>
                {d.name}: {d.consumption} kW
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <LimitBar
        label={t("consumption:limits.daily")}
        used={data?.todayEnergy ?? 0}
        limit={data?.dailyLimit ?? null}
        noData={t("consumption:kpi.noData")}
      />
      <LimitBar
        label={t("consumption:limits.monthly")}
        used={data?.monthEnergy ?? 0}
        limit={data?.monthlyLimit ?? null}
        noData={t("consumption:kpi.noData")}
      />
    </ScrollView>
  );
}