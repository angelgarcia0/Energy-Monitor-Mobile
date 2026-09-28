import { HomeProvider } from "@/context/HomeContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <HomeProvider>
        <UserProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }} />
        </UserProvider>
      </HomeProvider>
    </ThemeProvider>
  );
}