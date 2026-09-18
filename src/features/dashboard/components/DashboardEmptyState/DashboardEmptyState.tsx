import React from "react";
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
      title="Añade un hogar para empezar"
      actions={
        <>
          <Button variant="secondary" onPress={onCreateHome}>
            Crear hogar
          </Button>
          <Button variant="primary" onPress={onJoinHome}>
            Unirse a hogar
          </Button>
        </>
      }
    />
  );
}
