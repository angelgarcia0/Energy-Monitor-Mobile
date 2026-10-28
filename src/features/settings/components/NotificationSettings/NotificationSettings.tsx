import { Switch } from "@/components/Switch/Switch";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Theme } from "@/constants/theme";
import { errorMessage } from "@/services/http";
import { enablePushOnThisDevice } from "@/services/notifications/pushRegistration";
import { SettingsSectionCard } from "../../components/SettingsSectionCard/SettingsSectionCard";
import { useNotificationPreferences } from "../../hooks/useNotificationPreferences";
import { styles } from "./NotificationSettings.styles";

/**
 * Canales por los que llegan las alertas de los hogares.
 *
 * El correo lo envía el servidor. El push también, pero a dos sitios distintos:
 * los navegadores que se suscribieron y los teléfonos que registraron un token.
 * Este interruptor es la preferencia del servidor para ambos.
 *
 * Encenderlo aquí además pide el permiso del sistema y registra este teléfono.
 * Si el usuario lo denies, el interruptor vuelve a su sitio: dejarlo encendido
 * sería una mentira, porque de este teléfono no saldría nada.
 */
export function NotificationSettings() {
  const { t } = useTranslation("settings");
  const { preferences, loading, error, reload, save, pending } =
    useNotificationPreferences();

  // El mensaje de error vive aquí, no en el hook, porque el hook no traduce.
  const [message, setMessage] = useState<string | null>(null);
  const [askingPermission, setAskingPermission] = useState(false);

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
    // Tocar el correo no cambia el push.
    void run({ emailEnabled: !email, pushEnabled: push });
  };

  /**
   * Encender el push pasa por el permiso del sistema, porque el interruptor solo
   * guarda la preferencia del servidor: sin el token registrado, encenderlo no
   * haría que este teléfono mostrara nada.
   */
  const togglePush = () => {
    if (!preferences || pending || askingPermission) return;
    setMessage(null);

    if (push) {
      // Apagar no pide permiso ni borra el token: apagar es una preferencia, y el
      // teléfono se da de baja al cerrar sesión. Reinscribirse al volver a
      // encender es instantáneo y no vuelve a molestar con un diálogo.
      void run({ emailEnabled: email, pushEnabled: false });
      return;
    }

    setAskingPermission(true);
    void enablePushOnThisDevice()
      .then((registered) => {
        if (registered) {
          void run({ emailEnabled: email, pushEnabled: true });
        } else {
          setMessage(t("notifications.push.permissionDenied"));
        }
      })
      .catch(() => {
        setMessage(t("notifications.push.registrationFailed"));
      })
      .finally(() => {
        setAskingPermission(false);
      });
  };

  const toggleCombined = () => {
    if (!preferences || pending) return;
    const value = !combined;
    // El modo combinado no pide permiso: solo enciende o apaga el correo. Quien
    // quiera notificaciones en el teléfono las pide en la fila de push, donde se
    // entiende qué se está activando.
    void run({ emailEnabled: value, pushEnabled: value });
  };

  // Sin transporte configurado en el servidor no hay a quién enviar, ni a un
  // navegador ni a un teléfono: `pushAvailable` es `false` cuando no hay ni clave
  // VAPID ni credencial del relay.
  const pushHint = !pushAvailable
    ? t("notifications.push.unavailable")
    : preferences && preferences.pushBrowsers > 0
      ? t("notifications.push.browsers", { count: preferences.pushBrowsers })
      : t("notifications.push.description");

  const activeCount = [email, push].filter(Boolean).length;
  const busy = !!pending || askingPermission;

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