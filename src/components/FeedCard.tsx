import React from "react";
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { MotiView } from "moti";
import Avatar from "./Avatar";
import HateBadge from "./HateBadge";
import { Post } from "../lib/types";
import { resolveImage } from "../lib/mock-data";
import { Ionicons } from "@expo/vector-icons";

interface FeedCardProps {
  post: Post;
  index: number;
}

export default function FeedCard({ post, index }: FeedCardProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 30 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        delay: index * 100,
        type: "timing",
        duration: 500,
      }}
      className="px-5 mb-6"
    >
      <Link href={`/post/${post.id}` as any} asChild>
        <Pressable className="active:opacity-95">
          {/* Couple Image Container */}
          <View className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-100">
            <Image
              source={resolveImage(post.imageUrl)}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={300}
            />
            <HateBadge count={post.hateCount} />
          </View>
        </Pressable>
      </Link>

      {/* User Info Row */}
      <View className="flex-row items-center justify-between mt-3 px-1">
        <View className="flex-row items-center gap-2">
          <Avatar
            initials={post.user.initials}
            color={post.user.avatarColor}
            imageUrl={post.user.avatarUrl}
            size="sm"
          />
          <Text className="text-sm font-semibold text-zinc-900">
            @{post.user.username}
          </Text>
        </View>

        <Link href={`/post/${post.id}` as any} asChild>
          <Pressable className="flex-row items-center gap-0.5 active:opacity-60">
            <Text className="text-sm font-bold text-red-950">View post</Text>
            <Ionicons name="chevron-forward" size={14} color="#450a0a" />
          </Pressable>
        </Link>
      </View>

      {/* Caption Preview */}
      <Text
        numberOfLines={2}
        className="mt-1.5 text-sm text-zinc-600 leading-relaxed pl-10 pr-1"
      >
        {post.caption}
      </Text>
    </MotiView>
  );
}
