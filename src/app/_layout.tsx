import "../global.css";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  // null = still reading the persisted flag (keeps the splash-colored screen)
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("hinder_onboarded")
      .then((value) => setOnboarded(value === "true"))
      .catch(() => setOnboarded(false));
  }, []);

  if (onboarded === null) {
    return <View style={{ flex: 1, backgroundColor: "#0B0B0D" }} />;
  }

  return (
    <Stack
      screenOptions={{ headerShown: false }}
      initialRouteName={onboarded ? "(tabs)" : "onboarding"}
    >
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
