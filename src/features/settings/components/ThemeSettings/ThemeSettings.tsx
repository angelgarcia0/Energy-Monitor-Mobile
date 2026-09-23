import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Pressable } from "react-native";
import { SettingsSectionCard } from "../../components/SettingsSectionCard/SettingsSectionCard";
import { Theme } from "@/constants/theme";
import type { ThemePalette } from "@/context/ThemeContext";
import { styles } from "./ThemeSettings.styles";

const lightThemes = (themes: ThemePalette[]) =>
  themes.filter((theme) => theme.mode === "light");

const darkThemes = (themes: ThemePalette[]) =>
  themes.filter((theme) => theme.mode === "dark");

export function ThemeSettings() {
  const { themeId, setThemeId, currentTheme, themes } = useTheme();

  return (
    <SettingsSectionCard
      icon={<Ionicons name="color-palette-outline" size={20} color={Theme.colors.primary} />}
      title="Temas del sistema"
      description="Apariencia visual del sistema para todos los usuarios"
      trailing={
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{currentTheme.name}</Text>
        </View>
      }
    >
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Temas claros</Text>
        <View style={styles.grid}>
          {lightThemes(themes).map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isActive={themeId === theme.id}
              onPress={() => setThemeId(theme.id)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionLabelRow}>
          <Text style={styles.sectionLabel}>Temas oscuros</Text>
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>Nuevo</Text>
          </View>
        </View>
        <View style={styles.grid}>
          {darkThemes(themes).map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isActive={themeId === theme.id}
              onPress={() => setThemeId(theme.id)}
            />
          ))}
        </View>
      </View>
    </SettingsSectionCard>
  );
}

interface ThemeCardProps {
  theme: ThemePalette;
  isActive: boolean;
  onPress: () => void;
}

function ThemeCard({ theme, isActive, onPress }: ThemeCardProps) {
  const isDark = theme.mode === "dark";
  const cardBg = isDark ? "#0F1115" : "#FFFFFF";
  const cardBorder = isDark ? "#1E293B" : "#E5E7EB";
  const nameColor = isDark ? "#F1F5F9" : "#212529";
  const subtitleColor = isDark ? "#94A3B8" : "#6C757D";
  const lineColor = isDark ? "rgba(255,255,255,0.18)" : "#E5E7EB";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.themeCard,
        {
          backgroundColor: cardBg,
          borderColor: cardBorder,
        },
        isActive && styles.themeCardActive,
        pressed && styles.themeCardPressed,
      ]}
    >
      {isActive ? (
        <View style={styles.checkBadge}>
          <Ionicons name="checkmark" size={12} color="#FFFFFF" />
        </View>
      ) : null}

      <View style={[styles.preview, { borderColor: cardBorder }]}>
        <View style={[styles.previewSidebar, { backgroundColor: theme.sidebar }]}>
          <View style={[styles.sidebarLine, { backgroundColor: "rgba(255,255,255,0.6)", width: "70%" }]} />
          <View style={[styles.sidebarLine, { backgroundColor: "rgba(255,255,255,0.35)", width: "50%" }]} />
          <View style={[styles.sidebarLine, { backgroundColor: "rgba(255,255,255,0.35)", width: "60%" }]} />
          <View style={[styles.sidebarLine, { backgroundColor: "rgba(255,255,255,0.35)", width: "45%" }]} />
        </View>

        <View style={[styles.previewContent, { backgroundColor: isDark ? theme.main : "#FFFFFF" }]}>
          <View style={styles.previewTopRow}>
            <View style={[styles.previewBar, { backgroundColor: theme.main, width: "60%" }]} />
            <View style={[styles.previewAccent, { backgroundColor: theme.indicators[0] }]} />
          </View>
          <View style={styles.previewLineGroup}>
            <View style={[styles.previewLine, { backgroundColor: lineColor, width: "85%" }]} />
            <View style={[styles.previewLine, { backgroundColor: lineColor, width: "65%" }]} />
            <View style={[styles.previewLine, { backgroundColor: lineColor, width: "75%" }]} />
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardName, { color: nameColor }]}>{theme.name}</Text>
          <Text style={[styles.cardSubtitle, { color: subtitleColor }]}>
            {theme.subtitle}
          </Text>
        </View>
        <View style={styles.dots}>
          {theme.indicators.map((color, idx) => (
            <View key={idx} style={[styles.dot, { backgroundColor: color }]} />
          ))}
        </View>
      </View>
    </Pressable>
  );
}