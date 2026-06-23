import { Post, User } from "./types";

export const currentUser: User = {
  id: "u0",
  username: "single quin",
  avatarColor: "#6B21A8",
  initials: "SQ",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
};

const singlebae: User = {
  id: "u1",
  username: "singlebae",
  avatarColor: "#0D9488",
  initials: "SB",
  avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
};

const pringlesingle: User = {
  id: "u2",
  username: "pringlesingle",
  avatarColor: "#7C3AED",
  initials: "PS",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
};

const lonelyqueen: User = {
  id: "u3",
  username: "lonelyqueen",
  avatarColor: "#DB2777",
  initials: "LQ",
  avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
};

const singlet2: User = {
  id: "u4",
  username: "singlet2",
  avatarColor: "#EA580C",
  initials: "S2",
  avatarUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80",
};

const solosavage: User = {
  id: "u5",
  username: "solosavage",
  avatarColor: "#2563EB",
  initials: "SS",
  avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
};

export const posts: Post[] = [
  {
    id: "1",
    user: singlebae,
    title: "Annoying couple",
    imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop&q=80",
    caption:
      "Have you guys seen this annoying couple? always posting their nonsense self online, we can sha destroy their relationship on hinder",
    hateCount: 20,
    comments: [
      {
        id: "c1",
        user: singlet2,
        text: "ikr! very exhausting couple. I'm in oo",
        timestamp: "1 min ago",
      },
      {
        id: "c2",
        user: solosavage,
        text: "Lmaooo they think they're goals 😂 nah we moving different",
        timestamp: "3 min ago",
      },
    ],
    timestamp: "2 min ago",
  },
  {
    id: "2",
    user: pringlesingle,
    title: "Annoying couple again",
    imageUrl: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=800&auto=format&fit=crop&q=80",
    caption:
      "This one and his bae went on date and won't let us rest, na so so post and shining teeth everywhere, ugh!",
    hateCount: 20,
    comments: [
      {
        id: "c3",
        user: singlet2,
        text: "Abi oooooooooooooo. what will we not see",
        timestamp: "5 min ago",
      },
    ],
    timestamp: "2 min ago",
  },
  {
    id: "3",
    user: lonelyqueen,
    title: "PDA overload",
    imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop&q=80",
    caption:
      "These two won't stop taking selfies every 5 minutes. My timeline is SUFFERING. Someone help me report their happiness 😤",
    hateCount: 35,
    comments: [
      {
        id: "c4",
        user: singlebae,
        text: "the audacity to be this happy in public honestly",
        timestamp: "10 min ago",
      },
      {
        id: "c5",
        user: solosavage,
        text: "reporting for emotional damage 💀",
        timestamp: "8 min ago",
      },
      {
        id: "c6",
        user: pringlesingle,
        text: "They're doing it on purpose at this point",
        timestamp: "6 min ago",
      },
    ],
    timestamp: "15 min ago",
  },
  {
    id: "4",
    user: solosavage,
    title: "Matching outfits alert",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80",
    caption:
      "BRO. They came to the party in matching outfits. MATCHING. Like we don't already know they're together. The cringe is unbearable 🤮",
    hateCount: 48,
    comments: [
      {
        id: "c7",
        user: lonelyqueen,
        text: "I would simply pass away if I had to witness this irl",
        timestamp: "20 min ago",
      },
    ],
    timestamp: "30 min ago",
  },
];
