import { StyleSheet } from "react-native";

import { Theme } from "@/constants/theme";

const TEXTAREA_MIN_HEIGHT = Theme.spacing.xl * 3;
const PICKER_HEIGHT = Theme.spacing.xl + Theme.spacing.lg;

export const styles = StyleSheet.create({
  form: {
    gap: Theme.spacing.md,
  },
  field: {
    gap: Theme.spacing.xs,
  },
  label: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.radius.sm,
    backgroundColor: Theme.colors.background,
  },
  picker: {
    height: PICKER_HEIGHT,
    color: Theme.colors.textPrimary,
  },
  textarea: {
    minHeight: TEXTAREA_MIN_HEIGHT,
    textAlignVertical: "top",
  },
  helperRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: Theme.spacing.sm,
  },
  examples: {
    flex: 1,
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    fontStyle: "italic",
    color: Theme.colors.textSecondary,
  },
  counter: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    color: Theme.colors.textSecondary,
    textAlign: "right",
  },
  error: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size13,
    color: Theme.colors.danger,
  },
});
