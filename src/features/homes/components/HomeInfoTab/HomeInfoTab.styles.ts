import { StyleSheet } from "react-native";

import { Theme } from "@/constants/theme";

const AVATAR_SIZE = Theme.spacing.xl + Theme.spacing.sm;
const BADGE_RADIUS = Theme.spacing.xl;

export const styles = StyleSheet.create({
  content: {
    gap: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.xl,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
  },
  cardTitle: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  sectionSubtitle: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  field: {
    gap: Theme.spacing.xs,
    marginTop: Theme.spacing.md,
  },
  fieldLabel: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    fontWeight: Theme.typography.weight.medium,
    color: Theme.colors.textSecondary,
  },
  fieldValue: {
    minWidth: 0,
  },
  value: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textPrimary,
  },
  muted: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textSecondary,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: BADGE_RADIUS,
    backgroundColor: Theme.colors.primarySoft,
  },
  typeBadgeText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    fontWeight: Theme.typography.weight.medium,
    color: Theme.colors.primary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Theme.colors.border,
    marginTop: Theme.spacing.md,
  },
  hint: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.xs,
  },
  codeBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Theme.spacing.sm,
    marginTop: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.radius.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.background,
  },
  codeText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size18,
    fontWeight: Theme.typography.weight.bold,
    letterSpacing: 2,
    color: Theme.colors.textPrimary,
  },
  copyButton: {
    width: Theme.spacing.xl,
    height: Theme.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Theme.radius.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    opacity: 0.5,
  },
  actionRow: {
    marginTop: Theme.spacing.md,
  },
  ownerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
    marginTop: Theme.spacing.md,
  },
  ownerAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  ownerInitials: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
  },
  ownerMeta: {
    flex: 1,
    minWidth: 0,
    gap: Theme.spacing.xs,
  },
  ownerName: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  ownerBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: BADGE_RADIUS,
  },
  ownerBadgeText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    fontWeight: Theme.typography.weight.medium,
  },
  valueWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
  },
});