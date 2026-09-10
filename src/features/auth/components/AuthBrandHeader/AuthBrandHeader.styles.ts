import { StyleSheet } from "react-native";

import { Theme } from "../../../../constants/theme";

const LOGO_SIZE = Theme.spacing.xl * 2;

export const styles = StyleSheet.create({
  container: {
    padding: Theme.spacing.lg,
    borderRadius: Theme.radius.lg,
    ...Theme.shadow.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.md,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  name: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xxl,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.surface,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.surface,
    opacity: 0.72,
    textAlign: "center",
    marginTop: Theme.spacing.sm,
  },
});
