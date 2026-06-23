import React, { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { Tabs, useSegments } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView, AnimatePresence } from "moti";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Avatar from "../../components/Avatar";
import { currentUser } from "../../lib/mock-data";

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View className="absolute bottom-6 left-5 right-5 z-50">
      <View className="flex-row items-center justify-around bg-zinc-950/95 rounded-full py-2.5 px-3 shadow-xl border border-zinc-800/80">
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let label = "Feed";
          let iconName: any = "home-outline";

          if (route.name === "index") {
            label = "Feed";
            iconName = isFocused ? "home" : "home-outline";
          } else if (route.name === "leaderboard") {
            label = "Top Hates";
            iconName = isFocused ? "flame" : "flame-outline";
          } else if (route.name === "profile") {
            label = "Profile";
            iconName = isFocused ? "person" : "person-outline";
          }

          return (
            <Pressable
              key={route.key}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              className="relative flex-1 items-center justify-center py-2 px-2 rounded-full gap-1"
            >
              {isFocused && (
                <MotiView
                  from={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="absolute inset-0 bg-white/10 rounded-full"
                />
              )}
              <Ionicons
                name={iconName}
                size={20}
                color={isFocused ? "#ffffff" : "#a1a1aa"}
              />
              <Text
                className={`text-[10px] font-semibold tracking-wide ${
                  isFocused ? "text-white" : "text-zinc-400"
                }`}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const activeTab = segments[segments.length - 1] as string;
  const showHeader = activeTab === "index" || activeTab === "(tabs)" || !activeTab;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <View className="flex-1 bg-zinc-50">
      {showHeader && (
        <View
          style={{ paddingTop: insets.top }}
          className="bg-white border-b border-zinc-100/60 shadow-sm"
        >
          {/* Main header row */}
          <View className="flex-row items-center justify-between px-5 py-3">
            {/* Left: Avatar + Greeting */}
            <View className="flex-row items-center gap-3">
              <View className="relative">
                <Avatar
                  initials={currentUser.initials}
                  color={currentUser.avatarColor}
                  imageUrl={currentUser.avatarUrl}
                  size="md"
                />
                <View className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border border-white" />
              </View>
              <View className="flex-col">
                <Text className="text-[11px] font-medium text-zinc-400 leading-tight">
                  {getGreeting()} 👋
                </Text>
                <Text className="text-[15px] font-bold text-zinc-900 leading-snug">
                  {currentUser.username}
                </Text>
              </View>
            </View>

            {/* Right: Actions */}
            <View className="flex-row items-center gap-1.5">
              <Pressable
                onPress={() => setShowSearch(!showSearch)}
                className="p-2.5 rounded-xl active:bg-zinc-100"
              >
                <Ionicons
                  name={showSearch ? "close" : "search-outline"}
                  size={20}
                  color="#3f3f46"
                />
              </Pressable>

              <Pressable className="p-2.5 rounded-xl active:bg-zinc-100 relative">
                <Ionicons name="notifications-outline" size={20} color="#3f3f46" />
                <View className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-800 border border-white" />
              </Pressable>
            </View>
          </View>

          {/* Expandable search bar */}
          <AnimatePresence>
            {showSearch && (
              <MotiView
                from={{ height: 0, opacity: 0 }}
                animate={{ height: 48, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "timing", duration: 200 }}
                className="overflow-hidden px-5 pb-3"
              >
                <View className="relative flex-row items-center bg-zinc-100 rounded-xl px-3 py-1.5">
                  <Ionicons name="search-outline" size={16} color="#a1a1aa" className="mr-2" />
                  <TextInput
                    placeholder="Search annoying couples..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    className="flex-1 text-sm text-zinc-800 placeholder:text-zinc-400 p-0"
                    autoFocus
                  />
                </View>
              </MotiView>
            )}
          </AnimatePresence>
        </View>
      )}

      {/* Tab Navigator */}
      <Tabs
        tabBar={(props: BottomTabBarProps) => <CustomTabBar {...props} /> as React.ReactNode}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="leaderboard" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </View>
  );
}
