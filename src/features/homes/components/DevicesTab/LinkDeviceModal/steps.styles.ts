import { StyleSheet } from "react-native";

import { createThemeStyles, Theme } from "@/constants/theme";

/**
 * Estilos de los pasos del asistente de vinculación.
 *
 * `createThemeStyles` y no `StyleSheet.create`: este último evalúa
 * `Theme.colors` una sola vez, al importar el módulo, cuando el tema guardado
 * todavía no se ha leído. Sin el proxy, en el tema oscuro se quedan los colores
 * del tema claro y el texto desaparece sobre el fondo.
 */
export const stepStyles = createThemeStyles(() => StyleSheet.create({
  block: {
    gap: Theme.spacing.md,
  },
  stepTitle: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.lg,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  stepSubtitle: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textSecondary,
  },
  stepOf: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.xs,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.primary,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  /** Pastillas de progreso de la cabecera. */
  stepDots: {
    flexDirection: "row",
    gap: Theme.spacing.xs,
    marginTop: Theme.spacing.xs,
  },
  stepDot: {
    width: Theme.spacing.md,
    height: 3,
    borderRadius: 2,
    backgroundColor: Theme.colors.border,
  },
  stepDotActive: {
    backgroundColor: Theme.colors.primary,
  },

  /** Enlace secundario: buscar, reescanear, cambiar a manual. */
  linkButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
  },
  linkButtonLabel: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.primary,
  },
  linkButtonPressed: {
    opacity: 0.6,
  },
  linkButtonDisabled: {
    opacity: 0.4,
  },
  /** Los dos enlaces seguidos del paso de red. */
  linkActions: {
    gap: Theme.spacing.sm,
  },

  /** Bloque centrado mientras se busca o se escanea. */
  scanningBox: {
    alignItems: "center",
    gap: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xl,
  },
  scanningIcon: {
    color: Theme.colors.primary,
  },
  scanningText: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textSecondary,
    textAlign: "center",
  },

  /** Lista de módulos o de redes. */
  options: {
    gap: Theme.spacing.xs,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.surface,
    minHeight: 48,
  },
  optionSelected: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.primarySoft,
  },
  optionIcon: {
    color: Theme.colors.primary,
  },
  optionName: {
    flex: 1,
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.md,
    color: Theme.colors.textPrimary,
  },
  optionCheck: {
    color: Theme.colors.primary,
  },
  optionTag: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size11,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textSecondary,
  },

  /** Barras de señal: tres, encendidas según el porcentaje. */
  signalBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
    height: 14,
  },
  signalBar: {
    width: 3,
    backgroundColor: Theme.colors.border,
    borderRadius: 1,
  },
  signalBarLow: {
    height: 6,
  },
  signalBarMid: {
    height: 10,
  },
  signalBarHigh: {
    height: 14,
  },
  signalBarActive: {
    backgroundColor: Theme.colors.primary,
  },

  /** Aviso de que algo no está disponible. */
  notice: {
    flexDirection: "row",
    gap: Theme.spacing.sm,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.warningSoft,
  },
  noticeIcon: {
    color: Theme.colors.warningText,
  },
  noticeText: {
    flex: 1,
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.size13,
    color: Theme.colors.warningText,
  },

  /** Lista de pasos durante la conexión. */
  connectingBox: {
    alignItems: "center",
    gap: Theme.spacing.md,
    paddingVertical: Theme.spacing.lg,
  },
  connectingSpinner: {
    color: Theme.colors.primary,
  },
  connectingFailedIcon: {
    color: Theme.colors.danger,
  },
  connectingList: {
    alignSelf: "stretch",
    gap: Theme.spacing.sm,
  },
  connectingItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
  },
  connectingItemDone: {
    color: Theme.colors.textPrimary,
  },
  connectingItemPending: {
    color: Theme.colors.textSecondary,
  },
  connectingLabelDone: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textPrimary,
  },
  connectingLabelPending: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textSecondary,
  },
  connectingDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  connectingDotDone: {
    borderColor: Theme.colors.primary,
  },
  connectingDotIcon: {
    color: Theme.colors.primary,
  },

  /** Paso final. */
  doneBox: {
    alignItems: "center",
    gap: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xl,
  },
  doneIcon: {
    color: Theme.colors.success,
  },
}));