import React from "react";
import { View } from "react-native";
import { MotiView } from "moti";

export default function PostDetailSkeleton() {
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
      className="bg-zinc-50 flex-1"
    >
      {/* Header Skeleton */}
      <View className="flex-row items-center gap-3 px-5 py-4 border-b border-zinc-100/60 bg-white">
        <View className="w-8 h-8 rounded-full bg-zinc-200" />
        <View className="w-40 h-5 rounded-full bg-zinc-200" />
      </View>

      {/* Image Skeleton */}
      <View className="px-5 mt-4">
        <View className="w-full aspect-[4/3] rounded-3xl bg-zinc-200" />
      </View>

      {/* Post Info Skeleton */}
      <View className="px-5 mt-4 gap-3">
        <View className="flex-row items-center justify-between">
          <View className="w-36 h-4 rounded-full bg-zinc-200" />
          <View className="w-28 h-4 rounded-full bg-zinc-200" />
        </View>
        <View className="w-20 h-3 rounded-full bg-zinc-200 pl-10" />
        <View className="gap-2 mt-2">
          <View className="w-full h-3 rounded-full bg-zinc-200" />
          <View className="w-full h-3 rounded-full bg-zinc-200" />
          <View className="w-2/3 h-3 rounded-full bg-zinc-200" />
        </View>
      </View>

      {/* Comments Skeleton */}
      <View className="px-5 mt-6 gap-4">
        <View className="flex-row items-center justify-between">
          <View className="w-20 h-4 rounded-full bg-zinc-200" />
          <View className="w-24 h-7 rounded-full bg-zinc-200" />
        </View>
        {[1, 2].map((i) => (
          <View key={i} className="flex-row gap-3">
            <View className="w-8 h-8 rounded-full bg-zinc-200 shrink-0" />
            <View className="flex-1 gap-2">
              <View className="w-24 h-3 rounded-full bg-zinc-200" />
              <View className="w-full h-3 rounded-full bg-zinc-200" />
            </View>
          </View>
        ))}
      </View>

      {/* Button Skeleton */}
      <View className="px-5 mt-8">
        <View className="w-full h-14 rounded-full bg-zinc-200" />
      </View>
    </MotiView>
  );
}
