import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ActionMenu } from "@/components/ActionMenu/ActionMenu";
import { Header } from "@/components/Header/Header";
import { Theme } from "@/constants/theme";
import { CreateHomeModal } from "../../components/CreateHomeModal/CreateHomeModal";
import { DashboardEmptyState } from "../../components/DashboardEmptyState/DashboardEmptyState";
import { JoinHomeModal } from "../../components/JoinHomeModal/JoinHomeModal";
import { styles } from "./DashboardScreen.styles";

export interface DashboardScreenProps {}

export function DashboardScreen(_props: DashboardScreenProps) {
  const insets = useSafeAreaInsets();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, Theme.spacing.md) }]}>
      <StatusBar style="auto" />

      <Header title="Inicio" style={styles.header}>
        <ActionMenu
          options={[
            { label: "Unirse a hogar", icon: "people-outline", onPress: () => setShowJoin(true) },
            { label: "Crear hogar", icon: "folder-open-outline", onPress: () => setShowCreate(true) },
          ]}
        />
      </Header>

      <ScrollView contentContainerStyle={styles.content}>
        <DashboardEmptyState
          onCreateHome={() => setShowCreate(true)}
          onJoinHome={() => setShowJoin(true)}
        />
      </ScrollView>

      <CreateHomeModal visible={showCreate} onClose={() => setShowCreate(false)} />
      <JoinHomeModal visible={showJoin} onClose={() => setShowJoin(false)} />
    </View>
  );
}
