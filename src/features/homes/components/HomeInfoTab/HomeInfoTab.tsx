import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { Theme } from "@/constants/theme";
import { useHomes } from "@/context/HomeContext";
import type { Home } from "@/features/dashboard/components/HomeCard/HomeCard";
import { HOME_TYPE_OPTIONS } from "@/features/dashboard/validation/createHomeSchema";
import { ROLE_BADGE_COLORS } from "../../data/userAvatarColors";
import { getInitials } from "../../data/usersMock";
import { ConfirmHomeActionModal, type ConfirmHomeAction } from "./ConfirmHomeActionModal";
import { styles } from "./HomeInfoTab.styles";

export interface HomeInfoTabProps {
  home: Home;
  isOwner: boolean;
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldValue}>{children}</View>
    </View>
  );
}

function getHomeTypeLabel(home: Home) {
  const option = HOME_TYPE_OPTIONS.find((item) => item.value === home.homeTypeId);
  if (!option) return "";
  if (option.value === "other" && home.otherHomeType) return home.otherHomeType;
  return option.label;
}

export function HomeInfoTab({ home, isOwner }: HomeInfoTabProps) {
  const router = useRouter();
  const { removeHome } = useHomes();
  const [confirmAction, setConfirmAction] = useState<ConfirmHomeAction | null>(null);

  const typeLabel = getHomeTypeLabel(home);
  const typeIcon: "home-outline" | "business-outline" =
    home.homeTypeId === "house" ? "home-outline" : "business-outline";
  const ownerColor = ROLE_BADGE_COLORS.owner;

  const handleConfirm = () => {
    if (confirmAction) removeHome(home.id);
    setConfirmAction(null);
    router.replace("/dashboard");
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card>
          <View style={styles.cardTitleRow}>
            <Ionicons
              name="home-outline"
              size={Theme.typography.size.md}
              color={Theme.colors.textPrimary}
            />
            <Text style={styles.cardTitle}>Información del hogar</Text>
          </View>

          <Field label="Nombre">
            <Text style={styles.value}>{home.name || "—"}</Text>
          </Field>

          <Field label="Tipo de hogar">
            {typeLabel ? (
              <View style={styles.typeBadge}>
                <Ionicons
                  name={typeIcon}
                  size={Theme.typography.size.xs}
                  color={Theme.colors.primary}
                />
                <Text style={styles.typeBadgeText}>{typeLabel}</Text>
              </View>
            ) : (
              <Text style={styles.value}>—</Text>
            )}
          </Field>

          <Field label="Dirección">
            <Text style={styles.value}>{home.address || "—"}</Text>
          </Field>

          <Field label="Descripción">
            <Text style={styles.muted}>{home.description || "—"}</Text>
          </Field>

          <Field label="Fecha de creación">
            <Text style={styles.muted}>—</Text>
          </Field>

          {isOwner ? (
            <>
              <View style={styles.divider} />

              <View style={styles.cardTitleRow}>
                <Ionicons
                  name="key-outline"
                  size={Theme.typography.size.sm}
                  color={Theme.colors.textPrimary}
                />
                <Text style={styles.sectionSubtitle}>Código de acceso</Text>
              </View>
              <Text style={styles.hint}>
                Comparte este código para que otros usuarios puedan unirse.
              </Text>

              <View style={styles.codeBox}>
                <Text style={styles.codeText}>——————</Text>
                <Pressable
                  disabled
                  accessibilityRole="button"
                  accessibilityLabel="Copiar código de acceso"
                  style={styles.copyButton}
                >
                  <Ionicons
                    name="copy-outline"
                    size={Theme.typography.size.md}
                    color={Theme.colors.textSecondary}
                  />
                </Pressable>
              </View>
            </>
          ) : null}

          <View style={styles.actionRow}>
            <Button
              variant="danger"
              onPress={() => setConfirmAction(isOwner ? "delete" : "leave")}
              icon={
                <Ionicons
                  name={isOwner ? "trash-outline" : "log-out-outline"}
                  size={Theme.typography.size.md}
                  color={Theme.colors.danger}
                />
              }
            >
              {isOwner ? "Eliminar hogar" : "Salirse del hogar"}
            </Button>
          </View>
        </Card>

        <Card>
          <View style={styles.cardTitleRow}>
            <Ionicons
              name="person-outline"
              size={Theme.typography.size.md}
              color={Theme.colors.textPrimary}
            />
            <Text style={styles.cardTitle}>Usuario responsable</Text>
          </View>

          <View style={styles.ownerRow}>
            <View
              style={[styles.ownerAvatar, { backgroundColor: ownerColor.background }]}
            >
              <Text style={[styles.ownerInitials, { color: ownerColor.text }]}>
                {getInitials(home.userResponsible)}
              </Text>
            </View>
            <View style={styles.ownerMeta}>
              <Text style={styles.ownerName} numberOfLines={1}>
                {home.userResponsible || "—"}
              </Text>
              <View
                style={[styles.ownerBadge, { backgroundColor: ownerColor.background }]}
              >
                <Text style={[styles.ownerBadgeText, { color: ownerColor.text }]}>
                  Responsable
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <Field label="Correo">
            <View style={styles.valueWithIcon}>
              <Ionicons
                name="mail-outline"
                size={Theme.typography.size.xs}
                color={Theme.colors.textSecondary}
              />
              <Text style={styles.muted}>—</Text>
            </View>
          </Field>

          <Field label="Teléfono">
            <View style={styles.valueWithIcon}>
              <Ionicons
                name="call-outline"
                size={Theme.typography.size.xs}
                color={Theme.colors.textSecondary}
              />
              <Text style={styles.muted}>—</Text>
            </View>
          </Field>
        </Card>
      </ScrollView>

      {confirmAction ? (
        <ConfirmHomeActionModal
          visible
          mode={confirmAction}
          onCancel={() => setConfirmAction(null)}
          onConfirm={handleConfirm}
        />
      ) : null}
    </>
  );
}