import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, TextInput, View, ViewStyle } from "react-native";

import { styles } from "./OtpInput.styles";

export interface OtpInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function OtpInput({
  length = 6,
  value = "",
  onChange,
  onComplete,
  disabled = false,
  style,
}: OtpInputProps) {
  const { t } = useTranslation("common");
  const refs = useRef<Array<TextInput | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/\D/g, "");
    const chars = value.split("");

    if (digit === "") {
      chars[index] = "";
      onChange?.(chars.join(""));
      return;
    }

    // Un código pegado o autocompletado llega entero en un solo campo: se reparte desde ahí.
    const pasted = digit.length > 1 ? digit.slice(0, length - index) : digit.charAt(0);
    pasted.split("").forEach((char, offset) => {
      chars[index + offset] = char;
    });
    const joined = chars.join("").slice(0, length);
    onChange?.(joined);

    const next = index + pasted.length;
    if (joined.length === length) {
      onComplete?.(joined);
    } else if (next < length) {
      refs.current[next]?.focus();
    }
  };

  const handleKeyPress = (
    event: { nativeEvent: { key: string } },
    index: number,
  ) => {
    if (event.nativeEvent.key === "Backspace" && !value[index] && index > 0) {
      const chars = value.split("");
      chars[index - 1] = "";
      onChange?.(chars.join(""));
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length }, (_, index) => (
        <TextInput
          key={index}
          ref={(element) => {
            refs.current[index] = element;
          }}
          value={value[index] ?? ""}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(event) => handleKeyPress(event, index)}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex((prev) => (prev === index ? -1 : prev))}
          editable={!disabled}
          maxLength={index === 0 ? length : 1}
          keyboardType="number-pad"
          // El primer campo recibe el código que ofrece el teclado (SMS o correo).
          autoComplete={index === 0 ? "one-time-code" : "off"}
          textContentType={index === 0 ? "oneTimeCode" : "none"}
          accessibilityLabel={t("a11y.otpDigit", { index: index + 1, total: length })}
          selectTextOnFocus
          style={[
            styles.input,
            focusedIndex === index && styles.inputFocused,
            disabled && styles.inputDisabled,
          ]}
        />
      ))}
    </View>
  );
}