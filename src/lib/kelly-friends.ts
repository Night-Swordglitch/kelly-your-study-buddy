export type KellyFriend = {
  id: number;
  name: string;
  initial: string;
  avatar: string;
  status: "Studying" | "Online" | "Offline";
  level: number;
};

export const FRIENDS: KellyFriend[] = [
  { id: 1, name: "Alex", initial: "A", avatar: "#5b4bdb", status: "Studying", level: 8 },
  { id: 2, name: "Sarah", initial: "S", avatar: "#2563a8", status: "Online", level: 6 },
  { id: 3, name: "Daniel", initial: "D", avatar: "#9b4dca", status: "Offline", level: 7 },
  { id: 4, name: "Maya", initial: "M", avatar: "#b45d48", status: "Studying", level: 5 },
  { id: 5, name: "Ryan", initial: "R", avatar: "#3c8c70", status: "Offline", level: 4 },
  { id: 6, name: "Emma", initial: "E", avatar: "#a65a8a", status: "Online", level: 5 },
  { id: 7, name: "Jason", initial: "J", avatar: "#526b9a", status: "Offline", level: 6 },
];
