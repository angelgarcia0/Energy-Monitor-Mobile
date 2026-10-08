import { StyleSheet } from "react-native";

import { createThemeStyles, Theme } from "@/constants/theme";

export const styles = createThemeStyles(() => StyleSheet.create({
  error: {
    marginTop: Theme.spacing.xs,
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size13,
    color: Theme.colors.danger,
  },
}));