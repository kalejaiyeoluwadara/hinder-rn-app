import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Linking,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MotiView, AnimatePresence } from "moti";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "../../components/Avatar";
import FeedCard from "../../components/FeedCard";
import { posts, currentUser } from "../../lib/mock-data";

type Tab = "hates" | "rants" | "badges";

const STATUS_OPTIONS = [
  { value: "Cringe-Immune", label: "Cringe-Immune Hater" },
  { value: "Relationship Terminator", label: "Relationship Terminator" },
  { value: "Master of Solitude", label: "Master of Solitude" },
  { value: "Unapologetic Professional", label: "Unapologetic Professional" },
  { value: "Timeline Peacekeeper", label: "Timeline Peacekeeper" },
];

const badges = [
  { emoji: "🛡️", title: "PDA Shield", type: "Sanity Defense", desc: "Immune to relationship cringe. Grants +50 peace.", unlocked: true },
  { emoji: "🔥", title: "Relation Wrecker", type: "Active Offense", desc: "Hated 10+ couples. Certified heart breaker.", unlocked: true },
  { emoji: "👑", title: "Proudly Single", type: "Legendary", desc: "Timeline is fully sanitized. Living the dream.", unlocked: true },
  { emoji: "🔒", title: "Terminator", type: "Epic Quest", desc: "Reach 1,000 hate points on feed. (840/1000)", unlocked: false },
];

const stats = [
  { label: "Flagged", value: "12" },
  { label: "Hate Points", value: "840" },
  { label: "Badges", value: "3" },
];

