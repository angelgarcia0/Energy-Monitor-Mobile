import React, { useRef, useState } from "react";
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

    chars[index] = digit.charAt(0);
    const joined = chars.join("");
    onChange?.(joined);

    if (joined.length === length) {
      onComplete?.(joined);
    } else if (index < length - 1) {
      refs.current[index + 1]?.focus();
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
          maxLength={1}
          keyboardType="number-pad"
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