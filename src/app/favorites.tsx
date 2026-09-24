import { View } from "react-native";

import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { FavoritesScreen } from "@/features/favorites/screens/FavoritesScreen/FavoritesScreen";

export default function Favorites() {
  return (
    <View style={{ flex: 1 }}>
      <FavoritesScreen />
      <Sidebar />
    </View>
  );
}
