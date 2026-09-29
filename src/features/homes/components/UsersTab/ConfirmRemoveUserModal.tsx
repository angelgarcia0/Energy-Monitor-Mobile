import { Ionicons } from "@expo/vector-icons";
import React from "react";
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
  return (
    <Modal
      visible={visible}
      onRequestClose={onCancel}
      variant="danger"
      title="¿Eliminar miembro?"
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
        Vas a eliminar a &quot;{user.name}&quot; del proyecto. Dejará de recibir
        los datos de consumo del hogar y tendrás que volver a invitarlo si
        quieres que participe.
      </Text>
    </Modal>
  );
}