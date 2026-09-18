import { StyleSheet } from "react-native";

import { Theme } from "@/constants/theme";

const IMAGE_SIZE = Theme.spacing.xl * 8;

export const styles = StyleSheet.create({
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
});
