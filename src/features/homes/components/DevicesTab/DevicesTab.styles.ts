import { StyleSheet } from "react-native";

import { createThemeStyles, Theme } from "@/constants/theme";

const DEVICE_ICON_SIZE = Theme.spacing.xl + Theme.spacing.md;
const STATUS_RADIUS = Theme.spacing.xl;

export const styles = createThemeStyles(() => StyleSheet.create({
  content: {
    gap: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.xl,
  },
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Theme.spacing.md,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
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
    color: Theme.colors.textSecondary,
  },
  card: {
    overflow: "hidden",
  },
  emptyState: {
    padding: Theme.spacing.lg,
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    padding: Theme.spacing.md,
  },
  deviceIcon: {
    width: DEVICE_ICON_SIZE,
    height: DEVICE_ICON_SIZE,
    borderRadius: DEVICE_ICON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  deviceIconOnline: {
    backgroundColor: Theme.colors.primarySoft,
  },
  deviceIconOffline: {
    backgroundColor: Theme.colors.gradient,
  },
  deviceInfo: {
    flex: 1,
    minWidth: 0,
    gap: Theme.spacing.xs,
  },
  removeError: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.dangerText,
    marginTop: Theme.spacing.sm,
  },
  deviceName: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  deviceRoom: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    color: Theme.colors.textSecondary,
  },
  deviceMeta: {
    alignItems: "flex-end",
    gap: Theme.spacing.xs,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: STATUS_RADIUS,
  },
  statusBadgeOnline: {
    backgroundColor: Theme.colors.successSoft,
  },
  statusBadgeOffline: {
    backgroundColor: Theme.colors.dangerSoft,
  },
  statusText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    fontWeight: Theme.typography.weight.medium,
  },
  statusTextOnline: {
    color: Theme.colors.successText,
  },
  statusTextOffline: {
    color: Theme.colors.dangerText,
  },
  consumption: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  deleteButton: {
    width: Theme.spacing.xl,
    height: Theme.spacing.xl,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonPressed: {
    opacity: 0.7,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Theme.spacing.md + DEVICE_ICON_SIZE + Theme.spacing.sm,
    backgroundColor: Theme.colors.border,
  },
}));