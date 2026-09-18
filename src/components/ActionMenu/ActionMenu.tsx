import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Modal,
  Pressable,
  StyleProp,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

import { Theme } from "@/constants/theme";
import { styles } from "./ActionMenu.styles";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

export interface ActionMenuOption {
  label: string;
  icon?: IoniconName;
  onPress: () => void;
}

export interface ActionMenuProps {
  options: ActionMenuOption[];
  triggerIcon?: IoniconName;
  style?: StyleProp<ViewStyle>;
}

interface Anchor {
  top: number;
  right: number;
}

export function ActionMenu({
  options,
  triggerIcon = "add-outline",
  style,
}: ActionMenuProps) {
  const triggerRef = useRef<View>(null);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const { width: windowWidth } = useWindowDimensions();

  const open = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({
        top: y + height + Theme.spacing.sm,
        right: windowWidth - (x + width),
      });
    });
  };

  const close = () => setAnchor(null);

  return (
    <View ref={triggerRef} collapsable={false} style={style}>
      <Pressable
        onPress={open}
        accessibilityLabel="Abrir menú de acciones"
        style={({ pressed }) => [styles.trigger, pressed && styles.triggerPressed]}
      >
        <Ionicons name={triggerIcon} size={Theme.typography.size.lg} color={Theme.colors.surface} />
      </Pressable>

      <Modal visible={anchor !== null} transparent animationType="fade" onRequestClose={close}>
        <Pressable style={styles.backdrop} onPress={close}>
          {anchor ? (
            <View style={[styles.dropdown, { top: anchor.top, right: anchor.right }]}>
              {options.map((option) => (
                <Pressable
                  key={option.label}
                  style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
                  onPress={() => {
                    close();
                    option.onPress();
                  }}
                >
                  {option.icon ? (
                    <Ionicons name={option.icon} size={Theme.typography.size.lg} color={Theme.colors.textSecondary} />
                  ) : null}
                  <Text style={styles.itemText}>{option.label}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </Pressable>
      </Modal>
    </View>
  );
}
