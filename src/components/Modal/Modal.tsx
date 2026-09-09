import React from "react";
import {
  Modal as RNModal,
  Pressable,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
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
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.surface, style]}>
          {variant === "danger" ? (
            <View style={styles.dangerHeader}>
              {icon ? <View style={styles.dangerIconCircle}>{icon}</View> : null}
              {title ? <Text style={styles.dangerTitle}>{title}</Text> : null}
            </View>
          ) : title ? (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <Pressable onPress={onRequestClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
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
      </View>
    </RNModal>
  );
}
