import { Card } from "@/components/Card/Card";
import React from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { styles } from "./SettingsSectionCard.styles";

export interface SettingsSectionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  trailing?: React.ReactNode;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function SettingsSectionCard({
  icon,
  title,
  description,
  trailing,
  children,
  style,
}: SettingsSectionCardProps) {
  return (
    <Card style={[styles.card, style]}>
      <View style={styles.header}>
        <View style={styles.info}>
          <View style={styles.icon}>{icon}</View>
          <View style={styles.infoText}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        </View>

        {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
      </View>

      {children ? <View style={styles.body}>{children}</View> : null}
    </Card>
  );
}