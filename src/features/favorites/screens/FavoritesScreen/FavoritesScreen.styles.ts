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
  favoritesCard: {
    minHeight: Theme.spacing.xl * 12 + Theme.spacing.md,
    padding: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.radius.lg,
    backgroundColor: Theme.colors.surface,
    ...Theme.shadow.sm,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Theme.spacing.md,
  },
  gridItem: {
    width: "100%",
  },
  emptyState: {
    flex: 1,
  },
});
