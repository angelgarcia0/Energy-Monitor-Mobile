import { StyleSheet } from "react-native";

import { createThemeStyles, Theme } from "@/constants/theme";

export const styles = createThemeStyles(() => StyleSheet.create({
  container: {
    position: "relative",
  },

  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
  },
  triggerDark: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderColor: "rgba(255, 255, 255, 0.35)",
  },
  triggerLight: {
    backgroundColor: Theme.colors.surface,
    borderColor: Theme.colors.border,
  },
  triggerPressed: {
    opacity: 0.75,
  },
  triggerText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    fontWeight: Theme.typography.weight.bold,
  },

  flag: {
    borderRadius: 2,
  },

  backdrop: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Theme.spacing.lg,
    backgroundColor: "rgba(10, 37, 64, 0.45)",
  },

  sheet: {
    borderRadius: Theme.radius.lg,
    paddingVertical: Theme.spacing.xs,
    gap: 2,
  },
  sheetDark: {
    backgroundColor: Theme.colors.primaryDark,
  },
  sheetLight: {
    backgroundColor: Theme.colors.surface,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
  },
  itemPressed: {
    opacity: 0.7,
  },
  itemText: {
    flex: 1,
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
  },

  textLight: {
    color: "#FFFFFF",
  },
  textDark: {
    color: Theme.colors.textPrimary,
  },
}));