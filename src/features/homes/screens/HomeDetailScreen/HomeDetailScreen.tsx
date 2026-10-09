import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomTabBar, type BottomTabItem } from "@/components/layout/BottomTabBar/BottomTabBar";
import { Theme } from "@/constants/theme";
import type { HomeMembership } from "@/services/home";
import { ConsumptionHistoryTab } from "../../components/ConsumptionHistoryTab/ConsumptionHistoryTab";
import { ConsumptionTab } from "../../components/ConsumptionTab/ConsumptionTab";
import { DevicesTab } from "../../components/DevicesTab/DevicesTab";
import { HomeInfoTab } from "../../components/HomeInfoTab/HomeInfoTab";
import { ThresholdsTab } from "../../components/ThresholdsTab/ThresholdsTab";
import { UsersTab } from "../../components/UsersTab/UsersTab";
import { useConsumptionSummary } from "../../hooks/useConsumption";
import { useDevicesState } from "../../hooks/useDevicesState";
import { useThresholdsState } from "../../hooks/useThresholdsState";
import { styles } from "./HomeDetailScreen.styles";

export interface HomeDetailScreenProps {
  home: HomeMembership;
}

type HomeTab = "consumption" | "history" | "users" | "devices" | "thresholds" | "home";

const TABS: { id: HomeTab; icon: BottomTabItem["icon"] }[] = [
  { id: "consumption", icon: "pulse-outline" },
  { id: "history", icon: "time-outline" },
  { id: "users", icon: "people-outline" },
  { id: "devices", icon: "wifi-outline" },
  { id: "thresholds", icon: "options-outline" },
  { id: "home", icon: "home-outline" },
];

export function HomeDetailScreen({ home }: HomeDetailScreenProps) {
  const { t } = useTranslation("consumption");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<HomeTab>(TABS[0].id);
  const { summary } = useConsumptionSummary(home.idHome);
  const thresholds = useThresholdsState(home.idHome);
  // El resumen lo aporta la pantalla: el endpoint de dispositivos no trae
  // potencia y el de consumo no trae nombre ni estado de conexión.
  const deviceState = useDevicesState(home.idHome, summary);

  const isOwner = home.role === "OWNER";

  // Entrar por URL directa o recargar deja el stack con una sola pantalla: no
  // hay a qué volver, así que se cae al dashboard en vez de avisar en consola.
  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/dashboard");
  };

  const tabs = useMemo<BottomTabItem[]>(
    () => TABS.map((tab) => ({ ...tab, label: t(`tabs.${tab.id}`) })),
    [t],
  );

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, Theme.spacing.md) }]}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Pressable
          onPress={handleBack}
          accessibilityLabel={t("breadcrumb.home")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={Theme.typography.size.lg} color={Theme.colors.textPrimary} />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {home.name}
        </Text>
      </View>

      <View style={styles.body}>
        {activeTab === "consumption" ? (
          <ConsumptionTab homeId={home.idHome} devices={deviceState.devices} />
        ) : activeTab === "history" ? (
          <ConsumptionHistoryTab homeId={home.idHome} devices={deviceState.devices} />
        ) : activeTab === "devices" ? (
          <DevicesTab state={deviceState} isOwner={isOwner} />
        ) : activeTab === "thresholds" ? (
          <ThresholdsTab state={thresholds} isOwner={isOwner} />
        ) : activeTab === "users" ? (
          <UsersTab homeId={home.idHome} isOwner={isOwner} />
        ) : (
          <HomeInfoTab home={home} isOwner={isOwner} />
        )}
      </View>

      <BottomTabBar
        tabs={tabs}
        activeTabId={activeTab}
        onTabPress={(id) => setActiveTab(id as HomeTab)}
      />
    </View>
  );
}