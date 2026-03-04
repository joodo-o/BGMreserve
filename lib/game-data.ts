export interface BoardGame {
  id: string
  name: string
  genre: string
  playerCount: string
  weight: "Light" | "Medium" | "Heavy"
  playTime: string
  description: string
  available: boolean
  reservedBy?: string
  reservedSlot?: string
}

export const boardGames: BoardGame[] = [
  {
    id: "1",
    name: "Catan",
    genre: "Strategy",
    playerCount: "3-4",
    weight: "Medium",
    playTime: "60-120 min",
    description: "Trade, build, and settle on the island of Catan.",
    available: true,
  },
  {
    id: "2",
    name: "Ticket to Ride",
    genre: "Family",
    playerCount: "2-5",
    weight: "Light",
    playTime: "30-60 min",
    description: "Collect train cards and claim railway routes across the map.",
    available: true,
  },
  {
    id: "3",
    name: "Gloomhaven",
    genre: "Dungeon Crawler",
    playerCount: "1-4",
    weight: "Heavy",
    playTime: "60-150 min",
    description: "A tactical combat campaign in a persistent fantasy world.",
    available: false,
    reservedBy: "Alex M.",
    reservedSlot: "Friday 7:00 PM",
  },
  {
    id: "4",
    name: "Codenames",
    genre: "Party",
    playerCount: "4-8",
    weight: "Light",
    playTime: "15-30 min",
    description: "Give one-word clues to help your team guess the right words.",
    available: true,
  },
  {
    id: "5",
    name: "Terraforming Mars",
    genre: "Strategy",
    playerCount: "1-5",
    weight: "Heavy",
    playTime: "120-180 min",
    description: "Compete as corporations to terraform Mars.",
    available: true,
  },
  {
    id: "6",
    name: "Wingspan",
    genre: "Strategy",
    playerCount: "1-5",
    weight: "Medium",
    playTime: "40-70 min",
    description: "Attract birds to your wildlife preserves in this engine-building game.",
    available: false,
    reservedBy: "Sarah K.",
    reservedSlot: "Saturday 3:00 PM",
  },
  {
    id: "7",
    name: "Pandemic",
    genre: "Cooperative",
    playerCount: "2-4",
    weight: "Medium",
    playTime: "45-60 min",
    description: "Work together to cure diseases before they spread worldwide.",
    available: true,
  },
  {
    id: "8",
    name: "Azul",
    genre: "Abstract",
    playerCount: "2-4",
    weight: "Light",
    playTime: "30-45 min",
    description: "Draft colorful tiles and decorate your palace wall.",
    available: true,
  },
  {
    id: "9",
    name: "Scythe",
    genre: "Strategy",
    playerCount: "1-5",
    weight: "Heavy",
    playTime: "90-120 min",
    description: "Lead your faction in an alternate-history 1920s Europe.",
    available: false,
    reservedBy: "Mike R.",
    reservedSlot: "Sunday 2:00 PM",
  },
  {
    id: "10",
    name: "7 Wonders",
    genre: "Card Game",
    playerCount: "3-7",
    weight: "Medium",
    playTime: "30-45 min",
    description: "Develop your ancient civilization and build architectural wonders.",
    available: true,
  },
  {
    id: "11",
    name: "Root",
    genre: "Strategy",
    playerCount: "2-4",
    weight: "Heavy",
    playTime: "60-90 min",
    description: "Asymmetric woodland warfare for dominance of the forest.",
    available: true,
  },
  {
    id: "12",
    name: "Dixit",
    genre: "Party",
    playerCount: "3-8",
    weight: "Light",
    playTime: "30-45 min",
    description: "Use imaginative clues to guess beautifully illustrated cards.",
    available: true,
  },
  {
    id: "13",
    name: "Brass: Birmingham",
    genre: "Strategy",
    playerCount: "2-4",
    weight: "Heavy",
    playTime: "120-180 min",
    description: "Build industries and networks during the Industrial Revolution.",
    available: true,
  },
  {
    id: "14",
    name: "Splendor",
    genre: "Card Game",
    playerCount: "2-4",
    weight: "Light",
    playTime: "30-45 min",
    description: "Collect gem tokens and build your gem trading empire.",
    available: false,
    reservedBy: "Jamie L.",
    reservedSlot: "Friday 5:00 PM",
  },
  {
    id: "15",
    name: "Spirit Island",
    genre: "Cooperative",
    playerCount: "1-4",
    weight: "Heavy",
    playTime: "90-120 min",
    description: "Play as spirits defending your island from colonizers.",
    available: true,
  },
  {
    id: "16",
    name: "Mysterium",
    genre: "Cooperative",
    playerCount: "2-7",
    weight: "Light",
    playTime: "45-60 min",
    description: "A ghost sends visions to help psychics solve a murder.",
    available: true,
  },
]

export const genres = [
  "All",
  "Strategy",
  "Family",
  "Party",
  "Cooperative",
  "Dungeon Crawler",
  "Abstract",
  "Card Game",
]

export const weights: ("All" | "Light" | "Medium" | "Heavy")[] = [
  "All",
  "Light",
  "Medium",
  "Heavy",
]

export const playerCounts = ["All", "1-2", "3-4", "5+"]

export const timeSlots = [
  "Friday 5:00 PM",
  "Friday 7:00 PM",
  "Saturday 1:00 PM",
  "Saturday 3:00 PM",
  "Saturday 7:00 PM",
  "Sunday 2:00 PM",
  "Sunday 5:00 PM",
]
