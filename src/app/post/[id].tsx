import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { MotiView, AnimatePresence } from "moti";
import { posts as initialPosts, resolveImage, currentUser } from "../../lib/mock-data";
import { Post, Comment } from "../../lib/types";
import Avatar from "../../components/Avatar";
import HateBadge from "../../components/HateBadge";
import HateButton from "../../components/HateButton";
import PostDetailSkeleton from "../../components/PostDetailSkeleton";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(true);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [post, setPost] = useState<Post | undefined>(() =>
    initialPosts.find((p) => p.id === id)
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [id]);

  if (!post) {
    return (
      <View style={{ paddingTop: insets.top }} className="flex-1 items-center justify-center bg-zinc-50">
        <Text className="text-zinc-500 font-medium mb-4">Post not found</Text>
        <Pressable
          onPress={() => router.back()}
          className="bg-red-950 px-5 py-3 rounded-full active:bg-red-900"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  if (isLoading) {
    return <PostDetailSkeleton />;
  }

  const handleHate = () => {
    // Update local post state
    const updatedPost = {
      ...post,
      hateCount: post.hateCount + 1,
    };
    setPost(updatedPost);

    // Sync back to initialPosts array so the Feed card gets updated count when navigating back
    const globalPost = initialPosts.find((p) => p.id === id);
    if (globalPost) {
      globalPost.hateCount += 1;
    }
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `c${post.comments.length + 1}`,
      user: currentUser,
      text: commentText,
      timestamp: "Just now",
    };

    // Update local post state
    const updatedPost = {
      ...post,
      comments: [...post.comments, newComment],
    };
    setPost(updatedPost);

    // Sync back to initialPosts array
    const globalPost = initialPosts.find((p) => p.id === id);
    if (globalPost) {
      globalPost.comments.push(newComment);
    }

    // Close and reset form
    setIsCommentOpen(false);
    setCommentText("");
  };

  const handleDestroy = () => {
    Alert.alert(
      "Relationship Destroyed 💀",
      `Exterminators sent to expose ${post.title}! The cringe ends today.`,
      [{ text: "Excellent" }]
    );
  };

  return (
    <View className="flex-1 bg-zinc-50">
      {/* Custom Post Header */}
      <View
        style={{ paddingTop: insets.top }}
        className="bg-white border-b border-zinc-100/60 shadow-sm flex-row items-center gap-3 px-5 pb-3 pt-3"
      >
        <Pressable
          onPress={() => router.back()}
          className="p-1 -ml-1 rounded-full active:bg-zinc-100"
        >
          <Ionicons name="chevron-back" size={24} color="#18181b" />
        </Pressable>
        <Text className="text-lg font-bold text-zinc-900">{post.title}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Couple Image */}
        <MotiView
          from={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 400 }}
          className="px-5 mt-4"
        >
          <View className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-100">
            <Image
              source={resolveImage(post.imageUrl)}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={300}
            />
            <HateBadge count={post.hateCount} />
          </View>
        </MotiView>

        {/* Post Info Section */}
        <MotiView
          from={{ opacity: 0, translateY: 15 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 150, duration: 400 }}
          className="px-5 mt-4"
        >
          {/* User Row */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Avatar
                initials={post.user.initials}
                color={post.user.avatarColor}
                imageUrl={post.user.avatarUrl}
                size="sm"
              />
              <Text className="text-sm font-semibold text-zinc-900">
                {`@${post.user.username}'s post`}
              </Text>
            </View>

            <Pressable
              onPress={handleDestroy}
              className="flex-row items-center gap-0.5 active:opacity-60"
            >
              <Text className="text-sm font-bold text-red-950">Destroy with Hinder</Text>
              <Ionicons name="chevron-forward" size={14} color="#450a0a" />
            </Pressable>
          </View>

          {/* Timestamp */}
          <Text className="text-xs text-zinc-400 mt-1 pl-10">
            {post.timestamp}
          </Text>

          {/* Caption */}
          <Text className="text-sm text-zinc-700 leading-relaxed mt-4 px-1">
            {post.caption}
          </Text>
        </MotiView>

        {/* Comment Section Header */}
        <MotiView
          from={{ opacity: 0, translateY: 15 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 300, duration: 400 }}
          className="px-5 mt-6"
        >
          <View className="flex-row items-center justify-between border-b border-zinc-100 pb-3 mb-4">
            <Text className="text-sm font-bold text-zinc-900">Comments</Text>
            <Pressable
              onPress={() => setIsCommentOpen(true)}
              className="flex-row items-center gap-1 px-3 py-1.5 rounded-full bg-[#ffebe6] active:bg-[#ffddd6]"
            >
              <Text className="text-xs font-bold text-[#cc3333]">+</Text>
              <Text className="text-xs font-bold text-[#cc3333]">Add comment</Text>
            </Pressable>
          </View>

          {/* Comments List */}
          {post.comments.length === 0 ? (
            <View className="items-center py-6">
              <Text className="text-xs text-zinc-400 font-medium">Be the first to hate on this couple! 😈</Text>
            </View>
          ) : (
            <View className="gap-4">
              {post.comments.map((comment, index) => (
                <MotiView
                  key={comment.id}
                  from={{ opacity: 0, translateY: 10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ delay: index * 80, duration: 300 }}
                  className="flex-row gap-3"
                >
                  <Avatar
                    initials={comment.user.initials}
                    color={comment.user.avatarColor}
                    imageUrl={comment.user.avatarUrl}
                    size="sm"
                  />
                  <View className="flex-1 min-w-0">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm font-bold text-zinc-900">
                        @{comment.user.username}
                      </Text>
                      <Pressable className="active:opacity-50">
                        <Text className="text-xs font-bold text-zinc-500">Reply</Text>
                      </Pressable>
                    </View>
                    <Text className="text-sm text-zinc-600 leading-relaxed mt-0.5">
                      {comment.text}
                    </Text>
                  </View>
                </MotiView>
              ))}
            </View>
          )}
        </MotiView>

        {/* Hate Button Container */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 450, duration: 400 }}
          className="px-5 mt-8"
        >
          <HateButton onHate={handleHate} />
        </MotiView>
      </ScrollView>

      {/* Add Comment Bottom Sheet Modal */}
      <AnimatePresence>
        {isCommentOpen && (
          <>
            {/* Backdrop */}
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 z-50"
            >
              <Pressable className="flex-1" onPress={() => setIsCommentOpen(false)} />
            </MotiView>

            {/* Sheet Container */}
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className="absolute bottom-0 left-0 right-0 z-50"
            >
              <MotiView
                from={{ translateY: 400 }}
                animate={{ translateY: 0 }}
                exit={{ translateY: 400 }}
                transition={{ type: "spring", damping: 20, stiffness: 200 }}
                className="bg-white rounded-t-3xl p-6 shadow-2xl border-t border-zinc-100"
              >
                {/* Drag Handle Indicator */}
                <View className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mb-4" />

                <Text className="text-lg font-bold text-zinc-900 mb-4 text-center">
                  Add a comment
                </Text>

                <TextInput
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholder="What do you think about this annoying couple? 💀"
                  placeholderTextColor="#a1a1aa"
                  multiline
                  numberOfLines={3}
                  className="w-full px-4 py-3.5 rounded-xl bg-zinc-50 text-zinc-900 border border-zinc-200 text-sm h-24 mb-4"
                  style={{ textAlignVertical: "top" }}
                  autoFocus
                />

                <Pressable
                  onPress={handleAddComment}
                  disabled={!commentText.trim()}
                  className={`w-full py-4 rounded-full items-center justify-center ${
                    commentText.trim() ? "bg-red-950 active:bg-red-900" : "bg-zinc-200"
                  }`}
                >
                  <Text
                    className={`font-semibold text-base ${
                      commentText.trim() ? "text-white" : "text-zinc-400"
                    }`}
                  >
                    Post comment 💬
                  </Text>
                </Pressable>
              </MotiView>
            </KeyboardAvoidingView>
          </>
        )}
      </AnimatePresence>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 48,
  },
});
