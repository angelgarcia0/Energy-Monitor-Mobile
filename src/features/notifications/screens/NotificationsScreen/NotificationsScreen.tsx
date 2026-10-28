import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Header } from "@/components/Header/Header";
import { Loader } from "@/components/Loader/Loader";
import { Theme } from "@/constants/theme";
import { useHomes } from "@/context/HomeContext";
import { useNotificationCenter } from "@/context/NotificationCenterContext";
import { errorMessage } from "@/services/http";
import {
  ActivityRow,
  AlertRow,
  RecommendationRow,
} from "../../components/NotificationRow/NotificationRow";
import type { UiActivity } from "../../data/activityTypes";
import type { UiAlert } from "../../data/alertTypes";
import {
  ACCOUNT_SCOPE,
  ALL_SCOPE,
  inScope,
  type NotificationScope,
} from "../../data/notificationScope";
import type { UiRecommendation } from "../../data/recommendationTypes";
import { styles } from "./NotificationsScreen.styles";

type NotificationsTab = "all" | "alerts" | "recommendations" | "activity";

const TABS: { id: NotificationsTab }[] = [
  { id: "all" },
  { id: "alerts" },
  { id: "recommendations" },
  { id: "activity" },
];

/** El hogar elegido en el filtro se recuerda en este teléfono. */
const SCOPE_KEY = "energymonitor.notificationsScope";

const byNewest = (a: { date: string }, b: { date: string }) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

/** Fila de la lista: alertas, recomendaciones y actividad, unidas por fecha. */
type NotificationRowItem =
  | { kind: "alert"; alert: UiAlert; date: string }
  | { kind: "recommendation"; recommendation: UiRecommendation; date: string }
  | { kind: "activity"; activity: UiActivity; date: string };

