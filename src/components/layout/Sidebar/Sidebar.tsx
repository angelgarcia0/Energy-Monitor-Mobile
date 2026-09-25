import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname, type Href } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/Button/Button";
import { Theme } from "@/constants/theme";
import { styles, TRIGGER_TOP_OFFSET } from "./Sidebar.styles";
import { NavHomes } from "./NavHomes";

export interface SidebarProps {}

const DRAWER_WIDTH = Math.min(Dimensions.get("window").width * 0.85, 300);

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

interface NavItemConfig {
  label: string;
  route: Href;
  icon: IoniconName;
}

const NAV_ITEMS_TOP: NavItemConfig[] = [
  { label: "Inicio", route: "/dashboard", icon: "home-outline" },
];

const NAV_ITEMS_BOTTOM: NavItemConfig[] = [
  { label: "Favoritos", route: "/favorites", icon: "heart-outline" },
  { label: "Notificaciones", route: "/notifications", icon: "notifications-outline" },
  { label: "Ajustes", route: "/settings", icon: "settings-outline" },
];

interface NavItemProps {
  icon: IoniconName;
  label: string;
  active: boolean;
  onPress: () => void;
}

function NavItem({ icon, label, active, onPress }: NavItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.navItem, active && styles.navItemActive]}
    >
      <Ionicons
        name={icon}
        size={Theme.typography.size.lg}
        color={active ? Theme.colors.surface : "rgba(255, 255, 255, 0.8)"}
      />
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Sidebar(_props: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [translateX] = useState(() => new Animated.Value(-DRAWER_WIDTH));

  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -DRAWER_WIDTH,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isOpen, translateX]);

  const closeDrawer = () => {
    setIsOpen(false);
    setOpenMenu(false);
  };

  const handleNavigate = (route: Href) => {
    router.push(route);
    closeDrawer();
  };

  const handleLogout = () => {
    closeDrawer();
    router.replace("/");
  };

  return (
    <>
      {!isOpen ? (
        <Pressable
          style={[styles.trigger, { top: Math.max(insets.top, Theme.spacing.md) + TRIGGER_TOP_OFFSET }]}
          onPress={() => setIsOpen(true)}
        >
          <Ionicons name="menu-outline" size={Theme.typography.size.lg} color={Theme.colors.surface} />
        </Pressable>
      ) : null}

      {isOpen ? <Pressable style={styles.overlay} onPress={closeDrawer} /> : null}

      <Animated.View
        style={[
          styles.drawer,
          {
            width: DRAWER_WIDTH,
            paddingTop: insets.top + Theme.spacing.md,
            paddingBottom: Math.max(insets.bottom, Theme.spacing.md),
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={styles.header}>
          <Image
            source={require("../../../assets/logo_proyecto.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>EnergyMonitor</Text>
        </View>

        <View style={styles.nav}>
          {NAV_ITEMS_TOP.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={pathname === item.route}
              onPress={() => handleNavigate(item.route)}
            />
          ))}

          <NavHomes onNavigate={closeDrawer} />

          {NAV_ITEMS_BOTTOM.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={pathname === item.route}
              onPress={() => handleNavigate(item.route)}
            />
          ))}
        </View>

        {openMenu ? (
          <Pressable
            style={styles.dropdownCatcher}
            onPress={() => setOpenMenu(false)}
          />
        ) : null}

        <View style={styles.profileSection}>
          <Pressable style={styles.profileRow} onPress={() => setOpenMenu((prev) => !prev)}>
            <View style={styles.avatar}>
              <Ionicons name="person-outline" size={Theme.typography.size.md} color={Theme.colors.surface} />
            </View>
            <Text style={styles.profileName} numberOfLines={1}>
              Usuario
            </Text>
            <View style={styles.menuButton}>
              <Ionicons name="ellipsis-horizontal" size={Theme.typography.size.md} color={Theme.colors.surface} />
            </View>
          </Pressable>

          {openMenu ? (
            <View style={styles.dropdown}>
              <View style={styles.dropdownItem}>
                <Ionicons name="person-outline" size={Theme.typography.size.md} color={Theme.colors.textSecondary} />
                <Text style={styles.dropdownItemText}>Mi cuenta</Text>
              </View>

              <View style={styles.dropdownItem}>
                <Ionicons name="add-outline" size={Theme.typography.size.md} color={Theme.colors.textSecondary} />
                <Text style={styles.dropdownItemText}>Añadir cuenta</Text>
              </View>

              <View style={styles.divider} />

              <Button variant="primary" size="medium" style={styles.logoutButton} onPress={handleLogout}>
                Cerrar sesión
              </Button>
            </View>
          ) : null}
        </View>
      </Animated.View>
    </>
  );
}
