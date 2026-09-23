import { StyleSheet } from "react-native";
import { Theme } from "@/constants/theme";

export const styles = StyleSheet.create({
  card: {
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Theme.spacing.md,
    paddingBottom: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  info: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Theme.spacing.md,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  infoText: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size18,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  description: {
    marginTop: Theme.spacing.xs,
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.md,
    color: Theme.colors.textSecondary,
  },
  trailing: {
    flexShrink: 0,
  },
  body: {
    paddingTop: Theme.spacing.lg,
  },
});