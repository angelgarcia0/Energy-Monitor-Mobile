import { StyleSheet } from "react-native";
import { Theme } from "../../constants/theme";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    ...Theme.shadow.sm,
  },
});
