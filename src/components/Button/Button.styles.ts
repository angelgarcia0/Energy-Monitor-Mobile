import { StyleSheet } from "react-native";
import { Theme } from "../../constants/theme";

export const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.sm,
    borderRadius: Theme.radius.sm,
    ...Theme.shadow.md,
  },
  icon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  size_small: {
    height: 32,
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
  },
  size_medium: {
    height: 40,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
  },
  size_large: {
    height: 48,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
  },

  text_small: {
    fontSize: Theme.typography.size.xs,
  },
  text_medium: {
    fontSize: Theme.typography.size.sm,
  },
  text_large: {
    fontSize: Theme.typography.size.md,
  },

  text: {
    fontFamily: Theme.typography.fontPrimary,
    fontWeight: Theme.typography.weight.medium,
  },

  variant_primary: {
    backgroundColor: Theme.colors.primary,
    borderWidth: 0,
  },
  text_primary: {
    color: Theme.colors.surface,
  },

  variant_secondary: {
    backgroundColor: Theme.colors.background,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  text_secondary: {
    color: Theme.colors.textPrimary,
  },

  variant_ghost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Theme.colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  text_ghost: {
    color: Theme.colors.textSecondary,
  },

  variant_danger: {
    backgroundColor: Theme.colors.background,
    borderWidth: 1,
    borderColor: Theme.colors.danger,
  },
  text_danger: {
    color: Theme.colors.danger,
  },

  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.6,
  },
});
