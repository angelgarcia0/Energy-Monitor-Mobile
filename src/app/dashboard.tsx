import { View } from "react-native";

import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { DashboardScreen } from "@/features/dashboard/screens/DashboardScreen/DashboardScreen";

export default function Dashboard() {
  return (
    <View style={{ flex: 1 }}>
      <DashboardScreen />

      {/* TEMPORAL: montaje de prueba manual del Sidebar; se retira cuando
          se integre en un layout compartido para todas las pantallas. */}
      <Sidebar />
    </View>
  );
}
