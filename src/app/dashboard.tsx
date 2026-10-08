import { View } from "react-native";

import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { useTheme } from "@/context/ThemeContext";
import { DashboardScreen } from "@/features/dashboard/screens/DashboardScreen/DashboardScreen";

export default function Dashboard() {
  const { currentTheme } = useTheme();

  // La key remonta la pantalla al cambiar de paleta para que los estilos
  // reconstruidos se apliquen (ver useTheme).

  return (
    <View key={currentTheme.id} style={{ flex: 1 }}>
      <DashboardScreen />

      {/* TEMPORAL: montaje de prueba manual del Sidebar; se retira cuando
          se integre en un layout compartido para todas las pantallas. */}
      <Sidebar />
    </View>
  );
}