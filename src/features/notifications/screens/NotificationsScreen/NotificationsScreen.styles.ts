import { StyleSheet } from "react-native";

import { TRIGGER_SIZE as SIDEBAR_TRIGGER_SIZE } from "@/components/layout/Sidebar/Sidebar.styles";
import { Theme } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    marginLeft: Theme.spacing.md + SIDEBAR_TRIGGER_SIZE + Theme.spacing.sm,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.xl,
  },
  hero: {
    alignItems: "center",
    gap: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.lg,
    paddingBottom: Theme.spacing.md,
  },
  title: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xl,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    maxWidth: 640,
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.size.size22,
    color: Theme.colors.textSecondary,
    textAlign: "center",
  },
  panel: {
    minHeight: Theme.spacing.xl * 12 + Theme.spacing.md,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.radius.lg,
    backgroundColor: Theme.colors.surface,
    ...Theme.shadow.sm,
  },
  tabsRow: {
    gap: Theme.spacing.sm,
    paddingBottom: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  tabs: {
    flexDirection: "row",
    gap: Theme.spacing.xs,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.xs,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.sm,
    borderRadius: Theme.radius.md,
  },
  tabActive: {
    backgroundColor: Theme.colors.primarySoft,
  },
  tabLabel: {
    flexShrink: 1,
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.medium,
    color: Theme.colors.textSecondary,
    textAlign: "center",
  },
  tabLabelActive: {
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.primary,
  },
  tabCount: {
    flexShrink: 0,
    minWidth: Theme.spacing.lg,
    alignItems: "center",
    paddingVertical: Theme.spacing.xs / 2,
    paddingHorizontal: Theme.spacing.xs,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.primary,
  },
  tabCountLabel: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.surface,
  },
  markAllButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    gap: Theme.spacing.xs,
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
  },
  markAllLabel: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.primary,
  },
  list: {
    paddingTop: Theme.spacing.sm,
  },
  emptyState: {
    flex: 1,
    paddingVertical: Theme.spacing.xl,
  },
});
