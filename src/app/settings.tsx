import { View } from "react-native";

import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { SettingsScreen } from "@/features/settings/screens/SettingsScreen/SettingsScreen";

export default function Settings() {
  return (
    <View style={{ flex: 1 }}>
      <SettingsScreen />
      <Sidebar />
    </View>
  );
}