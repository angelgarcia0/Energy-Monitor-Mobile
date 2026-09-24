import { StyleSheet } from "react-native";

import { Theme } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  link: {
    borderRadius: Theme.radius.sm,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  linkPressed: {
    backgroundColor: Theme.colors.cardSoft,
  },
  linkText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.lg,
    fontWeight: Theme.typography.weight.medium,
    color: Theme.colors.primary,
  },
  current: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.lg,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textSecondary,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  separator: {
    marginHorizontal: 2,
  },
});
