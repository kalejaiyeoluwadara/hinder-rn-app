import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MotiView, AnimatePresence } from "moti";
import { Ionicons } from "@expo/vector-icons";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { resolveImage } from "../lib/mock-data";

// ── Palette ────────────────────────────────────────────────
const INK = "#0B0B0D";
const BLOOD = "#8B0000";
const EMBER = "#EF4444";
const BONE = "#FAFAF9";
const ASH = "#A1A1AA";
const SMOKE = "#27272A";

const TOTAL_STEPS = 5;
const { width: SCREEN_W } = Dimensions.get("window");
const CARD_W = Math.min(SCREEN_W - 56, 330);
const CARD_H = CARD_W * 1.32;

const FEATURES = [
  {
    icon: "search",
    title: "Expose them",
    body: "Spotted matching outfits? Report the couple to the feed.",
  },
  {
    icon: "flame",
    title: "Pile on",
    body: "Stack hates. The cringiest couples rise up the Hall of Shame.",
  },
  {
    icon: "heart-dislike",
    title: "No mercy",
    body: "Rant in the comments. Remind them singlehood already won.",
  },
] as const;

const COUPLES = [
  {
    id: "d1",
    image: "/images/couple1.png",
    name: "The Matching Sweaters",
    crime: "Coordinated their fits. On purpose. In public.",
  },
  {
    id: "d2",
    image: "/images/couple3.png",
    name: "The PDA Patrol",
    crime: "Made out at your friend's wedding. Again.",
  },
  {
    id: "d3",
    image: "/images/couple2.png",
    name: "The Soft-Launchers",
    crime: "47 'casual' hand pics this week alone.",
  },
];

const PERSONAS = [
  { id: "Cringe-Immune", emoji: "🛡️", title: "Cringe-Immune", line: "PDA bounces right off you." },
  { id: "Relationship Terminator", emoji: "💀", title: "Relationship Terminator", line: "You end ships for sport." },
  { id: "Master of Solitude", emoji: "🧘", title: "Master of Solitude", line: "Your peace is non-negotiable." },
  { id: "Unapologetic Professional", emoji: "👑", title: "Unapologetic Pro", line: "Single, and proud of the craft." },
  { id: "Timeline Peacekeeper", emoji: "☮️", title: "Timeline Peacekeeper", line: "You cleanse feeds for the people." },
];

export default function Onboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Field-training state
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [hated, setHated] = useState(0);
  const [resistMsg, setResistMsg] = useState<string | null>(null);
  const resistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persona
  const [persona, setPersona] = useState<string | null>(null);

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };
  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const finish = async () => {
    try {
      await AsyncStorage.setItem("hinder_onboarded", "true");
    } catch {
      // non-blocking — worst case the tour shows again
    }
    router.replace("/(tabs)");
  };

  const onHate = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setHated((h) => h + 1);
    setSwipeIndex((i) => i + 1);
  };

  const onResist = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    const lines = ["There's no love here.", "Nice try. No.", "Wrong app, lover boy.", "Right is a myth."];
    setResistMsg(lines[Math.floor(Math.random() * lines.length)]);
    if (resistTimer.current) clearTimeout(resistTimer.current);
    resistTimer.current = setTimeout(() => setResistMsg(null), 1300);
  };

  const selectedPersona = PERSONAS.find((p) => p.id === persona);

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <StatusBar style="light" />

        {/* Ambient blood glow */}
        <View pointerEvents="none" style={styles.glowTop} />
        <View pointerEvents="none" style={styles.glowBottom} />

        {/* Persistent top bar (hidden on welcome) */}
        {step > 0 && (
          <View className="flex-row items-center justify-between px-5 py-3">
            <Pressable
              onPress={goBack}
              hitSlop={10}
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: SMOKE }}
            >
              <Ionicons name="chevron-back" size={18} color={BONE} />
            </Pressable>

            <HeatMeter step={step} />

            <Pressable onPress={finish} hitSlop={10}>
              <Text style={{ color: ASH }} className="text-xs font-semibold">
                Skip
              </Text>
            </Pressable>
          </View>
        )}

        {/* Animated step content */}
        <AnimatePresence exitBeforeEnter custom={direction}>
          <MotiView
            key={step}
            from={{ opacity: 0, translateX: 36 * direction }}
            animate={{ opacity: 1, translateX: 0 }}
            exit={{ opacity: 0, translateX: -36 * direction }}
            transition={{ type: "timing", duration: 320 }}
            style={styles.stepFill}
          >
            {step === 0 && <Welcome onStart={goNext} onSkip={finish} bottomInset={insets.bottom} />}

            {step === 1 && <Playbook onNext={goNext} bottomInset={insets.bottom} />}

            {step === 2 && (
              <FieldTraining
                couples={COUPLES}
                index={swipeIndex}
                hated={hated}
                resistMsg={resistMsg}
                onHate={onHate}
                onResist={onResist}
                onNext={goNext}
                bottomInset={insets.bottom}
              />
            )}

            {step === 3 && (
              <PersonaPicker
                selected={persona}
                onSelect={setPersona}
                onNext={goNext}
                bottomInset={insets.bottom}
              />
            )}

            {step === 4 && (
              <Ready persona={selectedPersona} onEnter={finish} bottomInset={insets.bottom} />
            )}
          </MotiView>
        </AnimatePresence>
      </View>
    </GestureHandlerRootView>
  );
}

