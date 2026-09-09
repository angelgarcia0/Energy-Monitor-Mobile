import { StyleSheet } from "react-native";
import { Theme } from "../../constants/theme";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.xs,
    padding: Theme.spacing.lg,
  },
  containerFull: {
    gap: Theme.spacing.md,
    paddingVertical: Theme.spacing.xl,
  },
  image: {
    marginBottom: Theme.spacing.sm,
  },
  icon: {
    opacity: 0.45,
    marginBottom: Theme.spacing.xs,
  },
  title: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.md,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textSecondary,
    textAlign: "center",
  },
  titleFull: {
    fontSize: Theme.typography.size.xl,
  },
  description: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textSecondary,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    gap: Theme.spacing.sm,
    marginTop: Theme.spacing.sm,
  },
});
