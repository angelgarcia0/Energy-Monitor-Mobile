import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";

import { Button } from "@/components/Button/Button";
import { Modal } from "@/components/Modal/Modal";
import { Theme } from "@/constants/theme";
import { styles } from "./ConfirmHomeActionModal.styles";

export type ConfirmHomeAction = "delete" | "leave";

export interface ConfirmHomeActionModalProps {
  visible: boolean;
  mode: ConfirmHomeAction;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmHomeActionModal({
  visible,
  mode,
  onCancel,
  onConfirm,
}: ConfirmHomeActionModalProps) {
  const { t } = useTranslation("home");
  const isDelete = mode === "delete";

  return (
    <Modal
      visible={visible}
      onRequestClose={onCancel}
      variant="danger"
      title={isDelete ? t("confirm.deleteTitle") : t("confirm.leaveTitle")}
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
            {isDelete ? t("buttons.deleteHome") : t("buttons.leaveHome")}
          </Button>
        </>
      }
    >
      <Text style={styles.message}>
        {isDelete ? t("confirm.delete") : t("confirm.leave")}
      </Text>
    </Modal>
  );
}