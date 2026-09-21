import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomTabBar, type BottomTabItem } from "@/components/layout/BottomTabBar/BottomTabBar";
import { Theme } from "@/constants/theme";
import type { Home } from "@/features/dashboard/components/HomeCard/HomeCard";
import { ConsumptionHistoryTab } from "../../components/ConsumptionHistoryTab/ConsumptionHistoryTab";
import { ConsumptionTab } from "../../components/ConsumptionTab/ConsumptionTab";
import { styles } from "./HomeDetailScreen.styles";

export interface HomeDetailScreenProps {
  home: Home;
}

const TABS: BottomTabItem[] = [
  { id: "Consumo", label: "Consumo", icon: "pulse-outline" },
  { id: "Historial", label: "Historial", icon: "time-outline" },
  { id: "Usuarios", label: "Usuarios", icon: "people-outline" },
  { id: "Dispositivos", label: "Dispositivos", icon: "wifi-outline" },
  { id: "Umbrales", label: "Umbrales", icon: "options-outline" },
  { id: "Hogar", label: "Hogar", icon: "home-outline" },
];

export function HomeDetailScreen({ home }: HomeDetailScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, Theme.spacing.md) }]}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Volver" style={styles.backButton}>
          <Ionicons name="arrow-back" size={Theme.typography.size.lg} color={Theme.colors.textPrimary} />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {home.name}
        </Text>
      </View>

      <View style={styles.body}>
        {activeTab === "Consumo" ? (
          <ConsumptionTab />
        ) : activeTab === "Historial" ? (
          <ConsumptionHistoryTab />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderTitle}>{activeTab}</Text>
            <Text style={styles.placeholderText}>Próximamente</Text>
          </View>
        )}
      </View>

      <BottomTabBar tabs={TABS} activeTabId={activeTab} onTabPress={setActiveTab} />
    </View>
  );
}
