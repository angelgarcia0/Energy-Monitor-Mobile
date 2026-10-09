import { StyleSheet } from "react-native";

import { createThemeStyles, Theme } from "@/constants/theme";

const ICON_SIZE = Theme.spacing.xl + Theme.spacing.md;
const APPLIANCE_ICON_SIZE = Theme.spacing.xl + Theme.spacing.md + Theme.spacing.xs;
const PICKER_HEIGHT = Theme.spacing.xl + Theme.spacing.lg;

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
  blockLabel: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  hint: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    lineHeight: Theme.typography.size.size13,
    color: Theme.colors.textSecondary,
  },
  /**
   * Aviso de que falta el paso por Bluetooth. No es decorativo: el alta sin él
   * deja el módulo registrado en el backend pero sin credenciales para publicar.
   */
  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Theme.spacing.xs,
    padding: Theme.spacing.sm,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.warningSoft,
  },
  noticeIcon: {
    marginTop: 1,
  },
  noticeText: {
    flex: 1,
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    lineHeight: Theme.typography.size.size13,
    color: Theme.colors.warningText,
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
  applianceOptionPressed: {
    opacity: 0.85,
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
    color: Theme.colors.dangerText,
  },
  errorSlot: {
    minHeight: Theme.typography.size.size13 + 2,
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