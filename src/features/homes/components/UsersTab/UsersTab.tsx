import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { Input } from "@/components/Input/Input";
import { Theme } from "@/constants/theme";
import {
  getAvatarColor,
  ROLE_BADGE_COLORS,
} from "../../data/userAvatarColors";
import { getInitials, INITIAL_USERS, type ProjectUser } from "../../data/usersMock";
import { ConfirmRemoveUserModal } from "./ConfirmRemoveUserModal";
import { styles } from "./UsersTab.styles";

export interface UsersTabProps {
  isOwner: boolean;
}

interface PendingInvite {
  id: number;
  email: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Avatar({ name, index }: { name: string; index: number }) {
  const variant = getAvatarColor(index);

  return (
    <View style={[styles.avatar, { backgroundColor: variant.background }]}>
      <Text style={[styles.avatarText, { color: variant.text }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
}

interface UserRowProps {
  user: ProjectUser;
  index: number;
  isOwner: boolean;
  onRequestRemove: (user: ProjectUser) => void;
}

function UserRow({ user, index, isOwner, onRequestRemove }: UserRowProps) {
  const { t } = useTranslation("users");
  const badge = ROLE_BADGE_COLORS[user.role];

  return (
    <View style={styles.userRow}>
      <Avatar name={user.name} index={index} />

      <View style={styles.userInfo}>
        <Text style={styles.userName} numberOfLines={1}>
          {user.name}
        </Text>
        <Text style={styles.userEmail} numberOfLines={1}>
          {user.email}
        </Text>
      </View>

      <View style={[styles.badge, { backgroundColor: badge.background }]}>
        <Text style={[styles.badgeText, { color: badge.text }]}>
          {user.role === "owner" ? t("roles.owner") : t("roles.member")}
        </Text>
      </View>

      {isOwner && user.role !== "owner" ? (
        <Pressable
          onPress={() => onRequestRemove(user)}
          accessibilityRole="button"
          accessibilityLabel={t("actions.removeUser", { name: user.name })}
          style={({ pressed }) => [
            styles.removeButton,
            pressed && styles.removeButtonPressed,
          ]}
        >
          <Ionicons
            name="trash-outline"
            size={Theme.typography.size.md}
            color={Theme.colors.danger}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

interface PendingRowProps {
  pending: PendingInvite;
  onCancel: (id: number) => void;
}

function PendingRow({ pending, onCancel }: PendingRowProps) {
  const { t } = useTranslation("users");

  return (
    <View style={styles.userRow}>
      <View style={styles.pendingIcon}>
        <Ionicons
          name="mail-outline"
          size={Theme.typography.size.md}
          color={Theme.colors.textSecondary}
        />
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.userEmail} numberOfLines={1}>
          {pending.email}
        </Text>
        <Text style={styles.pendingLabel}>{t("pending.sent")}</Text>
      </View>

      <Button variant="ghost" size="small" onPress={() => onCancel(pending.id)}>
        {t("pending.cancel")}
      </Button>
    </View>
  );
}

export function UsersTab({ isOwner }: UsersTabProps) {
  const { t } = useTranslation("users");
  const [users, setUsers] = useState<ProjectUser[]>(INITIAL_USERS);
  const [pending, setPending] = useState<PendingInvite[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [userToRemove, setUserToRemove] = useState<ProjectUser | null>(null);

  const membersCount = t("header.membersCount", { count: users.length });

  const handleInvite = () => {
    const email = inviteEmail.trim().toLowerCase();

    if (!email) return setInviteError(t("invite.errors.empty"));
    if (!EMAIL_REGEX.test(email)) return setInviteError(t("invite.errors.invalid"));
    if (users.some((user) => user.email === email))
      return setInviteError(t("invite.errors.alreadyMember"));
    if (pending.some((invite) => invite.email === email))
      return setInviteError(t("invite.errors.alreadyInvited"));

    setPending((prev) => [...prev, { id: Date.now(), email }]);
    setInviteEmail("");
    setInviteError("");
  };

  const handleCancelInvite = (id: number) => {
    setPending((prev) => prev.filter((invite) => invite.id !== id));
  };

  const handleConfirmRemove = () => {
    if (userToRemove) {
      setUsers((prev) => prev.filter((user) => user.id !== userToRemove.id));
    }
    setUserToRemove(null);
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t("header.title")}</Text>
          <Text style={styles.subtitle}>{membersCount}</Text>
        </View>

        <Card padding="none" style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.blockTitle}>{t("members.title")}</Text>
          </View>
          {users.map((user, index) => (
            <View key={user.id}>
              <UserRow
                user={user}
                index={index}
                isOwner={isOwner}
                onRequestRemove={setUserToRemove}
              />
              {index < users.length - 1 ? <View style={styles.divider} /> : null}
            </View>
          ))}
        </Card>

        {isOwner ? (
          <Card style={styles.card}>
            <Text style={styles.blockTitle}>{t("invite.title")}</Text>
            <View style={styles.inviteRow}>
              <View style={styles.inviteInputWrap}>
                <Input
                  value={inviteEmail}
                  onChangeText={(text) => {
                    setInviteEmail(text);
                    setInviteError("");
                  }}
                  placeholder={t("invite.placeholder")}
                  keyboardType="email-address"
                />
              </View>
              <Button onPress={handleInvite}>{t("invite.button")}</Button>
            </View>
            {inviteError ? (
              <Text style={styles.inviteError}>{inviteError}</Text>
            ) : null}
          </Card>
        ) : null}

        {isOwner ? (
          <Card padding="none" style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.blockTitle}>{t("pending.title")}</Text>
            </View>
            {pending.length === 0 ? (
              <Text style={styles.emptyPending}>{t("pending.empty")}</Text>
            ) : (
              pending.map((invite, index) => (
                <View key={invite.id}>
                  <PendingRow pending={invite} onCancel={handleCancelInvite} />
                  {index < pending.length - 1 ? (
                    <View style={styles.divider} />
                  ) : null}
                </View>
              ))
            )}
          </Card>
        ) : null}
      </ScrollView>

      {userToRemove ? (
        <ConfirmRemoveUserModal
          visible
          user={userToRemove}
          onCancel={() => setUserToRemove(null)}
          onConfirm={handleConfirmRemove}
        />
      ) : null}
    </>
  );
}