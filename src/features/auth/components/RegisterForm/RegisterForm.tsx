import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { Input } from "@/components/Input/Input";
import { Theme } from "@/constants/theme";
import {
  registerSchema,
  type RegisterFormValues,
} from "../../validation/registerSchema";
import { styles } from "./RegisterForm.styles";

export interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      repeatPassword: "",
      terms: false,
    },
  });

  const onSubmit = (_data: RegisterFormValues) => {
    // TEMPORAL: la navegación a verify-account es un placeholder que se
    // reemplaza cuando se conecte el backend real (registro pendiente).
    router.push("/verify-account");
    onSuccess?.();
  };

  return (
    <Card padding="lg" style={styles.card}>
      <View style={styles.form}>
        <Text style={styles.title}>Registro</Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              label="Nombre"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Tu nombre"
              autoComplete="name"
            />
          )}
        />
        {errors.name ? (
          <Text style={styles.error}>{errors.name.message}</Text>
        ) : null}

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

        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              label="Contraseña"
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

        <Controller
          control={control}
          name="terms"
          render={({ field: { value, onChange } }) => (
            <View style={styles.options}>
              <Pressable
                style={[styles.checkbox, value && styles.checkboxChecked]}
                onPress={() => onChange(!value)}
              >
                {value ? (
                  <Ionicons
                    name="checkmark"
                    size={Theme.typography.size.xs}
                    color={Theme.colors.surface}
                  />
                ) : null}
              </Pressable>

              <Text style={styles.termsText}>
                {"Estoy de acuerdo con los "}
                <Text
                  style={styles.termsLink}
                  onPress={() =>
                    console.log("Términos de uso: pendiente de implementar")
                  }
                >
                  Términos de uso
                </Text>
                {" y la "}
                <Text
                  style={styles.termsLink}
                  onPress={() =>
                    console.log(
                      "Política de privacidad: pendiente de implementar",
                    )
                  }
                >
                  Política de privacidad
                </Text>
              </Text>
            </View>
          )}
        />
        {errors.terms ? (
          <Text style={styles.error}>{errors.terms.message}</Text>
        ) : null}

        <View style={styles.buttonsContainer}>
          <Button
            variant="primary"
            size="large"
            style={styles.submitButton}
            onPress={handleSubmit(onSubmit)}
          >
            Registrarse
          </Button>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>O</Text>
            <View style={styles.dividerLine} />
          </View>

          <Text style={styles.loginWith}>Registrarse usando:</Text>

          <Button
            variant="secondary"
            size="medium"
            style={styles.googleButton}
            icon={
              <Image
                source={require("../../../../assets/google_icon.png")}
                style={styles.googleIcon}
              />
            }
            onPress={() =>
              console.log("Registrarse con Google: pendiente de implementar")
            }
          >
            Google
          </Button>
        </View>

        <Text style={styles.register}>
          ¿Ya tienes una cuenta?{" "}
          <Text
            style={styles.registerLink}
            onPress={() => router.push("/")}
          >
            Inicia sesión
          </Text>
        </Text>
      </View>
    </Card>
  );
}
