import { StyleSheet } from "react-native";

import { createThemeStyles, Theme } from "@/constants/theme";

export const styles = createThemeStyles(() => StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
    gap: Theme.spacing.xs,
  },
  label: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textSecondary,
  },
  value: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textPrimary,
  },
  editButton: {
    width: Theme.spacing.xl + Theme.spacing.sm,
    height: Theme.spacing.xl + Theme.spacing.sm,
    borderRadius: Theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.colors.primarySoft,
  },
  editButtonPressed: {
    opacity: 0.7,
  },
}));