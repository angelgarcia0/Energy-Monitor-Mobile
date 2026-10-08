import { StyleSheet } from "react-native";

import { createThemeStyles, Theme } from "@/constants/theme";

const ROW_ICON_SIZE = Theme.spacing.xl + Theme.spacing.sm;

export const styles = createThemeStyles(() => StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    gap: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.xl,
  },
  header: {
    gap: Theme.spacing.xs,
  },
  title: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.lg,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  subtitle: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.size.size22,
    color: Theme.colors.textSecondary,
  },
  readOnlyNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.background,
  },
  readOnlyText: {
    flex: 1,
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size13,
    color: Theme.colors.textSecondary,
  },
  card: {
    gap: Theme.spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Theme.spacing.sm,
  },
  rowLeft: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Theme.spacing.sm,
  },
  rowIcon: {
    width: ROW_ICON_SIZE,
    height: ROW_ICON_SIZE,
    borderRadius: ROW_ICON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.colors.primarySoft,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
    gap: Theme.spacing.xs,
  },
  rowTitle: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  rowHint: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    lineHeight: Theme.typography.size.size18,
    color: Theme.colors.textSecondary,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
  },
  periodicityLabel: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.primary,
  },
  badge: {
    paddingHorizontal: Theme.spacing.sm + Theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: Theme.spacing.xl,
  },
  badgeSuccess: {
    backgroundColor: Theme.colors.successSoft,
  },
  badgeNeutral: {
    backgroundColor: Theme.colors.background,
  },
  badgeInfo: {
    backgroundColor: Theme.colors.infoSoft,
  },
  badgeText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size11,
    fontWeight: Theme.typography.weight.bold,
  },
  badgeTextSuccess: {
    color: Theme.colors.successText,
  },
  badgeTextNeutral: {
    color: Theme.colors.textSecondary,
  },
  badgeTextInfo: {
    color: Theme.colors.infoText,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Theme.colors.border,
  },
  fieldsRow: {
    gap: Theme.spacing.md,
  },
  field: {
    gap: Theme.spacing.xs,
  },
  fieldHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Theme.spacing.sm,
  },
  fieldLabel: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
  },
  inputFlex: {
    flex: 1,
  },
  inputDisabled: {
    color: Theme.colors.textSecondary,
  },
  unit: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textSecondary,
  },
  errorSlot: {
    minHeight: Theme.typography.size.size13 + 2,
  },
  error: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size13,
    color: Theme.colors.danger,
  },
  saveButton: {
    alignSelf: "stretch",
  },
  infoNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Theme.spacing.xs,
  },
  infoNoteText: {
    flex: 1,
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    lineHeight: Theme.typography.size.size18,
    color: Theme.colors.textSecondary,
  },
}));