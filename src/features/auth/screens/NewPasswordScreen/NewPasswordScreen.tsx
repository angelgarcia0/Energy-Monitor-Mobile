import { StatusBar } from "expo-status-bar";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Theme } from "@/constants/theme";
import { AuthBrandHeader } from "../../components/AuthBrandHeader/AuthBrandHeader";
import { NewPasswordForm } from "../../components/NewPasswordForm/NewPasswordForm";
import { styles } from "./NewPasswordScreen.styles";

export interface NewPasswordScreenProps {}

export function NewPasswordScreen(_props: NewPasswordScreenProps) {
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

        <NewPasswordForm />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}