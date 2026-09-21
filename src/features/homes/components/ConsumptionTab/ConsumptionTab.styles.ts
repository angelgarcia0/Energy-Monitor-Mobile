import { StyleSheet } from "react-native";

import { Theme } from "@/constants/theme";

const TRACK_HEIGHT = Theme.spacing.sm;
// Sin token para tintes translúcidos; mismo criterio que Sidebar.styles.ts.
const TRACK_TINT = "rgba(255, 255, 255, 0.15)";
const LIMIT_VALUES_TINT = "rgba(255, 255, 255, 0.7)";

export const styles = StyleSheet.create({
  content: {
    gap: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.xl,
  },
  kpiCard: {
    gap: Theme.spacing.xs,
    borderWidth: 2,
    borderRadius: Theme.radius.lg,
  },
  kpiLabel: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size11,
    fontWeight: Theme.typography.weight.bold,
    letterSpacing: 0.5,
    color: Theme.colors.textSecondary,
  },
  kpiValue: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size22,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  kpiUnit: {
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.medium,
    color: Theme.colors.textSecondary,
  },
  kpiSub: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    color: Theme.colors.textSecondary,
  },
  chartTitle: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  chartTitleMuted: {
    fontWeight: Theme.typography.weight.normal,
    color: Theme.colors.textSecondary,
  },
  chartSubtitle: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size11,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.sm,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.sm,
  },
  chart: {
    padding: 0,
    backgroundColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
  },
  deviceLegend: {
    gap: Theme.spacing.xs,
    marginTop: Theme.spacing.sm,
  },
  deviceLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
  },
  deviceLegendText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    color: Theme.colors.textSecondary,
  },
  limitCard: {
    backgroundColor: Theme.colors.primaryDark,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  limitTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  limitLabel: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.surface,
  },
  limitPct: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.secondary,
  },
  limitTrack: {
    height: TRACK_HEIGHT,
    borderRadius: Theme.radius.sm,
    backgroundColor: TRACK_TINT,
    overflow: "hidden",
  },
  limitFill: {
    height: "100%",
    borderRadius: Theme.radius.sm,
    backgroundColor: Theme.colors.secondary,
  },
  limitValues: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size11,
    color: LIMIT_VALUES_TINT,
    textAlign: "right",
  },
});
