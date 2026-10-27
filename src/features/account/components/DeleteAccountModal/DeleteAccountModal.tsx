import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";

import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { Modal } from "@/components/Modal/Modal";
import { Theme } from "@/constants/theme";
import { styles } from "./DeleteAccountModal.styles";

export type DeleteConfirmation = { password: string } | { code: string };

export interface DeleteAccountModalProps {
  visible: boolean;
  onCancel: () => void;
  /** Contraseña o, en una cuenta de Google, el código; el error lo muestra quien llama. */
  onConfirm: (confirmation: DeleteConfirmation) => Promise<void> | void;
  /** Cuenta creada con Google: no tiene contraseña y confirma con un código por correo. */
  googleAccount?: boolean;
  email?: string;
  /** Envía el código; devuelve si se envió (si no, quien llama muestra el error). */
  onRequestCode?: () => Promise<boolean>;
}

/**
 * Confirmación previa a eliminar la cuenta: pide la contraseña o, si la cuenta se creó con
 * Google, el código que llega al correo, y llama onConfirm.
 */
export function DeleteAccountModal({
  visible,
  onCancel,
  onConfirm,
  googleAccount = false,
  email = "",
  onRequestCode,
}: DeleteAccountModalProps) {
  const { t } = useTranslation("account");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const ready = googleAccount ? /^\d{6}$/.test(code) : Boolean(password);

  const confirm = async () => {
    setBusy(true);
    try {
      await onConfirm(googleAccount ? { code } : { password });
    } finally {
      setBusy(false);
    }
  };

  const requestCode = async () => {
    if (!onRequestCode) return;
    setBusy(true);
    try {
      if (await onRequestCode()) setCodeSent(true);
    } finally {
      setBusy(false);
    }
  };

  const handleCancel = () => {
    setPassword("");
    setCode("");
    setCodeSent(false);
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
            disabled={!ready || busy}
            style={styles.footerButton}
          >
            {t("deleteAccount.confirm")}
          </Button>
        </>
      }
    >
      <Text style={styles.message}>{t("deleteAccount.message")}</Text>

      {googleAccount ? (
        <>
          <Text style={styles.message}>
            {codeSent
              ? t("deleteAccount.codeSent", { email })
              : t("deleteAccount.googleMessage", { email })}
          </Text>
          {codeSent ? (
            <Input
              label={t("deleteAccount.codeLabel")}
              value={code}
              onChangeText={(value) => setCode(value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              keyboardType="number-pad"
              autoComplete="one-time-code"
              maxLength={6}
            />
          ) : null}
          <Button variant="secondary" onPress={requestCode} disabled={busy}>
            {codeSent ? t("deleteAccount.resendCode") : t("deleteAccount.sendCode")}
          </Button>
        </>
      ) : (
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
      )}
    </Modal>
  );
}
