import { StyleSheet } from "react-native";

import { TRIGGER_SIZE as SIDEBAR_TRIGGER_SIZE } from "@/components/layout/Sidebar/Sidebar.styles";
import { Theme } from "../../../../constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    marginLeft: Theme.spacing.md + SIDEBAR_TRIGGER_SIZE + Theme.spacing.sm,
  },
  contentEmpty: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: Theme.spacing.xl,
  },
  contentList: {
    gap: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.xl,
  },
});
