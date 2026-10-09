import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { Input } from "@/components/Input/Input";
import { authApi } from "@/services/auth";
import { errorMessage } from "@/services/http/errorMessages";
import {
  recoverPasswordSchema,
  type RecoverPasswordFormValues,
} from "../../validation/recoverPasswordSchema";
import { styles } from "./RecoverPasswordForm.styles";

export interface RecoverPasswordFormProps {
  onSuccess?: () => void;
}

export function RecoverPasswordForm({ onSuccess }: RecoverPasswordFormProps) {
  const { t } = useTranslation("recoverPassword");
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoverPasswordFormValues>({
    resolver: zodResolver(recoverPasswordSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: RecoverPasswordFormValues) => {
    setSubmitting(true);
    setServerError("");
    try {
      await authApi.forgotPassword(data.email.trim());
      // El backend responde 202 siempre, exista o no la cuenta: por eso no se
      // distingue el caso, solo se pide el código y se sigue.
      router.push({
        pathname: "/verify-recover-password",
        params: { email: data.email.trim() },
      });
      onSuccess?.();
    } catch (error) {
      setServerError(errorMessage(t, error, "passwordForgot"));
      setSubmitting(false);
    }
  };

  return (
    <Card padding="lg" style={styles.card}>
      <View style={styles.form}>
        <Text style={styles.title}>{t("title")}</Text>

        <Text style={styles.description}>{t("description")}</Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              label={t("emailLabel")}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t("emailPlaceholder")}
              keyboardType="email-address"
              autoComplete="email"
            />
          )}
        />
        {errors.email ? (
          <Text style={styles.error}>{errors.email.message}</Text>
        ) : null}

        {serverError ? (
          <Text style={styles.error}>{serverError}</Text>
        ) : null}

        <Button
          variant="primary"
          size="large"
          style={styles.submitButton}
          disabled={submitting}
          onPress={handleSubmit(onSubmit)}
        >
          {submitting ? t("sending") : t("sendCode")}
        </Button>

        <Text style={styles.footer}>
          {t("comeBack")}{" "}
          <Text style={styles.footerLink} onPress={() => router.push("/")}>
            {t("login")}
          </Text>
        </Text>
      </View>
    </Card>
  );
}