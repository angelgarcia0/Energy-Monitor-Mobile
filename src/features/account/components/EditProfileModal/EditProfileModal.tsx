import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  useWindowDimensions,
} from "react-native";
import { z } from "zod";

import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { Modal } from "@/components/Modal/Modal";
import {
  accountEmailSchema,
  accountNameSchema,
  accountPhoneSchema,
} from "../../validation/accountSchemas";
import { styles } from "./EditProfileModal.styles";

export type EditableField = "name" | "email" | "phone";

export interface EditProfileModalProps {
  visible: boolean;
  field: EditableField;
  initialValue: string;
  onClose: () => void;
  onSubmit: (field: EditableField, value: string) => void;
}

interface FormValues {
  value: string;
}

const FIELD_CONFIG: Record<
  EditableField,
  {
    title: string;
    label: string;
    placeholder: string;
    keyboardType: "default" | "email-address" | "phone-pad";
    autoCapitalize: "none" | "sentences" | "words";
    schema: z.ZodObject<{ value: z.ZodString }>;
  }
> = {
  name: {
    title: "Editar nombre",
    label: "Nombre",
    placeholder: "Ej: Juan Esteban",
    keyboardType: "default",
    autoCapitalize: "words",
    schema: z.object({ value: accountNameSchema.shape.name }),
  },
  email: {
    title: "Editar correo",
    label: "Correo",
    placeholder: "Ej: tucorreo@ejemplo.com",
    keyboardType: "email-address",
    autoCapitalize: "none",
    schema: z.object({ value: accountEmailSchema.shape.email }),
  },
  phone: {
    title: "Editar teléfono",
    label: "Teléfono",
    placeholder: "Ej: 3001234567",
    keyboardType: "phone-pad",
    autoCapitalize: "none",
    schema: z.object({ value: accountPhoneSchema.shape.phone }),
  },
};

export function EditProfileModal({
  visible,
  field,
  initialValue,
  onClose,
  onSubmit,
}: EditProfileModalProps) {
  const { height } = useWindowDimensions();
  const config = FIELD_CONFIG[field];

  const schema = useMemo(() => config.schema, [config.schema]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { value: initialValue },
  });

  useEffect(() => {
    if (visible) reset({ value: initialValue });
  }, [visible, initialValue, reset, field]);

  const submit = (values: FormValues) => {
    onSubmit(field, values.value.trim());
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      title={config.title}
      footer={
        <>
          <Button variant="secondary" onPress={onClose}>
            Cancelar
          </Button>
          <Button onPress={handleSubmit(submit)}>Guardar</Button>
        </>
      }
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ maxHeight: height * 0.4 }}
          keyboardShouldPersistTaps="handled"
        >
          <Controller
            control={control}
            name="value"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label={config.label}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={config.placeholder}
                keyboardType={config.keyboardType}
                autoCapitalize={config.autoCapitalize}
                autoComplete={field === "email" ? "email" : "off"}
              />
            )}
          />
          {errors.value ? (
            <Text style={styles.error}>{errors.value.message}</Text>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
