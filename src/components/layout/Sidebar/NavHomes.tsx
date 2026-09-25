import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Theme } from "@/constants/theme";
import { useHomes } from "@/context/HomeContext";
import { styles } from "./Sidebar.styles";

export interface NavHomesProps {
  onNavigate: () => void;
}

export function NavHomes({ onNavigate }: NavHomesProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { homes } = useHomes();

  const active = pathname === "/homes" || pathname.startsWith("/home/");

  const handleHomePress = (id: number) => {
    router.push(`/home/${id}`);
    onNavigate();
  };

  return (
    <View>
      <Pressable
        onPress={() => setOpen((prev) => !prev)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        style={[styles.navItem, active && styles.navItemActive]}
      >
        <Ionicons
          name="flash-outline"
          size={Theme.typography.size.lg}
          color={active ? Theme.colors.surface : "rgba(255, 255, 255, 0.8)"}
        />
        <Text style={[styles.navLabel, active && styles.navLabelActive]}>
          Hogares
        </Text>
        <View style={styles.homesChevron}>
          <Ionicons
            name={open ? "chevron-up-outline" : "chevron-down-outline"}
            size={Theme.typography.size.md}
            color={active ? Theme.colors.surface : "rgba(255, 255, 255, 0.8)"}
          />
        </View>
      </Pressable>

      {open ? (
        <View style={styles.homesList}>
          {homes.length === 0 ? (
            <Text style={styles.noHomes}>Sin hogares</Text>
          ) : (
            homes.map((home) => {
              const selected = pathname === `/home/${home.id}`;
              return (
                <Pressable
                  key={home.id}
                  onPress={() => handleHomePress(home.id)}
                  style={[styles.homeItem, selected && styles.homeItemActive]}
                >
                  <View style={styles.homeAvatar}>
                    <Text style={styles.homeAvatarText}>
                      {home.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.homeName} numberOfLines={1}>
                    {home.name}
                  </Text>
                </Pressable>
              );
            })
          )}
        </View>
      ) : null}
    </View>
  );
}
