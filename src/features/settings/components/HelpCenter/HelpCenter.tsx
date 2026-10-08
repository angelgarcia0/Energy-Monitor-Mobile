import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { Theme } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { SettingsSectionCard } from "../../components/SettingsSectionCard/SettingsSectionCard";
import { styles } from "./HelpCenter.styles";

const HELP_ITEMS = [
  { key: "docs", icon: "book-outline", type: "docs" },
  { key: "support", icon: "headset-outline", type: "support" },
  { key: "updates", icon: "sparkles-outline", type: "updates" },
] as const;

type HelpIconName = (typeof HELP_ITEMS)[number]["icon"];

interface HelpTypeStyle {
  backgroundColor: string;
  color: string;
}

// Colores de marca del icono de cada tipo (no son tokens de UI), con variante oscura
// igual que en la Web
// (SettingsPage/components/HelpCenter/HelpCenter.module.css).
const TYPE_STYLES: Record<string, HelpTypeStyle> = {
  docs: { backgroundColor: "#EEF2FF", color: "#6366F1" },
  support: { backgroundColor: "#FFF1F2", color: "#EF4444" },
  updates: { backgroundColor: "#ECFDF5", color: "#22C55E" },
};

const TYPE_STYLES_DARK: Record<string, HelpTypeStyle> = {
  docs: { backgroundColor: "rgba(99, 102, 241, 0.15)", color: "#818CF8" },
  support: { backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#FCA5A5" },
  updates: { backgroundColor: "rgba(34, 197, 94, 0.15)", color: "#86EFAC" },
};

export function HelpCenter() {
  const { t } = useTranslation("settings");
  const { currentTheme } = useTheme();
  const typeStyles = currentTheme.mode === "dark" ? TYPE_STYLES_DARK : TYPE_STYLES;

  return (
    <SettingsSectionCard
      icon={
        <Ionicons name="help-circle-outline" size={20} color={Theme.colors.primary} />
      }
      title={t("helpCenter.title")}
      description={t("helpCenter.description")}
      style={styles.lastCard}
    >
      <View style={styles.container}>
        {HELP_ITEMS.map((item) => {
          const typeStyle = typeStyles[item.type];
          return (
            <View key={item.key} style={styles.helpCard}>
              <View style={[styles.icon, typeStyle]}>
                <Ionicons name={item.icon as HelpIconName} size={20} color={typeStyle.color} />
              </View>

              <Text style={styles.title}>{t(`help.${item.key}.title`)}</Text>

              <Text style={styles.description}>
                {t(`help.${item.key}.description`)}
              </Text>

              <View style={styles.linkRow} pointerEvents="none">
                <Text style={styles.link}>{t(`help.${item.key}.action`)}</Text>
                <Ionicons name="open-outline" size={14} color={Theme.colors.primary} />
              </View>
            </View>
          );
        })}
      </View>
    </SettingsSectionCard>
  );
}