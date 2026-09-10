import { StyleSheet } from "react-native";

import { Theme } from "@/constants/theme";

export const styles = StyleSheet.create({
  card: {
    width: "100%",
  },
  form: {
    width: "100%",
    gap: Theme.spacing.md,
  },
  title: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.lg,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
    textAlign: "center",
  },
  error: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size13,
    color: Theme.colors.danger,
  },
  options: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Theme.spacing.sm,
  },
  checkbox: {
    width: Theme.spacing.lg,
    height: Theme.spacing.lg,
    borderRadius: Theme.radius.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  termsText: {
    flex: 1,
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textPrimary,
  },
  termsLink: {
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.secondary,
  },
  buttonsContainer: {
    alignItems: "center",
    gap: Theme.spacing.sm,
    width: "100%",
  },
  submitButton: {
    width: "100%",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: Theme.spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Theme.colors.border,
  },
  dividerText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    color: Theme.colors.textSecondary,
  },
  loginWith: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textSecondary,
  },
  googleButton: {
    width: "100%",
  },
  googleIcon: {
    width: Theme.spacing.xl,
    height: Theme.spacing.xl,
  },
  register: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.medium,
    color: Theme.colors.textPrimary,
    textAlign: "center",
  },
  registerLink: {
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.secondary,
  },
});
