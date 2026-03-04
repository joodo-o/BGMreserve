export interface Table {
  id: "A" | "B" | "C"
  label: string
  color: string
  bgClass: string
  borderClass: string
  textClass: string
  bgSlotClass: string
}

export const TABLES: Table[] = [
  {
    id: "A",
    label: "Table A",
    color: "#22c55e",
    bgClass: "bg-green-500",
    borderClass: "border-green-500",
    textClass: "text-green-400",
    bgSlotClass: "bg-green-500/20",
  },
  {
    id: "B",
    label: "Table B",
    color: "#3b82f6",
    bgClass: "bg-blue-500",
    borderClass: "border-blue-500",
    textClass: "text-blue-400",
    bgSlotClass: "bg-blue-500/20",
  },
  {
    id: "C",
    label: "Table C",
    color: "#a855f7",
    bgClass: "bg-purple-500",
    borderClass: "border-purple-500",
    textClass: "text-purple-400",
    bgSlotClass: "bg-purple-500/20",
  },
]

export interface Reservation {
  id: string
  date: string // YYYY-MM-DD
  tableId: "A" | "B" | "C"
  startSlot: number // index into TIME_SLOTS
  endSlot: number // index into TIME_SLOTS (exclusive)
  userId: string
  userName: string
  phone: string
  cancelPassword: string // 4-digit password for cancel
  playerCount: number
  description?: string
}

// 30-min intervals from 10:00 to next day 10:00 (24-hour clock).
// Indices 0..47 are start labels, index 48 is the endpoint label.
export const TIME_SLOTS: string[] = []
for (let i = 0; i < 48; i++) {
  const totalMins = 10 * 60 + i * 30
  const isNextDay = totalMins >= 24 * 60
  const minsInDay = totalMins % (24 * 60)
  const h24 = Math.floor(minsInDay / 60)
  const m = minsInDay % 60
  const minute = m.toString().padStart(2, "0")
  const hour = h24.toString().padStart(2, "0")
  TIME_SLOTS.push(`${hour}:${minute}`)
}
// Endpoint label for next-day 10:00
TIME_SLOTS.push("10:00")

export const MAX_DURATION_SLOTS = 6 // up to 3 hours

export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = (date.getMonth() + 1).toString().padStart(2, "0")
  const d = date.getDate().toString().padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function getSlotLabel(slotIndex: number): string {
  return TIME_SLOTS[slotIndex] ?? ""
}

export function hasConflict(
  reservations: Reservation[],
  date: string,
  tableId: string,
  startSlot: number,
  endSlot: number,
  excludeId?: string
): boolean {
  return reservations.some(
    (r) =>
      r.id !== excludeId &&
      r.date === date &&
      r.tableId === tableId &&
      r.startSlot < endSlot &&
      r.endSlot > startSlot
  )
}

// Seed data
export function getSeedReservations(): Reservation[] {
  const today = new Date()
  const todayStr = formatDate(today)
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const tomorrowStr = formatDate(tomorrow)

  return [
    {
      id: "seed-1",
      date: todayStr,
      tableId: "A",
      startSlot: 8,  // 11:00 AM
      endSlot: 12,   // 1:00 PM
      userId: "alex",
      userName: "Alex M.",
      phone: "010-1111-2222",
      cancelPassword: "1234",
      playerCount: 4,
      description: "친구들과 캐주얼 보드게임 세션",
    },
    {
      id: "seed-2",
      date: todayStr,
      tableId: "B",
      startSlot: 14, // 2:00 PM
      endSlot: 20,   // 4:00 PM
      userId: "sarah",
      userName: "Sarah K.",
      phone: "010-3333-4444",
      cancelPassword: "5678",
      playerCount: 3,
      description: "전략 게임 모임",
    },
    {
      id: "seed-3",
      date: todayStr,
      tableId: "C",
      startSlot: 22, // 5:00 PM
      endSlot: 26,   // 7:00 PM
      userId: "mike",
      userName: "Mike R.",
      phone: "010-5555-6666",
      cancelPassword: "0000",
      playerCount: 5,
      description: "동아리 내 정기 모임",
    },
    {
      id: "seed-4",
      date: tomorrowStr,
      tableId: "A",
      startSlot: 20, // 3:00 PM
      endSlot: 24,   // 5:00 PM
      userId: "jamie",
      userName: "Jamie L.",
      phone: "010-7777-8888",
      cancelPassword: "9999",
      playerCount: 2,
      description: "보드게임 체험 세션",
    },
  ]
}
