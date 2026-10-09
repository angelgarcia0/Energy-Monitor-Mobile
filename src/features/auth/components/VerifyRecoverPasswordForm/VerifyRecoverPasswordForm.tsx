import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { OtpInput } from "@/components/OtpInput/OtpInput";
import { authApi } from "@/services/auth";
import { errorMessage } from "@/services/http/errorMessages";
import { useResendCooldown } from "../../hooks/useResendCooldown";
import { setRecoverCode, startRecoverFlow } from "../../service/recoverFlow";
import {
  verifyCodeSchema,
  type VerifyCodeFormValues,
} from "../../validation/verifyCodeSchema";
import { styles } from "./VerifyRecoverPasswordForm.styles";

export interface VerifyRecoverPasswordFormProps {
  onSuccess?: () => void;
}

export function VerifyRecoverPasswordForm({
  onSuccess,
}: VerifyRecoverPasswordFormProps) {
  const { t } = useTranslation("recoverPassword");
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [serverError, setServerError] = useState("");
  const [notice, setNotice] = useState("");
  const { secondsLeft, isCoolingDown, start } = useResendCooldown();

  const {
    control,
    handleSubmit,
    watch,
  } = useForm<VerifyCodeFormValues>({
    resolver: zodResolver(verifyCodeSchema),
    mode: "onChange",
    defaultValues: { code: "" },
  });

  const code = watch("code");
  const isComplete = /^\d{6}$/.test(code);

  // El backend no tiene endpoint de verificación: el código se valida aquí y se
  // entrega al paso siguiente, que es el que llama a POST /auth/password/reset.
  const onSubmit = (data: VerifyCodeFormValues) => {
    if (!email) return;

    startRecoverFlow(email);
    setRecoverCode(data.code);
    router.push("/new-password");
    onSuccess?.();
  };

  const onResend = async () => {
    if (!email || isCoolingDown) return;

    setServerError("");
    try {
      await authApi.forgotPassword(email);
      setNotice(t("resendSent"));
      start();
    } catch (error) {
      // Solo se enseña el límite por IP: cualquier otro fallo se oculta para no
      // distinguir si el correo está registrado.
      if ((error as { status?: number } | null)?.status === 429) {
        setNotice("");
        setServerError(errorMessage(t, error, "passwordForgot"));
      }
    }
  };

  return (
    <Card padding="lg" style={styles.card}>
      <View style={styles.form}>
        <Text style={styles.title}>{t("title")}</Text>

        <Text style={styles.description}>{t("verifyDescription")}</Text>

        {notice ? <Text style={styles.notice}>{notice}</Text> : null}

        <Controller
          control={control}
          name="code"
          render={({ field: { value, onChange } }) => (
            <OtpInput length={6} value={value} onChange={onChange} />
          )}
        />

        {serverError ? (
          <Text style={styles.error}>{serverError}</Text>
        ) : null}

        <Button
          variant="primary"
          size="large"
          style={styles.submitButton}
          disabled={!isComplete}
          onPress={handleSubmit(onSubmit)}
        >
          {t("confirmCode")}
        </Button>

        <View style={styles.resendBlock}>
          <Text style={styles.resendText}>{t("notReceived")}</Text>
          <Button
            variant="secondary"
            size="medium"
            style={styles.resendButton}
            disabled={isCoolingDown}
            onPress={onResend}
          >
            {isCoolingDown
              ? t("resendIn", { seconds: secondsLeft })
              : t("resend")}
          </Button>
        </View>

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