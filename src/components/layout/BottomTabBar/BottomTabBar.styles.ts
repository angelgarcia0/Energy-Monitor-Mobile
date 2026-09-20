import { StyleSheet } from "react-native";

import { Theme } from "../../../constants/theme";

export const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    ...Theme.shadow.md,
    shadowOffset: { width: 0, height: -2 },
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Theme.spacing.sm + Theme.spacing.xs,
    borderTopWidth: 2,
    borderTopColor: "transparent",
  },
  tabActive: {
    borderTopColor: Theme.colors.primary,
  },
});
