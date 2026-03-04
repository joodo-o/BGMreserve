"use client"

import { useState, useMemo, useCallback } from "react"
import Image from "next/image"
import { Calendar } from "@/components/ui/calendar"
import {
  TABLES,
  TIME_SLOTS,
  MAX_DURATION_SLOTS,
  formatDate,
  getSlotLabel,
  hasConflict,
  getSeedReservations,
  type Reservation,
  type Table,
} from "@/lib/reservation-store"
import {
  CalendarClock,
  AlertTriangle,
  CheckCircle2,
  Users,
  Clock,
  X,
  Phone,
  Mail,
  User,
  KeyRound,
  Monitor,
  Dice5,
  MessageSquareText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"

const ADMIN_CANCEL_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_CODE2

// ─── Timeline row for one table ────────────────────────────────────────
function TimelineRow({
  table,
  reservations,
  selectedDate,
}: {
  table: Table
  reservations: Reservation[]
  selectedDate: string
}) {
  const dayReservations = reservations.filter(
    (r) => r.date === selectedDate && r.tableId === table.id
  )

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 px-1 pb-1">
        <div
          className={`h-3 w-3 rounded-full ${table.bgClass}`}
          style={{
            boxShadow: `0 0 8px ${table.color}60`,
          }}
        />
        <span className={`text-xs font-semibold ${table.textClass}`}>
          {table.label}
        </span>
      </div>
      <div className="flex gap-px">
        {TIME_SLOTS.map((slot, idx) => {
          const reservation = dayReservations.find(
            (r) => idx >= r.startSlot && idx < r.endSlot
          )
          const isBooked = !!reservation
          const isStart = reservation?.startSlot === idx

          return (
            <div
              key={idx}
              className={`group relative flex h-10 flex-1 items-center justify-center border transition-colors ${
                isBooked
                  ? `${table.bgSlotClass} ${table.borderClass}/30 border`
                  : "border-border/30 bg-[#262626] hover:bg-[#333333]"
              } ${idx === 0 ? "rounded-l-md" : ""} ${
                idx === TIME_SLOTS.length - 1 ? "rounded-r-md" : ""
              }`}
              title={
                isBooked
                  ? `${reservation.userName} (${getSlotLabel(reservation.startSlot)} - ${getSlotLabel(reservation.endSlot)})`
                  : `${slot} - Open`
              }
            >
              {isStart && (
                <span
                  className={`absolute left-1 text-[9px] font-medium ${table.textClass} hidden lg:block truncate max-w-full px-0.5`}
                >
                  {reservation.userName}
                </span>
              )}
              {isBooked && (
                <div
                  className={`absolute inset-0 opacity-10 ${table.bgClass}`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const SLOT_COUNT = 48
const MIN_SLOT_WIDTH = 24
const TIMELINE_MIN_WIDTH = SLOT_COUNT * MIN_SLOT_WIDTH
const MIDNIGHT_INDEX = TIME_SLOTS.findIndex((slot) => slot === "00:00")
const HAS_MIDNIGHT = MIDNIGHT_INDEX !== -1

// ─── Time labels row (scrollable) ─────────────────────────────────────
function TimeLabels({ selectedDate }: { selectedDate: Date }) {
  const nextDate = new Date(selectedDate)
  nextDate.setDate(selectedDate.getDate() + 1)
  const nextMonth = (nextDate.getMonth() + 1).toString().padStart(2, "0")
  const nextDay = nextDate.getDate().toString().padStart(2, "0")
  const nextDateLabel = `${nextMonth}/${nextDay}`

  return (
    <div
      className="flex gap-px"
      style={{ minWidth: TIMELINE_MIN_WIDTH }}
    >
      {TIME_SLOTS.slice(0, SLOT_COUNT).map((slot, idx) => {
        const isMidnight = HAS_MIDNIGHT && idx === MIDNIGHT_INDEX
        const showLabel = idx % 2 === 0 || isMidnight

        return (
          <div
            key={idx}
            className="relative flex h-7 flex-1 items-end justify-center text-[8px] leading-none lg:text-[10px] text-muted-foreground"
          >
            {isMidnight && (
              <span className="pointer-events-none absolute top-0 text-[9px] text-muted-foreground/75">
                {nextDateLabel}
              </span>
            )}
            <span className="pb-0.5">{showLabel ? slot : ""}</span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Booking form ────────────────────────────────────────────────────
function BookingForm({
  selectedDate,
  reservations,
  onBook,
  isWithinBookingWindow,
  isPastDate,
}: {
  selectedDate: string
  reservations: Reservation[]
  onBook: (r: Omit<Reservation, "id">) => void
  isWithinBookingWindow: boolean
  isPastDate: boolean
}) {
  const [userName, setUserName] = useState("")
  const [phone, setPhone] = useState("")
  const [cancelPassword, setCancelPassword] = useState("")
  const [tableId, setTableId] = useState("")
  const [startSlot, setStartSlot] = useState("")
  const [endSlot, setEndSlot] = useState("")
  const [playerCount, setPlayerCount] = useState("2")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [description, setDescription] = useState("")

  // Admin override is triggered by special name in the "이름" field
  const isAdminOverride = userName.trim() === process.env.NEXT_PUBLIC_ADMIN_CODE
  const isBookingTemporarilyDisabled =
    (!isWithinBookingWindow || isPastDate) && !isAdminOverride

  const handleSubmit = useCallback(() => {
    setError("")
    setSuccess(false)

    if (!isAdminOverride) {
      if (!isWithinBookingWindow) {
        setError("해당 날짜는 예약 가능 기간(3주) 밖입니다.")
        return
      }
      if (isPastDate) {
        setError("오늘 이전 날짜에는 신규 예약을 할 수 없습니다.")
        return
      }
    }

    if (!userName.trim()) {
      setError("이름을 입력해주세요.")
      return
    }
    if (!phone.trim()) {
      setError("휴대폰 번호를 입력해주세요.")
      return
    }
    const cp = cancelPassword.trim()
    if (cp.length !== 4 || !/^\d{4}$/.test(cp)) {
      setError("취소 비밀번호는 4자리 숫자여야 합니다.")
      return
    }
    if (!tableId || !startSlot || !endSlot) {
      setError("모든 필드를 입력해주세요.")
      return
    }

    const start = parseInt(startSlot)
    const end = parseInt(endSlot)

    if (end <= start) {
      setError("종료 시간은 시작 시간 이후여야 합니다.")
      return
    }

    if (end - start > MAX_DURATION_SLOTS) {
      setError("최대 예약 가능 시간은 3시간입니다.")
      return
    }

    if (hasConflict(reservations, selectedDate, tableId, start, end)) {
      setError(
        "해당 시간에는 이미 예약이 있습니다. 다른 시간이나 테이블을 선택해주세요."
      )
      return
    }

    const players = parseInt(playerCount)
    if (isNaN(players) || players < 1 || players > 9) {
      setError("인원 수는 1명 이상 9명 이하로 입력해주세요.")
      return
    }

    const isAdmin = isAdminOverride
    const safeUserName = isAdmin ? "관리자" : userName.trim()
    const safeUserId = isAdmin ? "admin" : userName.trim()

    onBook({
      date: selectedDate,
      tableId: tableId as "A" | "B" | "C",
      startSlot: start,
      endSlot: end,
      userId: safeUserId,
      userName: safeUserName,
      phone: phone.trim(),
      cancelPassword: cp,
      playerCount: players,
      description: description.trim() || undefined,
    })

    setTableId("")
    setStartSlot("")
    setEndSlot("")
    setPlayerCount("2")
    setCancelPassword("")
    setDescription("")
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }, [
    userName,
    phone,
    cancelPassword,
    tableId,
    startSlot,
    endSlot,
    playerCount,
    selectedDate,
    reservations,
    onBook,
    isWithinBookingWindow,
    isPastDate,
    isAdminOverride,
  ])

  // Build available end slots based on selected start (label only, no duration)
  const endOptions = useMemo(() => {
    if (!startSlot) return []
    const start = parseInt(startSlot)
    const maxEnd = Math.min(start + MAX_DURATION_SLOTS, 48)
    const options: { value: string; label: string }[] = []
    for (let i = start + 1; i <= maxEnd; i++) {
      const label = TIME_SLOTS[i] ?? ""
      const blocked =
        tableId &&
        hasConflict(reservations, selectedDate, tableId, start, i)
      if (!blocked && label) {
        options.push({ value: i.toString(), label })
      }
    }
    return options
  }, [startSlot, tableId, reservations, selectedDate])

  const PLAYER_OPTIONS = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9+" },
  ]

  return (
    <div className="rounded-xl border border-neon-red/30 bg-card p-5">
      <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
        <CalendarClock className="h-4 w-4 text-neon-red" />
        새로운 예약
      </h3>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            이름
          </label>
          <Input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="홍길동"
            className="border-border bg-secondary text-foreground focus-visible:ring-neon-red h-9 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground flex items-center gap-1">
            <Phone className="h-3 w-3" />
            연락처
          </label>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-1234-5678"
            className="border-border bg-secondary text-foreground focus-visible:ring-neon-red h-9 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground flex items-center gap-1">
              <Monitor className="h-3.5 w-3.5" />
              테이블
            </label>
            <Select value={tableId} onValueChange={(v) => { setTableId(v); setEndSlot("") }}>
              <SelectTrigger className="border-border bg-secondary text-foreground focus:ring-neon-red h-9 text-sm w-full">
                <SelectValue placeholder="테이블 #" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-foreground">
                {TABLES.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    <span className="flex items-center gap-2">
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${t.bgClass}`}
                      />
                      {t.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" />
              인원
            </label>
            <Select value={playerCount} onValueChange={setPlayerCount}>
              <SelectTrigger className="border-border bg-secondary text-foreground focus:ring-neon-red h-9 text-sm w-full">
                <SelectValue placeholder="인원을 선택하세요" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-foreground">
                {PLAYER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground flex items-center gap-1">
            <MessageSquareText className="h-3.5 w-3.5" />
            예약 설명
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="진행하는 모임 단위, 플레이할 예정인 보드게임, 추가 신청 가능 여부 등을 적어주세요."
            className="min-h-[72px] resize-y rounded-md border border-border bg-secondary px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-red"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              시작 시간
            </label>
            <Select value={startSlot} onValueChange={(v) => { setStartSlot(v); setEndSlot("") }}>
              <SelectTrigger className="border-border bg-secondary text-foreground focus:ring-neon-red h-9 text-sm w-full">
                <SelectValue placeholder="시작 시간 선택" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-foreground max-h-52">
                {TIME_SLOTS.slice(0, SLOT_COUNT).map((slot, idx) => (
                  <SelectItem key={idx} value={idx.toString()}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              종료 시간
            </label>
            <Select value={endSlot} onValueChange={setEndSlot} disabled={!startSlot}>
              <SelectTrigger className="border-border bg-secondary text-foreground focus:ring-neon-red h-9 text-sm w-full">
                <SelectValue placeholder="종료 시간을 선택" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-foreground max-h-52">
                {endOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground flex items-center gap-1">
            <KeyRound className="h-3.5 w-3.5" />
            취소 비밀번호 (4자리 숫자)
          </label>
          <Input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={cancelPassword}
            onChange={(e) => setCancelPassword(e.target.value.replace(/\D/g, ""))}
            placeholder="4자리 숫자 (예: 0000)"
            className="border-border bg-secondary text-foreground focus-visible:ring-neon-red h-9 text-sm"
          />
        </div>

        {error && (
          <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>예약 오류</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-lg border border-cyber-lime/30 bg-cyber-lime/10 px-3 py-2 text-sm text-cyber-lime">
            <CheckCircle2 className="h-4 w-4" />
            예약이 완료되었습니다!
          </div>
        )}

        <Button
          onClick={handleSubmit}
          className="w-full bg-neon-red text-primary-foreground hover:bg-neon-red/90 neon-glow-red font-semibold text-sm"
          size="sm"
          disabled={isBookingTemporarilyDisabled}
        >
          예약하기
        </Button>
      </div>
    </div>
  )
}

// ─── Reservations list for the day ───────────────────────────────────
function DayReservationsList({
  reservations,
  selectedDate,
  onShowDetail,
  onRequestCancel,
}: {
  reservations: Reservation[]
  selectedDate: string
  onShowDetail: (r: Reservation) => void
  onRequestCancel: (r: Reservation) => void
}) {
  const dayReservations = reservations
    .filter((r) => r.date === selectedDate)
    .slice()
    .sort((a, b) => {
      const order: Record<"A" | "B" | "C", number> = { A: 0, B: 1, C: 2 }
      const tableDiff = order[a.tableId] - order[b.tableId]
      if (tableDiff !== 0) return tableDiff
      return a.startSlot - b.startSlot
    })

  if (dayReservations.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card/50 p-6 text-center">
        <CalendarClock className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          예약이 없습니다.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm font-medium text-muted-foreground">
        예약 목록 ({dayReservations.length})
      </h4>
      {dayReservations.map((r) => {
        const table = TABLES.find((t) => t.id === r.tableId)!
        return (
          <div
            key={r.id}
            className={`flex items-center justify-between gap-3 rounded-lg border bg-card p-3 ${table.borderClass}/20`}
          >
            <button
              type="button"
              onClick={() => onShowDetail(r)}
              className="flex flex-1 items-center gap-3 min-w-0 text-left hover:opacity-90"
            >
              <div
                className={`h-8 w-1 shrink-0 rounded-full ${table.bgClass}`}
                style={{ boxShadow: `0 0 6px ${table.color}60` }}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {r.userName}{" "}
                  <span className={`text-xs ${table.textClass}`}>
                    {table.label}
                  </span>
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>
                    {getSlotLabel(r.startSlot)} - {getSlotLabel(r.endSlot)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {r.playerCount}
                  </span>
                </div>
              </div>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onRequestCancel(r) }}
              className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              aria-label="Cancel reservation"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────
export function ReservationsTab() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [reservations, setReservations] = useState<Reservation[]>(
    getSeedReservations
  )
  const [detailReservation, setDetailReservation] = useState<Reservation | null>(null)
  const [cancelTarget, setCancelTarget] = useState<Reservation | null>(null)
  const [cancelPasswordInput, setCancelPasswordInput] = useState("")
  const [cancelError, setCancelError] = useState("")

  const dateStr = formatDate(selectedDate)

  const normalizeDate = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate())

  const today = new Date()
  const todayDate = normalizeDate(today)
  const selectedDayOnly = normalizeDate(selectedDate)

  const dayOfWeek = todayDate.getDay() // 0 (Sun) - 6 (Sat)
  const diffToMonday = (dayOfWeek + 6) % 7
  const bookingStart = new Date(todayDate)
  bookingStart.setDate(todayDate.getDate() - diffToMonday)

  const bookingEndExclusive = new Date(bookingStart)
  bookingEndExclusive.setDate(bookingStart.getDate() + 21)

  const isWithinBookingWindow =
    selectedDayOnly >= bookingStart && selectedDayOnly < bookingEndExclusive
  const isPastDate = selectedDayOnly < todayDate

  const navBase = todayDate
  const fromMonth = new Date(navBase.getFullYear(), navBase.getMonth() - 2, 1)
  const toMonth = new Date(navBase.getFullYear(), navBase.getMonth() + 3, 1)

  const handleBook = useCallback(
    (data: Omit<Reservation, "id">) => {
      const newReservation: Reservation = {
        ...data,
        id: `res-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      }
      setReservations((prev) => [...prev, newReservation])
    },
    []
  )

  const handleRequestCancel = useCallback((r: Reservation) => {
    setCancelTarget(r)
    setCancelPasswordInput("")
    setCancelError("")
  }, [])

  const handleConfirmCancel = useCallback(() => {
    if (!cancelTarget) return
    const input = cancelPasswordInput.trim()
    if (input === cancelTarget.cancelPassword || input === ADMIN_CANCEL_PASSWORD) {
      setReservations((prev) => prev.filter((r) => r.id !== cancelTarget.id))
      setCancelTarget(null)
      setCancelPasswordInput("")
      setCancelError("")
    } else {
      setCancelError("Incorrect password. Use your 4-digit cancel password, or admin password.")
    }
  }, [cancelTarget, cancelPasswordInput])

  const closeCancelDialog = useCallback(() => {
    setCancelTarget(null)
    setCancelPasswordInput("")
    setCancelError("")
  }, [])

  // Dates that have reservations per table for calendar indicators
  const bookedByTable = useMemo(() => {
    return reservations.reduce(
      (acc, r) => {
        acc[r.tableId].add(r.date)
        return acc
      },
      {
        A: new Set<string>(),
        B: new Set<string>(),
        C: new Set<string>(),
      } as Record<"A" | "B" | "C", Set<string>>
    )
  }, [reservations])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-neon-red text-glow-brand-soft lg:text-[2.1rem]">
          BGM 동아리방 예약 시스템
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          여기서 동아리 활동을 위한 예약을 하세요!
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        {TABLES.map((t) => (
          <span key={t.id} className="flex items-center gap-1.5">
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${t.bgClass}`}
              style={{ boxShadow: `0 0 6px ${t.color}60` }}
            />
            <span className={t.textClass}>{t.label}</span>
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-secondary" />
          Open
        </span>
      </div>

      {/* Split screen: Calendar | Timeline */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* LEFT: Calendar + Booking form */}
        <div className="flex w-full flex-col gap-4 lg:min-w-[21rem] lg:max-w-sm lg:shrink-0">
          <div className="rounded-xl border border-border bg-card p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              fromMonth={fromMonth}
              toMonth={toMonth}
              modifiers={{
                tableA: (date) => bookedByTable.A.has(formatDate(date)),
                tableB: (date) => bookedByTable.B.has(formatDate(date)),
                tableC: (date) => bookedByTable.C.has(formatDate(date)),
              }}
              className="mx-auto"
            />
          </div>

          <BookingForm
            selectedDate={dateStr}
            reservations={reservations}
            onBook={handleBook}
            isWithinBookingWindow={isWithinBookingWindow}
            isPastDate={isPastDate}
          />
        </div>

        {/* RIGHT: Timeline + Day reservations */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="rounded-xl border border-border bg-card p-4 lg:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">
                {`${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 ${
                  ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"][selectedDate.getDay()]
                }`}
              </h3>
              <span className="text-xs text-muted-foreground">
                30분 단위로 예약 가능(최대 3시간)
              </span>
            </div>

            {/* Time labels + Table timelines: same horizontal scroll */}
            <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-thin-modern">
              <div className="mb-1 flex gap-2" style={{ minWidth: TIMELINE_MIN_WIDTH + 72 }}>
                <div className="sticky left-0 z-20 flex w-[72px] shrink-0 items-center bg-card">
                  <span className="text-[10px] font-medium text-muted-foreground">
                    테이블
                  </span>
                </div>
                <TimeLabels selectedDate={selectedDate} />
              </div>
              <div className="flex flex-col gap-3">
                {TABLES.map((table) => (
                  <div
                    key={table.id}
                    className="flex items-stretch gap-2"
                    style={{ minWidth: TIMELINE_MIN_WIDTH + 72 }}
                  >
                    <div className="sticky left-0 z-20 flex w-[72px] shrink-0 items-center bg-card">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${table.bgClass}`}
                          style={{ boxShadow: `0 0 6px ${table.color}60` }}
                        />
                        <span
                          className={`text-xs font-semibold ${table.textClass}`}
                        >
                          {table.label}
                        </span>
                      </div>
                    </div>
                    <div className="relative flex gap-px" style={{ minWidth: TIMELINE_MIN_WIDTH }}>
                      {TIME_SLOTS.slice(0, SLOT_COUNT).map((slot, idx) => {
                        const reservation = reservations.find(
                          (r) =>
                            r.date === dateStr &&
                            r.tableId === table.id &&
                            idx >= r.startSlot &&
                            idx < r.endSlot
                        )
                        const isBooked = !!reservation
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              isBooked &&
                              reservation &&
                              setDetailReservation(reservation)
                            }
                            className={`relative flex h-10 flex-1 shrink-0 items-center justify-center transition-colors ${
                              isBooked
                                ? `${table.bgSlotClass} border ${table.borderClass}/25 cursor-pointer hover:opacity-90`
                                : "border border-border/20 bg-[#262626] hover:bg-[#333333] cursor-default"
                            } ${idx === 0 ? "rounded-l-md" : ""} ${
                              idx === SLOT_COUNT - 1 ? "rounded-r-md" : ""
                            }`}
                            title={
                              isBooked
                                ? `${reservation.userName}: ${getSlotLabel(
                                    reservation.startSlot
                                  )} - ${getSlotLabel(
                                    reservation.endSlot
                                  )} (${reservation.playerCount} players) — Click for details`
                                : `${slot} - Available`
                            }
                          />
                        )
                      })}

                      {/* Reservation labels overlayed across merged blocks */}
                      <div className="pointer-events-none absolute inset-y-0 left-0 right-0">
                        {reservations
                          .filter(
                            (r) =>
                              r.date === dateStr && r.tableId === table.id
                          )
                          .map((r) => {
                            const length = r.endSlot - r.startSlot
                            const left = (r.startSlot / SLOT_COUNT) * 100
                            const width = (length / SLOT_COUNT) * 100
                            return (
                              <div
                                key={r.id}
                                className={`absolute flex h-full items-center justify-start px-2 text-[10px] font-semibold ${table.textClass}`}
                                style={{
                                  left: `${left}%`,
                                  width: `${width}%`,
                                }}
                              >
                                <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-left">
                                  {r.userName}
                                </span>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Day reservations list */}
          <DayReservationsList
            reservations={reservations}
            selectedDate={dateStr}
            onShowDetail={setDetailReservation}
            onRequestCancel={handleRequestCancel}
          />
        </div>
      </div>

      {/* Detail dialog: name, phone, description */}
      <Dialog open={!!detailReservation} onOpenChange={(open) => !open && setDetailReservation(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>예약 상세</DialogTitle>
          </DialogHeader>
          {detailReservation && (
            <div className="flex flex-col gap-3 text-sm">
              <p className="font-medium text-foreground">
                {detailReservation.userName}
              </p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <a href={`tel:${detailReservation.phone}`} className="text-white hover:underline">
                  {detailReservation.phone}
                </a>
              </div>
              {detailReservation.description && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageSquareText className="h-4 w-4 shrink-0" />
                  <p className="text-xs leading-relaxed text-white">
                    {detailReservation.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel password dialog */}
      <Dialog open={!!cancelTarget} onOpenChange={(open) => !open && closeCancelDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>예약 취소</DialogTitle>
            <DialogDescription>
              예약 시 설정한 4자리 취소 비밀번호를 입력해주세요. 관리자 비밀번호도 사용할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Input
              type="password"
              inputMode="numeric"
              maxLength={10}
              value={cancelPasswordInput}
              onChange={(e) => setCancelPasswordInput(e.target.value)}
              placeholder="취소 비밀번호(4자리) 또는 관리자 비밀번호"
              className="border-border bg-secondary"
            />
            {cancelError && (
              <p className="text-xs text-destructive">{cancelError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeCancelDialog}>
              닫기
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
            >
              예약 취소하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