// ── Heat-meter progress ────────────────────────────────────
function HeatMeter({ step }: { step: number }) {
  return (
    <View className="flex-row gap-1.5">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <View
          key={i}
          style={{
            width: i === step ? 22 : 12,
            height: 4,
            borderRadius: 999,
            backgroundColor: i <= step ? EMBER : SMOKE,
          }}
        />
      ))}
    </View>
  );
}

// ── Reusable primary CTA ───────────────────────────────────
function PrimaryButton({
  label,
  onPress,
  disabled,
  icon,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: any;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={{ opacity: disabled ? 0.4 : 1 }}>
      <LinearGradient
        colors={[EMBER, BLOOD]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cta}
      >
        <Text style={{ color: BONE }} className="text-base font-bold">
          {label}
        </Text>
        {icon && <Ionicons name={icon} size={18} color={BONE} />}
      </LinearGradient>
    </Pressable>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ color: EMBER }} className="text-[11px] font-bold uppercase tracking-[3px]">
      {children}
    </Text>
  );
}

// ── Step 0: Welcome ────────────────────────────────────────
function Welcome({
  onStart,
  onSkip,
  bottomInset,
}: {
  onStart: () => void;
  onSkip: () => void;
  bottomInset: number;
}) {
  return (
    <View className="flex-1 px-7">
      {/* Logo lockup */}
      <MotiView
        from={{ opacity: 0, translateY: -8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 80, type: "timing", duration: 400 }}
        className="flex-row items-center gap-2 pt-4"
      >
        <Ionicons name="heart-dislike" size={20} color={EMBER} />
        <Text style={{ color: BONE, letterSpacing: 4 }} className="text-base font-extrabold">
          HINDER
        </Text>
      </MotiView>

      {/* Hero */}
      <View className="flex-1 justify-center">
        <MotiView
          from={{ opacity: 0, translateY: 14 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200, type: "timing", duration: 500 }}
        >
          <Eyebrow>The anti-dating app</Eyebrow>

          <View className="mt-4">
            <Text style={{ color: BONE }} className="text-6xl font-black tracking-tighter">
              Swipe
            </Text>
            <View className="flex-row items-end">
              <Text
                style={{ color: ASH, textDecorationLine: "line-through" }}
                className="text-6xl font-black tracking-tighter"
              >
                right
              </Text>
              <Text style={{ color: EMBER }} className="text-6xl font-black tracking-tighter">
                {" "}left.
              </Text>
            </View>
          </View>

          <Text style={{ color: ASH }} className="text-base leading-relaxed mt-5 max-w-[300px]">
            Tinder helps you find love. Hinder helps you escape it — one annoying couple at a time.
          </Text>
        </MotiView>
      </View>

      {/* Actions */}
      <MotiView
        from={{ opacity: 0, translateY: 16 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 420, type: "timing", duration: 500 }}
        style={{ paddingBottom: bottomInset + 12 }}
      >
        <PrimaryButton label="Start hating" icon="flame" onPress={onStart} />
        <Pressable onPress={onSkip} hitSlop={10} className="mt-4 items-center">
          <Text style={{ color: ASH }} className="text-sm">
            Already bitter? <Text style={{ color: BONE }} className="font-semibold">Skip the tour</Text>
          </Text>
        </Pressable>
      </MotiView>
    </View>
  );
}

