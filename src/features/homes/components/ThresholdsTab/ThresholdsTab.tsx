import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("thresholds");
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
          <Text style={styles.title}>{t("title")}</Text>
          <Text style={styles.subtitle}>{t("subtitle")}</Text>
        </View>

        {!isOwner ? (
          <View style={styles.readOnlyNotice}>
            <Ionicons
              name="lock-closed"
              size={Theme.typography.size.size13}
              color={Theme.colors.textSecondary}
            />
            <Text style={styles.readOnlyText}>{t("readOnly.notice")}</Text>
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
                <Text style={styles.rowTitle}>{t("defaults.label")}</Text>
                <Text style={styles.rowHint}>{t("defaults.hint")}</Text>
              </View>
            </View>

            <View style={styles.rowRight}>
              <Badge
                label={useDefaults ? t("defaults.on") : t("defaults.off")}
                tone={useDefaults ? "success" : "neutral"}
              />
              <Switch
                value={useDefaults}
                onValueChange={handleToggleDefaults}
                disabled={!isOwner}
                accessibilityLabel={t("defaults.label")}
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
                    <Text style={styles.rowTitle}>{t("periodicity.label")}</Text>
                    <Text style={styles.periodicityLabel}>
                      {isDaily ? t("periodicity.daily") : t("periodicity.monthly")}
                    </Text>
                  </View>
                </View>

                <Switch
                  value={!isDaily}
                  onValueChange={handleTogglePeriod}
                  disabled={!isOwner || useDefaults}
                  accessibilityLabel={t("accessibility.monthlyPeriodicity")}
                />
              </View>
            </>
          ) : null}

          <View style={styles.divider} />

          <View style={styles.fieldsRow}>
            <View style={styles.field}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>{t("fields.daily")}</Text>
                {!useDefaults && !isDaily && calculatedDaily ? (
                  <Badge label={t("calculated")} tone="info" />
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
                    accessibilityLabel={t("accessibility.daily")}
                    style={dailyEditable ? undefined : styles.inputDisabled}
                  />
                </View>
                <Text style={styles.unit}>{t("unit")}</Text>
              </View>
            </View>

            <View style={styles.field}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>{t("fields.monthly")}</Text>
                {!useDefaults && isDaily && calculatedMonthly ? (
                  <Badge label={t("calculated")} tone="info" />
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
                    accessibilityLabel={t("accessibility.monthly")}
                    style={monthlyEditable ? undefined : styles.inputDisabled}
                  />
                </View>
                <Text style={styles.unit}>{t("unit")}</Text>
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
                    color={Theme.colors.onBrand}
                  />
                ) : undefined
              }
              style={styles.saveButton}
            >
              {saved ? t("buttons.saved") : t("buttons.save")}
            </Button>
          ) : null}
        </Card>

        <View style={styles.infoNote}>
          <Ionicons
            name="information-circle-outline"
            size={Theme.typography.size.size13}
            color={Theme.colors.textSecondary}
          />
          <Text style={styles.infoNoteText}>{t("scopeNote")}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
