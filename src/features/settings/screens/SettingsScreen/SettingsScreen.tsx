import { useRouter, type Href } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "@/components/Header/Header";
import { Theme } from "@/constants/theme";
import { HelpCenter } from "../../components/HelpCenter/HelpCenter";
import { LanguageSettings } from "../../components/LanguageSettings/LanguageSettings";
import { NotificationSettings } from "../../components/NotificationSettings/NotificationSettings";
import { ThemeSettings } from "../../components/ThemeSettings/ThemeSettings";
import { styles } from "./SettingsScreen.styles";

export function SettingsScreen() {
  const { t } = useTranslation("settings");
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, Theme.spacing.md),
        },
      ]}
    >
      <StatusBar style="auto" />

      <Header
        breadcrumbItems={[
          {
            label: t("header.home"),
            onPress: () => router.push("/dashboard" as Href),
          },
          { label: t("header.settings") },
        ]}
        style={styles.header}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LanguageSettings />
        <ThemeSettings />
        <NotificationSettings />
        <HelpCenter />
      </ScrollView>
    </View>
  );
}
