import { StyleSheet } from "react-native";

import { createThemeStyles, Theme } from "@/constants/theme";

export const styles = createThemeStyles(() => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  close: {
    position: "absolute",
    top: Theme.spacing.xl * 2,
    right: Theme.spacing.lg,
    width: Theme.spacing.xl + Theme.spacing.md,
    height: Theme.spacing.xl + Theme.spacing.md,
    borderRadius: Theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  image: {
    width: "100%",
    height: "100%",
  },
}));
