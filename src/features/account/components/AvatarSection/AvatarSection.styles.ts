import { StyleSheet } from "react-native";

import { Theme } from "@/constants/theme";

const AVATAR_SIZE = Theme.spacing.xl * 4;
const BADGE_SIZE = Theme.spacing.xl;

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: Theme.spacing.sm,
    paddingVertical: Theme.spacing.lg,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: Theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPressed: {
    opacity: 0.85,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    // El recorte va en la imagen, no en el avatar: el contenedor no puede
    // llevar overflow hidden porque ahí va montado el badge de cámara.
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    backgroundColor: Theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  hint: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    color: Theme.colors.textSecondary,
  },
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  sheet: {
    backgroundColor: Theme.colors.surface,
    borderTopLeftRadius: Theme.radius.lg,
    borderTopRightRadius: Theme.radius.lg,
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.sm,
    paddingBottom: Theme.spacing.xl,
    gap: Theme.spacing.xs,
  },
  sheetHandle: {
    alignSelf: "center",
    width: Theme.spacing.xl + Theme.spacing.lg,
    height: Theme.spacing.xs,
    borderRadius: Theme.radius.sm,
    backgroundColor: Theme.colors.border,
    marginBottom: Theme.spacing.sm,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.sm,
    borderRadius: Theme.radius.md,
  },
  optionPressed: {
    backgroundColor: Theme.colors.background,
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.medium,
    color: Theme.colors.textPrimary,
  },
  optionTextDanger: {
    color: Theme.colors.danger,
  },
  optionTextDisabled: {
    color: Theme.colors.textSecondary,
  },
  viewer: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  viewerClose: {
    position: "absolute",
    top: Theme.spacing.xl * 2,
    right: Theme.spacing.lg,
    width: Theme.spacing.xl + Theme.spacing.md,
    height: Theme.spacing.xl + Theme.spacing.md,
    borderRadius: Theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  viewerImage: {
    width: "100%",
    height: "100%",
  },
});
