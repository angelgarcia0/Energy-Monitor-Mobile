import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";

import { Button } from "@/components/Button/Button";
import { Modal } from "@/components/Modal/Modal";
import { Theme } from "@/constants/theme";
import { getApplianceLabel, type Device } from "../../data/deviceMocks";
import { styles } from "./ConfirmDeleteModal.styles";

export interface ConfirmDeleteModalProps {
  visible: boolean;
  device: Device;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({
  visible,
  device,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  const { t } = useTranslation("devices");
  const deviceName =
    device.name?.trim() || getApplianceLabel(t, device.applianceType);

  return (
    <Modal
      visible={visible}
      onRequestClose={onCancel}
      variant="danger"
      title={t("confirmDelete.title")}
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
            {t("confirmDelete.cancel")}
          </Button>
          <Button variant="danger" onPress={onConfirm} style={styles.footerButton}>
            {t("confirmDelete.confirm")}
          </Button>
        </>
      }
    >
      <Text style={styles.message}>
        {t("confirmDelete.message", { name: deviceName })}
      </Text>
    </Modal>
  );
}
