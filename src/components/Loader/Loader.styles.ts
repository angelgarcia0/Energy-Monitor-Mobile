import { StyleSheet } from "react-native";
import { createThemeStyles, Theme } from "../../constants/theme";

export const styles = createThemeStyles(() => StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.sm,
  },
  text: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textSecondary,
  },
}));