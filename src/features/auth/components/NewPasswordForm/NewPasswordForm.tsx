import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { Input } from "@/components/Input/Input";
import { Theme } from "@/constants/theme";
import { authApi } from "@/services/auth";
import { errorMessage } from "@/services/http/errorMessages";
import {
  clearRecoverFlow,
  getRecoverFlow,
} from "../../service/recoverFlow";
import {
  newPasswordSchema,
  type NewPasswordFormValues,
} from "../../validation/newPasswordSchema";
import { styles } from "./NewPasswordForm.styles";

export interface NewPasswordFormProps {
  onSuccess?: () => void;
}

export function NewPasswordForm({ onSuccess }: NewPasswordFormProps) {
  const { t } = useTranslation("auth");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    mode: "onChange",
    defaultValues: { password: "", repeatPassword: "" },
  });

  const onSubmit = async (data: NewPasswordFormValues) => {
    const flow = getRecoverFlow();
    if (!flow?.code) {
      setServerError(t("newPassword.sessionExpired"));
      return;
    }

    setSubmitting(true);
    setServerError("");
    try {
      await authApi.resetPassword({
        email: flow.email,
        resetToken: flow.code,
        newPassword: data.password,
      });
      clearRecoverFlow();
      router.navigate({ pathname: "/", params: { success: "passwordUpdated" } });
      onSuccess?.();
    } catch (error) {
      setServerError(errorMessage(t, error, "passwordReset"));
      setSubmitting(false);
    }
  };

  return (
    <Card padding="lg" style={styles.card}>
      <View style={styles.form}>
        <Text style={styles.title}>{t("newPassword.title")}</Text>

        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              label={t("newPassword.password")}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="••••••"
              secureTextEntry={!showPassword}
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
        />
        {errors.password ? (
          <Text style={styles.error}>{errors.password.message}</Text>
        ) : null}

        <Controller
          control={control}
          name="repeatPassword"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              label={t("newPassword.repeatPassword")}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="••••••"
              secureTextEntry={!showRepeatPassword}
              icon={
                <Ionicons
                  name={showRepeatPassword ? "eye-off-outline" : "eye-outline"}
                  size={Theme.typography.size.lg}
                  color={Theme.colors.textSecondary}
                />
              }
              onIconPress={() => setShowRepeatPassword((prev) => !prev)}
            />
          )}
        />
        {errors.repeatPassword ? (
          <Text style={styles.error}>{errors.repeatPassword.message}</Text>
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
          {submitting ? t("newPassword.saving") : t("newPassword.save")}
        </Button>
      </View>
    </Card>
  );
}