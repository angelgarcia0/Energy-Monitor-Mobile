import { Ionicons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Alert } from "@/components/Alert/Alert";
import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { Header } from "@/components/Header/Header";
import { Theme } from "@/constants/theme";
import { useUser } from "@/context/UserContext";
import { authApi } from "@/services/auth";
import { errorMessage } from "@/services/http/errorMessages";
import { AvatarSection } from "../../components/AvatarSection/AvatarSection";
import { ChangePasswordModal } from "../../components/ChangePasswordModal/ChangePasswordModal";
import { DeleteAccountModal } from "../../components/DeleteAccountModal/DeleteAccountModal";
import {
  EditProfileModal,
  type EditableField,
} from "../../components/EditProfileModal/EditProfileModal";
import { ProfileField } from "../../components/ProfileField/ProfileField";
import { styles } from "./AccountScreen.styles";

const MASKED_PASSWORD = "••••••••";
const SUCCESS_TIMEOUT = 2500;
const ERROR_TIMEOUT = 5000;

export function AccountScreen() {
  const { t } = useTranslation("account");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    refresh,
    updateName,
    updateLastName,
    updateEmail,
    updateAvatar,
  } = useUser();

  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage_, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), SUCCESS_TIMEOUT);
    return () => clearTimeout(timer);
  }, [successMessage]);

  useEffect(() => {
    if (!errorMessage_) return;
    const timer = setTimeout(() => setErrorMessage(null), ERROR_TIMEOUT);
    return () => clearTimeout(timer);
  }, [errorMessage_]);

  // El perfil se relee al abrirlo, igual que el ProtectedRoute de la Web: el
  // nombre, la foto y el correo pueden haber cambiado en otra sesión.
  useEffect(() => {
    refresh().catch(() => {});
  }, [refresh]);

  const showSuccess = (message: string) => setSuccessMessage(message);

  /** Envuelve una acción del backend: éxito con mensaje o error visible. */
  const run = async (action: () => Promise<unknown>, success?: string) => {
    try {
      await action();
      if (success) showSuccess(success);
    } catch (error) {
      setErrorMessage(errorMessage(t, error));
    }
  };

  const handleEditSubmit = async (field: EditableField, value: string) => {
    if (field === "name") {
      await run(() => updateName(value), t("success.nameUpdated"));
      return;
    }

    if (field === "lastName") {
      await run(() => updateLastName(value), t("success.lastNameUpdated"));
      return;
    }

    await run(() => updateEmail(value), t("success.emailUpdated"));
  };

  const handleDeleteAccount = async (password: string) => {
    try {
      await authApi.deleteAccount(password);
      setDeleteModalOpen(false);
      router.replace("/" as Href);
    } catch (error) {
      setErrorMessage(errorMessage(t, error, "accountDelete"));
    }
  };

  const handlePasswordChange = async (values: {
    currentPassword: string;
    newPassword: string;
  }) => {
    try {
      await authApi.changePassword(values);
      setPasswordModalOpen(false);
      showSuccess(t("success.passwordUpdated"));
    } catch (error) {
      setErrorMessage(errorMessage(t, error, "passwordChange"));
    }
  };

  const editingInitialValue =
    editingField === "name"
      ? user.name
      : editingField === "lastName"
        ? user.lastName
        : user.email;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top, Theme.spacing.md) },
      ]}
    >
      <StatusBar style="auto" />

      <Header
        breadcrumbItems={[
          {
            label: t("breadcrumb.home"),
            onPress: () => router.push("/dashboard" as Href),
          },
          { label: t("breadcrumb.current") },
        ]}
        style={styles.header}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {successMessage ? (
          <Alert
            variant="success"
            title={successMessage}
            icon={
              <Ionicons
                name="checkmark-circle"
                size={Theme.typography.size.xl}
                color={Theme.colors.successText}
              />
            }
          />
        ) : null}

        {errorMessage_ ? (
          <Alert
            variant="danger"
            title={errorMessage_}
            icon={
              <Ionicons
                name="alert-circle"
                size={Theme.typography.size.xl}
                color={Theme.colors.dangerText}
              />
            }
          />
        ) : null}

        <Card style={styles.card}>
          <AvatarSection
            avatarUri={user.avatarUri}
            onPickAvatar={(dataUrl) =>
              run(() => updateAvatar(dataUrl), t("success.avatarUpdated"))
            }
            onRemoveAvatar={() =>
              run(() => updateAvatar(null), t("success.avatarRemoved"))
            }
            onPermissionDenied={() =>
              setErrorMessage(t("permissions.photoDenied"))
            }
          />

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("personalData")}</Text>

            <ProfileField
              label={t("name")}
              value={user.name}
              editAccessibilityLabel={t("edit", { label: t("name").toLowerCase() })}
              onEdit={() => setEditingField("name")}
            />
            <View style={styles.divider} />

            <ProfileField
              label={t("lastName")}
              value={user.lastName}
              editAccessibilityLabel={t("edit", {
                label: t("lastName").toLowerCase(),
              })}
              onEdit={() => setEditingField("lastName")}
            />

            <ProfileField
              label={t("email")}
              value={user.email}
              editAccessibilityLabel={t("edit", { label: t("email").toLowerCase() })}
              onEdit={() => setEditingField("email")}
            />
            <View style={styles.divider} />

            <ProfileField
              label={t("password")}
              value={MASKED_PASSWORD}
              editAccessibilityLabel={t("edit", { label: t("password").toLowerCase() })}
              onEdit={() => setPasswordModalOpen(true)}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.deleteSection}>
            <Text style={styles.deleteQuestion}>{t("deleteQuestion")}</Text>
            <Button
              variant="secondary"
              onPress={() => setDeleteModalOpen(true)}
            >
              {/* Button no expone color de texto: se pasa un Text propio para
                  poder pintar la etiqueta en danger como en el web. */}
              <Text style={styles.deleteButtonText}>
                {t("deleteAccount.confirm")}
              </Text>
            </Button>
          </View>
        </Card>
      </ScrollView>

      {editingField ? (
        <EditProfileModal
          visible
          field={editingField}
          initialValue={editingInitialValue}
          onClose={() => setEditingField(null)}
          onSubmit={handleEditSubmit}
        />
      ) : null}

      {passwordModalOpen ? (
        <ChangePasswordModal
          visible
          onClose={() => setPasswordModalOpen(false)}
          onSubmit={handlePasswordChange}
        />
      ) : null}

      {deleteModalOpen ? (
        <DeleteAccountModal
          visible
          onCancel={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteAccount}
        />
      ) : null}
    </View>
  );
}