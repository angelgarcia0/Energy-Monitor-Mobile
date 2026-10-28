import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { Modal } from "@/components/Modal/Modal";
import { Theme } from "@/constants/theme";
import { styles } from "./ConfirmTransferUserModal.styles";

export interface ConfirmTransferUserModalProps {
  visible: boolean;
  /** Solo se usa el nombre para el mensaje; el id va en la llamada. */
  user: { name: string; lastName: string };
  /** `true` mientras corre `PUT /owner`: el botón queda bloqueado. */
  transferring?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Confirmación de transferir el hogar, con la casilla obligatoria que también
 * pide la Web: el cambio deja a quien lo hace como simple miembro, así que no
 * puede ser un toque accidental.
 */
export function ConfirmTransferUserModal({
  visible,
  user,
  transferring = false,
  onCancel,
  onConfirm,
}: ConfirmTransferUserModalProps) {
  const { t } = useTranslation("users");
  const [acknowledged, setAcknowledged] = useState(false);
  const fullName = [user.name, user.lastName].filter(Boolean).join(" ");

  return (
    <Modal
      visible={visible}
      onRequestClose={onCancel}
      title={t("confirmTransfer.title")}
      icon={
        <Ionicons
          name="people-outline"
          size={Theme.typography.size.xxl}
          color={Theme.colors.primary}
        />
      }
      footer={
        <>
          <Button variant="secondary" onPress={onCancel} disabled={transferring} style={styles.footerButton}>
            {t("confirmTransfer.cancel")}
          </Button>
          <Button
            onPress={onConfirm}
            disabled={transferring || !acknowledged}
            style={styles.footerButton}
          >
            {transferring ? t("confirmTransfer.transferring") : t("confirmTransfer.confirm")}
          </Button>
        </>
      }
    >
      <Text style={styles.message}>{t("confirmTransfer.message", { name: fullName })}</Text>

      <Pressable
        onPress={() => setAcknowledged((prev) => !prev)}
        disabled={transferring}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: acknowledged }}
        accessibilityLabel={t("confirmTransfer.acknowledge")}
        style={styles.acknowledge}
      >
        <View style={[styles.checkbox, acknowledged && styles.checkboxChecked]}>
          {acknowledged ? (
            <Ionicons name="checkmark" size={Theme.typography.size.sm} color={Theme.colors.onPrimary} />
          ) : null}
        </View>
        <Text style={styles.acknowledgeText}>{t("confirmTransfer.acknowledge")}</Text>
      </Pressable>
    </Modal>
  );
}
