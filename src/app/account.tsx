import { View } from "react-native";

import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { AccountScreen } from "@/features/account/screens/AccountScreen/AccountScreen";

export default function Account() {
  return (
    <View style={{ flex: 1 }}>
      <AccountScreen />
      <Sidebar />
    </View>
  );
}
