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
  submitButton: {
    width: "100%",
  },
});