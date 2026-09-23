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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Theme.spacing.md,
  },
  languageCard: {
    position: "relative",
    flexGrow: 1,
    flexBasis: "45%",
    minHeight: 140,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.radius.lg,
    backgroundColor: Theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.sm,
    padding: Theme.spacing.md,
  },
  languageCardActive: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.primarySoft,
  },
  languageCardPressed: {
    opacity: 0.8,
  },
  check: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  flag: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.surface,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  flagImage: {
    borderRadius: 32,
  },
  name: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size18,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  locale: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textSecondary,
  },
});