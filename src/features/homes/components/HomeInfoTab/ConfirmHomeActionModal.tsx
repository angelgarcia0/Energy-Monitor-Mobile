import { Ionicons } from "@expo/vector-icons";
import React from "react";
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
  const isDelete = mode === "delete";

  return (
    <Modal
      visible={visible}
      onRequestClose={onCancel}
      variant="danger"
      title={isDelete ? "¿Eliminar hogar?" : "¿Salirte del hogar?"}
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
            {isDelete ? "Eliminar hogar" : "Salirse del hogar"}
          </Button>
        </>
      }
    >
      <Text style={styles.message}>
        {isDelete
          ? "¿Eliminar este hogar? Esta acción no se puede deshacer."
          : "¿Seguro que deseas salirte de este hogar?"}
      </Text>
    </Modal>
  );
}