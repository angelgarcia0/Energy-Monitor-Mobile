import { StyleSheet } from "react-native";
import { Theme } from "@/constants/theme";

export const styles = StyleSheet.create({
  counter: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: Theme.colors.successSoft,
  },
  counterText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size13,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.successText,
  },
  options: {
    gap: Theme.spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
    flex: 1,
    minWidth: 0,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Theme.colors.cardSoft,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowInfo: {
    flex: 1,
    minWidth: 0,
  },
  rowTitle: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.md,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  rowDescription: {
    marginTop: 2,
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size13,
    color: Theme.colors.textSecondary,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    flexShrink: 0,
  },
  status: {
    paddingVertical: 4,
    paddingHorizontal: Theme.spacing.sm,
    borderRadius: 999,
  },
  statusActive: {
    backgroundColor: Theme.colors.successSoft,
  },
  statusInactive: {
    backgroundColor: Theme.colors.dangerSoft,
  },
  statusText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size11,
    fontWeight: Theme.typography.weight.bold,
  },
});