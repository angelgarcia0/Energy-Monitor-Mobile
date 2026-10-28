import React, { useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";
import { styles } from "./Input.styles";

export type InputVariant = "default" | "otp";

export interface InputProps extends TextInputProps {
  label?: string;
  variant?: InputVariant;
  icon?: React.ReactNode;
  onIconPress?: () => void;
  /** Lo que hace el botón del ícono (p. ej. "Mostrar contraseña"); el ícono solo no se lee. */
  iconAccessibilityLabel?: string;
  /** Ayuda que sigue visible al escribir (p. ej. las reglas de la contraseña), a diferencia del placeholder. */
  hint?: string;
}

export function Input({
  label,
  variant = "default",
  icon,
  onIconPress,
  iconAccessibilityLabel,
  hint,
  style,
  onFocus,
  onBlur,
  accessibilityLabel,
  accessibilityHint,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {/* La etiqueta visible se repite como nombre accesible del campo: un lector de pantalla
          no la asocia sola, y el placeholder desaparece al escribir. */}
      {label ? (
        <Text style={styles.label} importantForAccessibility="no" accessibilityElementsHidden>
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.wrapper,
          variant === "otp" ? styles.wrapperOtp : styles.wrapperDefault,
          focused && variant !== "otp" && styles.wrapperFocused,
        ]}
      >
        <TextInput
          style={[
            styles.input,
            variant === "otp" && styles.inputOtp,
            style,
          ]}
          placeholderTextColor={styles.placeholder.color}
          spellCheck={false}
          autoCorrect={false}
          autoCapitalize="none"
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityHint={hint ?? accessibilityHint}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />

        {icon ? (
          <Pressable
            onPress={onIconPress}
            style={styles.icon}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={iconAccessibilityLabel}
          >
            {icon}
          </Pressable>
        ) : null}
      </View>

      {hint ? (
        <Text style={styles.hint} importantForAccessibility="no" accessibilityElementsHidden>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
