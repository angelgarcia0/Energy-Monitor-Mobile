import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  useWindowDimensions,
} from "react-native";

import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { Modal } from "@/components/Modal/Modal";
import { Theme } from "@/constants/theme";
import { changePasswordSchema, type ChangePasswordValues } from "../../validation/accountSchemas";
import { styles } from "./ChangePasswordModal.styles";

export interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  /** Recibe las contraseñas sin confirmar; el error lo muestra quien llama. */
  onSubmit: (values: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void> | void;
}

const DEFAULT_VALUES: ChangePasswordValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function ChangePasswordModal({
  visible,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) {
  const { t } = useTranslation("account");
  const { height } = useWindowDimensions();
  const [showPasswords, setShowPasswords] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const handleClose = () => {
    reset();
    setShowPasswords(false);
    onClose();
  };

  // El modal solo se cierra si la llamada resuelve: si el backend rechaza la
  // contraseña actual, quien llama muestra el error y el formulario sigue abierto.
  const submit = async (values: ChangePasswordValues) => {
    await onSubmit({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
    reset();
    setShowPasswords(false);
  };

  const eyeIcon = (
    <Ionicons
      name={showPasswords ? "eye-off-outline" : "eye-outline"}
      size={Theme.typography.size.lg}
      color={Theme.colors.textSecondary}
    />
  );

  return (
    <Modal
      visible={visible}
      onRequestClose={handleClose}
      title={t("changePassword.title")}
      footer={
        <>
          <Button variant="secondary" onPress={handleClose}>
            {t("deleteAccount.cancel")}
          </Button>
          <Button disabled={isSubmitting} onPress={handleSubmit(submit)}>
            {isSubmitting ? t("changePassword.saving") : t("changePassword.save")}
          </Button>
        </>
      }
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ maxHeight: height * 0.45 }}
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
        >
          <Controller
            control={control}
            name="currentPassword"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label={t("changePassword.currentLabel")}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="••••••••"
                secureTextEntry={!showPasswords}
                icon={eyeIcon}
                onIconPress={() => setShowPasswords((prev) => !prev)}
              />
            )}
          />
          {errors.currentPassword ? (
            <Text style={styles.error}>{errors.currentPassword.message}</Text>
          ) : null}

          <Controller
            control={control}
            name="newPassword"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label={t("changePassword.newLabel")}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t("changePassword.newPlaceholder")}
                secureTextEntry={!showPasswords}
              />
            )}
          />
          {errors.newPassword ? (
            <Text style={styles.error}>{errors.newPassword.message}</Text>
          ) : null}

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label={t("changePassword.confirmLabel")}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t("changePassword.confirmPlaceholder")}
                secureTextEntry={!showPasswords}
              />
            )}
          />
          {errors.confirmPassword ? (
            <Text style={styles.error}>{errors.confirmPassword.message}</Text>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
