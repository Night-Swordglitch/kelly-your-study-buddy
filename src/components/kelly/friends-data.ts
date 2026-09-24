export type Friend = {
  id: number;
  name: string;
  initial: string;
  avatar: string;
  status: "Studying" | "Online" | "Offline";
  level: number;
  xp: number;
  topXP?: boolean;
};

export const FRIENDS: Friend[] = [
  {
    id: 1,
    name: "Alex",
    initial: "A",
    avatar: "#5b4bdb",
    status: "Studying",
    level: 8,
    xp: 3240,
    topXP: true,
  },
  {
    id: 2,
    name: "Sarah",
    initial: "S",
    avatar: "#2563a8",
    status: "Online",
    level: 6,
    xp: 2180,
  },
  {
    id: 3,
    name: "Daniel",
    initial: "D",
    avatar: "#9b4dca",
    status: "Offline",
    level: 7,
    xp: 2760,
  },
  {
    id: 4,
    name: "Maya",
    initial: "M",
    avatar: "#b45d48",
    status: "Studying",
    level: 5,
    xp: 1840,
  },
  {
    id: 5,
    name: "Ryan",
    initial: "R",
    avatar: "#3c8c70",
    status: "Offline",
    level: 4,
    xp: 1320,
  },
];

export const SUGGESTED: Friend[] = [
  {
    id: 101,
    name: "Emma",
    initial: "E",
    avatar: "#a65a8a",
    status: "Online",
    level: 5,
    xp: 1560,
  },
  {
    id: 102,
    name: "Jason",
    initial: "J",
    avatar: "#526b9a",
    status: "Offline",
    level: 6,
    xp: 2010,
  },
];

export const RANKINGS = [
  { rank: 2, name: "Alex", initial: "A", avatar: "#5b4bdb", level: 8, xp: 3240 },
  { rank: 3, name: "Daniel", initial: "D", avatar: "#9b4dca", level: 7, xp: 2760 },
  { rank: 4, name: "Sarah", initial: "S", avatar: "#2563a8", level: 6, xp: 2180 },
  { rank: 5, name: "Maya", initial: "M", avatar: "#b45d48", level: 5, xp: 1840 },
];

export const STUDYING = [
  {
    id: 1,
    name: "Alex",
    initial: "A",
    avatar: "#5b4bdb",
  },
];
