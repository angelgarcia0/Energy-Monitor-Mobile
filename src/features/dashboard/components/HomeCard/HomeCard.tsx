import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { Card } from "@/components/Card/Card";
import { Theme } from "@/constants/theme";
import type { HomeMembership } from "@/services/home";
import { styles } from "./HomeCard.styles";

export interface HomeCardProps {
  home: HomeMembership;
  onPress?: (home: HomeMembership) => void;
  onToggleFavorite?: (idHome: string) => void;
  /** El backend guarda un solo límite de tiempo por llamada; ver `homeApi`. */
  togglingFavorite?: boolean;
}

const DESCRIPTION_LIMIT = 150;

export function HomeCard({
  home,
  onPress,
  onToggleFavorite,
  togglingFavorite = false,
}: HomeCardProps) {
  const { t } = useTranslation("homeCard");
  const [expanded, setExpanded] = useState(false);

  // El backend no manda un color: el tono lo decide el rol, como en la Web.
  const headerColor =
    home.role === "MEMBER" ? Theme.colors.secondary : Theme.colors.primary;

  const description = home.description ?? "";
  const isLong = description.length > DESCRIPTION_LIMIT;
  const displayText =
    expanded || !isLong
      ? description
      : description.slice(0, DESCRIPTION_LIMIT) + "…";

  return (
    <Pressable
      onPress={() => onPress?.(home)}
      accessibilityLabel={t("openHome", { name: home.name })}
    >
      <View style={[styles.header, { backgroundColor: headerColor }]}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{home.name}</Text>
          <Text style={styles.responsible}>
            {home.role === "MEMBER" ? t("member") : t("owner")}
          </Text>
        </View>

        <Pressable
          onPress={() => onToggleFavorite?.(home.idHome)}
          disabled={togglingFavorite}
          accessibilityRole="button"
          accessibilityLabel={home.favorite ? t("removeFavorite") : t("addFavorite")}
          style={[styles.favoriteButton, home.favorite && styles.favorited]}
        >
          <Ionicons
            name={home.favorite ? "heart" : "heart-outline"}
            size={Theme.typography.size.size18}
            color={
              home.favorite ? Theme.colors.primary : Theme.colors.onBrand
            }
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