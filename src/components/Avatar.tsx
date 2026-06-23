import React from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";

interface AvatarProps {
  initials: string;
  color: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-20 h-20",
};

const textMap = {
  sm: "text-[10px]",
  md: "text-xs",
  lg: "text-sm",
  xl: "text-lg",
};

export default function Avatar({
  initials,
  color,
  imageUrl,
  size = "md",
}: AvatarProps) {
  if (imageUrl) {
    return (
      <View className={`${sizeMap[size]} rounded-full overflow-hidden shrink-0 bg-zinc-200`}>
        <Image
          source={{ uri: imageUrl }}
          alt={initials}
          className="w-full h-full"
          contentFit="cover"
          transition={200}
        />
      </View>
    );
  }

  return (
    <View
      className={`${sizeMap[size]} rounded-full flex items-center justify-center shrink-0`}
      style={{ backgroundColor: color }}
    >
      <Text className={`text-white font-extrabold ${textMap[size]}`}>
        {initials}
      </Text>
    </View>
  );
}
