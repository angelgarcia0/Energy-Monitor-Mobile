import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Card } from "@/components/Card/Card";
import { Theme } from "@/constants/theme";
import { styles } from "./HomeCard.styles";

export interface Home {
  id: number;
  name: string;
  address: string;
  description: string;
  userResponsible: string;
  variant: "owned" | "joined";
  favorite: boolean;
  homeTypeId?: string;
  otherHomeType?: string;
}

export interface HomeCardProps {
  home: Home;
  favorite: boolean;
  onPress?: (home: Home) => void;
  onToggleFavorite?: (id: number) => void;
}

const DESCRIPTION_LIMIT = 150;

export function HomeCard({
  home,
  favorite,
  onPress,
  onToggleFavorite,
}: HomeCardProps) {
  const [expanded, setExpanded] = useState(false);

  const headerColor =
    home.variant === "joined" ? Theme.colors.secondary : Theme.colors.primary;

  const isLong = home.description.length > DESCRIPTION_LIMIT;
  const displayText =
    expanded || !isLong
      ? home.description
      : home.description.slice(0, DESCRIPTION_LIMIT) + "…";

  return (
    <Pressable
      onPress={() => onPress?.(home)}
      accessibilityLabel={`Abrir hogar ${home.name}`}
    >
      <View style={[styles.header, { backgroundColor: headerColor }]}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{home.name}</Text>
          <Text style={styles.responsible}>{home.userResponsible}</Text>
        </View>

        <Pressable
          onPress={() => onToggleFavorite?.(home.id)}
          accessibilityLabel={favorite ? "Quitar favorito" : "Añadir a favoritos"}
          style={[styles.favoriteButton, favorite && styles.favorited]}
        >
          <Ionicons
            name={favorite ? "heart" : "heart-outline"}
            size={Theme.typography.size.size18}
            color={favorite ? Theme.colors.primary : Theme.colors.surface}
          />
        </Pressable>
      </View>

      <Card style={styles.body}>
        <Text style={styles.text}>
          <Text style={styles.label}>Dirección: </Text>
          {home.address}
        </Text>

        <View style={styles.descriptionWrapper}>
          <Text style={styles.text} numberOfLines={!expanded && isLong ? 2 : undefined}>
            <Text style={styles.label}>Descripción: </Text>
            {displayText}
          </Text>
          {isLong ? (
            <Pressable onPress={() => setExpanded((prev) => !prev)}>
              <Text style={styles.toggle}>{expanded ? "Ver menos" : "Ver más"}</Text>
            </Pressable>
          ) : null}
        </View>
      </Card>
    </Pressable>
  );
}
