import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Modal } from "@/components/Modal/Modal";
import { Theme } from "@/constants/theme";
import { styles } from "./SelectField.styles";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  label?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  /** Texto mostrado mientras `value` no coincida con ninguna opción. */
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Selector con lista propia en lugar del `Picker` nativo.
 *
 * El desplegable de Android lo pinta el sistema: en modo oscuro sale un diálogo
 * negro, mientras los textos llevan el color de la paleta activa de la app (que
 * se elige en Ajustes y no sigue al modo del sistema), y las opciones quedan
 * ilegibles. Aquí la lista se pinta con los mismos tokens que el resto de
 * pantallas, así se ve bien con cualquier tema de la app y cualquier modo del
 * teléfono.
 */
export function SelectField({
  label,
  value,
  options,
  onChange,
  placeholder,
  disabled = false,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <Pressable
        onPress={() => setOpen(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        accessibilityLabel={label}
        style={({ pressed }) => [
          styles.field,
          pressed && styles.fieldPressed,
          disabled && styles.fieldDisabled,
        ]}
      >
        <Text style={[styles.value, !selected && styles.placeholder]} numberOfLines={1}>
          {selected?.label ?? placeholder ?? ""}
        </Text>
        <Ionicons
          name="chevron-down"
          size={Theme.typography.size.md}
          color={Theme.colors.textSecondary}
        />
      </Pressable>

      <Modal
        visible={open}
        onRequestClose={() => setOpen(false)}
        title={label}
      >
        <ScrollView style={styles.list} bounces={false} showsVerticalScrollIndicator={false}>
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <Pressable
                key={option.value}
                onPress={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                style={({ pressed }) => [
                  styles.option,
                  isSelected && styles.optionSelected,
                  pressed && styles.optionPressed,
                ]}
              >
                <Text
                  style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}
                  numberOfLines={2}
                >
                  {option.label}
                </Text>
                {isSelected ? (
                  <Ionicons
                    name="checkmark"
                    size={Theme.typography.size.md}
                    color={Theme.colors.primary}
                  />
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>
      </Modal>
    </View>
  );
}
