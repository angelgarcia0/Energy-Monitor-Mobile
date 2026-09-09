import { StyleSheet } from "react-native";
import { Theme } from "../../constants/theme";

const LEADING_SIZE = Theme.spacing.xl + Theme.spacing.xs;
const ACTION_SIZE = Theme.spacing.xl - Theme.spacing.xs;

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.background,
  },
  pressed: {
    backgroundColor: Theme.colors.gradient,
  },
  leadingWrapper: {
    flexShrink: 0,
  },
  avatar: {
    width: LEADING_SIZE,
    height: LEADING_SIZE,
    borderRadius: LEADING_SIZE / 2,
    backgroundColor: Theme.colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.primary,
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  subtitle: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    color: Theme.colors.textSecondary,
  },

  badge: {
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
    borderRadius: Theme.radius.lg,
    flexShrink: 0,
  },
  badgeText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size11,
    fontWeight: Theme.typography.weight.medium,
  },
  badge_success: { backgroundColor: Theme.colors.successSoft },
  badgeText_success: { color: Theme.colors.successText },
  badge_warning: { backgroundColor: Theme.colors.warningSoft },
  badgeText_warning: { color: Theme.colors.warningText },
  badge_danger: { backgroundColor: Theme.colors.dangerSoft },
  badgeText_danger: { color: Theme.colors.dangerText },
  badge_info: { backgroundColor: Theme.colors.infoSoft },
  badgeText_info: { color: Theme.colors.infoText },

  actionButton: {
    width: ACTION_SIZE,
    height: ACTION_SIZE,
    borderRadius: ACTION_SIZE / 2,
    backgroundColor: Theme.colors.dangerSoft,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
});
