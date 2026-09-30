import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { Card } from "@/components/Card/Card";
import { Theme } from "@/constants/theme";
import { styles } from "./HomeCard.styles";

export type HomeTextField =
  | "name"
  | "address"
  | "description"
  | "userResponsible";

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
  /**
   * Campos cuyo texto viene del locale y no del usuario. Se guardan como claves
   * y se resuelven al renderizar para que sigan el idioma activo.
   */
  mockFields?: Partial<Record<HomeTextField, string>>;
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
  const { t } = useTranslation("homeCard");
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
      accessibilityLabel={t("openHome", { name: home.name })}
    >
      <View style={[styles.header, { backgroundColor: headerColor }]}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{home.name}</Text>
          <Text style={styles.responsible}>{home.userResponsible}</Text>
        </View>

        <Pressable
          onPress={() => onToggleFavorite?.(home.id)}
          accessibilityLabel={favorite ? t("removeFavorite") : t("addFavorite")}
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
          <Text style={styles.label}>{t("address")}: </Text>
          {home.address}
        </Text>

        <View style={styles.descriptionWrapper}>
          <Text style={styles.text} numberOfLines={!expanded && isLong ? 2 : undefined}>
            <Text style={styles.label}>{t("description")}: </Text>
            {displayText}
          </Text>
          {isLong ? (
            <Pressable onPress={() => setExpanded((prev) => !prev)}>
              <Text style={styles.toggle}>
                {expanded ? t("showLess") : t("showMore")}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </Card>
    </Pressable>
  );
}
