import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, Text, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { Input } from "@/components/Input/Input";
import { Theme } from "@/constants/theme";
import { authApi } from "@/services/auth";
import { errorMessage } from "@/services/http/errorMessages";
import { toRegisterPayload } from "../../service/registerPayload";
import {
  registerSchema,
  type RegisterFormValues,
} from "../../validation/registerSchema";
import { styles } from "./RegisterForm.styles";

export interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
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
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      password: "",
      repeatPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setSubmitting(true);
    setServerError("");
    try {
      await authApi.register(toRegisterPayload(data));
      // El registro no devuelve token: se verifica el correo y luego se inicia sesión.
      router.push({
        pathname: "/verify-account",
        params: { email: data.email.trim() },
      });
      onSuccess?.();
    } catch (error) {
      setServerError(errorMessage(t, error, "register"));
      setSubmitting(false);
    }
  };

  return (
    <Card padding="lg" style={styles.card}>
      <View style={styles.form}>
        <Text style={styles.title}>{t("register.title")}</Text>

        <View style={styles.nameRow}>
          <View style={styles.fieldHalf}>
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label={t("register.name")}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={t("register.namePlaceholder")}
                  autoComplete="name"
                />
              )}
            />
            {errors.name ? (
              <Text style={styles.error}>{errors.name.message}</Text>
            ) : null}
          </View>

          <View style={styles.fieldHalf}>
            <Controller
              control={control}
              name="lastName"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label={t("register.lastName")}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={t("register.lastNamePlaceholder")}
                  autoComplete="family-name"
                />
              )}
            />
            {errors.lastName ? (
              <Text style={styles.error}>{errors.lastName.message}</Text>
            ) : null}
          </View>
        </View>

        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              label={t("register.email")}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t("register.emailPlaceholder")}
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
              label={t("register.password")}
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
              label={t("register.repeatPassword")}
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
                    color={Theme.colors.onBrand}
                  />
                ) : null}
              </Pressable>

              <Text style={styles.termsText}>
                {t("register.termsPrefix")}{" "}
                <Text
                  style={styles.termsLink}
                  onPress={() =>
                    console.log("Términos de uso: pendiente de implementar")
                  }
                >
                  {t("register.terms")}
                </Text>
                {t("register.termsJoin")}{" "}
                <Text
                  style={styles.termsLink}
                  onPress={() =>
                    console.log(
                      "Política de privacidad: pendiente de implementar",
                    )
                  }
                >
                  {t("register.privacy")}
                </Text>
              </Text>
            </View>
          )}
        />
        {errors.terms ? (
          <Text style={styles.error}>{errors.terms.message}</Text>
        ) : null}

        {serverError ? (
          <Text style={styles.error}>{serverError}</Text>
        ) : null}

        <View style={styles.buttonsContainer}>
          <Button
            variant="primary"
            size="large"
            style={styles.submitButton}
            disabled={submitting}
            onPress={handleSubmit(onSubmit)}
          >
            {submitting ? t("register.submitting") : t("register.submit")}
          </Button>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t("register.divider")}</Text>
            <View style={styles.dividerLine} />
          </View>

          <Text style={styles.loginWith}>{t("register.registerWith")}</Text>

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
            {t("register.google")}
          </Button>
        </View>

        <Text style={styles.register}>
          {t("register.haveAccount")}{" "}
          <Text
            style={styles.registerLink}
            onPress={() => router.push("/")}
          >
            {t("register.login")}
          </Text>
        </Text>
      </View>
    </Card>
  );
}
