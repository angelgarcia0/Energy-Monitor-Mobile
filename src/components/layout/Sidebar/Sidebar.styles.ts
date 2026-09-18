import { StyleSheet } from "react-native";

import { Theme } from "../../../constants/theme";

const TRIGGER_SIZE = Theme.spacing.xl + Theme.spacing.sm + Theme.spacing.xs;
const AVATAR_SIZE = Theme.spacing.xl + Theme.spacing.xs;
const LOGO_SIZE = Theme.spacing.xl + Theme.spacing.md;

// No Theme token covers translucent white-on-color tints or the backdrop dim;
// same exception already used by Modal.styles.ts / AuthBrandHeader.styles.ts.
const OVERLAY_COLOR = "rgba(0, 0, 0, 0.4)";
const TINT_SUBTLE = "rgba(255, 255, 255, 0.08)";
const TINT_AVATAR = "rgba(255, 255, 255, 0.15)";
const TINT_ACTIVE = "rgba(255, 255, 255, 0.16)";
const TEXT_INACTIVE = "rgba(255, 255, 255, 0.8)";

export const styles = StyleSheet.create({
  trigger: {
    position: "absolute",
    left: Theme.spacing.md,
    width: TRIGGER_SIZE,
    height: TRIGGER_SIZE,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.radius.md,
    zIndex: 1000,
    ...Theme.shadow.md,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: OVERLAY_COLOR,
    zIndex: 998,
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: Theme.colors.backgroundLeft,
    paddingHorizontal: Theme.spacing.md,
    zIndex: 999,
    ...Theme.shadow.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  headerTitle: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.surface,
  },
  nav: {
    flexGrow: 1,
    justifyContent: "center",
    gap: Theme.spacing.md,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
  },
  navItemActive: {
    backgroundColor: TINT_ACTIVE,
  },
  navLabel: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.md,
    fontWeight: Theme.typography.weight.medium,
    color: TEXT_INACTIVE,
  },
  navLabelActive: {
    color: Theme.colors.surface,
  },
  profileSection: {
    marginTop: "auto",
    position: "relative",
    paddingBottom: Theme.spacing.md,
    zIndex: 3,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.xs,
    borderRadius: Theme.radius.lg,
    backgroundColor: TINT_SUBTLE,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: TINT_AVATAR,
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: {
    flex: 1,
    minWidth: 0,
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.medium,
    color: Theme.colors.surface,
  },
  menuButton: {
    padding: Theme.spacing.xs,
  },
  dropdownCatcher: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  dropdown: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: "100%",
    marginBottom: Theme.spacing.sm,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    zIndex: 2,
    ...Theme.shadow.lg,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.sm,
    borderRadius: Theme.radius.md,
  },
  dropdownItemText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.border,
    marginVertical: Theme.spacing.sm,
  },
  logoutButton: {
    width: "100%",
  },
});
