import { Ionicons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Header } from "@/components/Header/Header";
import { Theme } from "@/constants/theme";
import { useHomes } from "@/context/HomeContext";
import {
  HomeCard,
  type Home,
} from "@/features/dashboard/components/HomeCard/HomeCard";
import { styles } from "./FavoritesScreen.styles";

export function FavoritesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { homes, toggleFavorite } = useHomes();
  const favoriteHomes = homes.filter((home) => home.favorite);

  const handleHomePress = (home: Home) => {
    // ponytail: cast a Href hasta que `expo start` regenere los tipos de rutas.
    router.push(
      `/home/${home.id}?home=${encodeURIComponent(JSON.stringify(home))}` as Href,
    );
  };

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
          { label: "Favoritos" },
        ]}
        style={styles.header}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.title}>Favoritos</Text>
          <Text style={styles.subtitle}>
            Tus hogares marcados como favoritos aparecen aquí para que los
            encuentres de forma rápida.
          </Text>
        </View>

        <View style={styles.favoritesCard}>
          {favoriteHomes.length > 0 ? (
            <View style={styles.grid}>
              {favoriteHomes.map((home) => (
                <View key={home.id} style={styles.gridItem}>
                  <HomeCard
                    home={home}
                    favorite={home.favorite}
                    onPress={handleHomePress}
                    onToggleFavorite={toggleFavorite}
                  />
                </View>
              ))}
            </View>
          ) : (
            <EmptyState
              icon={
                <Ionicons
                  name="heart-outline"
                  size={Theme.typography.size.xxl + Theme.spacing.sm}
                  color={Theme.colors.border}
                />
              }
              title="Sin favoritos aún"
              description="Marca el corazón en cualquier hogar para verlo aquí."
              style={styles.emptyState}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