// ── Step 1: The Playbook ───────────────────────────────────
function Playbook({ onNext, bottomInset }: { onNext: () => void; bottomInset: number }) {
  return (
    <View className="flex-1 px-7">
      <View className="pt-2">
        <Eyebrow>The playbook</Eyebrow>
        <Text style={{ color: BONE }} className="text-3xl font-black tracking-tight mt-3">
          Three ways to win
        </Text>
      </View>

      <View className="flex-1 justify-center gap-4">
        {FEATURES.map((f, i) => (
          <MotiView
            key={f.title}
            from={{ opacity: 0, translateX: 24 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 120 + i * 110, type: "timing", duration: 420 }}
            className="flex-row items-center gap-4 p-4 rounded-2xl"
            style={{ backgroundColor: "#161618", borderWidth: 1, borderColor: SMOKE }}
          >
            <View
              className="w-12 h-12 rounded-xl items-center justify-center"
              style={{ backgroundColor: "rgba(239,68,68,0.12)" }}
            >
              <Ionicons name={f.icon as any} size={22} color={EMBER} />
            </View>
            <View className="flex-1">
              <Text style={{ color: BONE }} className="text-base font-bold">
                {f.title}
              </Text>
              <Text style={{ color: ASH }} className="text-[13px] leading-snug mt-0.5">
                {f.body}
              </Text>
            </View>
          </MotiView>
        ))}
      </View>

      <View style={{ paddingBottom: bottomInset + 12 }}>
        <PrimaryButton label="Got it" icon="arrow-forward" onPress={onNext} />
      </View>
    </View>
  );
}

