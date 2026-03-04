const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const TABLE_NAME = "reservations"

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // These will surface clearly in the browser console during development
  // so misconfiguration can be fixed quickly.
  // eslint-disable-next-line no-console
  console.warn("Supabase env vars are missing. Reservation persistence is disabled.")
}

const baseHeaders: HeadersInit = {
  apikey: SUPABASE_ANON_KEY ?? "",
  Authorization: `Bearer ${SUPABASE_ANON_KEY ?? ""}`,
  "Content-Type": "application/json",
}

type DbReservation = {
  id: string
  date: string
  table_id: "A" | "B" | "C"
  start_slot: number
  end_slot: number
  user_id: string
  user_name: string
  phone: string
  cancel_password: string
  player_count: number
  description: string | null
}

import type { Reservation } from "./reservation-store"

function fromDb(row: DbReservation): Reservation {
  return {
    id: row.id,
    date: row.date,
    tableId: row.table_id,
    startSlot: row.start_slot,
    endSlot: row.end_slot,
    userId: row.user_id,
    userName: row.user_name,
    phone: row.phone,
    cancelPassword: row.cancel_password,
    playerCount: row.player_count,
    description: row.description ?? undefined,
  }
}

function toDb(input: Omit<Reservation, "id">): Omit<DbReservation, "id"> {
  return {
    date: input.date,
    table_id: input.tableId,
    start_slot: input.startSlot,
    end_slot: input.endSlot,
    user_id: input.userId,
    user_name: input.userName,
    phone: input.phone,
    cancel_password: input.cancelPassword,
    player_count: input.playerCount,
    description: input.description ?? null,
  }
}

export async function fetchReservations(): Promise<Reservation[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return []

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${TABLE_NAME}?select=*&order=date.asc&order=start_slot.asc`,
    {
      headers: baseHeaders,
      cache: "no-store",
    }
  )

  if (!res.ok) {
    throw new Error("Failed to load reservations from Supabase")
  }

  const data = (await res.json()) as DbReservation[]
  return data.map(fromDb)
}

export async function createReservation(
  input: Omit<Reservation, "id">
): Promise<Reservation> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase is not configured")
  }

  const payload = [toDb(input)]

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}?select=*`, {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`예약 생성에 실패했습니다: ${text}`)
  }

  const [row] = (await res.json()) as DbReservation[]
  return fromDb(row)
}

export async function deleteReservation(id: string): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase is not configured")
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${TABLE_NAME}?id=eq.${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: baseHeaders,
    }
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`예약 삭제에 실패했습니다: ${text}`)
  }
}

