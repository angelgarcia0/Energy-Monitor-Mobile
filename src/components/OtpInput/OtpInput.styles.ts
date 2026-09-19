import { StyleSheet } from "react-native";

import { Theme } from "../../constants/theme";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Theme.spacing.sm,
    width: "100%",
  },
  input: {
    width: 45,
    height: 45,
    textAlign: "center",
    fontSize: Theme.typography.size.size18,
    fontFamily: Theme.typography.fontPrimary,
    color: Theme.colors.textPrimary,
    borderWidth: 2,
    borderColor: Theme.colors.secondary,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.background,
    ...Theme.shadow.md,
  },
  inputFocused: {
    borderColor: Theme.colors.primaryHover,
  },
  inputDisabled: {
    opacity: 0.6,
  },
});