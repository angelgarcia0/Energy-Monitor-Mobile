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
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
  },
  size_medium: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
  },
  size_large: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
  },

  text_small: {
    fontSize: Theme.typography.size.xs,
    lineHeight: Theme.typography.size.xs * 1.3,
  },
  text_medium: {
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.size.sm * 1.3,
  },
  text_large: {
    fontSize: Theme.typography.size.md,
    lineHeight: Theme.typography.size.md * 1.3,
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
