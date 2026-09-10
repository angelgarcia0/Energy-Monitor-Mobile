import { StyleSheet } from "react-native";

import { Theme } from "@/constants/theme";

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: Theme.spacing.md,
    gap: Theme.spacing.lg,
  },
});