import React from "react";
import { Text } from "react-native";
import { MotiView } from "moti";

interface HateBadgeProps {
  count: number;
}

export default function HateBadge({ count }: HateBadgeProps) {
  return (
    <MotiView
      from={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", damping: 12 }}
      className="absolute bottom-3 right-3 bg-white/90 rounded-full px-3 py-1.5 shadow-sm"
    >
      <Text className="text-xs font-extrabold text-zinc-900">
        {count} hates
      </Text>
    </MotiView>
  );
}
