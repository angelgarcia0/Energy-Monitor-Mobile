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
  description: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textSecondary,
    textAlign: "center",
  },
  submitButton: {
    width: "100%",
  },
  resendBlock: {
    alignItems: "center",
    gap: Theme.spacing.sm,
  },
  resendText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textSecondary,
  },
  resendButton: {
    width: "100%",
  },
  footer: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.medium,
    color: Theme.colors.textPrimary,
    textAlign: "center",
  },
  footerLink: {
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.secondary,
  },
});