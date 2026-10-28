import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
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
  accountLastNameSchema,
  accountNameSchema,
} from "../../validation/accountSchemas";
import { styles } from "./EditProfileModal.styles";

export type EditableField = "name" | "lastName" | "email";

export interface EditProfileModalProps {
  visible: boolean;
  field: EditableField;
  initialValue: string;
  onClose: () => void;
  onSubmit: (field: EditableField, value: string) => Promise<void> | void;
}

interface FormValues {
  value: string;
}

const FIELD_CONFIG: Record<
  EditableField,
  {
    titleKey: string;
    labelKey: string;
    placeholderKey: string;
    keyboardType: "default" | "email-address";
    autoCapitalize: "none" | "sentences" | "words";
    schema: z.ZodObject<{ value: z.ZodString }>;
  }
> = {
  name: {
    titleKey: "editField.nameTitle",
    labelKey: "name",
    placeholderKey: "editField.placeholderName",
    keyboardType: "default",
    autoCapitalize: "words",
    schema: z.object({ value: accountNameSchema.shape.name }),
  },
  lastName: {
    titleKey: "editField.lastNameTitle",
    labelKey: "lastName",
    placeholderKey: "editField.placeholderLastName",
    keyboardType: "default",
    autoCapitalize: "words",
    schema: z.object({ value: accountLastNameSchema.shape.lastName }),
  },
  email: {
    titleKey: "editField.emailTitle",
    labelKey: "email",
    placeholderKey: "editField.placeholderEmail",
    keyboardType: "email-address",
    autoCapitalize: "none",
    schema: z.object({ value: accountEmailSchema.shape.email }),
  },
};

export function EditProfileModal({
  visible,
  field,
  initialValue,
  onClose,
  onSubmit,
}: EditProfileModalProps) {
  const { t } = useTranslation("account");
  const { height } = useWindowDimensions();
  const config = FIELD_CONFIG[field];

  const schema = useMemo(() => config.schema, [config.schema]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { value: initialValue },
  });

  useEffect(() => {
    if (visible) reset({ value: initialValue });
  }, [visible, initialValue, reset, field]);

  // El modal se cierra solo si el backend aceptó el cambio; si lo rechaza, quien
  // llama muestra el error y el formulario sigue abierto con lo escrito.
  const submit = async (values: FormValues) => {
    await onSubmit(field, values.value.trim());
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      title={t(config.titleKey)}
      footer={
        <>
          <Button variant="secondary" onPress={onClose}>
            {t("deleteAccount.cancel")}
          </Button>
          <Button disabled={isSubmitting} onPress={handleSubmit(submit)}>
            {t("editField.save")}
          </Button>
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
                label={t(config.labelKey)}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t(config.placeholderKey)}
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
