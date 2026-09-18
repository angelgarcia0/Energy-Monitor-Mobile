import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { Modal } from "@/components/Modal/Modal";
import { Theme } from "@/constants/theme";
import {
  JOIN_CODE_LENGTH,
  joinHomeSchema,
  sanitizeJoinCode,
  type JoinHomeFormValues,
} from "../../validation/joinHomeSchema";
import { styles } from "./JoinHomeModal.styles";

export interface JoinHomeModalProps {
  visible: boolean;
  onClose: () => void;
}

export function JoinHomeModal({ visible, onClose }: JoinHomeModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JoinHomeFormValues>({
    resolver: zodResolver(joinHomeSchema),
    defaultValues: { code: "" },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: JoinHomeFormValues) => {
    // TODO: persistir cuando exista HomeContext/backend
    console.log("Unirse a hogar:", data);
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={handleClose}
      title="Unirse a hogar"
      footer={
        <>
          <Button variant="secondary" onPress={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onPress={handleSubmit(onSubmit)}>
            Unirme
          </Button>
        </>
      }
    >
      <View style={styles.body}>
        <View style={styles.iconCircle}>
          <Ionicons name="key-outline" size={Theme.typography.size.xl} color={Theme.colors.primary} />
        </View>

        <Text style={styles.description}>
          Ingresa el código alfanumérico que te compartió el responsable del hogar.
        </Text>

        <Controller
          control={control}
          name="code"
          render={({ field: { value, onChange, onBlur } }) => (
            <View style={styles.field}>
              <Input
                label="Código de acceso"
                value={value}
                onChangeText={(text) => onChange(sanitizeJoinCode(text))}
                onBlur={onBlur}
                placeholder="Ej: AB12CD34"
                maxLength={JOIN_CODE_LENGTH}
                autoCapitalize="characters"
              />
              <Text style={styles.counter}>
                {value.length}/{JOIN_CODE_LENGTH}
              </Text>
            </View>
          )}
        />
        {errors.code ? <Text style={styles.error}>{errors.code.message}</Text> : null}

        <Text style={styles.hint}>
          El código tiene 8 caracteres entre letras mayúsculas y números.
        </Text>
      </View>
    </Modal>
  );
}