// ── Step 2: Field Training (the signature) ─────────────────
function FieldTraining({
  couples,
  index,
  hated,
  resistMsg,
  onHate,
  onResist,
  onNext,
  bottomInset,
}: {
  couples: typeof COUPLES;
  index: number;
  hated: number;
  resistMsg: string | null;
  onHate: () => void;
  onResist: () => void;
  onNext: () => void;
  bottomInset: number;
}) {
  const cleansed = index >= couples.length;
  const visible = couples.slice(index, index + 3);

  return (
    <View className="flex-1 px-7">
      <View className="pt-2">
        <Eyebrow>Field training</Eyebrow>
        <Text style={{ color: BONE }} className="text-3xl font-black tracking-tight mt-3">
          This is the only direction
        </Text>
        <Text style={{ color: ASH }} className="text-sm mt-2">
          Drag a couple left to hate them. Try to swipe right — we dare you.
        </Text>
      </View>

      {/* Card stack */}
      <View className="flex-1 items-center justify-center">
        <View style={{ width: CARD_W, height: CARD_H }}>
          {cleansed ? (
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 rounded-3xl items-center justify-center"
              style={{ borderWidth: 1, borderColor: SMOKE, borderStyle: "dashed" }}
            >
              <Text className="text-5xl">✨</Text>
              <Text style={{ color: BONE }} className="text-lg font-bold mt-3">
                Timeline cleansed
              </Text>
              <Text style={{ color: ASH }} className="text-sm mt-1">
                Not a couple in sight.
              </Text>
            </MotiView>
          ) : (
            visible
              .map((couple, pos) => (
                <SwipeCard
                  key={couple.id}
                  couple={couple}
                  pos={pos}
                  isTop={pos === 0}
                  onHate={onHate}
                  onResist={onResist}
                />
              ))
              .reverse()
          )}

          {/* Resist toast */}
          <AnimatePresence>
            {resistMsg && (
              <MotiView
                from={{ opacity: 0, translateY: 8, scale: 0.9 }}
                animate={{ opacity: 1, translateY: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={styles.toast}
              >
                <Ionicons name="close-circle" size={16} color={BONE} />
                <Text style={{ color: BONE }} className="text-xs font-bold">
                  {resistMsg}
                </Text>
              </MotiView>
            )}
          </AnimatePresence>
        </View>
      </View>

      {/* Counter + CTA */}
      <View style={{ paddingBottom: bottomInset + 12 }}>
        <View className="flex-row items-center justify-center gap-1.5 mb-4">
          <Ionicons name="flame" size={14} color={hated > 0 ? EMBER : ASH} />
          <Text style={{ color: hated > 0 ? BONE : ASH }} className="text-xs font-semibold">
            {hated === 0
              ? "Hate your first couple to continue"
              : `${hated} couple${hated > 1 ? "s" : ""} exposed`}
          </Text>
        </View>
        <PrimaryButton
          label={cleansed ? "I'm a natural" : "Continue"}
          icon="arrow-forward"
          disabled={hated === 0}
          onPress={onNext}
        />
      </View>
    </View>
  );
}

function SwipeCard({
  couple,
  pos,
  isTop,
  onHate,
  onResist,
}: {
  couple: (typeof COUPLES)[number];
  pos: number;
  isTop: boolean;
  onHate: () => void;
  onResist: () => void;
}) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  const baseScale = 1 - pos * 0.05;
  const baseY = pos * 14;

  const pan = Gesture.Pan()
    .enabled(isTop)
    .onUpdate((e) => {
      // Left is free; right rubber-bands to signal "no entry"
      tx.value = e.translationX < 0 ? e.translationX : e.translationX * 0.28;
      ty.value = e.translationY * 0.35;
    })
    .onEnd((e) => {
      if (e.translationX < -110) {
        tx.value = withTiming(-SCREEN_W * 1.4, { duration: 240 }, (done) => {
          if (done) runOnJS(onHate)();
        });
        ty.value = withTiming(ty.value + 80, { duration: 240 });
      } else {
        if (e.translationX > 60) runOnJS(onResist)();
        tx.value = withSpring(0, { damping: 16 });
        ty.value = withSpring(0, { damping: 16 });
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value + baseY },
      { rotate: `${interpolate(tx.value, [-SCREEN_W, 0, SCREEN_W], [-14, 0, 14])}deg` },
      { scale: baseScale },
    ],
  }));

  const hateStamp = useAnimatedStyle(() => ({
    opacity: interpolate(tx.value, [-120, -30], [1, 0], Extrapolation.CLAMP),
  }));
  const resistStamp = useAnimatedStyle(() => ({
    opacity: interpolate(tx.value, [12, 60], [0, 1], Extrapolation.CLAMP),
  }));

  const Card = (
    <Animated.View style={[styles.card, cardStyle]}>
      <Image
        source={resolveImage(couple.image)}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={200}
      />
      {/* Bottom legibility scrim */}
      <LinearGradient
        colors={["transparent", "rgba(11,11,13,0.92)"]}
        style={styles.cardScrim}
      />

      {/* Stamps */}
      {isTop && (
        <>
          <Animated.View style={[styles.stampLeft, hateStamp]}>
            <Text style={styles.stampHateText}>HATED</Text>
          </Animated.View>
          <Animated.View style={[styles.stampRight, resistStamp]}>
            <Text style={styles.stampNoText}>NO.</Text>
          </Animated.View>
        </>
      )}

      {/* Couple info */}
      <View style={styles.cardInfo}>
        <Text style={{ color: BONE }} className="text-xl font-extrabold">
          {couple.name}
        </Text>
        <Text style={{ color: ASH }} className="text-[13px] leading-snug mt-1">
          {couple.crime}
        </Text>
      </View>
    </Animated.View>
  );

  if (!isTop) return Card;
  return <GestureDetector gesture={pan}>{Card}</GestureDetector>;
}

