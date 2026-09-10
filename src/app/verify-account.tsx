import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { Theme } from "@/constants/theme";

export default function VerifyAccountScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Verificación de cuenta (placeholder)</Text>
      <Text style={styles.subtitle}>
        Pantalla temporal para comprobar la navegación desde Register.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.sm,
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.background,
  },
  title: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.lg,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
  },
  subtitle: {
    fontFamily: Theme.typography.fontPrimary,
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textSecondary,
    textAlign: "center",
  },
});
