import React from "react";
import { Pressable, Text } from "react-native";
import { MotiView } from "moti";

interface CreatePostButtonProps {
  onPress: () => void;
}

export default function CreatePostButton({ onPress }: CreatePostButtonProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: 150, type: "timing", duration: 400 }}
    >
      <Pressable
        onPress={onPress}
        className="w-full flex-row items-center justify-center gap-2 py-3.5 px-5 border border-zinc-200 rounded-full bg-white active:bg-zinc-50"
      >
        <Text className="text-zinc-400 text-lg leading-none font-semibold">+</Text>
        <Text className="text-zinc-500 text-sm font-semibold">
          Which couple is annoying you today?
        </Text>
      </Pressable>
    </MotiView>
  );
}
