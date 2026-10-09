import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { Loader } from "@/components/Loader/Loader";
import { Theme } from "@/constants/theme";
import { useHomes } from "@/context/HomeContext";
import { useCurrentPerson, type CurrentPerson } from "@/services/auth";
import { errorMessage } from "@/services/http";
import { homeApi, type Role, type UserHome } from "@/services/home";
import { getInitials } from "../../data/initials";
import { getAvatarColor, getRoleBadgeColor } from "../../data/userAvatarColors";
import { ConfirmRemoveUserModal } from "./ConfirmRemoveUserModal";
import { styles } from "./UsersTab.styles";

export interface UsersTabProps {
  homeId: string;
  isOwner: boolean;
}

/** Miembro ya normalizado para pintar: sin nulos y con el dueño primero. */
interface MemberRow {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: Role;
}

/**
 * El backend manda `name`/`lastName`/`email`, pero no los garantiza para todos:
 * cuando faltan se completan con los de la persona en sesión y, en último
 * caso, se muestra el `userId`. Un id crudo es feo pero identificable; un hueco
 * no dice nada.
 *
 * Si el dueño no viene en la lista se le antepone, para que el encabezado y el
 * estado "solo el dueño" no dependan de que el backend lo devuelva.
 */
function toRows(
  members: UserHome[],
  me: CurrentPerson | null,
  isOwner: boolean,
): MemberRow[] {
  const rows: MemberRow[] = members.map((member) => {
    const isMe = me?.id === member.userId;
    return {
      id: member.userId,
      name: member.name || (isMe ? me?.name : "") || member.userId,
      lastName: member.lastName || (isMe ? me?.lastName : "") || "",
      email: member.email || (isMe ? me?.email : "") || "",
      role: member.role,
    };
  });

  if (isOwner && me && !rows.some((row) => row.role === "OWNER")) {
    rows.unshift({
      id: me.id,
      name: me.name,
      lastName: me.lastName,
      email: me.email,
      role: "OWNER",
    });
  }

  return rows.sort((a, b) =>
    a.role === "OWNER" ? -1 : b.role === "OWNER" ? 1 : 0,
  );
}

function Avatar({ name, lastName, index }: { name: string; lastName: string; index: number }) {
  const variant = getAvatarColor(index);

  return (
    <View style={[styles.avatar, { backgroundColor: variant.background }]}>
      <Text style={[styles.avatarText, { color: variant.text }]}>
        {getInitials(name, lastName)}
      </Text>
    </View>
  );
}

interface UserRowProps {
  user: MemberRow;
  index: number;
  isOwner: boolean;
  removing: boolean;
  onRequestRemove: (user: MemberRow) => void;
}

function UserRow({
  user,
  index,
  isOwner,
  removing,
  onRequestRemove,
}: UserRowProps) {
  const { t } = useTranslation("users");
  const badge = getRoleBadgeColor(user.role);
  const fullName = [user.name, user.lastName].filter(Boolean).join(" ");

  return (
    <View style={styles.userRow}>
      <Avatar name={user.name} lastName={user.lastName} index={index} />

      <View style={styles.userInfo}>
        <Text style={styles.userName} numberOfLines={1}>
          {fullName}
        </Text>
        <Text style={styles.userEmail} numberOfLines={1}>
          {user.email}
        </Text>
      </View>

      <View style={[styles.badge, { backgroundColor: badge.background }]}>
        <Text style={[styles.badgeText, { color: badge.text }]}>
          {user.role === "OWNER" ? t("roles.owner") : t("roles.member")}
        </Text>
      </View>

      {isOwner && user.role !== "OWNER" ? (
        <Pressable
          onPress={() => onRequestRemove(user)}
          disabled={removing}
          accessibilityRole="button"
          accessibilityLabel={t("actions.removeUser", { name: fullName })}
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

/**
 * Miembros del hogar contra el backend.
 *
 * No hay bloque de invitaciones: el backend no expone ningún endpoint para
 * invitar, así que el dueño comparte el código de acceso desde la pestaña de
 * información y el resto se une con él. La Web quitó esa sección por lo mismo.
 */
export function UsersTab({ homeId, isOwner }: UsersTabProps) {
  const { t } = useTranslation("users");
  const { removeMember } = useHomes();
  const me = useCurrentPerson();

  const [members, setMembers] = useState<UserHome[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userToRemove, setUserToRemove] = useState<MemberRow | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setMembers(await homeApi.listMembers(homeId));
    } catch (err) {
      setError(errorMessage(t, err, "memberRemove"));
    } finally {
      setLoading(false);
    }
  }, [homeId, t]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos estándar
    void load();
  }, [load]);

  const rows = toRows(members, me, isOwner);
  const membersCount = t("header.membersCount", { count: rows.length });
  const onlyOwner = isOwner && rows.every((row) => row.role === "OWNER");

  const handleConfirmRemove = async () => {
    if (!userToRemove) return;
    setRemovingId(userToRemove.id);
    setRemoveError(null);
    try {
      const err = await removeMember(homeId, userToRemove.id);
      if (err) {
        setRemoveError(errorMessage(t, err, "memberRemove"));
        return;
      }
      setMembers((prev) => prev.filter((m) => m.userId !== userToRemove.id));
      setUserToRemove(null);
    } finally {
      setRemovingId(null);
    }
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

        {loading ? <Loader text={t("state.loading")} /> : null}

        {error ? (
          <View style={styles.emptyText}>
            <Text style={styles.error} accessibilityRole="alert">
              {error}
            </Text>
            <Button variant="secondary" onPress={() => void load()}>
              {t("state.retry")}
            </Button>
          </View>
        ) : null}

        {!loading && !error ? (
          <Card padding="none" style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.blockTitle}>{t("members.title")}</Text>
            </View>
            {rows.map((user, index) => (
              <View key={user.id}>
                <UserRow
                  user={user}
                  index={index}
                  isOwner={isOwner}
                  removing={removingId === user.id}
                  onRequestRemove={setUserToRemove}
                />
                {index < rows.length - 1 ? <View style={styles.divider} /> : null}
              </View>
            ))}
          </Card>
        ) : null}

        {onlyOwner ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.blockTitle}>{t("members.onlyOwnerTitle")}</Text>
            </View>
            <Text style={styles.emptyText}>{t("members.onlyOwnerDescription")}</Text>
          </View>
        ) : null}

        {removeError ? (
          <Text style={styles.error} accessibilityRole="alert">
            {removeError}
          </Text>
        ) : null}
      </ScrollView>

      {userToRemove ? (
        <ConfirmRemoveUserModal
          visible
          user={userToRemove}
          removing={removingId === userToRemove.id}
          onCancel={() => setUserToRemove(null)}
          onConfirm={handleConfirmRemove}
        />
      ) : null}
    </>
  );
}