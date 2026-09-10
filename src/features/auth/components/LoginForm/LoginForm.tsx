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
  loginSchema,
  type LoginFormValues,
} from "../../validation/loginSchema";
import { styles } from "./LoginForm.styles";

export interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (_data: LoginFormValues) => {
    // TEMPORAL: la navegación al dashboard es un placeholder que se
    // reemplaza cuando se conecte el backend real (login pendiente).
    router.replace("/dashboard");
    onSuccess?.();
  };

  return (
    <Card padding="lg" style={styles.card}>
      <View style={styles.form}>
        <Text style={styles.title}>Iniciar sesión</Text>

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

        <View style={styles.options}>
          <Pressable
            style={styles.remember}
            onPress={() => setRemember((prev) => !prev)}
          >
            <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
              {remember ? (
                <Ionicons
                  name="checkmark"
                  size={Theme.typography.size.xs}
                  color={Theme.colors.surface}
                />
              ) : null}
            </View>
            <Text style={styles.rememberLabel}>Recordar datos</Text>
          </Pressable>

          <Pressable
            onPress={() =>
              console.log("Recuperar contraseña: pendiente de implementar")
            }
          >
            <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
          </Pressable>
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            variant="primary"
            size="large"
            style={styles.submitButton}
            onPress={handleSubmit(onSubmit)}
          >
            Ingresar
          </Button>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>O</Text>
            <View style={styles.dividerLine} />
          </View>

          <Text style={styles.loginWith}>Iniciar usando:</Text>

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
              console.log("Iniciar sesión con Google: pendiente de implementar")
            }
          >
            Google
          </Button>
        </View>

        <Text style={styles.register}>
          ¿No tienes una cuenta?{" "}
          <Text
            style={styles.registerLink}
            onPress={() => console.log("Registro: pendiente de implementar")}
          >
            Regístrate
          </Text>
        </Text>
      </View>
    </Card>
  );
}
