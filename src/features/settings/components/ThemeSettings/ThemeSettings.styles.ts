import { StyleSheet } from "react-native";
import { Theme } from "@/constants/theme";

export const styles = StyleSheet.create({
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.primarySoft,
  },
  badgeText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.md,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.primary,
  },
  section: {
    paddingTop: Theme.spacing.lg,
  },
  sectionLabel: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.md,
  },
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  newBadge: {
    paddingVertical: 2,
    paddingHorizontal: Theme.spacing.sm,
    borderRadius: Theme.radius.sm,
    backgroundColor: Theme.colors.primary,
  },
  newBadgeText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size11,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.surface,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Theme.spacing.md,
  },
  themeCard: {
    position: "relative",
    flexGrow: 1,
    flexBasis: "45%",
    borderWidth: 1,
    borderRadius: Theme.radius.lg,
    padding: 10,
    overflow: "hidden",
  },
  themeCardPressed: {
    opacity: 0.85,
  },
  themeCardActive: {
    borderWidth: 2,
    borderColor: Theme.colors.primary,
  },
  checkBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  preview: {
    flexDirection: "row",
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
  },
  previewSidebar: {
    width: "28%",
    padding: 10,
    gap: 8,
    justifyContent: "flex-start",
  },
  sidebarLine: {
    height: 5,
    borderRadius: 3,
  },
  previewContent: {
    flex: 1,
    padding: 10,
    gap: 10,
  },
  previewTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  previewAccent: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  previewBar: {
    height: 14,
    borderRadius: 4,
  },
  previewLineGroup: {
    gap: 6,
  },
  previewLine: {
    height: 6,
    borderRadius: 3,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    gap: 10,
  },
  cardInfo: {
    flex: 1,
    minWidth: 0,
  },
  cardName: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.md,
    fontWeight: Theme.typography.weight.bold,
  },
  cardSubtitle: {
    marginTop: 2,
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
});