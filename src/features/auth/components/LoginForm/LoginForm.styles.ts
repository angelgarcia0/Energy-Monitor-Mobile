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
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    rowGap: Theme.spacing.xs,
    columnGap: Theme.spacing.sm,
  },
  remember: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    flexShrink: 0,
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
  },
  checkboxChecked: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  rememberLabel: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.medium,
    color: Theme.colors.textPrimary,
  },
  link: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.secondary,
    flexShrink: 1,
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