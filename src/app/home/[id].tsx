import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { Loader } from "@/components/Loader/Loader";
import { Theme } from "@/constants/theme";
import { useHomes } from "@/context/HomeContext";
import { useTheme } from "@/context/ThemeContext";
import { HomeDetailScreen } from "@/features/homes/screens/HomeDetailScreen/HomeDetailScreen";

export default function HomeDetail() {
  const { currentTheme } = useTheme();

  const { t } = useTranslation("homeNotFound");
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { homes, loading } = useHomes();

  const home = homes.find((h) => h.idHome === id) ?? null;

  // Al abrir la app desde una notificación los hogares todavía se están cargando: "no
  // encontrado" sería falso mientras tanto.
  if (!home && loading) {
    return (
      <View key={currentTheme.id} style={{ flex: 1, backgroundColor: Theme.colors.background }}>
        <Loader style={{ flex: 1 }} />
      </View>
    );
  }

  // La key remonta la pantalla al cambiar de paleta para que los estilos
  // reconstruidos se apliquen (ver useTheme).
  if (!home) {
    return (
      <View
        key={currentTheme.id}
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: Theme.spacing.md,
          padding: Theme.spacing.lg,
          backgroundColor: Theme.colors.background,
        }}
      >
        <Text
          style={{
            fontFamily: Theme.typography.fontPrimary,
            fontSize: Theme.typography.size.lg,
            fontWeight: Theme.typography.weight.bold,
            color: Theme.colors.textPrimary,
            textAlign: "center",
          }}
        >
          {t("title")}
        </Text>
        <Text
          style={{
            fontFamily: Theme.typography.fontPrimary,
            fontSize: Theme.typography.size.sm,
            color: Theme.colors.textSecondary,
            textAlign: "center",
          }}
        >
          {t("description")}
        </Text>
        <Button onPress={() => router.replace("/dashboard")}>
          {t("backToDashboard")}
        </Button>
      </View>
    );
  }

  return <HomeDetailScreen key={currentTheme.id} home={home} />;
}
