import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { Input } from "@/components/Input/Input";
import {
  recoverPasswordSchema,
  type RecoverPasswordFormValues,
} from "../../validation/recoverPasswordSchema";
import { styles } from "./RecoverPasswordForm.styles";

export interface RecoverPasswordFormProps {
  onSuccess?: () => void;
}

export function RecoverPasswordForm({ onSuccess }: RecoverPasswordFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoverPasswordFormValues>({
    resolver: zodResolver(recoverPasswordSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const onSubmit = (_data: RecoverPasswordFormValues) => {
    // TEMPORAL: simulación de envío del código que se reemplaza cuando se
    // conecte el backend real (envío de correo pendiente).
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      router.push("/verify-recover-password");
      onSuccess?.();
    }, 600);
  };

  return (
    <Card padding="lg" style={styles.card}>
      <View style={styles.form}>
        <Text style={styles.title}>Recuperar contraseña</Text>

        <Text style={styles.description}>
          Te enviaremos un correo con código de verificación de 6 dígitos para
          poder recuperar tu cuenta. A continuación digita tu correo
        </Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              label="Correo electrónico"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="tucorreo@ejemplo.com"
              keyboardType="email-address"
              autoComplete="email"
            />
          )}
        />
        {errors.email ? (
          <Text style={styles.error}>{errors.email.message}</Text>
        ) : null}

        <Button
          variant="primary"
          size="large"
          style={styles.submitButton}
          disabled={submitting}
          onPress={handleSubmit(onSubmit)}
        >
          {submitting ? "Enviando..." : "Enviar código"}
        </Button>

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