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
import { styles } from "./VerifyAccountForm.styles";

export interface VerifyAccountFormProps {
  onSuccess?: () => void;
}

export function VerifyAccountForm({ onSuccess }: VerifyAccountFormProps) {
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
    // TEMPORAL: simulación de verificación que se reemplaza cuando se conecte
    // el backend real y se pueda autenticar la sesión (o navegar directo al
    // dashboard si el backend autologuea).
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      router.navigate("/");
      onSuccess?.();
    }, 600);
  };

  return (
    <Card padding="lg" style={styles.card}>
      <View style={styles.form}>
        <Text style={styles.title}>Verificar correo</Text>

        <Text style={styles.description}>
          Te enviamos un código de 6 dígitos a tu correo. Ingresa el código para
          verificar tu cuenta.
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
          ¿Ya tienes una cuenta?{" "}
          <Text style={styles.footerLink} onPress={() => router.navigate("/")}>
            Inicia sesión
          </Text>
        </Text>
      </View>
    </Card>
  );
}