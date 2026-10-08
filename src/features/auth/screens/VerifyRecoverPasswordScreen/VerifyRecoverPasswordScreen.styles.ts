import { StyleSheet } from "react-native";

import { createThemeStyles, Theme } from "@/constants/theme";

export const styles = createThemeStyles(() => StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: Theme.spacing.md,
    gap: Theme.spacing.lg,
  },
  languageSwitcher: {
    alignSelf: "center",
  },
}));