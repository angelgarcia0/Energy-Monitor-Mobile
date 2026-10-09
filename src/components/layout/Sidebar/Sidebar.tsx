import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname, type Href } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { useAlerts } from "@/context/AlertsContext";
import { useUser } from "@/context/UserContext";
import { styles, TRIGGER_TOP_OFFSET } from "./Sidebar.styles";
import { NavHomes } from "./NavHomes";

export interface SidebarProps {}

const DRAWER_WIDTH = Math.min(Dimensions.get("window").width * 0.85, 300);

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

interface NavItemConfig {
  labelKey: string;
  route: Href;
  icon: IoniconName;
}

// El Sidebar es navegación de la app, no un primitivo: traduce sus propias
// etiquetas porque todas las pantallas privadas lo usan como único drawer.
const NAV_ITEMS_TOP: NavItemConfig[] = [
  { labelKey: "home", route: "/dashboard", icon: "home-outline" },
];

const NAV_ITEMS_BOTTOM: NavItemConfig[] = [
  { labelKey: "favorites", route: "/favorites", icon: "heart-outline" },
  { labelKey: "notifications", route: "/notifications", icon: "notifications-outline" },
  { labelKey: "settings", route: "/settings", icon: "settings-outline" },
];

interface NavItemProps {
  icon: IoniconName;
  label: string;
  active: boolean;
  onPress: () => void;
  /** Alertas pendientes. Solo el item de notificaciones lo lleva. */
  badge?: number;
}

function NavItem({ icon, label, active, onPress, badge = 0 }: NavItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.navItem, active && styles.navItemActive]}
    >
      <Ionicons
        name={icon}
        size={Theme.typography.size.lg}
        color={active ? Theme.colors.onBrand : Theme.colors.onBrandMuted}
      />
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>
        {label}
      </Text>
      {badge > 0 ? (
        <View style={styles.navBadge}>
          <Text style={styles.navBadgeLabel}>{badge > 99 ? "99+" : badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

export function Sidebar(_props: SidebarProps) {
  const { t } = useTranslation("sidebar");
  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [translateX] = useState(() => new Animated.Value(-DRAWER_WIDTH));

  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useUser();
  const { pendingCount } = useAlerts();

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

  const handleLogout = async () => {
    closeDrawer();
    // La sesión local se borra primero; el backend solo recibe el aviso.
    await signOut();
    router.replace("/");
  };

  const handleOpenAccount = () => {
    closeDrawer();
    // ponytail: cast a Href hasta que `expo start` regenere los tipos de rutas.
    router.push("/account" as Href);
  };

  return (
    <>
      {!isOpen ? (
        <Pressable
          style={[styles.trigger, { top: Math.max(insets.top, Theme.spacing.md) + TRIGGER_TOP_OFFSET }]}
          onPress={() => setIsOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={t("openNav")}
        >
          <Ionicons name="menu-outline" size={Theme.typography.size.lg} color={Theme.colors.onBrand} />
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
              key={item.labelKey}
              icon={item.icon}
              label={t(item.labelKey)}
              active={pathname === item.route}
              onPress={() => handleNavigate(item.route)}
            />
          ))}

          <NavHomes onNavigate={closeDrawer} />

          {NAV_ITEMS_BOTTOM.map((item) => (
            <NavItem
              key={item.labelKey}
              icon={item.icon}
              label={t(item.labelKey)}
              active={pathname === item.route}
              onPress={() => handleNavigate(item.route)}
              badge={item.route === "/notifications" ? pendingCount : 0}
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
              {user.avatarUri ? (
                <Image source={{ uri: user.avatarUri }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person-outline" size={Theme.typography.size.md} color={Theme.colors.onBrand} />
              )}
            </View>
            <Text style={styles.profileName} numberOfLines={1}>
              {user.name}
            </Text>
            <View style={styles.menuButton}>
              <Ionicons name="ellipsis-horizontal" size={Theme.typography.size.md} color={Theme.colors.onBrand} />
            </View>
          </Pressable>

          {openMenu ? (
            <View style={styles.dropdown}>
              <Pressable
                style={({ pressed }) => [styles.dropdownItem, pressed && styles.dropdownItemPressed]}
                onPress={handleOpenAccount}
                accessibilityRole="button"
                accessibilityLabel={t("profile.myAccount")}
              >
                <Ionicons name="person-outline" size={Theme.typography.size.md} color={Theme.colors.textSecondary} />
                <Text style={styles.dropdownItemText}>{t("profile.myAccount")}</Text>
              </Pressable>

              <View style={styles.dropdownItem}>
                <Ionicons name="add-outline" size={Theme.typography.size.md} color={Theme.colors.textSecondary} />
                <Text style={styles.dropdownItemText}>{t("profile.addAccount")}</Text>
              </View>

              <View style={styles.divider} />

              <Button variant="primary" size="medium" style={styles.logoutButton} onPress={handleLogout}>
                {t("profile.logout")}
              </Button>
            </View>
          ) : null}
        </View>
      </Animated.View>
    </>
  );
}
