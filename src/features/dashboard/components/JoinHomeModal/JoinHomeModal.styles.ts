import { StyleSheet } from "react-native";

import { Theme } from "@/constants/theme";

const ICON_CIRCLE_SIZE = Theme.spacing.xl * 2;

export const styles = StyleSheet.create({
  body: {
    alignItems: "center",
    gap: Theme.spacing.md,
  },
  iconCircle: {
    width: ICON_CIRCLE_SIZE,
    height: ICON_CIRCLE_SIZE,
    borderRadius: ICON_CIRCLE_SIZE / 2,
    backgroundColor: Theme.colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textSecondary,
    textAlign: "center",
  },
  field: {
    width: "100%",
    gap: Theme.spacing.xs,
  },
  counter: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    color: Theme.colors.textSecondary,
    textAlign: "right",
  },
  error: {
    alignSelf: "flex-start",
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size13,
    color: Theme.colors.danger,
  },
  hint: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    color: Theme.colors.textSecondary,
    textAlign: "center",
  },
});
