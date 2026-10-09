import { Ionicons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Header } from "@/components/Header/Header";
import { Loader } from "@/components/Loader/Loader";
import { Theme } from "@/constants/theme";
import { useNotificationCenter } from "@/context/NotificationCenterContext";
import { errorMessage } from "@/services/http";
import { AlertRow, RecommendationRow } from "../../components/NotificationRow/NotificationRow";
import type { UiAlert } from "../../data/alertTypes";
import type { UiRecommendation } from "../../data/recommendationTypes";
import { styles } from "./NotificationsScreen.styles";

type NotificationsTab = "all" | "alerts" | "recommendations";

const TABS: { id: NotificationsTab }[] = [
  { id: "all" },
  { id: "alerts" },
  { id: "recommendations" },
];

const byNewest = (a: { date: string }, b: { date: string }) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

/** Fila de la lista: alertas y recomendaciones, ambas reales, unidas por fecha. */
type NotificationRowItem =
  | { kind: "alert"; alert: UiAlert; date: string }
  | { kind: "recommendation"; recommendation: UiRecommendation; date: string };

export function NotificationsScreen() {
  const { t, i18n } = useTranslation("notifications");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    alerts,
    recommendations,
    loading,
    error,
    reload,
    markRead,
    remove,
    removeAllResolved,
    markRecommendationRead,
    markAllRecommendationsRead,
    removeRecommendation,
    removeAllReadRecommendations,
  } = useNotificationCenter();

  const [activeTab, setActiveTab] = useState<NotificationsTab>("all");
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const formatDate = (isoDate: string) => {
    try {
      return new Intl.DateTimeFormat(i18n.resolvedLanguage ?? i18n.language, {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(isoDate));
    } catch {
      return isoDate;
    }
  };

  /** Envuelve una acción del contexto: estado de error y de "ocupado" compartidos. */
  const run = async (action: () => Promise<unknown>) => {
    setBusy(true);
    setActionError(null);
    try {
      const err = await action();
      if (err) setActionError(errorMessage(t, err));
    } finally {
      setBusy(false);
    }
  };

  const activeAlertsCount = alerts.filter((a) => !a.resolved).length;
  const resolvedAlertsCount = alerts.length - activeAlertsCount;
  const unreadRecommendationsCount = recommendations.filter((r) => !r.read).length;
  const readRecommendationsCount = recommendations.length - unreadRecommendationsCount;

  const listToRender = useMemo<NotificationRowItem[]>(() => {
    const alertRows: NotificationRowItem[] = alerts.map((alert) => ({
      kind: "alert",
      alert,
      date: alert.date,
    }));
    const recommendationRows: NotificationRowItem[] = recommendations.map(
      (recommendation) => ({
        kind: "recommendation",
        recommendation,
        date: recommendation.date,
      }),
    );

    const list =
      activeTab === "alerts"
        ? alertRows
        : activeTab === "recommendations"
          ? recommendationRows
          : [...alertRows, ...recommendationRows];

    return [...list].sort(byNewest);
  }, [activeTab, alerts, recommendations]);

  const showLoading = loading && alerts.length === 0 && recommendations.length === 0;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top, Theme.spacing.md) },
      ]}
    >
      <StatusBar style="auto" />

      <Header
        breadcrumbItems={[
          {
            label: t("breadcrumb.home"),
            onPress: () => router.push("/dashboard" as Href),
          },
          { label: t("breadcrumb.current") },
        ]}
        style={styles.header}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.title}>{t("title")}</Text>
          <Text style={styles.subtitle}>{t("subtitle")}</Text>
        </View>

        <View style={styles.panel}>
          <View style={styles.tabsRow}>
            <View style={styles.tabs}>
              {TABS.map((tab) => {
                const active = tab.id === activeTab;
                const count =
                  tab.id === "alerts"
                    ? activeAlertsCount
                    : tab.id === "recommendations"
                      ? unreadRecommendationsCount
                      : 0;
                return (
                  <Pressable
                    key={tab.id}
                    onPress={() => setActiveTab(tab.id)}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: active }}
                    style={[styles.tab, active && styles.tabActive]}
                  >
                    <Text
                      style={[
                        styles.tabLabel,
                        active && styles.tabLabelActive,
                      ]}
                      numberOfLines={1}
                    >
                      {t(`tabs.${tab.id}`)}
                    </Text>
                    {count > 0 ? (
                      <View style={styles.tabCount}>
                        <Text style={styles.tabCountLabel}>{count}</Text>
                      </View>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>

            {/* Cada pestaña ofrece lo que su lista permite: borrar lo ya resuelto en
                alertas, y marcar leídas o borrar las leídas en recomendaciones.
                "Todas" no ofrece ninguno, porque no son la misma operación. */}
            {activeTab === "alerts" && resolvedAlertsCount > 0 ? (
              <Pressable
                onPress={() => void run(removeAllResolved)}
                disabled={busy}
                accessibilityRole="button"
                accessibilityLabel={t("actions.deleteAllResolved", {
                  count: resolvedAlertsCount,
                })}
                style={styles.markAllButton}
              >
                <Ionicons
                  name="trash-outline"
                  size={Theme.typography.size.sm}
                  color={Theme.colors.danger}
                />
                <Text style={styles.markAllLabel}>
                  {t("actions.deleteAllResolved", { count: resolvedAlertsCount })}
                </Text>
              </Pressable>
            ) : activeTab === "recommendations" && unreadRecommendationsCount > 0 ? (
              <Pressable
                onPress={() => void run(markAllRecommendationsRead)}
                disabled={busy}
                accessibilityRole="button"
                accessibilityLabel={t("actions.markAllRead")}
                style={styles.markAllButton}
              >
                <Ionicons
                  name="checkmark-done"
                  size={Theme.typography.size.sm}
                  color={Theme.colors.primary}
                />
                <Text style={styles.markAllLabel}>
                  {t("actions.markAllRead")}
                </Text>
              </Pressable>
            ) : activeTab === "recommendations" && readRecommendationsCount > 0 ? (
              <Pressable
                onPress={() => void run(removeAllReadRecommendations)}
                disabled={busy}
                accessibilityRole="button"
                accessibilityLabel={t("actions.deleteAllRead", {
                  count: readRecommendationsCount,
                })}
                style={styles.markAllButton}
              >
                <Ionicons
                  name="trash-outline"
                  size={Theme.typography.size.sm}
                  color={Theme.colors.danger}
                />
                <Text style={styles.markAllLabel}>
                  {t("actions.deleteAllRead", { count: readRecommendationsCount })}
                </Text>
              </Pressable>
            ) : null}
          </View>

          {showLoading ? <Loader text={t("state.loading")} /> : null}

          {error ? (
            <View style={styles.emptyState}>
              <Text style={styles.actionError} accessibilityRole="alert">
                {errorMessage(t, error)}
              </Text>
              <Pressable
                onPress={reload}
                accessibilityRole="button"
                accessibilityLabel={t("state.retry")}
              >
                <Text style={styles.markAllLabel}>{t("state.retry")}</Text>
              </Pressable>
            </View>
          ) : null}

          {actionError ? (
            <Text style={styles.actionError} accessibilityRole="alert">
              {actionError}
            </Text>
          ) : null}

          {!showLoading && !error && listToRender.length === 0 ? (
            <EmptyState
              icon={
                <Ionicons
                  name="notifications-outline"
                  size={Theme.typography.size.xxl + Theme.spacing.sm}
                  color={Theme.colors.border}
                />
              }
              title={t(`empty.${activeTab}.title`)}
              description={t(`empty.${activeTab}.description`)}
              style={styles.emptyState}
            />
          ) : null}

          {!showLoading && listToRender.length > 0 ? (
            <View style={styles.list}>
              {listToRender.map((item) =>
                item.kind === "alert" ? (
                  <AlertRow
                    key={item.alert.id}
                    alert={item.alert}
                    formatDate={formatDate}
                    onMarkRead={(id) => void run(() => markRead(id))}
                    onRemove={(id) => void run(() => remove(id))}
                    busy={busy}
                  />
                ) : (
                  <RecommendationRow
                    key={item.recommendation.id}
                    recommendation={item.recommendation}
                    formatDate={formatDate}
                    onMarkRead={(id) => void run(() => markRecommendationRead(id))}
                    onRemove={(id) => void run(() => removeRecommendation(id))}
                    busy={busy}
                  />
                ),
              )}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}