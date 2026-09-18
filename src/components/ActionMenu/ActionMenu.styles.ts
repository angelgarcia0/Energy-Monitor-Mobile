import { StyleSheet } from "react-native";

import { Theme } from "../../constants/theme";

const TRIGGER_SIZE = Theme.spacing.xl + Theme.spacing.sm;
const MENU_MIN_WIDTH = Theme.spacing.xl * 6;

export const styles = StyleSheet.create({
  trigger: {
    width: TRIGGER_SIZE,
    height: TRIGGER_SIZE,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.radius.lg,
  },
  triggerPressed: {
    backgroundColor: Theme.colors.primaryHover,
  },
  backdrop: {
    flex: 1,
  },
  dropdown: {
    position: "absolute",
    minWidth: MENU_MIN_WIDTH,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.sm,
    ...Theme.shadow.lg,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.radius.md,
  },
  itemPressed: {
    backgroundColor: Theme.colors.primarySoft,
  },
  itemText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textPrimary,
  },
});
