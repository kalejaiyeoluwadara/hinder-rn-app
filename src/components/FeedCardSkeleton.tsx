import React from "react";
import { View } from "react-native";
import { MotiView } from "moti";

export default function FeedCardSkeleton() {
  return (
    <MotiView
      from={{ opacity: 0.5 }}
      animate={{ opacity: 0.9 }}
      transition={{
        type: "timing",
        duration: 800,
        loop: true,
        repeatReverse: true,
      }}
      className="px-5 mb-6"
    >
      {/* Image Skeleton */}
      <View className="w-full aspect-[4/3] rounded-3xl bg-zinc-200" />

      {/* User Info Row Skeleton */}
      <View className="flex-row items-center justify-between mt-3 px-1">
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 rounded-full bg-zinc-200" />
          <View className="w-24 h-4 rounded-full bg-zinc-200" />
        </View>
        <View className="w-16 h-4 rounded-full bg-zinc-200" />
      </View>

      {/* Caption Skeleton */}
      <View className="mt-2.5 pl-10 pr-1 gap-1.5">
        <View className="w-full h-3 rounded-full bg-zinc-200" />
        <View className="w-3/4 h-3 rounded-full bg-zinc-200" />
      </View>
    </MotiView>
  );
}
