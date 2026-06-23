import React, { useState } from "react";
import { Pressable, Text } from "react-native";
import { MotiView } from "moti";

interface HateButtonProps {
  onHate?: () => void;
}

export default function HateButton({ onHate }: HateButtonProps) {
  const [hated, setHated] = useState(false);

  const handleHate = () => {
    if (hated) return;
    setHated(true);
    onHate?.();
  };

  return (
    <MotiView
      animate={{
        scale: hated ? 1 : 1,
      }}
      transition={{ type: "timing", duration: 150 }}
    >
      <Pressable
        onPress={handleHate}
        disabled={hated}
        className={`w-full py-4 rounded-full items-center justify-center ${
          hated
            ? "bg-zinc-800 border border-zinc-700 active:opacity-100"
            : "bg-red-950 active:bg-red-900"
        }`}
      >
        <Text
          className={`font-bold text-base ${
            hated ? "text-zinc-400" : "text-white"
          }`}
        >
          {hated ? "You hated their relationship 💔" : "Hate on their relationship"}
        </Text>
      </Pressable>
    </MotiView>
  );
}
