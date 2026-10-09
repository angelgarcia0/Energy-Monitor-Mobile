import { zodResolver } from "@hookform/resolvers/zod";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm, useWatch } from "react-hook-form";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { Modal } from "@/components/Modal/Modal";
import { Theme } from "@/constants/theme";
import { sortHomeTypes } from "@/features/shared/homeTypes";
import type { HomeType } from "@/services/home";
import {
  createHomeSchema,
  sanitizeAddress,
  type CreateHomeFormValues,
} from "../../validation/createHomeSchema";
import { styles } from "./CreateHomeModal.styles";

export interface CreateHomeModalProps {
  visible: boolean;
  /** Catálogo de `GET /home-types`, sin ordenar. */
  types: HomeType[];
  submitting?: boolean;
  /** Mensaje ya traducido de la última llamada fallida. */
  serverError?: string | null;
  onClose: () => void;
  /** Devuelve `true` si el hogar se creó: el modal solo se cierra en ese caso. */
  onSubmit: (values: CreateHomeFormValues) => Promise<boolean>;
}

const DEFAULT_VALUES: CreateHomeFormValues = {
  name: "",
  homeType: "",
  address: "",
  description: "",
};

export function CreateHomeModal({
  visible,
  types,
  submitting = false,
  serverError,
  onClose,
  onSubmit,
}: CreateHomeModalProps) {
  const { t } = useTranslation("createHomeModal");
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
  const address = useWatch({ control, name: "address" });

  const sortedTypes = sortHomeTypes(types);

  const handleClose = () => {
    reset();
    onClose();
  };

  const submit = async (data: CreateHomeFormValues) => {
    if (await onSubmit(data)) handleClose();
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={handleClose}
      title={t("title")}
      footer={
        <>
          <Button variant="secondary" onPress={handleClose} disabled={submitting}>
            {t("buttons.cancel")}
          </Button>
          <Button
            variant="primary"
            onPress={handleSubmit(submit)}
            disabled={submitting || sortedTypes.length === 0}
          >
            {submitting ? t("buttons.creating") : t("buttons.create")}
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
              label={t("fields.name")}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t("placeholders.name")}
              maxLength={50}
              autoCapitalize="sentences"
            />
          )}
        />
        {errors.name ? <Text style={styles.error}>{errors.name.message}</Text> : null}

        <View style={styles.field}>
          <Text style={styles.label}>{t("fields.type")}</Text>
          <Controller
            control={control}
            name="homeType"
            render={({ field: { value, onChange } }) => (
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={value}
                  onValueChange={(next) => onChange(String(next))}
                  mode="dropdown"
                  enabled={!submitting}
                  style={styles.picker}
                  dropdownIconColor={Theme.colors.textSecondary}
                >
                  <Picker.Item
                    label={t("placeholders.type")}
                    value=""
                    color={Theme.colors.textSecondary}
                  />
                  {sortedTypes.map((type) => (
                    <Picker.Item
                      key={type.idHomeType}
                      label={t(`homeTypes.${type.name}`, { defaultValue: type.name })}
                      value={type.idHomeType}
                      color={Theme.colors.textPrimary}
                    />
                  ))}
                </Picker>
              </View>
            )}
          />
        </View>
        {errors.homeType ? <Text style={styles.error}>{errors.homeType.message}</Text> : null}
        {sortedTypes.length === 0 ? (
          <Text style={styles.error}>{t("errors.noTypesAvailable")}</Text>
        ) : null}

        <Controller
          control={control}
          name="address"
          render={({ field: { value, onChange, onBlur } }) => (
            <View style={styles.field}>
              <Input
                label={t("fields.address")}
                value={value}
                onChangeText={(text) => onChange(sanitizeAddress(text))}
                onBlur={onBlur}
                placeholder={t("placeholders.address")}
                maxLength={200}
                autoCapitalize="words"
              />
              <View style={styles.helperRow}>
                <Text style={styles.examples}>{t("fields.addressExamples")}</Text>
                <Text style={styles.counter}>{address.length}/200</Text>
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
                label={`${t("fields.description")} ${t("fields.optional")}`}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t("placeholders.description")}
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

        {serverError ? (
          <Text style={styles.error} accessibilityRole="alert">
            {serverError}
          </Text>
        ) : null}
      </ScrollView>
    </Modal>
  );
}