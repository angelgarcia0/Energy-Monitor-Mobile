import { Ionicons } from "@expo/vector-icons";
import React from "react";
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
  return (
    <Modal
      visible={visible}
      onRequestClose={onCancel}
      variant="danger"
      title="¿Eliminar tu cuenta?"
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
        Esta acción es permanente. Perderás el acceso a tus hogares y a tus
        datos de consumo.
      </Text>
    </Modal>
  );
}