// ── Step 3: Persona ────────────────────────────────────────
function PersonaPicker({
  selected,
  onSelect,
  onNext,
  bottomInset,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
  onNext: () => void;
  bottomInset: number;
}) {
  return (
    <View className="flex-1 px-7">
      <View className="pt-2">
        <Eyebrow>Choose your arc</Eyebrow>
        <Text style={{ color: BONE }} className="text-3xl font-black tracking-tight mt-3">
          What kind of single are you?
        </Text>
      </View>

      <ScrollView
        className="flex-1 mt-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
      >
        {PERSONAS.map((p, i) => {
          const active = selected === p.id;
          return (
            <MotiView
              key={p.id}
              from={{ opacity: 0, translateY: 14 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: i * 70, type: "timing", duration: 320 }}
            >
              <Pressable
                onPress={() => onSelect(p.id)}
                className="flex-row items-center gap-4 p-4 rounded-2xl"
                style={{
                  backgroundColor: active ? "rgba(239,68,68,0.10)" : "#161618",
                  borderWidth: 1.5,
                  borderColor: active ? EMBER : SMOKE,
                }}
              >
                <Text className="text-3xl">{p.emoji}</Text>
                <View className="flex-1">
                  <Text style={{ color: BONE }} className="text-base font-bold">
                    {p.title}
                  </Text>
                  <Text style={{ color: ASH }} className="text-[13px] mt-0.5">
                    {p.line}
                  </Text>
                </View>
                <Ionicons
                  name={active ? "checkmark-circle" : "ellipse-outline"}
                  size={22}
                  color={active ? EMBER : SMOKE}
                />
              </Pressable>
            </MotiView>
          );
        })}
      </ScrollView>

      <View style={{ paddingBottom: bottomInset + 12, paddingTop: 8 }}>
        <PrimaryButton
          label="Lock it in"
          icon="arrow-forward"
          disabled={!selected}
          onPress={onNext}
        />
      </View>
    </View>
  );
}

// ── Step 4: Ready ──────────────────────────────────────────
function Ready({
  persona,
  onEnter,
  bottomInset,
}: {
  persona: (typeof PERSONAS)[number] | undefined;
  onEnter: () => void;
  bottomInset: number;
}) {
  return (
    <View className="flex-1 px-7">
      <View className="flex-1 items-center justify-center">
        <MotiView
          from={{ scale: 0, rotate: "-12deg" }}
          animate={{ scale: 1, rotate: "0deg" }}
          transition={{ type: "spring", damping: 11, stiffness: 140 }}
          className="w-24 h-24 rounded-3xl items-center justify-center"
          style={{ backgroundColor: "rgba(239,68,68,0.12)", borderWidth: 1, borderColor: EMBER }}
        >
          <Text className="text-5xl">{persona?.emoji ?? "💔"}</Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 14 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 220, type: "timing", duration: 500 }}
          className="items-center mt-7"
        >
          <Eyebrow>Welcome to the resistance</Eyebrow>
          <Text style={{ color: BONE }} className="text-4xl font-black tracking-tight mt-3 text-center">
            {"You're in."}
          </Text>
          <Text style={{ color: ASH }} className="text-base leading-relaxed mt-4 text-center max-w-[300px]">
            <Text style={{ color: BONE }} className="font-bold">
              {persona?.title ?? "A proud single"}
            </Text>{" "}
            reporting for duty. Your timeline just got a lot less cringe.
          </Text>
        </MotiView>
      </View>

      <View style={{ paddingBottom: bottomInset + 12 }}>
        <PrimaryButton label="Enter Hinder" icon="flame" onPress={onEnter} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: INK },
  stepFill: { flex: 1 },
  glowTop: {
    position: "absolute",
    top: -120,
    left: SCREEN_W / 2 - 180,
    width: 360,
    height: 360,
    borderRadius: 360,
    backgroundColor: "rgba(139,0,0,0.22)",
  },
  glowBottom: {
    position: "absolute",
    bottom: -160,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 300,
    backgroundColor: "rgba(239,68,68,0.06)",
  },
  cta: {
    height: 56,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  card: {
    position: "absolute",
    width: CARD_W,
    height: CARD_H,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: SMOKE,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  cardScrim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "55%",
  },
  cardInfo: { position: "absolute", left: 18, right: 18, bottom: 18 },
  stampLeft: {
    position: "absolute",
    top: 22,
    right: 18,
    transform: [{ rotate: "14deg" }],
    borderWidth: 3,
    borderColor: EMBER,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stampHateText: { color: EMBER, fontWeight: "900", fontSize: 26, letterSpacing: 1 },
  stampRight: {
    position: "absolute",
    top: 22,
    left: 18,
    transform: [{ rotate: "-14deg" }],
    borderWidth: 3,
    borderColor: BONE,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  stampNoText: { color: BONE, fontWeight: "900", fontSize: 26, letterSpacing: 1 },
  toast: {
    position: "absolute",
    alignSelf: "center",
    bottom: -8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: BLOOD,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
});
