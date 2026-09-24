import { HomeProvider } from "@/context/HomeContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <HomeProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }} />
      </HomeProvider>
    </ThemeProvider>
  );
}