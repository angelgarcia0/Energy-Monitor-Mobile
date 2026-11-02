import { StyleSheet } from "react-native";
import { createThemeStyles, Theme } from "@/constants/theme";

export const styles = createThemeStyles(() => StyleSheet.create({
  subtitle: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.md,
    lineHeight: 22,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.md,
  },
  section: {
    marginBottom: Theme.spacing.md,
  },
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.xs,
  },
  numberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Theme.colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  number: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.primary,
  },
  sectionHeading: {
    flex: 1,
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size18,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  bodyText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.md,
    lineHeight: 22,
    color: Theme.colors.textSecondary,
  },
  intro: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.md,
    lineHeight: 22,
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.md,
  },
  steps: {
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Theme.spacing.sm,
  },
  stepText: {
    flex: 1,
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.md,
    lineHeight: 22,
    color: Theme.colors.textSecondary,
  },
  notice: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    lineHeight: 20,
    color: Theme.colors.textSecondary,
    backgroundColor: Theme.colors.cardSoft,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  field: {
    marginBottom: Theme.spacing.md,
  },
  button: {
    alignSelf: "stretch",
    marginTop: Theme.spacing.sm,
  },
  current: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size18,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.sm,
  },
  note: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    lineHeight: 20,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.md,
  },
}));
