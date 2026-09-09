import { StyleSheet } from "react-native";
import { Theme } from "../../constants/theme";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: Theme.spacing.md,
  },
  surface: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    ...Theme.shadow.lg,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  title: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.lg,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  closeButton: {
    width: Theme.spacing.xl,
    height: Theme.spacing.xl,
    borderRadius: Theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.colors.background,
  },
  closeButtonText: {
    fontSize: Theme.typography.size.lg,
    color: Theme.colors.textSecondary,
    lineHeight: Theme.typography.size.lg,
  },

  body: {
    padding: Theme.spacing.lg,
  },
  dangerBody: {
    alignItems: "center",
  },

  dangerHeader: {
    alignItems: "center",
    paddingTop: Theme.spacing.lg,
    paddingHorizontal: Theme.spacing.lg,
    gap: Theme.spacing.sm,
  },
  dangerIconCircle: {
    width: Theme.spacing.xl + Theme.spacing.md,
    height: Theme.spacing.xl + Theme.spacing.md,
    borderRadius: (Theme.spacing.xl + Theme.spacing.md) / 2,
    backgroundColor: Theme.colors.dangerSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  dangerTitle: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.md,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
    textAlign: "center",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  dangerFooter: {
    borderTopWidth: 0,
    paddingTop: 0,
  },
});
