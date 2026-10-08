import { StyleSheet } from "react-native";

import { createThemeStyles, Theme } from "@/constants/theme";

const IMAGE_SIZE = Theme.spacing.xl * 8;

export const styles = createThemeStyles(() => StyleSheet.create({
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
}));