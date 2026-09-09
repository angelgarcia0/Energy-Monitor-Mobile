import React, { useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";
import { styles } from "./Input.styles";

export type InputVariant = "default" | "otp";

export interface InputProps extends TextInputProps {
  label?: string;
  variant?: InputVariant;
  icon?: React.ReactNode;
  onIconPress?: () => void;
}

export function Input({
  label,
  variant = "default",
  icon,
  onIconPress,
  style,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

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
          <Pressable onPress={onIconPress} style={styles.icon}>
            {icon}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