const UNDERLINE_WIDTH = 56;

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const user = currentUser;

  const [profile, setProfile] = useState({
    name: user.username,
    handle: `@${user.username.toLowerCase().replace(/\s+/g, "")}`,
    bio: "Unapologetically single. Professional couple hater. On a mission to restore sanity and singlehood to my timeline.",
    location: "Single Headquarters",
    website: "hinder.app/single",
    joined: "Joined October 2024",
    status: "Cringe-Immune",
  });

  const [activeTab, setActiveTab] = useState<Tab>("hates");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [tabBarWidth, setTabBarWidth] = useState(0);

  // Edit form state
  const [editName, setEditName] = useState(profile.name);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editLocation, setEditLocation] = useState(profile.location);
  const [editWebsite, setEditWebsite] = useState(profile.website);
  const [editStatus, setEditStatus] = useState(profile.status);

  // Mocked: posts this user "hated"
  const hatedPosts = posts.filter((p) => p.id !== "2");

  const tabs: { id: Tab; label: string }[] = [
    { id: "hates", label: "Hates" },
    { id: "rants", label: "Rants" },
    { id: "badges", label: "Badges" },
  ];
  const activeIndex = tabs.findIndex((t) => t.id === activeTab);
  const tabWidth = tabBarWidth / tabs.length;
  const underlineX =
    tabBarWidth > 0 ? activeIndex * tabWidth + (tabWidth - UNDERLINE_WIDTH) / 2 : 0;

  const openEdit = () => {
    setEditName(profile.name);
    setEditBio(profile.bio);
    setEditLocation(profile.location);
    setEditWebsite(profile.website);
    setEditStatus(profile.status);
    setIsEditOpen(true);
  };

  const handleSave = () => {
    setProfile({
      ...profile,
      name: editName,
      bio: editBio,
      location: editLocation,
      website: editWebsite,
      status: editStatus,
    });
    setIsEditOpen(false);
  };

  const subtitle =
    activeTab === "hates"
      ? `${hatedPosts.length} Hates`
      : activeTab === "rants"
      ? "0 Rants"
      : `${badges.filter((b) => b.unlocked).length} Badges`;

  return (
    <View className="flex-1 bg-white">
      {/* Sticky Header Bar */}
      <View
        style={{ paddingTop: insets.top }}
        className="bg-white border-b border-zinc-100 px-4 pb-2"
      >
        <View className="pt-2">
          <Text className="text-base font-extrabold text-zinc-900 tracking-tight">
            {profile.name}
          </Text>
          <Text className="text-[11px] text-zinc-400 font-medium">{subtitle}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Banner */}
        <LinearGradient
          colors={["#450a0a", "#18181b", "#8B0000"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="relative h-32 w-full overflow-hidden justify-end items-end px-4 pb-2"
        >
          <Ionicons
            name="heart-dislike"
            size={112}
            color="rgba(255,255,255,0.06)"
            style={{ position: "absolute", right: -16, bottom: -16, transform: [{ rotate: "12deg" }] }}
          />
          <Text className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
            Anti-PDA Shield
          </Text>
        </LinearGradient>

        {/* Profile Details */}
        <View className="px-4">
          {/* Avatar overlap + Edit button */}
          <View className="flex-row justify-between items-end mb-2.5" style={{ marginTop: -40 }}>
            <View className="rounded-full border-4 border-white bg-white overflow-hidden">
              <Avatar
                initials={user.initials}
                color={user.avatarColor}
                imageUrl={user.avatarUrl}
                size="xl"
              />
            </View>
            <Pressable
              onPress={openEdit}
              className="px-4 py-1.5 border border-zinc-200 rounded-full active:bg-zinc-50"
            >
              <Text className="text-xs font-bold text-zinc-900">Edit profile</Text>
            </Pressable>
          </View>

          {/* Identity */}
          <View className="gap-1">
            <Text className="text-xl font-extrabold text-zinc-950 tracking-tight">
              {profile.name}
            </Text>
            <Text className="text-xs text-zinc-400 font-semibold">{profile.handle}</Text>
          </View>

          {/* Bio */}
          <Text className="text-sm text-zinc-700 leading-normal mt-3 pr-2">
            {profile.bio}
          </Text>

          {/* Metadata */}
          <View className="flex-row flex-wrap mt-3.5 border-b border-zinc-100 pb-4">
            <MetaItem icon="location-outline" className="w-1/2 mb-1.5">
              <Text className="text-xs text-zinc-500 font-medium">{profile.location}</Text>
            </MetaItem>
            <MetaItem icon="link-outline" className="w-1/2 mb-1.5">
              <Pressable onPress={() => Linking.openURL(`https://${profile.website}`)}>
                <Text className="text-xs text-[#8B0000] font-medium">{profile.website}</Text>
              </Pressable>
            </MetaItem>
            <MetaItem icon="calendar-outline" className="w-1/2">
              <Text className="text-xs text-zinc-500 font-medium">{profile.joined}</Text>
            </MetaItem>
            <MetaItem icon="shield-checkmark-outline" className="w-1/2">
              <Text className="text-xs text-emerald-600 font-semibold">{profile.status}</Text>
            </MetaItem>
          </View>

          {/* Stats Row */}
          <View className="flex-row items-center gap-6 py-3.5 border-b border-zinc-100">
            {stats.map((stat) => (
              <View key={stat.label} className="flex-row items-baseline gap-1">
                <Text className="font-extrabold text-zinc-950 text-sm">{stat.value}</Text>
                <Text className="text-xs text-zinc-500 font-medium">{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tabs */}
        <View
          className="flex-row border-b border-zinc-100 relative"
          onLayout={(e) => setTabBarWidth(e.nativeEvent.layout.width)}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                className="flex-1 items-center py-3.5"
              >
                <Text
                  className="text-sm font-bold"
                  style={{ color: isActive ? "#09090b" : "#71717a" }}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
          {tabBarWidth > 0 && (
            <MotiView
              animate={{ translateX: underlineX }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="absolute bottom-0 h-[3px] rounded-full bg-[#8B0000]"
              style={{ width: UNDERLINE_WIDTH }}
            />
          )}
        </View>

        {/* Tab Content */}
        <View className="mt-4">
          <AnimatePresence exitBeforeEnter>
            {activeTab === "hates" && (
              <MotiView
                key="hates"
                from={{ opacity: 0, translateY: 15 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0 }}
              >
                {hatedPosts.map((post, i) => (
                  <FeedCard key={post.id} post={post} index={i} />
                ))}
              </MotiView>
            )}

            {activeTab === "rants" && (
              <MotiView
                key="rants"
                from={{ opacity: 0, translateY: 15 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0 }}
                className="items-center py-12 px-6"
              >
                <View className="w-16 h-16 bg-zinc-50 rounded-2xl items-center justify-center border border-zinc-100 mb-4">
                  <Ionicons name="megaphone-outline" size={28} color="#a1a1aa" />
                </View>
                <Text className="text-sm font-bold text-zinc-800 uppercase tracking-wide">
                  No rants yet
                </Text>
                <Text className="text-xs text-zinc-500 mt-1.5 max-w-[240px] leading-relaxed text-center">
                  Seen a couple posting cringe cheesy selfies? Spill the tea and destroy
                  their peace!
                </Text>
                <Pressable className="mt-4 px-6 py-2 bg-[#8B0000] rounded-full active:bg-[#6B0000] flex-row items-center gap-1.5">
                  <Ionicons name="add" size={14} color="#ffffff" />
                  <Text className="text-white text-xs font-bold">Report a Couple</Text>
                </Pressable>
              </MotiView>
            )}

            {activeTab === "badges" && (
              <MotiView
                key="badges"
                from={{ opacity: 0, translateY: 15 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0 }}
                className="px-4 gap-3"
              >
                {badges.map((badge, i) => (
                  <MotiView
                    key={badge.title}
                    from={{ opacity: 0, translateX: -10 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ delay: i * 80, type: "timing", duration: 300 }}
                    className={`flex-row items-center gap-4 p-3.5 rounded-2xl border ${
                      badge.unlocked
                        ? "bg-zinc-50 border-zinc-100"
                        : "bg-zinc-50/50 border-zinc-100 opacity-60"
                    }`}
                  >
                    <View
                      className={`w-12 h-12 rounded-xl items-center justify-center ${
                        badge.unlocked ? "bg-white" : "bg-zinc-100 border border-zinc-200"
                      }`}
                    >
                      <Text className="text-2xl">{badge.emoji}</Text>
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between">
                        <Text className="text-xs font-bold text-zinc-950">{badge.title}</Text>
                        <View
                          className={`px-2 py-0.5 rounded-full ${
                            badge.unlocked ? "bg-[#ffebe6]" : "bg-zinc-200"
                          }`}
                        >
                          <Text
                            className={`text-[9px] font-bold uppercase tracking-wider ${
                              badge.unlocked ? "text-[#8B0000]" : "text-zinc-500"
                            }`}
                          >
                            {badge.type}
                          </Text>
                        </View>
                      </View>
                      <Text className="text-[11px] text-zinc-500 mt-1 leading-normal">
                        {badge.desc}
                      </Text>
                    </View>
                  </MotiView>
                ))}
              </MotiView>
            )}
          </AnimatePresence>
        </View>
      </ScrollView>

      {/* Edit Profile Bottom Sheet */}
      <AnimatePresence>
        {isEditOpen && (
          <>
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 z-50"
            >
              <Pressable className="flex-1" onPress={() => setIsEditOpen(false)} />
            </MotiView>

            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className="absolute bottom-0 left-0 right-0 z-50"
            >
              <MotiView
                from={{ translateY: 700 }}
                animate={{ translateY: 0 }}
                exit={{ translateY: 700 }}
                transition={{ type: "spring", damping: 20, stiffness: 200 }}
                className="bg-white rounded-t-3xl p-6 shadow-2xl border-t border-zinc-100"
              >
                <View className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mb-4" />
                <Text className="text-lg font-bold text-zinc-900 mb-4 text-center">
                  Edit Profile
                </Text>

                <ScrollView showsVerticalScrollIndicator={false} className="max-h-[460px]">
                  <View className="gap-4 pb-2">
                    {/* Display Name */}
                    <Field label="Display Name">
                      <TextInput
                        value={editName}
                        onChangeText={setEditName}
                        placeholder="Display Name"
                        placeholderTextColor="#a1a1aa"
                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900"
                      />
                    </Field>

                    {/* Bio */}
                    <Field label="Bio">
                      <TextInput
                        value={editBio}
                        onChangeText={setEditBio}
                        placeholder="Describe your hater persona..."
                        placeholderTextColor="#a1a1aa"
                        multiline
                        numberOfLines={3}
                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 h-20"
                        style={{ textAlignVertical: "top" }}
                      />
                    </Field>

                    <View className="flex-row gap-3">
                      <View className="flex-1">
                        <Field label="Location">
                          <TextInput
                            value={editLocation}
                            onChangeText={setEditLocation}
                            placeholder="Where do you hate?"
                            placeholderTextColor="#a1a1aa"
                            className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900"
                          />
                        </Field>
                      </View>
                      <View className="flex-1">
                        <Field label="Website">
                          <TextInput
                            value={editWebsite}
                            onChangeText={setEditWebsite}
                            placeholder="Your link..."
                            placeholderTextColor="#a1a1aa"
                            className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900"
                          />
                        </Field>
                      </View>
                    </View>

                    {/* Status */}
                    <Field label="Single Status Level">
                      <View className="flex-row flex-wrap gap-2">
                        {STATUS_OPTIONS.map((opt) => {
                          const isActive = editStatus === opt.value;
                          return (
                            <Pressable
                              key={opt.value}
                              onPress={() => setEditStatus(opt.value)}
                              className={`px-3 py-2 rounded-full border ${
                                isActive
                                  ? "bg-[#8B0000] border-[#8B0000]"
                                  : "bg-white border-zinc-200"
                              }`}
                            >
                              <Text
                                className={`text-xs font-semibold ${
                                  isActive ? "text-white" : "text-zinc-600"
                                }`}
                              >
                                {opt.label}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </Field>

                    {/* Save */}
                    <Pressable
                      onPress={handleSave}
                      className="w-full py-3 mt-2 rounded-full bg-[#8B0000] active:bg-[#6B0000] items-center"
                    >
                      <Text className="text-white font-bold text-sm">Save changes</Text>
                    </Pressable>
                  </View>
                </ScrollView>
              </MotiView>
            </KeyboardAvoidingView>
          </>
        )}
      </AnimatePresence>
    </View>
  );
}

function MetaItem({
  icon,
  className,
  children,
}: {
  icon: any;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <View className={`flex-row items-center gap-1.5 ${className ?? ""}`}>
      <Ionicons name={icon} size={14} color="#a1a1aa" />
      {children}
    </View>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View>
      <Text className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
        {label}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 130,
  },
});
