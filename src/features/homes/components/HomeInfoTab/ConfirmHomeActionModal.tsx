import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";

import { Button } from "@/components/Button/Button";
import { Modal } from "@/components/Modal/Modal";
import { Theme } from "@/constants/theme";
import { styles } from "./ConfirmHomeActionModal.styles";

/**
 * Confirmación de salir del hogar.
 *
 * Solo hay una acción: el backend expone `DELETE /homes/{id}/members/me` y
 * ningún endpoint para eliminar el hogar, así que el dueño también abandona.
 */
export interface ConfirmHomeActionModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmHomeActionModal({
  visible,
  onCancel,
  onConfirm,
}: ConfirmHomeActionModalProps) {
  const { t } = useTranslation("home");

  return (
    <Modal
      visible={visible}
      onRequestClose={onCancel}
      variant="danger"
      title={t("confirm.leaveTitle")}
      icon={
        <Ionicons
          name="alert-circle-outline"
          size={Theme.typography.size.xxl}
          color={Theme.colors.danger}
        />
      }
      footer={
        <>
          <Button variant="secondary" onPress={onCancel} style={styles.footerButton}>
            {t("confirm.cancel")}
          </Button>
          <Button variant="danger" onPress={onConfirm} style={styles.footerButton}>
            {t("buttons.leaveHome")}
          </Button>
        </>
      }
    >
      <Text style={styles.message}>{t("confirm.leave")}</Text>
    </Modal>
  );
}