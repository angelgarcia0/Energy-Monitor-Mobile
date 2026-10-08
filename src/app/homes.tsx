import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { createThemeStyles, Theme } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";

export default function HomesScreen() {
  const { t } = useTranslation("homes");

  const { currentTheme } = useTheme();

  return (
    <View key={currentTheme.id} style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>{t("placeholder.title")}</Text>
      <Text style={styles.subtitle}>{t("placeholder.description")}</Text>
    </View>
  );
}

const styles = createThemeStyles(() => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.sm,
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.background,
  },
  title: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.lg,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  subtitle: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textSecondary,
    textAlign: "center",
  },
}));