export function NotificationsScreen() {
  const { t, i18n } = useTranslation("notifications");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { homes } = useHomes();
  const {
    alerts,
    recommendations,
    activity,
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
    markActivityRead,
    markAllActivityRead,
    removeActivity,
    removeAllReadActivity,
  } = useNotificationCenter();

  const [activeTab, setActiveTab] = useState<NotificationsTab>("all");
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [storedScope, setStoredScope] = useState<NotificationScope>(ALL_SCOPE);

  useEffect(() => {
    AsyncStorage.getItem(SCOPE_KEY)
      .then((saved) => {
        if (saved) setStoredScope(saved);
      })
      // Sin almacenamiento el filtro empieza en "todos": no es grave.
      .catch(() => undefined);
  }, []);

  // Un hogar que ya no es del usuario (salió o se eliminó) vuelve el filtro a "todos".
  const scope =
    storedScope === ALL_SCOPE ||
    storedScope === ACCOUNT_SCOPE ||
    homes.some((home) => home.idHome === storedScope)
      ? storedScope
      : ALL_SCOPE;

  const chooseScope = (next: NotificationScope) => {
    setStoredScope(next);
    AsyncStorage.setItem(SCOPE_KEY, next).catch(() => undefined);
  };

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

  const scopedAlerts = useMemo(() => alerts.filter((a) => inScope(a, scope)), [alerts, scope]);
  const scopedRecommendations = useMemo(
    () => recommendations.filter((r) => inScope(r, scope)),
    [recommendations, scope],
  );
  const scopedActivity = useMemo(
    () => activity.filter((n) => inScope(n, scope)),
    [activity, scope],
  );

  /** Pendientes de cada opción del filtro, para mostrarlos junto a su nombre. */
  const pendingIn = (option: NotificationScope) =>
    alerts.filter((a) => !a.resolved && inScope(a, option)).length +
    recommendations.filter((r) => !r.read && inScope(r, option)).length +
    activity.filter((n) => !n.read && inScope(n, option)).length;

  const scopeOptions = [
    { value: ALL_SCOPE, label: t("filter.all") },
    ...homes.map((home) => ({ value: home.idHome, label: home.name })),
    { value: ACCOUNT_SCOPE, label: t("filter.account") },
  ];

  const activeAlertsCount = scopedAlerts.filter((a) => !a.resolved).length;
  const resolvedAlertsCount = scopedAlerts.length - activeAlertsCount;
  const unreadRecommendationsCount = scopedRecommendations.filter((r) => !r.read).length;
  const readRecommendationsCount = scopedRecommendations.length - unreadRecommendationsCount;
  const unreadActivityCount = scopedActivity.filter((n) => !n.read).length;
  const readActivityCount = scopedActivity.length - unreadActivityCount;

  const tabCounts: Record<NotificationsTab, number> = {
    all: 0,
    alerts: activeAlertsCount,
    recommendations: unreadRecommendationsCount,
    activity: unreadActivityCount,
  };

  const listToRender = useMemo<NotificationRowItem[]>(() => {
    const alertRows: NotificationRowItem[] = scopedAlerts.map((alert) => ({
      kind: "alert",
      alert,
      date: alert.date,
    }));
    const recommendationRows: NotificationRowItem[] = scopedRecommendations.map(
      (recommendation) => ({
        kind: "recommendation",
        recommendation,
        date: recommendation.date,
      }),
    );
    const activityRows: NotificationRowItem[] = scopedActivity.map((entry) => ({
      kind: "activity",
      activity: entry,
      date: entry.date,
    }));

    const list =
      activeTab === "alerts"
        ? alertRows
        : activeTab === "recommendations"
          ? recommendationRows
          : activeTab === "activity"
            ? activityRows
            : [...alertRows, ...recommendationRows, ...activityRows];

    return [...list].sort(byNewest);
  }, [activeTab, scopedAlerts, scopedRecommendations, scopedActivity]);

  const showLoading =
    loading && alerts.length === 0 && recommendations.length === 0 && activity.length === 0;

  /**
   * Acción en bloque de la pestaña, sobre el hogar elegido: borrar lo ya
   * resuelto en alertas; marcar leídas o, si ya lo están, borrar las leídas en
   * recomendaciones y actividad. "Todas" no ofrece ninguna, porque no son la
   * misma operación.
   */
  const bulkAction =
    activeTab === "alerts" && resolvedAlertsCount > 0
      ? {
          icon: "trash-outline" as const,
          color: Theme.colors.danger,
          label: t("actions.deleteAllResolved", { count: resolvedAlertsCount }),
          onPress: () => removeAllResolved(scope),
        }
      : activeTab === "recommendations" && unreadRecommendationsCount > 0
        ? {
            icon: "checkmark-done" as const,
            color: Theme.colors.primary,
            label: t("actions.markAllRead"),
            onPress: () => markAllRecommendationsRead(scope),
          }
        : activeTab === "recommendations" && readRecommendationsCount > 0
          ? {
              icon: "trash-outline" as const,
              color: Theme.colors.danger,
              label: t("actions.deleteAllRead", { count: readRecommendationsCount }),
              onPress: () => removeAllReadRecommendations(scope),
            }
          : activeTab === "activity" && unreadActivityCount > 0
            ? {
                icon: "checkmark-done" as const,
                color: Theme.colors.primary,
                label: t("actions.markAllRead"),
                onPress: () => markAllActivityRead(scope),
              }
            : activeTab === "activity" && readActivityCount > 0
              ? {
                  icon: "trash-outline" as const,
                  color: Theme.colors.danger,
                  label: t("actions.deleteAllRead", { count: readActivityCount }),
                  onPress: () => removeAllReadActivity(scope),
                }
              : null;

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
          <Text style={styles.title} accessibilityRole="header">{t("title")}</Text>
          <Text style={styles.subtitle}>{t("subtitle")}</Text>
        </View>

        <View style={styles.panel}>
          <View style={styles.tabsRow}>
            <View style={styles.tabs}>
              {TABS.map((tab) => {
                const active = tab.id === activeTab;
                const count = tabCounts[tab.id];
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

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scopeChips}
              accessibilityLabel={t("filter.label")}
            >
              {scopeOptions.map((option) => {
                const selected = option.value === scope;
                const pending = pendingIn(option.value);
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => chooseScope(option.value)}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={
                      pending > 0
                        ? t("filter.optionPending", { name: option.label, count: pending })
                        : option.label
                    }
                    style={[styles.scopeChip, selected && styles.scopeChipActive]}
                  >
                    <Text
                      style={[styles.scopeChipLabel, selected && styles.scopeChipLabelActive]}
                      numberOfLines={1}
                    >
                      {option.label}
                    </Text>
                    {pending > 0 ? (
                      <Text style={[styles.scopeChipCount, selected && styles.scopeChipLabelActive]}>
                        {pending}
                      </Text>
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>

            {bulkAction ? (
              <Pressable
                onPress={() => void run(bulkAction.onPress)}
                disabled={busy}
                accessibilityRole="button"
                accessibilityLabel={bulkAction.label}
                style={styles.markAllButton}
              >
                <Ionicons
                  name={bulkAction.icon}
                  size={Theme.typography.size.sm}
                  color={bulkAction.color}
                />
                <Text style={styles.markAllLabel}>{bulkAction.label}</Text>
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
                ) : item.kind === "activity" ? (
                  <ActivityRow
                    key={item.activity.id}
                    activity={item.activity}
                    formatDate={formatDate}
                    onMarkRead={(id) => void run(() => markActivityRead(id))}
                    onRemove={(id) => void run(() => removeActivity(id))}
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
