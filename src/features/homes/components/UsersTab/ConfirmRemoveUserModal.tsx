import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";

import { Button } from "@/components/Button/Button";
import { Modal } from "@/components/Modal/Modal";
import { Theme } from "@/constants/theme";
import { styles } from "./ConfirmRemoveUserModal.styles";

export interface ConfirmRemoveUserModalProps {
  visible: boolean;
  /** Solo se usa el nombre para el mensaje; el id va en la llamada. */
  user: { name: string; lastName: string };
  /** `true` mientras corre `DELETE`: el botón queda bloqueado. */
  removing?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmRemoveUserModal({
  visible,
  user,
  removing = false,
  onCancel,
  onConfirm,
}: ConfirmRemoveUserModalProps) {
  const { t } = useTranslation("users");
  const fullName = [user.name, user.lastName].filter(Boolean).join(" ");

  return (
    <Modal
      visible={visible}
      onRequestClose={onCancel}
      variant="danger"
      title={t("confirmRemove.title")}
      icon={
        <Ionicons
          name="alert-circle-outline"
          size={Theme.typography.size.xxl}
          color={Theme.colors.danger}
        />
      }
      footer={
        <>
          <Button variant="secondary" onPress={onCancel} disabled={removing} style={styles.footerButton}>
            {t("confirmRemove.cancel")}
          </Button>
          <Button variant="danger" onPress={onConfirm} disabled={removing} style={styles.footerButton}>
            {removing ? t("confirmRemove.removing") : t("confirmRemove.confirm")}
          </Button>
        </>
      }
    >
      <Text style={styles.message}>
        {t("confirmRemove.message", { name: fullName })}
      </Text>
    </Modal>
  );
}