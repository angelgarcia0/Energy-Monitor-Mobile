import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";

import { Button } from "@/components/Button/Button";
import { Modal } from "@/components/Modal/Modal";
import { Theme } from "@/constants/theme";
import { styles } from "./DeleteAccountModal.styles";

export interface DeleteAccountModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteAccountModal({
  visible,
  onCancel,
  onConfirm,
}: DeleteAccountModalProps) {
  const { t } = useTranslation("account");

  return (
    <Modal
      visible={visible}
      onRequestClose={onCancel}
      variant="danger"
      title={t("deleteAccount.title")}
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
            {t("deleteAccount.cancel")}
          </Button>
          <Button variant="danger" onPress={onConfirm} style={styles.footerButton}>
            {t("deleteAccount.confirm")}
          </Button>
        </>
      }
    >
      <Text style={styles.message}>{t("deleteAccount.message")}</Text>
    </Modal>
  );
}
