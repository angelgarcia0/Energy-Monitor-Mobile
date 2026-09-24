import { useRouter, type Href } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ActionMenu } from "@/components/ActionMenu/ActionMenu";
import { Header } from "@/components/Header/Header";
import { Theme } from "@/constants/theme";
import { useHomes } from "@/context/HomeContext";
import { HomeCard, type Home } from "../../components/HomeCard/HomeCard";
import { CreateHomeModal } from "../../components/CreateHomeModal/CreateHomeModal";
import { DashboardEmptyState } from "../../components/DashboardEmptyState/DashboardEmptyState";
import { JoinHomeModal } from "../../components/JoinHomeModal/JoinHomeModal";
import type { CreateHomeFormValues } from "../../validation/createHomeSchema";
import { styles } from "./DashboardScreen.styles";

export interface DashboardScreenProps {}

export function DashboardScreen(_props: DashboardScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const { homes, addHome, toggleFavorite } = useHomes();

  const handleCreateHome = (values: CreateHomeFormValues) => {
    addHome({
      id: Date.now(),
      name: values.name,
      address: values.address,
      description: values.description,
      homeTypeId: values.homeType,
      otherHomeType: values.otherType,
      userResponsible: "Tú",
      variant: "owned",
      favorite: false,
    });
  };

  const handleJoinHome = () => {
    addHome({
      id: Date.now(),
      name: "Hogar unido",
      userResponsible: "Responsable del hogar",
      address: "Av. Central 45, Oficina 3",
      description: "Hogar al que te has unido como usuario regular.",
      variant: "joined",
      favorite: false,
    });
  };

  const handleHomePress = (home: Home) => {
    // ponytail: cast a Href hasta que `expo start` regenere los tipos de rutas.
    router.push(
      `/home/${home.id}?home=${encodeURIComponent(JSON.stringify(home))}` as Href,
    );
  };

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

      <ScrollView
        contentContainerStyle={homes.length === 0 ? styles.contentEmpty : styles.contentList}
      >
        {homes.length === 0 ? (
          <DashboardEmptyState
            onCreateHome={() => setShowCreate(true)}
            onJoinHome={() => setShowJoin(true)}
          />
        ) : (
          homes.map((home) => (
            <HomeCard
              key={home.id}
              home={home}
              favorite={home.favorite}
              onPress={handleHomePress}
              onToggleFavorite={toggleFavorite}
            />
          ))
        )}
      </ScrollView>

      <CreateHomeModal
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreateHome}
      />
      <JoinHomeModal
        visible={showJoin}
        onClose={() => setShowJoin(false)}
        onSubmit={handleJoinHome}
      />
    </View>
  );
}
