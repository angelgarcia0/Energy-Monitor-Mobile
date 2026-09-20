import { zodResolver } from "@hookform/resolvers/zod";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { Modal } from "@/components/Modal/Modal";
import { Theme } from "@/constants/theme";
import {
  createHomeSchema,
  HOME_TYPE_OPTIONS,
  sanitizeAddress,
  type CreateHomeFormValues,
} from "../../validation/createHomeSchema";
import { styles } from "./CreateHomeModal.styles";

export interface CreateHomeModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: CreateHomeFormValues) => void;
}

const DEFAULT_VALUES: CreateHomeFormValues = {
  name: "",
  homeType: "",
  otherType: "",
  address: "",
  description: "",
};

export function CreateHomeModal({ visible, onClose, onSubmit }: CreateHomeModalProps) {
  const { height } = useWindowDimensions();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateHomeFormValues>({
    resolver: zodResolver(createHomeSchema),
    defaultValues: DEFAULT_VALUES,
  });
  const homeType = useWatch({ control, name: "homeType" });

  const handleClose = () => {
    reset();
    onClose();
  };

  const submit = (data: CreateHomeFormValues) => {
    onSubmit(data);
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={handleClose}
      title="Crear hogar"
      footer={
        <>
          <Button variant="secondary" onPress={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onPress={handleSubmit(submit)}>
            Crear hogar
          </Button>
        </>
      }
    >
      <ScrollView
        style={{ maxHeight: height * 0.55 }}
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
      >
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              label="Nombre del hogar"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Ej: Mi hogar, Oficina central..."
              maxLength={50}
              autoCapitalize="sentences"
            />
          )}
        />
        {errors.name ? <Text style={styles.error}>{errors.name.message}</Text> : null}

        <View style={styles.field}>
          <Text style={styles.label}>Tipo de hogar</Text>
          <Controller
            control={control}
            name="homeType"
            render={({ field: { value, onChange } }) => (
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={value}
                  onValueChange={(next) => onChange(String(next))}
                  mode="dropdown"
                  style={styles.picker}
                  dropdownIconColor={Theme.colors.textSecondary}
                >
                  <Picker.Item label="Selecciona un tipo..." value="" color={Theme.colors.textSecondary} />
                  {HOME_TYPE_OPTIONS.map((option) => (
                    <Picker.Item key={option.value} label={option.label} value={option.value} color={Theme.colors.textPrimary} />
                  ))}
                </Picker>
              </View>
            )}
          />
        </View>
        {errors.homeType ? <Text style={styles.error}>{errors.homeType.message}</Text> : null}

        {homeType === "other" ? (
          <>
            <Controller
              control={control}
              name="otherType"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="¿Cuál?"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Describe el tipo de hogar..."
                  maxLength={50}
                  autoCapitalize="sentences"
                />
              )}
            />
            {errors.otherType ? <Text style={styles.error}>{errors.otherType.message}</Text> : null}
          </>
        ) : null}

        <Controller
          control={control}
          name="address"
          render={({ field: { value, onChange, onBlur } }) => (
            <View style={styles.field}>
              <Input
                label="Dirección"
                value={value}
                onChangeText={(text) => onChange(sanitizeAddress(text))}
                onBlur={onBlur}
                placeholder="Ej: Calle 45 # 12-34, Bogotá"
                maxLength={200}
                autoCapitalize="words"
              />
              <View style={styles.helperRow}>
                <Text style={styles.examples}>
                  Ej: Cra. 15 # 93-47, Calle 100 # 15-20, Vereda El Bosque Finca La Esperanza
                </Text>
                <Text style={styles.counter}>{value.length}/200</Text>
              </View>
            </View>
          )}
        />
        {errors.address ? <Text style={styles.error}>{errors.address.message}</Text> : null}

        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange, onBlur } }) => (
            <View style={styles.field}>
              <Input
                label="Descripción (opcional)"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Describe brevemente el hogar..."
                maxLength={200}
                multiline
                autoCapitalize="sentences"
                style={styles.textarea}
              />
              <Text style={styles.counter}>{value.length} / 200</Text>
            </View>
          )}
        />
        {errors.description ? <Text style={styles.error}>{errors.description.message}</Text> : null}
      </ScrollView>
    </Modal>
  );
}
