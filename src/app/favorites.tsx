import { View } from "react-native";

import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { useTheme } from "@/context/ThemeContext";
import { FavoritesScreen } from "@/features/favorites/screens/FavoritesScreen/FavoritesScreen";

export default function Favorites() {
  const { currentTheme } = useTheme();

  // La key remonta la pantalla al cambiar de paleta para que los estilos
  // reconstruidos se apliquen (ver useTheme).

  return (
    <View key={currentTheme.id} style={{ flex: 1 }}>
      <FavoritesScreen />
      <Sidebar />
    </View>
  );
}