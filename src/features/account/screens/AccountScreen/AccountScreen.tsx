import { Ionicons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Alert } from "@/components/Alert/Alert";
import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { Header } from "@/components/Header/Header";
import { Theme } from "@/constants/theme";
import { useUser } from "@/context/UserContext";
import { AvatarSection } from "../../components/AvatarSection/AvatarSection";
import { ChangePasswordModal } from "../../components/ChangePasswordModal/ChangePasswordModal";
import { DeleteAccountModal } from "../../components/DeleteAccountModal/DeleteAccountModal";
import {
  EditProfileModal,
  type EditableField,
} from "../../components/EditProfileModal/EditProfileModal";
import { ProfileField } from "../../components/ProfileField/ProfileField";
import { styles } from "./AccountScreen.styles";

const NO_PHONE_LABEL = "No tienes en el momento";
const MASKED_PASSWORD = "••••••••";
const SUCCESS_TIMEOUT = 2500;

export function AccountScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, updateName, updateEmail, updatePhone, updateAvatar, resetUser } =
    useUser();

  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), SUCCESS_TIMEOUT);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const showSuccess = (message: string) => setSuccessMessage(message);

  const handleEditSubmit = (field: EditableField, value: string) => {
    if (field === "name") {
      updateName(value);
      showSuccess("Nombre actualizado");
      return;
    }

    if (field === "email") {
      updateEmail(value);
      showSuccess("Correo actualizado");
      return;
    }

    // Vacío = quitar el teléfono.
    updatePhone(value === "" ? null : value);
    showSuccess(value === "" ? "Teléfono eliminado" : "Teléfono actualizado");
  };

  const handleDeleteAccount = () => {
    // TODO: llamar al endpoint de eliminación cuando exista backend.
    resetUser();
    setDeleteModalOpen(false);
    router.replace("/" as Href);
  };

  const editingInitialValue =
    editingField === "name"
      ? user.name
      : editingField === "email"
        ? user.email
        : (user.phone ?? "");

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
          { label: "Inicio", onPress: () => router.push("/dashboard" as Href) },
          { label: "Mi cuenta" },
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

        <Card style={styles.card}>
          <AvatarSection
            avatarUri={user.avatarUri}
            onPickAvatar={(uri) => {
              updateAvatar(uri);
              showSuccess("Foto de perfil actualizada");
            }}
            onRemoveAvatar={() => {
              updateAvatar(null);
              showSuccess("Foto de perfil eliminada");
            }}
            onPermissionDenied={() =>
              showSuccess(
                "Necesitamos permiso de la galería para agregar una foto",
              )
            }
          />

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Datos personales</Text>

            <ProfileField
              label="Nombre"
              value={user.name}
              onEdit={() => setEditingField("name")}
            />
            <View style={styles.divider} />

            <ProfileField
              label="Correo"
              value={user.email}
              onEdit={() => setEditingField("email")}
            />
            <View style={styles.divider} />

            <ProfileField
              label="Teléfono"
              value={user.phone ?? NO_PHONE_LABEL}
              onEdit={() => setEditingField("phone")}
            />
            <View style={styles.divider} />

            <ProfileField
              label="Contraseña"
              value={MASKED_PASSWORD}
              onEdit={() => setPasswordModalOpen(true)}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.deleteSection}>
            <Text style={styles.deleteQuestion}>¿Deseas eliminar tu cuenta?</Text>
            <Button
              variant="secondary"
              onPress={() => setDeleteModalOpen(true)}
            >
              {/* Button no expone color de texto: se pasa un Text propio para
                  poder pintar la etiqueta en danger como en el web. */}
              <Text style={styles.deleteButtonText}>Eliminar cuenta</Text>
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
          onSubmit={() => {
            setPasswordModalOpen(false);
            showSuccess("Contraseña actualizada");
          }}
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
