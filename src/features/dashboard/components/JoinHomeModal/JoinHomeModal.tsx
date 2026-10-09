import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { Modal } from "@/components/Modal/Modal";
import { Theme } from "@/constants/theme";
import {
  JOIN_CODE_LENGTH,
  joinHomeSchema,
  sanitizeJoinCode,
  type JoinHomeFormValues,
} from "../../validation/joinHomeSchema";
import { styles } from "./JoinHomeModal.styles";

export interface JoinHomeModalProps {
  visible: boolean;
  submitting?: boolean;
  /** Mensaje ya traducido de la última llamada fallida. */
  serverError?: string | null;
  onClose: () => void;
  /** Devuelve `true` si entró al hogar: el modal solo se cierra en ese caso. */
  onSubmit: (code: string) => Promise<boolean>;
}

export function JoinHomeModal({
  visible,
  submitting = false,
  serverError,
  onClose,
  onSubmit,
}: JoinHomeModalProps) {
  const { t } = useTranslation("joinHomeModal");
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JoinHomeFormValues>({
    resolver: zodResolver(joinHomeSchema),
    defaultValues: { code: "" },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const submit = async (data: JoinHomeFormValues) => {
    if (await onSubmit(data.code)) handleClose();
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={handleClose}
      title={t("title")}
      footer={
        <>
          <Button variant="secondary" onPress={handleClose} disabled={submitting}>
            {t("cancel")}
          </Button>
          <Button
            variant="primary"
            onPress={handleSubmit(submit)}
            disabled={submitting}
          >
            {submitting ? t("joining") : t("join")}
          </Button>
        </>
      }
    >
      <View style={styles.body}>
        <View style={styles.iconCircle}>
          <Ionicons name="key-outline" size={Theme.typography.size.xl} color={Theme.colors.primary} />
        </View>

        <Text style={styles.description}>{t("description")}</Text>

        <Controller
          control={control}
          name="code"
          render={({ field: { value, onChange, onBlur } }) => (
            <View style={styles.field}>
              <Input
                label={t("label")}
                value={value}
                onChangeText={(text) => onChange(sanitizeJoinCode(text))}
                onBlur={onBlur}
                placeholder={t("placeholder")}
                maxLength={JOIN_CODE_LENGTH}
                autoCapitalize="characters"
              />
              <Text style={styles.counter}>
                {value.length}/{JOIN_CODE_LENGTH}
              </Text>
            </View>
          )}
        />
        {errors.code ? <Text style={styles.error}>{errors.code.message}</Text> : null}

        {serverError ? (
          <Text style={styles.error} accessibilityRole="alert">
            {serverError}
          </Text>
        ) : null}

        <Text style={styles.hint}>{t("hint")}</Text>
      </View>
    </Modal>
  );
}
