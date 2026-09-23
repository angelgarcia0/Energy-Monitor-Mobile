import { StyleSheet } from "react-native";
import { Theme } from "../../constants/theme";

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Theme.spacing.lg,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.radius.lg,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadow.md,
  },
  titleWrapper: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.lg,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  actionsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
  },
  actionButton: {
    width: Theme.spacing.xl,
    height: Theme.spacing.xl,
    borderRadius: Theme.radius.lg,
    backgroundColor: Theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonPressed: {
    backgroundColor: Theme.colors.primaryHover,
  },
});