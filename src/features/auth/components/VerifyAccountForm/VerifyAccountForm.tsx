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
import {
  verifyCodeSchema,
  type VerifyCodeFormValues,
} from "../../validation/verifyCodeSchema";
import { styles } from "./VerifyAccountForm.styles";

export interface VerifyAccountFormProps {
  onSuccess?: () => void;
}

export function VerifyAccountForm({ onSuccess }: VerifyAccountFormProps) {
  const { t } = useTranslation("auth");
  const router = useRouter();
  // El registro deja el correo en la ruta: el código se envía a esa dirección.
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [submitting, setSubmitting] = useState(false);
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

  const onSubmit = async (data: VerifyCodeFormValues) => {
    if (!email) {
      setServerError(t("verify.missingEmail"));
      return;
    }

    setSubmitting(true);
    setServerError("");
    try {
      await authApi.verifyEmail({ email, code: data.code });
      router.navigate({ pathname: "/", params: { emailVerified: "1" } });
      onSuccess?.();
    } catch (error) {
      setServerError(errorMessage(t, error, "emailVerify"));
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    if (!email || isCoolingDown) return;
    setServerError("");
    try {
      await authApi.resendVerification(email);
      setNotice(t("verify.resendSent"));
      start();
    } catch (error) {
      setServerError(errorMessage(t, error, "emailResend"));
    }
  };

  return (
    <Card padding="lg" style={styles.card}>
      <View style={styles.form}>
        <Text style={styles.title}>{t("verify.title")}</Text>
        <Text style={styles.description}>{t("verify.description")}</Text>

        {notice ? <Text style={styles.notice}>{notice}</Text> : null}

        <Controller
          control={control}
          name="code"
          render={({ field: { value, onChange } }) => (
            <OtpInput
              length={6}
              value={value}
              onChange={onChange}
              disabled={submitting}
            />
          )}
        />

        {serverError ? (
          <Text style={styles.error}>{serverError}</Text>
        ) : null}

        <Button
          variant="primary"
          size="large"
          style={styles.submitButton}
          disabled={!isComplete || submitting}
          onPress={handleSubmit(onSubmit)}
        >
          {submitting ? t("verify.confirming") : t("verify.confirm")}
        </Button>

        <View style={styles.resendBlock}>
          <Text style={styles.resendText}>{t("verify.notReceived")}</Text>
          <Button
            variant="secondary"
            size="medium"
            style={styles.resendButton}
            disabled={isCoolingDown}
            onPress={onResend}
          >
            {isCoolingDown
              ? t("verify.resendIn", { seconds: secondsLeft })
              : t("verify.resend")}
          </Button>
        </View>

        <Text style={styles.footer}>
          {t("register.haveAccount")}{" "}
          <Text style={styles.footerLink} onPress={() => router.navigate("/")}>
            {t("register.login")}
          </Text>
        </Text>
      </View>
    </Card>
  );
}