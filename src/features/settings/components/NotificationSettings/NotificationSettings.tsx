import { Switch } from "@/components/Switch/Switch";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View } from "react-native";
import { Theme } from "@/constants/theme";
import { SettingsSectionCard } from "../../components/SettingsSectionCard/SettingsSectionCard";
import { styles } from "./NotificationSettings.styles";

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    email: true,
    push: true,
    combined: true,
  });

  const toggleSetting = (key: "email" | "push" | "combined") => {
    setSettings((prev) => {
      if (key === "combined") {
        const newValue = !prev.combined;
        return {
          email: newValue,
          push: newValue,
          combined: newValue,
        };
      }

      const updated = {
        ...prev,
        [key]: !prev[key],
      };

      return {
        ...updated,
        combined: updated.email && updated.push,
      };
    });
  };

  const activeCount = [settings.email, settings.push].filter(Boolean).length;

  return (
    <SettingsSectionCard
      icon={
        <Ionicons
          name="notifications-outline"
          size={20}
          color={Theme.colors.warningText}
        />
      }
      title="Notificaciones"
      description="Configura cómo deseas recibir alertas y eventos del sistema"
      trailing={
        <View style={styles.counter}>
          <Text style={styles.counterText}>{activeCount} activas</Text>
        </View>
      }
    >
      <View style={styles.options}>
        <NotificationRow
          icon="mail-outline"
          title="Correo electrónico"
          description="Alertas enviadas al correo registrado"
          enabled={settings.email}
          onToggle={() => toggleSetting("email")}
        />

        <NotificationRow
          icon="phone-portrait-outline"
          title="Notificaciones push"
          description="Alertas dentro de la plataforma"
          enabled={settings.push}
          onToggle={() => toggleSetting("push")}
        />

        <NotificationRow
          icon="checkmark-done-outline"
          title="Modo combinado"
          description="Activa ambos canales simultáneamente"
          enabled={settings.combined}
          onToggle={() => toggleSetting("combined")}
        />
      </View>
    </SettingsSectionCard>
  );
}

interface NotificationRowProps {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

function NotificationRow({
  icon,
  title,
  description,
  enabled,
  onToggle,
}: NotificationRowProps) {
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
            {enabled ? "Activo" : "Inactivo"}
          </Text>
        </View>

        <Switch value={enabled} onValueChange={onToggle} />
      </View>
    </View>
  );
}