import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { OtpInput } from "@/components/OtpInput/OtpInput";
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
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

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

  const onSubmit = (_data: VerifyCodeFormValues) => {
    // TEMPORAL: simulación de verificación del código que se reemplaza cuando
    // se conecte el backend real (verificación pendiente).
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      router.push("/new-password");
      onSuccess?.();
    }, 600);
  };

  return (
    <Card padding="lg" style={styles.card}>
      <View style={styles.form}>
        <Text style={styles.title}>Recuperar contraseña</Text>

        <Text style={styles.description}>
          Te enviamos un correo con un código de verificación de 6 dígitos para
          confirmar tu identidad
        </Text>

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

        <Button
          variant="primary"
          size="large"
          style={styles.submitButton}
          disabled={!isComplete || submitting}
          onPress={handleSubmit(onSubmit)}
        >
          {submitting ? "Confirmando..." : "Confirmar código"}
        </Button>

        <View style={styles.resendBlock}>
          <Text style={styles.resendText}>¿No te llegó el código?</Text>
          <Button
            variant="secondary"
            size="medium"
            style={styles.resendButton}
            onPress={() =>
              console.log("Reenviar código: pendiente de implementar")
            }
          >
            Reenviar código
          </Button>
        </View>

        <Text style={styles.footer}>
          Volver a{" "}
          <Text style={styles.footerLink} onPress={() => router.push("/")}>
            Inicio de sesión
          </Text>
        </Text>
      </View>
    </Card>
  );
}