import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";

import { Card } from "@/components/Card/Card";
import { Chart } from "@/components/Chart/Chart";
import { Theme } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { getDeviceColor } from "../../data/deviceChartColors";
import { mockConsumptionData } from "../../data/consumptionMock";
import { APPLIANCE_ICON, getApplianceLabel, type Device } from "../../data/deviceMocks";
import type { Thresholds } from "../../data/thresholds";
import { styles } from "./ConsumptionTab.styles";

export interface ConsumptionTabProps {
  devices: Device[];
  /** `null` mientras `GET /homes/{id}/thresholds` no responde. */
  thresholds: Thresholds | null;
}

interface LimitBarProps {
  label: string;
  used: number;
  limit: number;
}

function LimitBar({
  label,
  used,
  limit,
  noData,
}: LimitBarProps & { noData: string }) {
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
        {limit ? `${used} / ${limit} kWh` : noData}
      </Text>
    </View>
  );
}

export function ConsumptionTab({ devices, thresholds }: ConsumptionTabProps) {
  const { t } = useTranslation(["consumption", "devices"]);
  const { width } = useWindowDimensions();
  const { currentTheme } = useTheme();
  // Los gráficos usan la variante de la paleta activa para los colores por electrodoméstico.
  const mode = currentTheme.mode;
  const chartWidth = width - Theme.spacing.md * 4;
  const data = mockConsumptionData;

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

  const kwValues = data.consumoHoras.map((h) => h.kw);
  // ponytail: dataset invisible que fuerza el eje Y a 0..múltiplo de 4, porque el
  // Chart genérico no expone fromZero/decimalPlaces; añadir esas props y quitar esto.
  const yTop = Math.ceil(Math.max(...kwValues) / 4) * 4;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Card style={[styles.kpiCard, { borderColor: Theme.colors.warning }]}>
        <Text style={styles.kpiLabel}>{t("consumption:kpi.currentPower")}</Text>
        <Text style={styles.kpiValue}>
          {data.potencia}
          <Text style={styles.kpiUnit}> kW</Text>
        </Text>
        <Text style={styles.kpiSub}>
          {t("consumption:kpi.level")} {t(`consumption:kpi.levels.${data.nivelPotencia}`)}
        </Text>
      </Card>

      <Card style={[styles.kpiCard, { borderColor: Theme.colors.primary }]}>
        <Text style={styles.kpiLabel}>{t("consumption:kpi.todayConsumption")}</Text>
        <Text style={styles.kpiValue}>
          {data.consumoHoy}
          <Text style={styles.kpiUnit}> kWh</Text>
        </Text>
        <Text style={styles.kpiSub}>
          {t("consumption:kpi.currentLimit")}
          {thresholds ? `${thresholds.daily} kWh` : "—"}
        </Text>
      </Card>

      <Card style={[styles.kpiCard, { borderColor: Theme.colors.secondary }]}>
        <Text style={styles.kpiLabel}>{t("consumption:kpi.devices")}</Text>
        <Text style={styles.kpiValue}>
          {activeDevices}
          <Text style={styles.kpiUnit}> / {devices.length}</Text>
        </Text>
        <Text style={styles.kpiSub}>{t("consumption:kpi.allOperational")}</Text>
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
        <Chart
          type="area"
          width={chartWidth}
          height={180}
          style={styles.chart}
          data={{
            labels: data.consumoHoras.map((h, i) => (i % 3 === 0 ? h.hora : "")),
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
        used={data.limitesDiario.usado}
        limit={thresholds?.daily ?? 0}
        noData={t("consumption:kpi.noData")}
      />
      <LimitBar
        label={t("consumption:limits.monthly")}
        used={data.limiteMensual.usado}
        limit={thresholds?.monthly ?? 0}
        noData={t("consumption:kpi.noData")}
      />
    </ScrollView>
  );
}
