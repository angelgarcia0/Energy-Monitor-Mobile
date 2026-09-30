import React from "react";
import { useTranslation } from "react-i18next";
import { Image } from "react-native";

import { Button } from "@/components/Button/Button";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { styles } from "./DashboardEmptyState.styles";

export interface DashboardEmptyStateProps {
  onCreateHome: () => void;
  onJoinHome: () => void;
}

export function DashboardEmptyState({
  onCreateHome,
  onJoinHome,
}: DashboardEmptyStateProps) {
  const { t } = useTranslation("emptyState");

  return (
    <EmptyState
      variant="full"
      image={
        <Image
          source={require("../../../../assets/empty_image.png")}
          style={styles.image}
          resizeMode="contain"
        />
      }
      title={t("title")}
      actions={
        <>
          <Button variant="secondary" onPress={onCreateHome}>
            {t("createHome")}
          </Button>
          <Button variant="primary" onPress={onJoinHome}>
            {t("joinHome")}
          </Button>
        </>
      }
    />
  );
}
