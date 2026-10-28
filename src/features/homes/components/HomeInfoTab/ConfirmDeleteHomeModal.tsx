import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";

import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { Modal } from "@/components/Modal/Modal";
import { Theme } from "@/constants/theme";
import { styles } from "./ConfirmHomeActionModal.styles";

/**
 * Confirmación de eliminar el hogar (solo el responsable).
 *
 * Borrar un hogar lo quita a todos sus miembros y desvincula sus dispositivos, y
 * no se puede deshacer desde la app; por eso, igual que en la Web, se pide
 * escribir el nombre del hogar y no basta con un toque.
 */
export interface ConfirmDeleteHomeModalProps {
  visible: boolean;
  homeName: string;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteHomeModal({
  visible,
  homeName,
  deleting,
  onCancel,
  onConfirm,
}: ConfirmDeleteHomeModalProps) {
  const { t } = useTranslation("home");
  const [typedName, setTypedName] = useState("");

  const name = homeName.trim();
  const matches = name !== "" && typedName.trim().toLowerCase() === name.toLowerCase();

  return (
    <Modal
      visible={visible}
      onRequestClose={onCancel}
      variant="danger"
      title={t("confirm.deleteTitle")}
      icon={
        <Ionicons
          name="trash-outline"
          size={Theme.typography.size.xxl}
          color={Theme.colors.danger}
        />
      }
      footer={
        <>
          <Button
            variant="secondary"
            onPress={onCancel}
            disabled={deleting}
            style={styles.footerButton}
          >
            {t("confirm.cancel")}
          </Button>
          <Button
            variant="danger"
            onPress={onConfirm}
            disabled={!matches || deleting}
            style={styles.footerButton}
          >
            {deleting ? t("buttons.deleting") : t("buttons.deleteHome")}
          </Button>
        </>
      }
    >
      <Text style={styles.message}>{t("confirm.delete")}</Text>
      <Input
        label={t("confirm.deleteTypeName", { name })}
        value={typedName}
        onChangeText={setTypedName}
        placeholder={name}
        editable={!deleting}
      />
    </Modal>
  );
}
