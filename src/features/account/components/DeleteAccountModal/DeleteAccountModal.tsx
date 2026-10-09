import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";

import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { Modal } from "@/components/Modal/Modal";
import { Theme } from "@/constants/theme";
import { styles } from "./DeleteAccountModal.styles";

export interface DeleteAccountModalProps {
  visible: boolean;
  onCancel: () => void;
  /** El backend exige la contraseña para confirmar; el error lo muestra quien llama. */
  onConfirm: (password: string) => Promise<void> | void;
}

/** Confirmación previa a eliminar la cuenta: pide la contraseña y llama onConfirm. */
export function DeleteAccountModal({
  visible,
  onCancel,
  onConfirm,
}: DeleteAccountModalProps) {
  const { t } = useTranslation("account");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const confirm = async () => {
    setBusy(true);
    try {
      await onConfirm(password);
    } finally {
      setBusy(false);
    }
  };

  const handleCancel = () => {
    setPassword("");
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={handleCancel}
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
          <Button variant="secondary" onPress={handleCancel} style={styles.footerButton}>
            {t("deleteAccount.cancel")}
          </Button>
          <Button
            variant="danger"
            onPress={confirm}
            disabled={!password || busy}
            style={styles.footerButton}
          >
            {t("deleteAccount.confirm")}
          </Button>
        </>
      }
    >
      <Text style={styles.message}>{t("deleteAccount.message")}</Text>

      <Input
        label={t("deleteAccount.passwordLabel")}
        value={password}
        onChangeText={setPassword}
        placeholder="••••••"
        secureTextEntry={!showPassword}
        autoComplete="current-password"
        icon={
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={Theme.typography.size.lg}
            color={Theme.colors.textSecondary}
          />
        }
        onIconPress={() => setShowPassword((prev) => !prev)}
      />
    </Modal>
  );
}