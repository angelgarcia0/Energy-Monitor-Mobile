import { StyleSheet } from "react-native";

import { createThemeStyles, Theme } from "@/constants/theme";

export const styles = createThemeStyles(() => StyleSheet.create({
  form: {
    gap: Theme.spacing.xs,
    paddingBottom: Theme.spacing.xs,
  },
  error: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size13,
    color: Theme.colors.danger,
  },
}));