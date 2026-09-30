import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import CountryFlag from "react-native-country-flag";

import { Theme } from "@/constants/theme";
import { changeLanguage, LANGUAGES } from "@/i18n";
import { SettingsSectionCard } from "../../components/SettingsSectionCard/SettingsSectionCard";
import { styles } from "./LanguageSettings.styles";

export function LanguageSettings() {
  const { t, i18n } = useTranslation("settings");
  const currentId = i18n.resolvedLanguage ?? i18n.language;
  const current =
    LANGUAGES.find((lang) => lang.id === currentId) ?? LANGUAGES[0];

  const handleSelect = (id: string) => {
    void changeLanguage(id);
  };

  return (
    <SettingsSectionCard
      icon={
        <Ionicons name="language-outline" size={20} color={Theme.colors.primary} />
      }
      title={t("language.title")}
      description={t("language.description")}
      trailing={
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{current.name}</Text>
        </View>
      }
    >
      <View style={styles.grid}>
        {LANGUAGES.map((lang) => {
          const isActive = lang.id === currentId;
          return (
            <Pressable
              key={lang.id}
              onPress={() => handleSelect(lang.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              style={({ pressed }) => [
                styles.languageCard,
                isActive && styles.languageCardActive,
                pressed && styles.languageCardPressed,
              ]}
            >
              {isActive ? (
                <View style={styles.check}>
                  <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                </View>
              ) : null}

              <View style={styles.flag}>
                <CountryFlag isoCode={lang.code} size={52} style={styles.flagImage} />
              </View>

              <Text style={styles.name}>{lang.name}</Text>
              <Text style={styles.locale}>{lang.locale}</Text>
            </Pressable>
          );
        })}
      </View>
    </SettingsSectionCard>
  );
}
