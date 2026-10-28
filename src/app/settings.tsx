import { View } from "react-native";

import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { useTheme } from "@/context/ThemeContext";
import { SettingsScreen } from "@/features/settings/screens/SettingsScreen/SettingsScreen";

export default function Settings() {
  const { currentTheme } = useTheme();

  // La key remonta la pantalla al cambiar de paleta para que los estilos
  // reconstruidos se apliquen (ver useTheme).

  return (
    <View key={currentTheme.id} style={{ flex: 1 }}>
      <SettingsScreen />
      <Sidebar />
    </View>
  );
}