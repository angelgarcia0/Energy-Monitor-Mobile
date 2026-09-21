import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

import { Theme } from "@/constants/theme";
import type { Home } from "@/features/dashboard/components/HomeCard/HomeCard";
import { HomeDetailScreen } from "@/features/homes/screens/HomeDetailScreen/HomeDetailScreen";

export default function HomeDetail() {
  const { home } = useLocalSearchParams<{ id: string; home?: string }>();

  // TODO: leer el hogar desde HomeContext/backend en vez de serializarlo en la ruta
  const parsed: Home | null = home ? JSON.parse(home) : null;

  if (!parsed) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Theme.colors.background }}>
        <Text>Hogar no encontrado</Text>
      </View>
    );
  }

  return <HomeDetailScreen home={parsed} />;
}
