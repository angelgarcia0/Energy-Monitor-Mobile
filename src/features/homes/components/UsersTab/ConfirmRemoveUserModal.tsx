import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";

import { Button } from "@/components/Button/Button";
import { Modal } from "@/components/Modal/Modal";
import { Theme } from "@/constants/theme";
import type { ProjectUser } from "../../data/usersMock";
import { styles } from "./ConfirmRemoveUserModal.styles";

export interface ConfirmRemoveUserModalProps {
  visible: boolean;
  user: ProjectUser;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmRemoveUserModal({
  visible,
  user,
  onCancel,
  onConfirm,
}: ConfirmRemoveUserModalProps) {
  const { t } = useTranslation("users");

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
          <Button variant="secondary" onPress={onCancel} style={styles.footerButton}>
            {t("confirmRemove.cancel")}
          </Button>
          <Button variant="danger" onPress={onConfirm} style={styles.footerButton}>
            {t("confirmRemove.confirm")}
          </Button>
        </>
      }
    >
      <Text style={styles.message}>
        {t("confirmRemove.message", { name: user.name })}
      </Text>
    </Modal>
  );
}