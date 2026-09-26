import { Ionicons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
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

const TABS: { id: NotificationsTab; label: string }[] = [
  { id: "all", label: "Todas" },
  { id: "alerts", label: "Alertas" },
  { id: "recommendations", label: "Recomendaciones" },
];

const EMPTY_CONTENT: Record<NotificationsTab, { title: string; description: string }> = {
  all: {
    title: "Sin notificaciones",
    description:
      "Cuando el sistema detecte algo relevante en tus hogares, lo verás aquí.",
  },
  alerts: {
    title: "Sin alertas activas",
    description: "No hay alertas pendientes por revisar en este momento.",
  },
  recommendations: {
    title: "Sin recomendaciones",
    description: "Aún no hay recomendaciones generadas para tus hogares.",
  },
};

export function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [alerts] = useState(INITIAL_ALERTS);
  const [recommendations, setRecommendations] = useState(
    INITIAL_RECOMMENDATIONS,
  );
  const [activeTab, setActiveTab] = useState<NotificationsTab>("all");

  const formatDate = (isoDate: string) => {
    try {
      return new Intl.DateTimeFormat("es", {
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

  const empty = EMPTY_CONTENT[activeTab];

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
          { label: "Inicio", onPress: () => router.push("/dashboard" as Href) },
          { label: "Notificaciones" },
        ]}
        style={styles.header}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.title}>Notificaciones</Text>
          <Text style={styles.subtitle}>
            Alertas y recomendaciones generadas a partir del consumo de tus
            hogares.
          </Text>
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
                      {tab.label}
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
                accessibilityLabel="Marcar todas como leídas"
                style={styles.markAllButton}
              >
                <Ionicons
                  name="checkmark-done"
                  size={Theme.typography.size.sm}
                  color={Theme.colors.primary}
                />
                <Text style={styles.markAllLabel}>
                  Marcar todas como leídas
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
              title={empty.title}
              description={empty.description}
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
