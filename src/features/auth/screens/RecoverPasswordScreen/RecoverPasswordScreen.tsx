import { StatusBar } from "expo-status-bar";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Theme } from "@/constants/theme";
import { AuthBrandHeader } from "../../components/AuthBrandHeader/AuthBrandHeader";
import { RecoverPasswordForm } from "../../components/RecoverPasswordForm/RecoverPasswordForm";
import { styles } from "./RecoverPasswordScreen.styles";

export interface RecoverPasswordScreenProps {}

export function RecoverPasswordScreen(_props: RecoverPasswordScreenProps) {
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
        <AuthBrandHeader subtitle="Monitorea tu consumo eléctrico en tiempo real" />

        <RecoverPasswordForm />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}