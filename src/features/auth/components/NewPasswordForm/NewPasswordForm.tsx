import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { Input } from "@/components/Input/Input";
import { Theme } from "@/constants/theme";
import {
  newPasswordSchema,
  type NewPasswordFormValues,
} from "../../validation/newPasswordSchema";
import { styles } from "./NewPasswordForm.styles";

export interface NewPasswordFormProps {
  onSuccess?: () => void;
}

export function NewPasswordForm({ onSuccess }: NewPasswordFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    mode: "onChange",
    defaultValues: { password: "", repeatPassword: "" },
  });

  const onSubmit = (_data: NewPasswordFormValues) => {
    // TEMPORAL: simulación del guardado que se reemplaza cuando se conecte el
    // backend real (actualización de contraseña pendiente).
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      router.navigate({ pathname: "/", params: { success: "passwordUpdated" } });
      onSuccess?.();
    }, 600);
  };

  return (
    <Card padding="lg" style={styles.card}>
      <View style={styles.form}>
        <Text style={styles.title}>Nueva contraseña</Text>

        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              label="Nueva contraseña"
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
              label="Repetir contraseña"
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

        <Button
          variant="primary"
          size="large"
          style={styles.submitButton}
          disabled={submitting}
          onPress={handleSubmit(onSubmit)}
        >
          {submitting ? "Guardando..." : "Guardar contraseña"}
        </Button>
      </View>
    </Card>
  );
}