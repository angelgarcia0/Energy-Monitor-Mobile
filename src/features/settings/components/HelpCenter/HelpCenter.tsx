import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { Theme } from "@/constants/theme";
import { SettingsSectionCard } from "../../components/SettingsSectionCard/SettingsSectionCard";
import { styles } from "./HelpCenter.styles";

const HELP_ITEMS = [
  {
    title: "Documentación",
    description: "Guías de uso, referencia de funciones y tutoriales paso a paso",
    action: "Abrir documentación",
    icon: "book-outline",
    type: "docs",
  },
  {
    title: "Soporte técnico",
    description: "Comunícate con el equipo de soporte para resolver incidencias",
    action: "Crear ticket",
    icon: "headset-outline",
    type: "support",
  },
  {
    title: "Novedades",
    description: "Últimas actualizaciones, mejoras y correcciones del sistema",
    action: "Ver registro de cambios",
    icon: "sparkles-outline",
    type: "updates",
  },
] as const;

type HelpIconName = (typeof HELP_ITEMS)[number]["icon"];

interface HelpTypeStyle {
  backgroundColor: string;
  color: string;
}

const TYPE_STYLES: Record<string, HelpTypeStyle> = {
  docs: { backgroundColor: "#EEF2FF", color: "#6366F1" },
  support: { backgroundColor: "#FFF1F2", color: "#EF4444" },
  updates: { backgroundColor: "#ECFDF5", color: "#22C55E" },
};

export function HelpCenter() {
  return (
    <SettingsSectionCard
      icon={<Ionicons name="help-circle-outline" size={20} color="#0078D7" />}
      title="Centro de ayuda"
      description="Recursos y soporte para sacar el máximo provecho al sistema"
      style={styles.lastCard}
    >
      <View style={styles.container}>
        {HELP_ITEMS.map((item) => {
          const typeStyle = TYPE_STYLES[item.type];
          return (
            <View key={item.title} style={styles.helpCard}>
              <View style={[styles.icon, typeStyle]}>
                <Ionicons name={item.icon as HelpIconName} size={20} color={typeStyle.color} />
              </View>

              <Text style={styles.title}>{item.title}</Text>

              <Text style={styles.description}>{item.description}</Text>

              <View style={styles.linkRow} pointerEvents="none">
                <Text style={styles.link}>{item.action}</Text>
                <Ionicons name="open-outline" size={14} color={Theme.colors.primary} />
              </View>
            </View>
          );
        })}
      </View>
    </SettingsSectionCard>
  );
}