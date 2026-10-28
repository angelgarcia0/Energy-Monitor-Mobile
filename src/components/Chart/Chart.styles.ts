import { StyleSheet } from "react-native";
import { createThemeStyles, Theme } from "../../constants/theme";

export const styles = createThemeStyles(() => StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    ...Theme.shadow.sm,
  },
}));