import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { MotiView, AnimatePresence } from "moti";
import { posts as initialPosts, currentUser } from "../../lib/mock-data";
import { Post } from "../../lib/types";
import FeedCard from "../../components/FeedCard";
import FeedCardSkeleton from "../../components/FeedCardSkeleton";
import CreatePostButton from "../../components/CreatePostButton";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

const EVIDENCE_OPTIONS = [
  {
    id: "e1",
    url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80",
    label: "Matching Outfits Cringe 😬",
  },
  {
    id: "e2",
    url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&auto=format&fit=crop&q=80",
    label: "Excessive PDA 💋",
  },
  {
    id: "e3",
    url: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=400&auto=format&fit=crop&q=80",
    label: "Cheesy Couple Portrait 📸",
  },
];

export default function FeedScreen() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [coupleName, setCoupleName] = useState("");
  const [coupleRant, setCoupleRant] = useState("");
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const closeCreateSheet = () => {
    setIsCreateOpen(false);
    setCoupleName("");
    setCoupleRant("");
    setSelectedEvidence(null);
  };

  const handlePostSubmit = () => {
    if (!coupleName.trim() || !coupleRant.trim()) return;

    const newPost: Post = {
      id: String(posts.length + 1),
      user: currentUser,
      title: coupleName,
      imageUrl: selectedEvidence || EVIDENCE_OPTIONS[0].url,
      caption: coupleRant,
      hateCount: 1, // Freshly exposes start with 1 hate by default
      comments: [],
      timestamp: "Just now",
    };

    setPosts([newPost, ...posts]);
    closeCreateSheet();
  };

  return (
    <View className="flex-1 bg-zinc-50">
      {/* Feed List */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <FeedCard post={item} index={index} />
        )}
        ListHeaderComponent={
          <View className="px-5 mt-4 mb-6">
            <CreatePostButton onPress={() => setIsCreateOpen(true)} />
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20 px-5">
            <Text className="text-zinc-400 font-medium">No couples reported yet!</Text>
          </View>
        }
      />

      {/* Simulated Skeletons Loading Overlay */}
      {isLoading && (
        <View className="absolute inset-0 bg-zinc-50 pt-4 z-40">
          <View className="px-5 mt-4 mb-6">
            <View className="w-full h-[52px] rounded-full bg-zinc-200 animate-pulse" />
          </View>
          <FeedCardSkeleton />
          <FeedCardSkeleton />
        </View>
      )}

      {/* Create Post Bottom Sheet Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <>
            {/* Backdrop */}
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 z-50"
            >
              <Pressable className="flex-1" onPress={closeCreateSheet} />
            </MotiView>

            {/* Sheet Container */}
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className="absolute bottom-0 left-0 right-0 z-50"
            >
              <MotiView
                from={{ translateY: 650 }}
                animate={{ translateY: 0 }}
                exit={{ translateY: 650 }}
                transition={{ type: "spring", damping: 20, stiffness: 200 }}
                className="bg-white rounded-t-3xl p-6 shadow-2xl border-t border-zinc-100"
              >
                {/* Drag Handle Indicator */}
                <View className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mb-4" />

                <Text className="text-lg font-bold text-zinc-900 mb-4 text-center">
                  Report an annoying couple
                </Text>

                {/* Form fields */}
                <View className="gap-4">
                  {/* Name Input */}
                  <View>
                    <Text className="text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wide">
                      Give them a name
                    </Text>
                    <TextInput
                      value={coupleName}
                      onChangeText={setCoupleName}
                      placeholder="e.g. The PDA Kings"
                      placeholderTextColor="#a1a1aa"
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-50 text-zinc-900 border border-zinc-200 text-sm"
                    />
                  </View>

                  {/* Rant Input */}
                  <View>
                    <Text className="text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wide">
                      Why are they annoying?
                    </Text>
                    <TextInput
                      value={coupleRant}
                      onChangeText={setCoupleRant}
                      placeholder="Spill the tea... 🍵"
                      placeholderTextColor="#a1a1aa"
                      multiline
                      numberOfLines={3}
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-50 text-zinc-900 border border-zinc-200 text-sm h-20"
                      style={{ textAlignVertical: "top" }}
                    />
                  </View>

                  {/* Photographic Evidence Selection */}
                  <View>
                    <Text className="text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wide">
                      Photographic Evidence
                    </Text>
                    {selectedEvidence ? (
                      <View className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 mb-2">
                        <Image
                          source={{ uri: selectedEvidence }}
                          className="w-full h-full"
                          contentFit="cover"
                        />
                        <Pressable
                          onPress={() => setSelectedEvidence(null)}
                          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 active:bg-black/80"
                        >
                          <Ionicons name="close" size={16} color="white" />
                        </Pressable>
                        <View className="absolute bottom-2.5 left-2.5 bg-black/60 px-2.5 py-1 rounded-md">
                          <Text className="text-[9px] font-extrabold text-white uppercase tracking-wider">
                            Evidence Loaded 📸
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View className="flex-row gap-2 mb-2">
                        {EVIDENCE_OPTIONS.map((option) => (
                          <Pressable
                            key={option.id}
                            onPress={() => setSelectedEvidence(option.url)}
                            className="flex-1 aspect-square rounded-xl overflow-hidden border-2 border-transparent active:opacity-90 relative"
                          >
                            <Image
                              source={{ uri: option.url }}
                              className="w-full h-full"
                              contentFit="cover"
                            />
                            <View className="absolute inset-0 bg-black/20 flex items-center justify-end p-1">
                              <Text className="text-[8px] font-bold text-white text-center leading-none">
                                {option.id === "e1" ? "Outfits" : option.id === "e2" ? "PDA" : "Cheesy"}
                              </Text>
                            </View>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Submit Button */}
                  <Pressable
                    onPress={handlePostSubmit}
                    disabled={!coupleName.trim() || !coupleRant.trim()}
                    className={`w-full py-4 rounded-full items-center justify-center mt-2 ${
                      coupleName.trim() && coupleRant.trim()
                        ? "bg-red-950 active:bg-red-900"
                        : "bg-zinc-200"
                    }`}
                  >
                    <Text
                      className={`font-semibold text-base ${
                        coupleName.trim() && coupleRant.trim() ? "text-white" : "text-zinc-400"
                      }`}
                    >
                      Post to Hinder 🔥
                    </Text>
                  </Pressable>
                </View>
              </MotiView>
            </KeyboardAvoidingView>
          </>
        )}
      </AnimatePresence>
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingTop: 16,
    paddingBottom: 110, // Ensure space to scroll past the absolute floating BottomNav
  },
});
