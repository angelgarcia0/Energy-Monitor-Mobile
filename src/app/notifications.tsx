import { View } from "react-native";

import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { NotificationsScreen } from "@/features/notifications/screens/NotificationsScreen/NotificationsScreen";

export default function Notifications() {
  return (
    <View style={{ flex: 1 }}>
      <NotificationsScreen />
      <Sidebar />
    </View>
  );
}
