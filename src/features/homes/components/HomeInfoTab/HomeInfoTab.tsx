import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { Theme } from "@/constants/theme";
import { useHomes } from "@/context/HomeContext";
import { homeTypeLabel } from "@/features/shared/homeTypes";
import { errorMessage } from "@/services/http";
import type { HomeMembership } from "@/services/home";
import { getInitials } from "../../data/initials";
import { getRoleBadgeColor } from "../../data/userAvatarColors";
import { ConfirmHomeActionModal } from "./ConfirmHomeActionModal";
import { styles } from "./HomeInfoTab.styles";

export interface HomeInfoTabProps {
  home: HomeMembership;
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

/** `2026-10-08T…` → `08 oct 2026`, en el idioma activo. */
function formatDate(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function HomeInfoTab({ home, isOwner }: HomeInfoTabProps) {
  const { t } = useTranslation("home");
  const { homeTypes, leaveHome } = useHomes();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [leaveError, setLeaveError] = useState<string | null>(null);

  const typeLabel = homeTypeLabel(t, home.homeTypeId, homeTypes);
  // El backend manda el nombre del tipo; el ícono se elige por el id del seed.
  const typeIcon: "home-outline" | "business-outline" =
    ["hous000001", "coun000001", "cabi000001"].includes(home.homeTypeId)
      ? "home-outline"
      : "business-outline";
  const ownerColor = getRoleBadgeColor("OWNER");

  const responsibleName = [home.userResponsible, home.userResponsibleLastName]
    .filter(Boolean)
    .join(" ");

  const handleConfirmLeave = async () => {
    setConfirming(false);
    setLeaving(true);
    setLeaveError(null);
    try {
      const err = await leaveHome(home.idHome);
      if (err) {
        setLeaveError(errorMessage(t, err, "homeLeave"));
        return;
      }
      router.replace("/dashboard");
    } finally {
      setLeaving(false);
    }
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
            <Text style={styles.cardTitle}>{t("title.homeInfo")}</Text>
          </View>

          <Field label={t("fields.name")}>
            <Text style={styles.value}>{home.name || t("placeholders.empty")}</Text>
          </Field>

          <Field label={t("fields.homeType")}>
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
              <Text style={styles.value}>{t("placeholders.empty")}</Text>
            )}
          </Field>

          <Field label={t("fields.address")}>
            <Text style={styles.value}>
              {home.address || t("placeholders.empty")}
            </Text>
          </Field>

          <Field label={t("fields.description")}>
            <Text style={styles.muted}>
              {home.description || t("placeholders.empty")}
            </Text>
          </Field>

          <Field label={t("fields.creationDate")}>
            <Text style={styles.muted}>
              {formatDate(home.creationDate) || t("placeholders.empty")}
            </Text>
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
                <Text style={styles.sectionSubtitle}>
                  {t("title.accessCode")}
                </Text>
              </View>
              <Text style={styles.hint}>{t("hints.accessCode")}</Text>

              <View style={styles.codeBox}>
                <Text style={styles.codeText}>
                  {home.accessCode || t("placeholders.noCode")}
                </Text>
                {/* Copiar necesita `expo-clipboard`, que no está en el proyecto:
                    hasta que se agregue, el código se lee pero no se copia. */}
                <Pressable
                  disabled
                  accessibilityRole="button"
                  accessibilityLabel={t("buttons.copy")}
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

          {leaveError ? (
            <Text style={styles.error} accessibilityRole="alert">
              {leaveError}
            </Text>
          ) : null}

          <View style={styles.actionRow}>
            <Button
              variant="danger"
              onPress={() => setConfirming(true)}
              disabled={leaving}
              icon={
                <Ionicons
                  name="log-out-outline"
                  size={Theme.typography.size.md}
                  color={Theme.colors.danger}
                />
              }
            >
              {leaving ? t("buttons.leaving") : t("buttons.leaveHome")}
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
            <Text style={styles.cardTitle}>{t("title.owner")}</Text>
          </View>

          <View style={styles.ownerRow}>
            <View
              style={[styles.ownerAvatar, { backgroundColor: ownerColor.background }]}
            >
              <Text style={[styles.ownerInitials, { color: ownerColor.text }]}>
                {getInitials(responsibleName)}
              </Text>
            </View>
            <View style={styles.ownerMeta}>
              <Text style={styles.ownerName} numberOfLines={1}>
                {responsibleName || t("placeholders.empty")}
              </Text>
              <View
                style={[styles.ownerBadge, { backgroundColor: ownerColor.background }]}
              >
                <Text style={[styles.ownerBadgeText, { color: ownerColor.text }]}>
                  {t("status.responsible")}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <Field label={t("fields.email")}>
            <View style={styles.valueWithIcon}>
              <Ionicons
                name="mail-outline"
                size={Theme.typography.size.xs}
                color={Theme.colors.textSecondary}
              />
              <Text style={styles.muted}>
                {home.userResponsibleEmail || t("placeholders.empty")}
              </Text>
            </View>
          </Field>
        </Card>
      </ScrollView>

      {confirming ? (
        <ConfirmHomeActionModal
          visible
          onCancel={() => setConfirming(false)}
          onConfirm={handleConfirmLeave}
        />
      ) : null}
    </>
  );
}