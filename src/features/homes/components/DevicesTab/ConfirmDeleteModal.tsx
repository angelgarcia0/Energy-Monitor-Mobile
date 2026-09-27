import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text } from "react-native";

import { Button } from "@/components/Button/Button";
import { Modal } from "@/components/Modal/Modal";
import { Theme } from "@/constants/theme";
import { APPLIANCE_LABEL, type Device } from "../../data/deviceMocks";
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
  const deviceName = device.name?.trim() || APPLIANCE_LABEL[device.applianceType];

  return (
    <Modal
      visible={visible}
      onRequestClose={onCancel}
      variant="danger"
      title="¿Eliminar dispositivo?"
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
            Cancelar
          </Button>
          <Button variant="danger" onPress={onConfirm} style={styles.footerButton}>
            Eliminar
          </Button>
        </>
      }
    >
      <Text style={styles.message}>
        Vas a eliminar &quot;{deviceName}&quot;. Dejarás de recibir sus datos de
        consumo y tendrás que vincularlo de nuevo si quieres volver a usarlo.
      </Text>
    </Modal>
  );
}
