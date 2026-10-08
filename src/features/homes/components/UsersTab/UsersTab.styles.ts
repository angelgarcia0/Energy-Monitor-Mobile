import { StyleSheet } from "react-native";

import { createThemeStyles, Theme } from "@/constants/theme";

const AVATAR_SIZE = Theme.spacing.xl + Theme.spacing.sm;
const BADGE_RADIUS = Theme.spacing.xl;

export const styles = createThemeStyles(() => StyleSheet.create({
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
    color: Theme.colors.textSecondary,
  },
  card: {
    overflow: "hidden",
  },
  cardHeader: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.sm,
  },
  blockTitle: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    padding: Theme.spacing.md,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
    gap: Theme.spacing.xs,
  },
  userName: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  userEmail: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    color: Theme.colors.textSecondary,
  },
  badge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: BADGE_RADIUS,
  },
  badgeText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    fontWeight: Theme.typography.weight.medium,
  },
  removeButton: {
    width: Theme.spacing.xl,
    height: Theme.spacing.xl,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonPressed: {
    opacity: 0.7,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Theme.spacing.md + AVATAR_SIZE + Theme.spacing.sm,
    backgroundColor: Theme.colors.border,
  },
  inviteRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Theme.spacing.sm,
    marginTop: Theme.spacing.md,
  },
  inviteInputWrap: {
    flex: 1,
  },
  inviteError: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.dangerText,
    marginTop: Theme.spacing.sm,
  },
  pendingIcon: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: Theme.colors.gradient,
    alignItems: "center",
    justifyContent: "center",
  },
  pendingLabel: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    color: Theme.colors.textSecondary,
  },
  emptyPending: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textSecondary,
    padding: Theme.spacing.md,
  },
}));