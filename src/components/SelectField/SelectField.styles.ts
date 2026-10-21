import { StyleSheet } from "react-native";
import { createThemeStyles, Theme } from "../../constants/theme";

const FIELD_HEIGHT = Theme.spacing.xl + Theme.spacing.lg;

export const styles = createThemeStyles(() => StyleSheet.create({
  container: {
    width: "100%",
    gap: 6,
  },
  label: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  field: {
    minHeight: FIELD_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.radius.sm,
    backgroundColor: Theme.colors.background,
    ...Theme.shadow.sm,
  },
  fieldPressed: {
    opacity: 0.8,
  },
  fieldDisabled: {
    opacity: 0.5,
  },
  value: {
    flex: 1,
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textPrimary,
  },
  placeholder: {
    color: Theme.colors.textSecondary,
  },
  list: {
    maxHeight: 320,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Theme.spacing.sm,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.sm,
    borderRadius: Theme.radius.sm,
  },
  optionSelected: {
    backgroundColor: Theme.colors.primarySoft,
  },
  optionPressed: {
    opacity: 0.7,
  },
  optionLabel: {
    flex: 1,
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textPrimary,
  },
  optionLabelSelected: {
    color: Theme.colors.primary,
    fontWeight: Theme.typography.weight.bold,
  },
}));
