import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import CountryFlag from "react-native-country-flag";
import { Theme } from "@/constants/theme";
import { SettingsSectionCard } from "../../components/SettingsSectionCard/SettingsSectionCard";
import { styles } from "./LanguageSettings.styles";

export interface LanguageOption {
  id: string;
  name: string;
  locale: string;
  code: string;
}

export const LANGUAGES: LanguageOption[] = [
  { id: "es", name: "Español", locale: "es-CO", code: "CO" },
  { id: "en", name: "English", locale: "en-US", code: "US" },
  { id: "pt", name: "Português", locale: "pt-BR", code: "BR" },
  { id: "fr", name: "Français", locale: "fr-FR", code: "FR" },
];

const STORAGE_KEY = "lang";

export function LanguageSettings() {
  const [currentId, setCurrentId] = useState("es");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored && LANGUAGES.some((lang) => lang.id === stored)) {
          setCurrentId(stored);
        }
      })
      .catch(() => {});
  }, []);

  const current = LANGUAGES.find((lang) => lang.id === currentId) ?? LANGUAGES[0];

  const handleSelect = (id: string) => {
    setCurrentId(id);
    AsyncStorage.setItem(STORAGE_KEY, id).catch(() => {});
  };

  return (
    <SettingsSectionCard
      icon={
        <Ionicons name="language-outline" size={20} color={Theme.colors.primary} />
      }
      title="Idioma del sistema"
      description="Define el idioma de la interfaz y los reportes generados"
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