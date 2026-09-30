import { StatusBar } from "expo-status-bar";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Theme } from "@/constants/theme";
import { LanguageSwitcher } from "@/components/LanguageSwitcher/LanguageSwitcher";
import { AuthBrandHeader } from "../../components/AuthBrandHeader/AuthBrandHeader";
import { VerifyRecoverPasswordForm } from "../../components/VerifyRecoverPasswordForm/VerifyRecoverPasswordForm";
import { styles } from "./VerifyRecoverPasswordScreen.styles";

export interface VerifyRecoverPasswordScreenProps {}

export function VerifyRecoverPasswordScreen(
  _props: VerifyRecoverPasswordScreenProps,
) {
  const insets = useSafeAreaInsets();

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

        <VerifyRecoverPasswordForm />

        <LanguageSwitcher
          variant="light"
          style={styles.languageSwitcher}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}