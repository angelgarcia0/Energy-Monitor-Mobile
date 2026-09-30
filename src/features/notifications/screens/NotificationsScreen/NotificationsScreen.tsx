import { Ionicons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Header } from "@/components/Header/Header";
import { Theme } from "@/constants/theme";
import { AlertRow, RecommendationRow } from "../../components/NotificationRow/NotificationRow";
import {
  INITIAL_ALERTS,
  INITIAL_RECOMMENDATIONS,
} from "../../data/notificationsMock";
import { styles } from "./NotificationsScreen.styles";

type NotificationsTab = "all" | "alerts" | "recommendations";

const TABS: { id: NotificationsTab }[] = [
  { id: "all" },
  { id: "alerts" },
  { id: "recommendations" },
];

export function NotificationsScreen() {
  const { t, i18n } = useTranslation("notifications");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [alerts] = useState(INITIAL_ALERTS);
  const [recommendations, setRecommendations] = useState(
    INITIAL_RECOMMENDATIONS,
  );
  const [activeTab, setActiveTab] = useState<NotificationsTab>("all");

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

  const handleMarkRead = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, read: true } : r)),
    );
  };

  const handleMarkAllRead = () => {
    setRecommendations((prev) => prev.map((r) => ({ ...r, read: true })));
  };

  const activeAlertsCount = alerts.filter((a) => !a.resolved).length;
  const unreadRecommendationsCount = recommendations.filter(
    (r) => !r.read,
  ).length;

  const combinedList = useMemo(
    () =>
      [...alerts, ...recommendations].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [alerts, recommendations],
  );

  const listToRender =
    activeTab === "alerts"
      ? [...alerts].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )
      : activeTab === "recommendations"
        ? [...recommendations].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
        : combinedList;

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

            {activeTab !== "alerts" && unreadRecommendationsCount > 0 ? (
              <Pressable
                onPress={handleMarkAllRead}
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
            ) : null}
          </View>

          {listToRender.length === 0 ? (
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
          ) : (
            <View style={styles.list}>
              {listToRender.map((item) =>
                item.kind === "alert" ? (
                  <AlertRow
                    key={item.id}
                    alert={item}
                    formatDate={formatDate}
                  />
                ) : (
                  <RecommendationRow
                    key={item.id}
                    recommendation={item}
                    formatDate={formatDate}
                    onMarkRead={handleMarkRead}
                  />
                ),
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
