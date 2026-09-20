import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Theme } from "@/constants/theme";
import { styles } from "./BottomTabBar.styles";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

export interface BottomTabItem {
  id: string;
  label: string;
  icon: IoniconName;
}

export interface BottomTabBarProps {
  tabs: BottomTabItem[];
  activeTabId: string;
  onTabPress: (id: string) => void;
}

export function BottomTabBar({ tabs, activeTabId, onTabPress }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom }]}>
      {tabs.map((tab) => {
        const active = tab.id === activeTabId;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onTabPress(tab.id)}
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: active }}
            style={[styles.tab, active && styles.tabActive]}
          >
            <Ionicons
              name={tab.icon}
              size={Theme.typography.size.lg}
              color={active ? Theme.colors.primary : Theme.colors.textSecondary}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
