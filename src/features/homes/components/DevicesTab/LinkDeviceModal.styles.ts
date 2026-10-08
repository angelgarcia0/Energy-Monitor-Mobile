import { StyleSheet } from "react-native";

import { createThemeStyles, Theme } from "@/constants/theme";

const ICON_SIZE = Theme.spacing.xl + Theme.spacing.md;
const APPLIANCE_ICON_SIZE = Theme.spacing.xl + Theme.spacing.md + Theme.spacing.xs;
const PICKER_HEIGHT = Theme.spacing.xl + Theme.spacing.lg;
const BAR_WIDTH = 3;

export const styles = createThemeStyles(() => StyleSheet.create({
  scroll: {
    flexShrink: 1,
    // En RN Web el contenido del ScrollView no se recorta solo y termina
    // pintándose detrás del footer del Modal.
    overflow: "hidden",
  },
  content: {
    gap: Theme.spacing.sm,
    paddingBottom: Theme.spacing.xs,
  },
  stepDots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.xs,
  },
  stepDot: {
    width: Theme.spacing.lg,
    height: Theme.spacing.xs,
    borderRadius: Theme.radius.sm,
    backgroundColor: Theme.colors.border,
  },
  stepDotActive: {
    backgroundColor: Theme.colors.primary,
  },
  stepTitle: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.md,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
    textAlign: "center",
  },
  stepHint: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    lineHeight: Theme.typography.size.size22,
    color: Theme.colors.textSecondary,
    textAlign: "center",
  },
  blockLabel: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  scanningBox: {
    alignItems: "center",
    gap: Theme.spacing.md,
    paddingVertical: Theme.spacing.lg,
  },
  scannerCircle: {
    width: ICON_SIZE * 2,
    height: ICON_SIZE * 2,
    borderRadius: ICON_SIZE,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.colors.primarySoft,
  },
  scanningText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.medium,
    color: Theme.colors.primary,
  },
  optionList: {
    gap: Theme.spacing.sm,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    padding: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.surface,
  },
  optionRowSelected: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.cardSelected,
  },
  optionRowPressed: {
    opacity: 0.85,
  },
  optionIcon: {
    width: Theme.spacing.xl + Theme.spacing.xs,
    height: Theme.spacing.xl + Theme.spacing.xs,
    borderRadius: Theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.colors.primarySoft,
  },
  optionText: {
    flex: 1,
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.medium,
    color: Theme.colors.textPrimary,
  },
  rescanButton: {
    alignSelf: "flex-start",
  },
  applianceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Theme.spacing.sm,
  },
  applianceOption: {
    flexBasis: "47%",
    flexGrow: 1,
    minHeight: ICON_SIZE * 2,
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.xs,
    padding: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.surface,
  },
  applianceOptionSelected: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.cardSelected,
  },
  applianceIcon: {
    width: APPLIANCE_ICON_SIZE,
    height: APPLIANCE_ICON_SIZE,
    borderRadius: APPLIANCE_ICON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.colors.primarySoft,
  },
  applianceLabel: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    fontWeight: Theme.typography.weight.medium,
    color: Theme.colors.textPrimary,
    textAlign: "center",
  },
  applianceCheck: {
    position: "absolute",
    top: Theme.spacing.sm,
    right: Theme.spacing.sm,
  },
  networkInfo: {
    flex: 1,
    minWidth: 0,
    gap: Theme.spacing.xs,
  },
  networkName: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.medium,
    color: Theme.colors.textPrimary,
  },
  networkMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
  },
  openTag: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    color: Theme.colors.textSecondary,
    backgroundColor: Theme.colors.background,
    borderRadius: Theme.radius.sm,
    paddingHorizontal: Theme.spacing.xs,
    paddingVertical: 1,
    overflow: "hidden",
  },
  signalBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
  },
  signalBar: {
    width: BAR_WIDTH,
    borderRadius: BAR_WIDTH,
    backgroundColor: Theme.colors.border,
  },
  signalBarActive: {
    backgroundColor: Theme.colors.success,
  },
  field: {
    gap: Theme.spacing.xs,
  },
  label: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  error: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size13,
    color: Theme.colors.danger,
  },
  errorSlot: {
    minHeight: Theme.typography.size.size13 + 2,
  },
  connectingBox: {
    alignItems: "center",
    gap: Theme.spacing.lg,
    paddingVertical: Theme.spacing.lg,
  },
  connectingList: {
    alignSelf: "stretch",
    gap: Theme.spacing.md,
  },
  connectingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
  },
  connectingDot: {
    width: Theme.spacing.lg,
    height: Theme.spacing.lg,
    borderRadius: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.colors.background,
  },
  connectingDotDone: {
    borderColor: Theme.colors.success,
    backgroundColor: Theme.colors.success,
  },
  connectingText: {
    flex: 1,
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textSecondary,
  },
  connectingTextDone: {
    color: Theme.colors.textPrimary,
  },
  doneBox: {
    alignItems: "center",
    gap: Theme.spacing.sm,
    paddingBottom: Theme.spacing.xs,
  },
  doneTitle: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.md,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
    textAlign: "center",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.radius.sm,
    backgroundColor: Theme.colors.background,
  },
  picker: {
    height: PICKER_HEIGHT,
    color: Theme.colors.textPrimary,
  },
  footerButton: {
    flex: 1,
  },
}));