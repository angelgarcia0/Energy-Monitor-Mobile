import { StyleSheet } from "react-native";
import { Theme } from "@/constants/theme";

export const styles = StyleSheet.create({
  lastCard: {
    marginBottom: Theme.spacing.xl,
  },
  container: {
    gap: Theme.spacing.md,
  },
  helpCard: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.radius.lg,
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size18,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  description: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.md,
    lineHeight: 22,
    color: Theme.colors.textSecondary,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
    marginTop: Theme.spacing.sm,
  },
  link: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.md,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.primary,
  },
});