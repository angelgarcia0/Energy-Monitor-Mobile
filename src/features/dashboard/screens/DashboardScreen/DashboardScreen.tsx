import { Ionicons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ActionMenu } from "@/components/ActionMenu/ActionMenu";
import { Button } from "@/components/Button/Button";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Header } from "@/components/Header/Header";
import { Loader } from "@/components/Loader/Loader";
import { Theme } from "@/constants/theme";
import { useHomes } from "@/context/HomeContext";
import { errorMessage } from "@/services/http";
import type { HomeMembership } from "@/services/home";
import { CreateHomeModal } from "../../components/CreateHomeModal/CreateHomeModal";
import { DashboardEmptyState } from "../../components/DashboardEmptyState/DashboardEmptyState";
import { HomeCard } from "../../components/HomeCard/HomeCard";
import { JoinHomeModal } from "../../components/JoinHomeModal/JoinHomeModal";
import type { CreateHomeFormValues } from "../../validation/createHomeSchema";
import { styles } from "./DashboardScreen.styles";

export interface DashboardScreenProps {}

export function DashboardScreen(_props: DashboardScreenProps) {
  const { t } = useTranslation("dashboard");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [togglingHomeId, setTogglingHomeId] = useState<string | null>(null);
  const { homes, homeTypes, loading, error, reload, addHome, joinHome, setFavorite } =
    useHomes();

  const handleOpenCreate = () => {
    setCreateError(null);
    setShowCreate(true);
  };

  const handleOpenJoin = () => {
    setJoinError(null);
    setShowJoin(true);
  };

  const handleCreateHome = async (values: CreateHomeFormValues) => {
    setSubmitting(true);
    try {
      const err = await addHome({
        name: values.name.trim(),
        homeTypeId: values.homeType,
        address: values.address.trim(),
        description: values.description.trim() || undefined,
      });
      if (err) {
        setCreateError(errorMessage(t, err, "homeCreate"));
        return false;
      }
      return true;
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinHome = async (code: string) => {
    setSubmitting(true);
    try {
      const err = await joinHome(code);
      if (err) {
        setJoinError(errorMessage(t, err, "homeJoin"));
        return false;
      }
      return true;
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleFavorite = async (idHome: string) => {
    setTogglingHomeId(idHome);
    try {
      await setFavorite(idHome);
    } finally {
      setTogglingHomeId(null);
    }
  };

  const handleHomePress = (home: HomeMembership) => {
    router.push(`/home/${home.idHome}` as Href);
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, Theme.spacing.md) }]}>
      <StatusBar style="auto" />

      <Header title={t("breadcrumb.home")} style={styles.header}>
        <ActionMenu
          accessibilityLabel={t("actions.openMenu")}
          options={[
            { label: t("actions.joinHome"), icon: "people-outline", onPress: handleOpenJoin },
            { label: t("actions.createHome"), icon: "folder-open-outline", onPress: handleOpenCreate },
          ]}
        />
      </Header>

      <ScrollView
        contentContainerStyle={homes.length === 0 ? styles.contentEmpty : styles.contentList}
      >
        {loading ? <Loader text={t("state.loading")} /> : null}

        {error ? (
          <EmptyState
            variant="full"
            icon={
              <Ionicons
                name="cloud-offline-outline"
                size={Theme.typography.size.xxl + Theme.spacing.sm}
                color={Theme.colors.border}
              />
            }
            title={t("state.error")}
            description={t("state.errorDescription")}
            actions={<Button onPress={() => void reload()}>{t("state.retry")}</Button>}
          />
        ) : null}

        {!loading && !error && homes.length === 0 ? (
          <DashboardEmptyState
            onCreateHome={handleOpenCreate}
            onJoinHome={handleOpenJoin}
          />
        ) : null}

        {!loading && !error && homes.length > 0 ? (
          homes.map((home) => (
            <HomeCard
              key={home.idHome}
              home={home}
              onPress={handleHomePress}
              onToggleFavorite={handleToggleFavorite}
              togglingFavorite={togglingHomeId === home.idHome}
            />
          ))
        ) : null}
      </ScrollView>

      <CreateHomeModal
        visible={showCreate}
        types={homeTypes}
        submitting={submitting}
        serverError={createError}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreateHome}
      />
      <JoinHomeModal
        visible={showJoin}
        submitting={submitting}
        serverError={joinError}
        onClose={() => setShowJoin(false)}
        onSubmit={handleJoinHome}
      />
    </View>
  );
}