import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { Input } from "@/components/Input/Input";
import { Switch } from "@/components/Switch/Switch";
import { Theme } from "@/constants/theme";
import {
  DAYS_PER_MONTH,
  DEFAULT_THRESHOLDS,
  type Thresholds,
} from "../../data/thresholds";
import { validateThresholdValue } from "../../validation/thresholdsSchema";
import { styles } from "./ThresholdsTab.styles";

type Period = "daily" | "monthly";

export interface ThresholdsTabProps {
  thresholds: Thresholds;
  saveThresholds: (next: Thresholds) => void;
  isOwner: boolean;
}

interface BadgeProps {
  label: string;
  tone: "success" | "neutral" | "info";
}

function Badge({ label, tone }: BadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        tone === "success" && styles.badgeSuccess,
        tone === "neutral" && styles.badgeNeutral,
        tone === "info" && styles.badgeInfo,
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          tone === "success" && styles.badgeTextSuccess,
          tone === "neutral" && styles.badgeTextNeutral,
          tone === "info" && styles.badgeTextInfo,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

/** `""`, `NaN` y `<= 0` no son valores utilizables para calcular el otro umbral. */
function parsePositive(raw: string): number | null {
  if (raw.trim() === "") return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/** 1 decimal sin `.0` final: 300/30 -> "10", 270/30 -> "9", 15/30 -> "0.5". */
const formatOneDecimal = (value: number) => String(Math.round(value * 10) / 10);

export function ThresholdsTab({
  thresholds,
  saveThresholds,
  isOwner,
}: ThresholdsTabProps) {
  const [useDefaults, setUseDefaults] = useState(thresholds.useDefaults);
  const [period, setPeriod] = useState<Period>("daily");
  const [daily, setDaily] = useState(() => String(thresholds.daily));
  const [monthly, setMonthly] = useState(() => String(thresholds.monthly));
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(timer);
  }, [saved]);

  const clearFeedback = () => {
    setError("");
    setSaved(false);
  };

  const handleToggleDefaults = (next: boolean) => {
    if (!isOwner) return;

    setUseDefaults(next);
    if (next) {
      setDaily(String(DEFAULT_THRESHOLDS.daily));
      setMonthly(String(DEFAULT_THRESHOLDS.monthly));
    }
    clearFeedback();
  };

  const isDaily = period === "daily";
  const dailyNumber = parsePositive(daily);
  const monthlyNumber = parsePositive(monthly);

  const calculatedDaily =
    !isDaily && monthlyNumber !== null
      ? formatOneDecimal(monthlyNumber / DAYS_PER_MONTH)
      : "";
  const calculatedMonthly =
    isDaily && dailyNumber !== null
      ? String(Math.round(dailyNumber * DAYS_PER_MONTH))
      : "";

  const dailyValue = useDefaults
    ? String(DEFAULT_THRESHOLDS.daily)
    : isDaily
      ? daily
      : calculatedDaily;
  const monthlyValue = useDefaults
    ? String(DEFAULT_THRESHOLDS.monthly)
    : isDaily
      ? calculatedMonthly
      : monthly;

  const dailyEditable = !useDefaults && isDaily;
  const monthlyEditable = !useDefaults && !isDaily;

  const handleTogglePeriod = (nextIsMonthly: boolean) => {
    if (!isOwner || useDefaults) return;

    // El campo que era calculado pasa a ser editable: se fija su valor en el
    // estado para no perder el número que el usuario estaba viendo.
    if (nextIsMonthly && isDaily) setMonthly(calculatedMonthly);
    if (!nextIsMonthly && !isDaily) setDaily(calculatedDaily);

    setPeriod(nextIsMonthly ? "monthly" : "daily");
    clearFeedback();
  };

  const handleChangeDaily = (text: string) => {
    if (!dailyEditable) return;
    setDaily(text);
    clearFeedback();
  };

  const handleChangeMonthly = (text: string) => {
    if (!monthlyEditable) return;
    setMonthly(text);
    clearFeedback();
  };

  const handleSave = () => {
    if (useDefaults) {
      saveThresholds({
        daily: DEFAULT_THRESHOLDS.daily,
        monthly: DEFAULT_THRESHOLDS.monthly,
        useDefaults: true,
      });
      setError("");
      setSaved(true);
      return;
    }

    const message = validateThresholdValue(isDaily ? daily : monthly);
    if (message) {
      setError(message);
      setSaved(false);
      return;
    }

    setError("");
    // Se guardan los valores ya resueltos (el inactivo es el calculado), no el
    // estado crudo: si no, el par guardado sería incoherente con lo que se ve.
    saveThresholds({
      daily: Number(dailyValue),
      monthly: Number(monthlyValue),
      useDefaults: false,
    });
    setSaved(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.flex}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Umbrales de consumo</Text>
          <Text style={styles.subtitle}>
            Estos límites aplican únicamente a este hogar y se usan para generar
            alertas y recomendaciones personalizadas.
          </Text>
        </View>

        {!isOwner ? (
          <View style={styles.readOnlyNotice}>
            <Ionicons
              name="lock-closed"
              size={Theme.typography.size.size13}
              color={Theme.colors.textSecondary}
            />
            <Text style={styles.readOnlyText}>
              Solo el responsable del hogar puede modificar estos umbrales.
            </Text>
          </View>
        ) : null}

        <Card style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}>
                <Ionicons
                  name="speedometer-outline"
                  size={Theme.typography.size.size18}
                  color={Theme.colors.primary}
                />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>
                  Usar los umbrales por defecto del sistema
                </Text>
                <Text style={styles.rowHint}>
                  Los umbrales por defecto están pensados para un consumo
                  residencial promedio. Desactívalos para definir tus propios
                  límites en este hogar.
                </Text>
              </View>
            </View>

            <View style={styles.rowRight}>
              <Badge
                label={useDefaults ? "Activado" : "Desactivado"}
                tone={useDefaults ? "success" : "neutral"}
              />
              <Switch
                value={useDefaults}
                onValueChange={handleToggleDefaults}
                disabled={!isOwner}
                accessibilityLabel="Usar los umbrales por defecto del sistema"
              />
            </View>
          </View>

          {!useDefaults ? (
            <>
              <View style={styles.divider} />
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <View style={styles.rowIcon}>
                    <Ionicons
                      name="calendar-outline"
                      size={Theme.typography.size.size18}
                      color={Theme.colors.primary}
                    />
                  </View>
                  <View style={styles.rowText}>
                    <Text style={styles.rowTitle}>Configurar por</Text>
                    <Text style={styles.periodicityLabel}>
                      {isDaily ? "Diario" : "Mensual"}
                    </Text>
                  </View>
                </View>

                <Switch
                  value={!isDaily}
                  onValueChange={handleTogglePeriod}
                  disabled={!isOwner || useDefaults}
                  accessibilityLabel="Configurar por periodicidad mensual"
                />
              </View>
            </>
          ) : null}

          <View style={styles.divider} />

          <View style={styles.fieldsRow}>
            <View style={styles.field}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>Límite diario</Text>
                {!useDefaults && !isDaily && calculatedDaily ? (
                  <Badge label="Calculado" tone="info" />
                ) : null}
              </View>
              <View style={styles.inputRow}>
                <View style={styles.inputFlex}>
                  <Input
                    value={dailyValue}
                    onChangeText={handleChangeDaily}
                    editable={dailyEditable}
                    keyboardType="decimal-pad"
                    placeholder="0"
                    accessibilityLabel="Límite diario en kWh"
                    style={dailyEditable ? undefined : styles.inputDisabled}
                  />
                </View>
                <Text style={styles.unit}>kWh</Text>
              </View>
            </View>

            <View style={styles.field}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>Límite mensual</Text>
                {!useDefaults && isDaily && calculatedMonthly ? (
                  <Badge label="Calculado" tone="info" />
                ) : null}
              </View>
              <View style={styles.inputRow}>
                <View style={styles.inputFlex}>
                  <Input
                    value={monthlyValue}
                    onChangeText={handleChangeMonthly}
                    editable={monthlyEditable}
                    keyboardType="decimal-pad"
                    placeholder="0"
                    accessibilityLabel="Límite mensual en kWh"
                    style={monthlyEditable ? undefined : styles.inputDisabled}
                  />
                </View>
                <Text style={styles.unit}>kWh</Text>
              </View>
            </View>
          </View>

          <View style={styles.errorSlot}>
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>

          {isOwner ? (
            <Button
              onPress={handleSave}
              icon={
                saved ? (
                  <Ionicons
                    name="checkmark"
                    size={Theme.typography.size.md}
                    color={Theme.colors.surface}
                  />
                ) : undefined
              }
              style={styles.saveButton}
            >
              {saved ? "Guardado" : "Guardar cambios"}
            </Button>
          ) : null}
        </Card>

        <View style={styles.infoNote}>
          <Ionicons
            name="information-circle-outline"
            size={Theme.typography.size.size13}
            color={Theme.colors.textSecondary}
          />
          <Text style={styles.infoNoteText}>
            Cada hogar guarda sus propios umbrales; cambiarlos aquí no afecta a
            tus otros hogares.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
