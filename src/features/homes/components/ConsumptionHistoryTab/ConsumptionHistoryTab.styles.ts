import { StyleSheet } from "react-native";

import { Theme } from "@/constants/theme";

const DOT_SIZE = Theme.spacing.sm;
const TRACK_HEIGHT = Theme.spacing.sm - Theme.spacing.xs;

export const styles = StyleSheet.create({
  content: {
    gap: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.xl,
  },
  chipRow: {
    gap: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.surface,
  },
  chipActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  chipSoftActive: {
    backgroundColor: Theme.colors.primarySoft,
    borderColor: Theme.colors.primary,
  },
  chipText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.medium,
    color: Theme.colors.textSecondary,
  },
  chipTextActive: {
    color: Theme.colors.surface,
  },
  chipSoftActiveText: {
    color: Theme.colors.primary,
  },
  clearText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.medium,
    color: Theme.colors.danger,
  },
  date: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    color: Theme.colors.textSecondary,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  title: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    fontWeight: Theme.typography.weight.bold,
    letterSpacing: 0.5,
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.sm,
  },
  chart: {
    padding: 0,
    backgroundColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
  },
  empty: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textSecondary,
    textAlign: "center",
    paddingVertical: Theme.spacing.lg,
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  headerText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size11,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textSecondary,
  },
  cellText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    color: Theme.colors.textPrimary,
  },
  colPosition: {
    width: Theme.spacing.lg,
  },
  colName: {
    flex: 2,
    paddingRight: Theme.spacing.xs,
  },
  colTotal: {
    flex: 1.4,
  },
  colPercent: {
    flex: 1.6,
    gap: Theme.spacing.xs,
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: Theme.radius.sm,
    backgroundColor: Theme.colors.background,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: Theme.radius.sm,
  },
  statLabel: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size11,
    fontWeight: Theme.typography.weight.bold,
    letterSpacing: 0.5,
    color: Theme.colors.textSecondary,
  },
  statValue: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.lg,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
    marginVertical: Theme.spacing.xs,
  },
  statSub: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    color: Theme.colors.textSecondary,
  },
});
