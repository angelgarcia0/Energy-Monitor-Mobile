import { StyleSheet } from "react-native";

import { createThemeStyles, Theme } from "@/constants/theme";

export const styles = createThemeStyles(() => StyleSheet.create({
  message: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.size.size22,
    color: Theme.colors.textSecondary,
    textAlign: "center",
  },
  acknowledge: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Theme.spacing.sm,
    marginTop: Theme.spacing.md,
    padding: Theme.spacing.sm,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.warningSoft,
  },
  checkbox: {
    width: Theme.spacing.lg,
    height: Theme.spacing.lg,
    marginTop: 1,
    borderWidth: 2,
    borderColor: Theme.colors.warningText,
    borderRadius: Theme.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  acknowledgeText: {
    flex: 1,
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    lineHeight: Theme.typography.size.size18,
    color: Theme.colors.warningText,
  },
  footerButton: {
    flex: 1,
  },
}));
