import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, View } from "react-native";
import CountryFlag from "react-native-country-flag";

import { Theme } from "@/constants/theme";
import { changeLanguage, LANGUAGES } from "@/i18n";
import { styles } from "./LanguageSwitcher.styles";

export interface LanguageSwitcherProps {
  /** Variante para fondos oscuros (auth) o claros (app). */
  variant?: "dark" | "light";
  style?: React.ComponentProps<typeof View>["style"];
}

/**
 * Selector de idioma reutilizable. Es el componente genérico que sí puede usar
 * `t()`: existe justamente para mostrar los idiomas disponibles y su copy es
 * fijo para todos los que lo consumen.
 */
export function LanguageSwitcher({
  variant = "dark",
  style,
}: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation("languageSwitcher");
  const [open, setOpen] = useState(false);
  const currentId = i18n.resolvedLanguage ?? i18n.language;
  const current =
    LANGUAGES.find((lang) => lang.id === currentId) ?? LANGUAGES[0];
  const isDark = variant === "dark";

  const handleSelect = (id: string) => {
    setOpen(false);
    void changeLanguage(id);
  };

  return (
    <View style={[styles.container, style]}>
      <Pressable
        onPress={() => setOpen((prev) => !prev)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={t("change")}
        accessibilityHint={t("selectLabel")}
        style={({ pressed }) => [
          styles.trigger,
          isDark ? styles.triggerDark : styles.triggerLight,
          pressed && styles.triggerPressed,
        ]}
      >
        <CountryFlag isoCode={current.code} size={20} style={styles.flag} />
        <Text style={[styles.triggerText, isDark ? styles.textLight : styles.textDark]}>
          {current.locale}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={14}
          color={isDark ? "#FFFFFF" : Theme.colors.textPrimary}
        />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={[styles.sheet, isDark ? styles.sheetDark : styles.sheetLight]}>
            {LANGUAGES.map((lang) => {
              const active = lang.id === currentId;

              return (
                <Pressable
                  key={lang.id}
                  onPress={() => handleSelect(lang.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  style={({ pressed }) => [
                    styles.item,
                    pressed && styles.itemPressed,
                  ]}
                >
                  <CountryFlag isoCode={lang.code} size={28} style={styles.flag} />
                  <Text
                    style={[
                      styles.itemText,
                      isDark ? styles.textLight : styles.textDark,
                    ]}
                  >
                    {lang.name}
                  </Text>
                  {active ? (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={isDark ? "#FFFFFF" : Theme.colors.primary}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
