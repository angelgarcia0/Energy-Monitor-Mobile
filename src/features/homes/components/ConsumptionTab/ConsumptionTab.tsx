import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";

import { Card } from "@/components/Card/Card";
import { Chart } from "@/components/Chart/Chart";
import { Theme } from "@/constants/theme";
import { getDeviceColor } from "../../data/deviceChartColors";
import { mockConsumptionData } from "../../data/consumptionMock";
import { APPLIANCE_ICON, APPLIANCE_LABEL, INITIAL_DEVICES } from "../../data/deviceMocks";
import { styles } from "./ConsumptionTab.styles";

export interface ConsumptionTabProps {}

interface LimitBarProps {
  label: string;
  used: number;
  limit: number;
}

function LimitBar({ label, used, limit }: LimitBarProps) {
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
        {limit ? `${used} / ${limit} kWh` : "Sin datos"}
      </Text>
    </View>
  );
}

export function ConsumptionTab(_props: ConsumptionTabProps) {
  const { width } = useWindowDimensions();
  const chartWidth = width - Theme.spacing.md * 4;
  const data = mockConsumptionData;
  const devices = INITIAL_DEVICES;

  const activeDevices = devices.filter((d) => d.status === "online").length;

  const totals = new Map<(typeof devices)[number]["applianceType"], number>();
  devices.forEach((d) => {
    totals.set(d.applianceType, (totals.get(d.applianceType) ?? 0) + (d.consumption ?? 0));
  });
  const totalAll = [...totals.values()].reduce((a, b) => a + b, 0);
  const distribution = [...totals.entries()].map(([type, consumption]) => ({
    type,
    name: APPLIANCE_LABEL[type],
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
        <Text style={styles.kpiLabel}>POTENCIA ACTUAL ⚡</Text>
        <Text style={styles.kpiValue}>
          {data.potencia}
          <Text style={styles.kpiUnit}> kW</Text>
        </Text>
        <Text style={styles.kpiSub}>Nivel {data.nivelPotencia}</Text>
      </Card>

      <Card style={[styles.kpiCard, { borderColor: Theme.colors.primary }]}>
        <Text style={styles.kpiLabel}>CONSUMO HOY 📊</Text>
        <Text style={styles.kpiValue}>
          {data.consumoHoy}
          <Text style={styles.kpiUnit}> kWh</Text>
        </Text>
        <Text style={styles.kpiSub}>
          {data.limiteConsumo != null
            ? `Límite actual: ${data.limiteConsumo} kWh`
            : "Sin límite configurado"}
        </Text>
      </Card>

      <Card style={[styles.kpiCard, { borderColor: Theme.colors.secondary }]}>
        <Text style={styles.kpiLabel}>DISPOSITIVOS 🔌</Text>
        <Text style={styles.kpiValue}>
          {activeDevices}
          <Text style={styles.kpiUnit}> / {devices.length}</Text>
        </Text>
        <Text style={styles.kpiSub}>Todos operativos</Text>
      </Card>

      <Card>
        <Text style={styles.chartTitle}>
          Consumo Global — <Text style={styles.chartTitleMuted}>Últimas 24 horas</Text>
        </Text>
        <Text style={styles.chartSubtitle}>Potencia activa en kW</Text>
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
        <Text style={styles.sectionTitle}>Distribución actual</Text>
        <Chart
          type="pie"
          width={chartWidth}
          height={180}
          style={styles.chart}
          data={distribution.map((d) => ({
            name: `${d.name} ${d.percentage}%`,
            value: d.percentage,
            color: getDeviceColor(d.type),
          }))}
        />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Consumo por dispositivo (ahora)</Text>
        <Text style={styles.chartSubtitle}>Valores en W</Text>
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
                color={getDeviceColor(d.type)}
              />
              <Text style={styles.deviceLegendText}>
                {d.name}: {d.consumption} kW
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <LimitBar label="Límite diario" used={data.limitesDiario.usado} limit={data.limitesDiario.limite} />
      <LimitBar label="Límite mensual" used={data.limiteMensual.usado} limit={data.limiteMensual.limite} />
    </ScrollView>
  );
}
