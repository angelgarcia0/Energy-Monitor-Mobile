import { StyleSheet } from "react-native";

import { Theme } from "@/constants/theme";

const ICON_SIZE = Theme.spacing.xl + Theme.spacing.md;
const DOT_SIZE = Theme.spacing.xs / 2;

export const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Theme.spacing.sm,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  rowMuted: {
    opacity: 0.72,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: Theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCritical: {
    backgroundColor: Theme.colors.dangerSoft,
  },
  iconWarning: {
    backgroundColor: Theme.colors.warningSoft,
  },
  iconInfo: {
    backgroundColor: Theme.colors.infoSoft,
  },
  body: {
    flex: 1,
    minWidth: 0,
    gap: Theme.spacing.xs,
  },
  top: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Theme.spacing.sm,
  },
  title: {
    flex: 1,
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  badge: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    fontWeight: Theme.typography.weight.bold,
    paddingVertical: Theme.spacing.xs / 2,
    paddingHorizontal: Theme.spacing.sm,
    borderRadius: Theme.radius.md,
    overflow: "hidden",
  },
  badgeActive: {
    backgroundColor: Theme.colors.dangerSoft,
    color: Theme.colors.dangerText,
  },
  badgeResolved: {
    backgroundColor: Theme.colors.successSoft,
    color: Theme.colors.successText,
  },
  badgeNew: {
    backgroundColor: Theme.colors.infoSoft,
    color: Theme.colors.infoText,
  },
  badgeRead: {
    backgroundColor: Theme.colors.background,
    color: Theme.colors.textSecondary,
  },
  message: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textSecondary,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
  },
  metaText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    color: Theme.colors.textSecondary,
  },
  metaDot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: Theme.colors.border,
  },
  markReadButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: Theme.spacing.xs,
    marginTop: Theme.spacing.xs,
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.primarySoft,
  },
  markReadLabel: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.primary,
  },
});
