import type { Ionicons } from "@expo/vector-icons";
import type { TFunction } from "i18next";
import type React from "react";

import type { ActivityNotification, ActivitySource } from "@/services/notifications";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

/** Actividad en la forma que pinta la UI. */
export interface UiActivity {
  id: string;
  source: ActivitySource;
  /** Clave bajo `notifications:` sin la versión: `activity.home.member-joined`. */
  key: string;
  homeId: string | null;
  /** Nombre que tenía el hogar, o el actual si la notificación no lo guardó. */
  home: string | null;
  device: string | null;
  /** Quién lo hizo. */
  actor: string | null;
  /** A quién le pasó: el miembro quitado o el nuevo propietario. */
  subject: string | null;
  /** ISO-8601. */
  date: string;
  read: boolean;
}

/**
 * Backend → UI.
 *
 * @param homeNames nombres actuales de los hogares del usuario, para lo que no
 *   guardó el suyo (un dispositivo vinculado)
 */
export function toUiActivity(
  notification: ActivityNotification,
  homeNames: Map<string, string> = new Map(),
): UiActivity {
  const params = notification.params ?? {};
  return {
    id: notification.id,
    source: notification.source,
    key: notification.messageKey.replace(/\.v\d+$/, ""),
    homeId: notification.homeId,
    home:
      params.homeName ??
      (notification.homeId ? homeNames.get(notification.homeId) ?? null : null),
    device: params.deviceName ?? null,
    actor: params.actorName ?? null,
    subject: params.subjectName ?? null,
    date: notification.createdAt,
    read: notification.read,
  };
}

/**
 * Título y mensaje, con los mismos textos que la Web. Si falta algún nombre se
 * usa uno genérico ("tu hogar", "alguien") sin comillas; una clave que esta
 * versión de la app no conoce se muestra como novedad genérica.
 */
export function activityText(item: UiActivity, t: TFunction): { title: string; message: string } {
  const quoted = (name: string | null, fallback: string) =>
    name ? t("activity.quoted", { name }) : t(fallback);
  const names = {
    home: quoted(item.home, "activity.yourHome"),
    actor: item.actor ?? t("activity.someone"),
    subject: item.subject ?? t("activity.aMember"),
    device: quoted(item.device, "activity.aDevice"),
  };
  // Un dispositivo vinculado sin quién lo vinculó tiene su propia frase.
  const messageKeys = item.actor
    ? [`${item.key}.message`]
    : [`${item.key}.messageNoActor`, `${item.key}.message`];
  const message = t(messageKeys, {
    ...names,
    defaultValue: t("activity.generic.message", names),
  });
  return {
    title: t(`${item.key}.title`, { defaultValue: t("activity.generic.title") }),
    // Una frase que empieza por un nombre genérico ("un dispositivo se…") va con mayúscula.
    message: message.charAt(0).toUpperCase() + message.slice(1),
  };
}

const ACTIVITY_ICONS: Record<string, IoniconName> = {
  "activity.account.welcome": "sparkles-outline",
  "activity.home.created": "add-circle-outline",
  "activity.home.joined": "home-outline",
  "activity.home.member-joined": "person-add-outline",
  "activity.home.member-left": "log-out-outline",
  "activity.home.member-removed": "person-remove-outline",
  "activity.home.removed-you": "person-remove-outline",
  "activity.home.thresholds-updated": "speedometer-outline",
  "activity.home.ownership-received": "key-outline",
  "activity.home.ownership-given": "key-outline",
  "activity.home.owner-changed": "key-outline",
  "activity.home.deleted": "trash-outline",
  "activity.home.deleted-by-you": "trash-outline",
  "activity.device.linked": "link-outline",
  "activity.device.unlinked": "unlink-outline",
};

export function activityIcon(key: string): IoniconName {
  return ACTIVITY_ICONS[key] ?? "people-outline";
}
