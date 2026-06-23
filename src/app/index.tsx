import React from "react";
import { Text, View, Pressable } from "react-native";
import { MotiView } from "moti";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-zinc-50 p-6">
      <MotiView
        from={{ opacity: 0, scale: 0.8, translateY: 20 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 800 }}
        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl border border-zinc-100 items-center"
      >
        <View className="bg-red-950/10 p-4 rounded-full mb-4">
          <Text className="text-4xl">💔</Text>
        </View>

        <Text className="text-2xl font-bold text-zinc-900 text-center mb-2 tracking-tight">
          Hinder Mobile
        </Text>
        
        <Text className="text-sm text-zinc-500 text-center mb-6 leading-relaxed">
          NativeWind & Moti setup is complete! You are ready to start building the mobile app version of Hinder.
        </Text>

        <Pressable 
          className="w-full bg-red-950 active:bg-red-900 rounded-full py-4 items-center justify-center shadow-lg"
          onPress={() => console.log("Hate on this relationship!")}
        >
          <Text className="text-white font-semibold text-base">
            Let's Hate on Couples
          </Text>
        </Pressable>
      </MotiView>
    </View>
  );
}
