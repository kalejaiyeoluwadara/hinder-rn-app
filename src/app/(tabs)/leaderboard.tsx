import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "../../components/Avatar";
import { posts as allPosts, resolveImage } from "../../lib/mock-data";

type Filter = "all" | "week" | "today";

// Podium bar gradient palettes — silver (2nd), gold (1st), bronze (3rd)
const podiumColors: [string, string][] = [
  ["#d4d4d8", "#a1a1aa"], // Silver
  ["#fbbf24", "#eab308"], // Gold
  ["#fdba74", "#fbbf24"], // Bronze
];
const podiumHeights = [96, 128, 80];
const podiumEmojis = ["🥈", "👑", "🥉"];
const podiumRanks = [2, 1, 3];
const podiumBorders = ["#a1a1aa", "#fbbf24", "#fb923c"];
const podiumAvatarSizes = [52, 64, 48];

// Full-ranking progress bar gradients keyed by rank index
function rankBarColors(index: number): [string, string] {
  if (index === 0) return ["#8B0000", "#ef4444"];
  if (index === 1) return ["#71717a", "#a1a1aa"];
  if (index === 2) return ["#f97316", "#fbbf24"];
  return ["#a1a1aa", "#a1a1aa"];
}

export default function LeaderboardScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<Filter>("all");

  const sortedPosts = [...allPosts].sort((a, b) => b.hateCount - a.hateCount);
  const maxHates = sortedPosts[0]?.hateCount || 1;

  const totalHates = sortedPosts.reduce((sum, p) => sum + p.hateCount, 0);
  const totalComments = sortedPosts.reduce((sum, p) => sum + p.comments.length, 0);

  const top3 = sortedPosts.slice(0, 3);
  // Visual podium ordering: 2nd, 1st, 3rd
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;

  const stats = [
    { label: "Total Hates", value: totalHates, icon: "🔥" },
    { label: "Couples Exposed", value: sortedPosts.length, icon: "💔" },
    { label: "Comments", value: totalComments, icon: "💬" },
  ];

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All Time" },
    { id: "week", label: "This Week" },
    { id: "today", label: "Today" },
  ];

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero header with dark gradient */}
        <LinearGradient
          colors={["#09090b", "#18181b", "#27272a"]}
          style={{
            paddingTop: insets.top + 20,
            paddingHorizontal: 20,
            paddingBottom: 32,
            overflow: "hidden",
          }}
        >
          {/* Decorative glows */}
          <View className="absolute -top-16 left-1/2 -ml-32 w-64 h-64 rounded-full bg-[#8B0000]/20" />
          <View className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-amber-500/10" />

          {/* Title area */}
          <MotiView
            from={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 100, type: "timing", duration: 400 }}
          >
            <View className="flex-row items-center gap-2 mb-1">
              <Text className="text-2xl">🔥</Text>
              <Text className="text-xl font-extrabold text-white tracking-tight">
                Hall of Shame
              </Text>
            </View>
            <Text className="text-xs text-zinc-400 leading-relaxed max-w-[280px]">
              The most annoying couples on the internet, ranked by community hatred.
            </Text>
          </MotiView>

          {/* Filter pills */}
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 200, type: "timing", duration: 400 }}
            className="flex-row gap-2 mt-4"
          >
            {filters.map((filter) => {
              const isActive = activeFilter === filter.id;
              return (
                <Pressable
                  key={filter.id}
                  onPress={() => setActiveFilter(filter.id)}
                  className={`px-3.5 py-1.5 rounded-full ${
                    isActive ? "bg-[#8B0000]" : "bg-white/10"
                  }`}
                >
                  <Text
                    className={`text-[11px] font-bold uppercase tracking-wider ${
                      isActive ? "text-white" : "text-zinc-400"
                    }`}
                  >
                    {filter.label}
                  </Text>
                </Pressable>
              );
            })}
          </MotiView>

          {/* Podium section */}
          {top3.length >= 3 && (
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 300, type: "timing", duration: 500 }}
              className="flex-row items-end justify-center gap-2 mt-8"
            >
              {podiumOrder.map((post, i) => (
                <Link key={post.id} href={`/post/${post.id}` as any} asChild>
                  <Pressable className="flex-1 items-center" style={{ maxWidth: 120 }}>
                    {/* Avatar + crown for #1 */}
                    <MotiView
                      from={{ scale: 0, translateY: 20 }}
                      animate={{ scale: 1, translateY: 0 }}
                      transition={{
                        delay: 500 + i * 100,
                        type: "spring",
                        stiffness: 200,
                        damping: 12,
                      }}
                      className="relative mb-2"
                    >
                      {podiumRanks[i] === 1 && (
                        <Text className="absolute -top-6 left-0 right-0 text-center text-2xl z-10">
                          👑
                        </Text>
                      )}
                      <View
                        className="rounded-full overflow-hidden bg-zinc-700"
                        style={{
                          width: podiumAvatarSizes[i],
                          height: podiumAvatarSizes[i],
                          borderWidth: 2,
                          borderColor: podiumBorders[i],
                        }}
                      >
                        <Image
                          source={resolveImage(post.imageUrl)}
                          style={{ width: "100%", height: "100%" }}
                          contentFit="cover"
                        />
                      </View>
                    </MotiView>

                    {/* Username */}
                    <Text
                      numberOfLines={1}
                      className="text-[10px] font-bold text-zinc-300 text-center max-w-full"
                    >
                      @{post.user.username}
                    </Text>

                    {/* Hate count */}
                    <Text className="text-sm font-extrabold text-white mt-0.5">
                      {post.hateCount}
                    </Text>

                    {/* Podium bar */}
                    <MotiView
                      from={{ height: 0 }}
                      animate={{ height: podiumHeights[i] }}
                      transition={{
                        delay: 600 + i * 100,
                        type: "timing",
                        duration: 500,
                      }}
                      className="w-full rounded-t-xl mt-2 items-center justify-start overflow-hidden"
                    >
                      <LinearGradient
                        colors={podiumColors[i]}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style={StyleSheet.absoluteFill}
                      />
                      <Text className="text-xl mt-2">{podiumEmojis[i]}</Text>
                    </MotiView>
                  </Pressable>
                </Link>
              ))}
            </MotiView>
          )}
        </LinearGradient>

        {/* Community stats bar */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 600, type: "timing", duration: 400 }}
          className="flex-row border-b border-zinc-100"
        >
          {stats.map((stat, i) => (
            <View
              key={stat.label}
              className={`flex-1 py-3.5 items-center ${
                i < 2 ? "border-r border-zinc-100" : ""
              }`}
            >
              <View className="flex-row items-center gap-1">
                <Text className="text-sm">{stat.icon}</Text>
                <Text className="text-base font-extrabold text-zinc-900">
                  {stat.value}
                </Text>
              </View>
              <Text className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest mt-0.5">
                {stat.label}
              </Text>
            </View>
          ))}
        </MotiView>

        {/* Full ranked list */}
        <View className="px-5 mt-5">
          <Text className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 pl-1">
            Full Rankings
          </Text>

          <View className="gap-3">
            {sortedPosts.map((post, index) => {
              const barWidth = Math.max((post.hateCount / maxHates) * 100, 15);
              const isTop3 = index < 3;

              return (
                <MotiView
                  key={post.id}
                  from={{ opacity: 0, translateX: -20 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{
                    delay: 800 + index * 80,
                    type: "timing",
                    duration: 400,
                  }}
                >
                  <Link href={`/post/${post.id}` as any} asChild>
                    <Pressable
                      className={`rounded-2xl p-3.5 active:opacity-80 ${
                        isTop3
                          ? "border border-[#8B0000]/10 bg-[#8B0000]/5"
                          : "bg-zinc-50 border border-zinc-100"
                      }`}
                    >
                      <View className="flex-row items-center gap-3">
                        {/* Rank badge */}
                        <View
                          className={`w-8 h-8 rounded-lg items-center justify-center ${
                            index === 0
                              ? "bg-amber-100"
                              : index === 1
                              ? "bg-zinc-200"
                              : index === 2
                              ? "bg-orange-100"
                              : "bg-zinc-100"
                          }`}
                        >
                          {index < 3 ? (
                            <Text className="text-base">
                              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                            </Text>
                          ) : (
                            <Text className="text-sm font-extrabold text-zinc-500">
                              #{index + 1}
                            </Text>
                          )}
                        </View>

                        {/* Thumbnail */}
                        <View className="w-11 h-11 rounded-xl overflow-hidden bg-zinc-100">
                          <Image
                            source={resolveImage(post.imageUrl)}
                            style={{ width: "100%", height: "100%" }}
                            contentFit="cover"
                          />
                        </View>

                        {/* Info + progress bar */}
                        <View className="flex-1 min-w-0">
                          <View className="flex-row items-center gap-1.5 mb-0.5">
                            <Avatar
                              initials={post.user.initials}
                              color={post.user.avatarColor}
                              imageUrl={post.user.avatarUrl}
                              size="sm"
                            />
                            <Text
                              numberOfLines={1}
                              className="text-[13px] font-bold text-zinc-800 flex-1"
                            >
                              @{post.user.username}
                            </Text>
                          </View>

                          {/* Hate progress bar */}
                          <View className="flex-row items-center gap-2 mt-1.5">
                            <View className="flex-1 h-2 rounded-full bg-zinc-200/60 overflow-hidden">
                              <View
                                className="h-full rounded-full overflow-hidden"
                                style={{ width: `${barWidth}%` }}
                              >
                                <LinearGradient
                                  colors={rankBarColors(index)}
                                  start={{ x: 0, y: 0 }}
                                  end={{ x: 1, y: 0 }}
                                  style={StyleSheet.absoluteFill}
                                />
                              </View>
                            </View>
                            <Text
                              className={`text-xs font-extrabold ${
                                isTop3 ? "text-[#8B0000]" : "text-zinc-500"
                              }`}
                            >
                              {post.hateCount}
                            </Text>
                          </View>
                        </View>

                        {/* Trend indicator */}
                        <View className="items-center">
                          <Ionicons
                            name={index < 2 ? "arrow-up" : "arrow-down"}
                            size={14}
                            color={index < 2 ? "#ef4444" : "#a1a1aa"}
                          />
                          <Text className="text-[8px] font-bold text-zinc-400 uppercase mt-0.5">
                            {index < 2 ? "Hot" : "Stale"}
                          </Text>
                        </View>
                      </View>

                      {/* Caption preview for top 3 */}
                      {isTop3 && (
                        <Text
                          numberOfLines={1}
                          className="text-[11px] text-zinc-500 mt-2 pl-[76px] leading-relaxed"
                        >
                          &ldquo;{post.caption}&rdquo;
                        </Text>
                      )}
                    </Pressable>
                  </Link>
                </MotiView>
              );
            })}
          </View>
        </View>

        {/* Community CTA */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 1200, type: "timing", duration: 500 }}
          className="mx-5 mt-6 rounded-2xl overflow-hidden"
        >
          <LinearGradient
            colors={["#18181b", "#27272a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 16, alignItems: "center" }}
          >
            <Text className="text-2xl">💀</Text>
            <Text className="text-sm font-bold text-white mt-1.5">
              Know an annoying couple?
            </Text>
            <Text className="text-[11px] text-zinc-400 mt-0.5 text-center">
              Report them and let the community deliver justice.
            </Text>
            <Pressable className="mt-3 px-5 py-2 rounded-full bg-[#8B0000] active:bg-[#6B0000]">
              <Text className="text-white text-xs font-bold">Report a Couple 🔥</Text>
            </Pressable>
          </LinearGradient>
        </MotiView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 130,
  },
});
