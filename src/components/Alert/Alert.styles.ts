import { StyleSheet } from "react-native";
import { Theme } from "../../constants/theme";

const ICON_SIZE = Theme.spacing.xl + Theme.spacing.xs;

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    padding: Theme.spacing.sm,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.surface,
  },
  iconCircle: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  icon_success: {
    backgroundColor: Theme.colors.successSoft,
  },
  icon_warning: {
    backgroundColor: Theme.colors.warningSoft,
  },
  icon_danger: {
    backgroundColor: Theme.colors.dangerSoft,
  },
  icon_info: {
    backgroundColor: Theme.colors.infoSoft,
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
  message: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    color: Theme.colors.textSecondary,
  },
  right: {
    flexShrink: 0,
  },
});
