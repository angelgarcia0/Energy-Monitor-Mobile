import { StyleSheet } from "react-native";
import { Theme } from "../../constants/theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 6,
  },
  label: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Theme.colors.background,
    ...Theme.shadow.sm,
  },
  wrapperDefault: {
    borderRadius: Theme.radius.sm,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  wrapperOtp: {
    padding: 0,
    borderRadius: Theme.radius.md,
    alignSelf: "flex-start",
  },
  wrapperFocused: {
    borderColor: Theme.colors.primaryHover,
  },
  input: {
    flex: 1,
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textPrimary,
    padding: 0,
  },
  inputOtp: {
    width: 45,
    height: 45,
    textAlign: "center",
    fontSize: Theme.typography.size.size18,
    borderWidth: 2,
    borderColor: Theme.colors.secondary,
    borderRadius: Theme.radius.md,
    ...Theme.shadow.md,
  },
  icon: {
    marginLeft: Theme.spacing.sm,
    opacity: 0.6,
  },
  placeholder: {
    color: Theme.colors.textSecondary,
  },
});
