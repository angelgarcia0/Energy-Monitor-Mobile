import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleProp, Text, View, ViewStyle } from "react-native";

import { Theme } from "../../../../constants/theme";
import { styles } from "./AuthBrandHeader.styles";

export interface AuthBrandHeaderProps {
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
}

export function AuthBrandHeader({ subtitle, style }: AuthBrandHeaderProps) {
  return (
    <LinearGradient
      colors={[
        Theme.colors.primaryDark,
        Theme.colors.backgroundLeft,
        Theme.colors.primaryDark,
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, style]}
    >
      <View style={styles.row}>
        <Image
          source={require("../../../../assets/logo_proyecto.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.name}>EnergyMonitor</Text>
      </View>

      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </LinearGradient>
  );
}
