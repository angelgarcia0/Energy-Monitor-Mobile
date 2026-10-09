import { Ionicons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Header } from "@/components/Header/Header";
import { Theme } from "@/constants/theme";
import { useHomes } from "@/context/HomeContext";
import { HomeCard } from "@/features/dashboard/components/HomeCard/HomeCard";
import type { HomeMembership } from "@/services/home";
import { styles } from "./FavoritesScreen.styles";

export function FavoritesScreen() {
  const { t } = useTranslation("favorites");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { homes, setFavorite } = useHomes();
  const favoriteHomes = homes.filter((home) => home.favorite);

  // Solo el id viaja en la ruta: el hogar se resuelve del contexto, así que no
  // se pone el objeto entero en la URL.
  const handleHomePress = (home: HomeMembership) => {
    router.push(`/home/${home.idHome}` as Href);
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
          {
            label: t("favorites.breadcrumb.home"),
            onPress: () => router.push("/dashboard" as Href),
          },
          { label: t("favorites.breadcrumb.current") },
        ]}
        style={styles.header}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.title}>{t("favorites.title")}</Text>
          <Text style={styles.subtitle}>{t("favorites.subtitle")}</Text>
        </View>

        <View style={styles.favoritesCard}>
          {favoriteHomes.length > 0 ? (
            <View style={styles.grid}>
              {favoriteHomes.map((home) => (
                <View key={home.idHome} style={styles.gridItem}>
                  <HomeCard
                    home={home}
                    onPress={handleHomePress}
                    onToggleFavorite={setFavorite}
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
              title={t("favorites.empty.title")}
              description={t("favorites.empty.description")}
              style={styles.emptyState}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
