import { StyleSheet } from "react-native";

import { Theme } from "@/constants/theme";

const FAVORITE_SIZE = Theme.spacing.xl + Theme.spacing.xs;
const HEADER_MIN_HEIGHT = Theme.spacing.xl * 3;
// Sin token para tintes translúcidos; mismo criterio que Sidebar.styles.ts.
const FAVORITE_TINT = "rgba(255, 255, 255, 0.18)";
const RESPONSIBLE_TINT = "rgba(255, 255, 255, 0.9)";

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Theme.spacing.sm,
    padding: Theme.spacing.md,
    minHeight: HEADER_MIN_HEIGHT,
    borderTopLeftRadius: Theme.radius.lg,
    borderTopRightRadius: Theme.radius.lg,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
    gap: Theme.spacing.xs,
  },
  title: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.md,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.surface,
  },
  responsible: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: RESPONSIBLE_TINT,
  },
  favoriteButton: {
    width: FAVORITE_SIZE,
    height: FAVORITE_SIZE,
    borderRadius: FAVORITE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: FAVORITE_TINT,
  },
  favorited: {
    backgroundColor: Theme.colors.surface,
  },
  body: {
    gap: Theme.spacing.sm,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: Theme.radius.lg,
    borderBottomRightRadius: Theme.radius.lg,
  },
  descriptionWrapper: {
    gap: Theme.spacing.xs,
  },
  text: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textSecondary,
  },
  label: {
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  toggle: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.medium,
    color: Theme.colors.primary,
    textDecorationLine: "underline",
  },
});
