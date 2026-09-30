import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Alert } from "@/components/Alert/Alert";
import { LanguageSwitcher } from "@/components/LanguageSwitcher/LanguageSwitcher";
import { Theme } from "@/constants/theme";
import { AuthBrandHeader } from "../../components/AuthBrandHeader/AuthBrandHeader";
import { LoginForm } from "../../components/LoginForm/LoginForm";
import { styles } from "./LoginScreen.styles";

export interface LoginScreenProps {}

export function LoginScreen(_props: LoginScreenProps) {
  const { t } = useTranslation("auth");
  const insets = useSafeAreaInsets();
  const { success } = useLocalSearchParams<{ success?: string }>();

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="light" />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, Theme.spacing.lg),
            paddingBottom: insets.bottom + Theme.spacing.lg,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <AuthBrandHeader />

        {success === "passwordUpdated" ? (
          <Alert
            variant="success"
            title={t("passwordUpdated.title")}
            message={t("passwordUpdated.message")}
            icon={
              <Ionicons
                name="checkmark-circle"
                size={Theme.typography.size.xl}
                color={Theme.colors.successText}
              />
            }
          />
        ) : null}

        <LoginForm />

        <LanguageSwitcher
          variant="light"
          style={styles.languageSwitcher}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}