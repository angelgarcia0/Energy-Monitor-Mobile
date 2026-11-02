import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Modal as RNModal,
  Platform,
  Pressable,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Theme } from "@/constants/theme";
import { styles } from "./Modal.styles";

export type ModalVariant = "default" | "danger";

export interface ModalProps {
  visible: boolean;
  onRequestClose: () => void;
  variant?: ModalVariant;
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Modal({
  visible,
  onRequestClose,
  variant = "default",
  title,
  icon,
  children,
  footer,
  style,
}: ModalProps) {
  const { t } = useTranslation("common");

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      {/* El teclado no lo evita nadie solo: en iOS la ventana del modal no se
          ajusta, así que el contenedor entero se eleva con él. En Android la
          ventana de RNModal ya redimensiona (adjustResize) y este KAV no hace
          nada (behavior undefined). */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <View style={[styles.surface, style]} accessibilityViewIsModal>
          {variant === "danger" ? (
            <View style={styles.dangerHeader}>
              {icon ? <View style={styles.dangerIconCircle}>{icon}</View> : null}
              {title ? (
                <Text style={styles.dangerTitle} accessibilityRole="header">
                  {title}
                </Text>
              ) : null}
            </View>
          ) : title ? (
            <View style={styles.header}>
              <Text style={styles.title} accessibilityRole="header">
                {title}
              </Text>
              <Pressable
                onPress={onRequestClose}
                style={styles.closeButton}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={t("a11y.close")}
              >
                <Ionicons
                  name="close"
                  size={Theme.typography.size.lg}
                  color={Theme.colors.textSecondary}
                />
              </Pressable>
            </View>
          ) : null}

          <View
            style={[
              styles.body,
              variant === "danger" && styles.dangerBody,
            ]}
          >
            {children}
          </View>

          {footer ? (
            <View
              style={[
                styles.footer,
                variant === "danger" && styles.dangerFooter,
              ]}
            >
              {footer}
            </View>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
}
