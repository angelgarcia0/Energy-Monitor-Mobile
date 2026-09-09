import { StyleSheet } from "react-native";
import { Theme } from "../../constants/theme";

export const styles = StyleSheet.create({
  base: {
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadow.sm,
  },
  padding_none: {
    padding: 0,
  },
  padding_sm: {
    padding: Theme.spacing.sm,
  },
  padding_md: {
    padding: Theme.spacing.md,
  },
  padding_lg: {
    padding: Theme.spacing.lg,
  },
  variant_default: {},
  variant_soft: {
    backgroundColor: Theme.colors.cardSoft,
    borderColor: "transparent",
  },
  variant_selected: {
    backgroundColor: Theme.colors.cardSelected,
    borderColor: Theme.colors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
});