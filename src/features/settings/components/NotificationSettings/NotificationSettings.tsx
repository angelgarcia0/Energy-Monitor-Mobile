import { Switch } from "@/components/Switch/Switch";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Theme } from "@/constants/theme";
import { errorMessage } from "@/services/http";
import { SettingsSectionCard } from "../../components/SettingsSectionCard/SettingsSectionCard";
import { useNotificationPreferences } from "../../hooks/useNotificationPreferences";
import { styles } from "./NotificationSettings.styles";

/**
 * Canales por los que llegan las alertas de los hogares.
 *
 * El correo lo envía el servidor. El push no: son las suscripciones VAPID de los
 * navegadores, así que desde aquí se enciende o apaga la preferencia, pero lo que
 * llega es a los navegadores ya suscritos, nunca a este teléfono.
 */
export function NotificationSettings() {
  const { t } = useTranslation("settings");
  const { preferences, loading, error, reload, save, pending } =
    useNotificationPreferences();

  // El mensaje de error vive aquí, no en el hook, porque el hook no traduce.
  const [message, setMessage] = useState<string | null>(null);

  const email = !!preferences?.emailEnabled;
  const push = !!preferences?.pushEnabled;
  const combined = email && push;
  const pushAvailable = !!preferences?.pushAvailable;

  const run = async (
    next: { emailEnabled: boolean; pushEnabled: boolean },
  ): Promise<void> => {
    setMessage(null);
    const err = await save(next);
    if (err) setMessage(errorMessage(t, err));
  };

  const toggleEmail = () => {
    if (!preferences || pending) return;
    // Tocar el correo no cambia el push de los navegadores.
    void run({ emailEnabled: !email, pushEnabled: push });
  };

  const togglePush = () => {
    if (!preferences || pending) return;
    void run({ emailEnabled: email, pushEnabled: !push });
  };

  const toggleCombined = () => {
    if (!preferences || pending) return;
    const value = !combined;
    void run({ emailEnabled: value, pushEnabled: value });
  };

  // El push depende de que el servidor tenga clave configurada. Sin ella,
  // `/notifications/push/public-key` responde 404 y encender el interruptor no
  // suscribiría a nadie.
  const pushHint = !pushAvailable
    ? t("notifications.push.unavailable")
    : preferences && preferences.pushBrowsers > 0
      ? t("notifications.push.browsers", { count: preferences.pushBrowsers })
      : t("notifications.push.description");

  const activeCount = [email, push].filter(Boolean).length;
  const busy = !!pending;

  return (
    <SettingsSectionCard
      icon={
        <Ionicons
          name="notifications-outline"
          size={20}
          color={Theme.colors.warningText}
        />
      }
      title={t("notifications.title")}
      description={t("notifications.description")}
      trailing={
        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {activeCount} {t("notifications.active")}
          </Text>
        </View>
      }
    >
      <View style={styles.options}>
        {loading && !preferences ? (
          <View style={styles.loading}>
            <ActivityIndicator color={Theme.colors.primary} />
          </View>
        ) : null}

        {error && !preferences ? (
          <View style={styles.row}>
            <Text style={styles.message} accessibilityRole="alert">
              {errorMessage(t, error)}
            </Text>
            <Pressable
              onPress={reload}
              accessibilityRole="button"
              accessibilityLabel={t("notifications.retry")}
            >
              <Text style={styles.retry}>{t("notifications.retry")}</Text>
            </Pressable>
          </View>
        ) : null}

        <NotificationRow
          icon="mail-outline"
          title={t("notifications.email.title")}
          description={t("notifications.email.description")}
          enabled={email}
          disabled={loading || busy}
          onToggle={toggleEmail}
        />

        <NotificationRow
          icon="phone-portrait-outline"
          title={t("notifications.push.title")}
          description={pushHint}
          enabled={push}
          disabled={loading || busy || !pushAvailable}
          onToggle={togglePush}
        />

        <NotificationRow
          icon="checkmark-done-outline"
          title={t("notifications.combined.title")}
          description={t("notifications.combined.description")}
          enabled={combined}
          disabled={loading || busy || !pushAvailable}
          onToggle={toggleCombined}
        />
      </View>

      {message ? (
        <Text style={styles.message} accessibilityRole="alert">
          {message}
        </Text>
      ) : null}
    </SettingsSectionCard>
  );
}

interface NotificationRowProps {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  description: string;
  enabled: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

function NotificationRow({
  icon,
  title,
  description,
  enabled,
  disabled = false,
  onToggle,
}: NotificationRowProps) {
  const { t } = useTranslation("settings");

  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={styles.rowIcon}>
          <Ionicons name={icon} size={18} color={Theme.colors.primary} />
        </View>

        <View style={styles.rowInfo}>
          <Text style={styles.rowTitle}>{title}</Text>
          <Text style={styles.rowDescription}>{description}</Text>
        </View>
      </View>

      <View style={styles.rowRight}>
        <View style={[styles.status, enabled ? styles.statusActive : styles.statusInactive]}>
          <Text
            style={[
              styles.statusText,
              { color: enabled ? Theme.colors.successText : Theme.colors.dangerText },
            ]}
          >
            {enabled
              ? t("notifications.status.active")
              : t("notifications.status.inactive")}
          </Text>
        </View>

        <Switch
          value={enabled}
          onValueChange={onToggle}
          disabled={disabled}
          accessibilityLabel={title}
        />
      </View>
    </View>
  );
}