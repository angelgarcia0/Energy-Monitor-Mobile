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
    paddingBottom: Theme.spacing.sm,
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
}));