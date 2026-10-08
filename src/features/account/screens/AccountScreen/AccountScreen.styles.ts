import { StyleSheet } from "react-native";

import { TRIGGER_SIZE as SIDEBAR_TRIGGER_SIZE } from "@/components/layout/Sidebar/Sidebar.styles";
import { createThemeStyles, Theme } from "@/constants/theme";

export const styles = createThemeStyles(() => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    marginLeft: Theme.spacing.md + SIDEBAR_TRIGGER_SIZE + Theme.spacing.sm,
  },
  content: {
    gap: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.xl,
  },
  card: {
    gap: Theme.spacing.md,
  },
  section: {
    gap: Theme.spacing.xs,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.md,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.xs,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Theme.colors.border,
  },
  deleteSection: {
    alignItems: "center",
    gap: Theme.spacing.sm,
    paddingTop: Theme.spacing.xs,
  },
  deleteQuestion: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textSecondary,
    textAlign: "center",
  },
  deleteButtonText: {
    color: Theme.colors.danger,
  },
}));