import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

import { Theme } from "@/constants/theme";
import { useHomes } from "@/context/HomeContext";
import { HomeDetailScreen } from "@/features/homes/screens/HomeDetailScreen/HomeDetailScreen";

export default function HomeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { homes } = useHomes();

  const home = homes.find((h) => String(h.id) === id) ?? null;

  if (!home) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Theme.colors.background }}>
        <Text>Hogar no encontrado</Text>
      </View>
    );
  }

  return <HomeDetailScreen home={home} />;
}
