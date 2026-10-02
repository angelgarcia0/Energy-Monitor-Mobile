import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { Theme } from "@/constants/theme";
import { useHomes } from "@/context/HomeContext";
import type { Home } from "@/features/dashboard/components/HomeCard/HomeCard";
import { getHomeTypeLabel } from "@/features/dashboard/validation/createHomeSchema";
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

export function HomeInfoTab({ home, isOwner }: HomeInfoTabProps) {
  const { t } = useTranslation("home");
  const router = useRouter();
  const { removeHome } = useHomes();
  const [confirmAction, setConfirmAction] = useState<ConfirmHomeAction | null>(null);

  const typeLabel =
    (home.homeTypeId === "other" && home.otherHomeType) ||
    getHomeTypeLabel(t, home.homeTypeId);
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
            <Text style={styles.muted}>{t("placeholders.empty")}</Text>
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
                <Text style={styles.codeText}>{t("placeholders.noCode")}</Text>
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
              {isOwner ? t("buttons.deleteHome") : t("buttons.leaveHome")}
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
                {getInitials(home.userResponsible)}
              </Text>
            </View>
            <View style={styles.ownerMeta}>
              <Text style={styles.ownerName} numberOfLines={1}>
                {home.userResponsible || t("placeholders.empty")}
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
              <Text style={styles.muted}>{t("placeholders.empty")}</Text>
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