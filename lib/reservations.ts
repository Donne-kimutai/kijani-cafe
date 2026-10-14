
import { prisma } from "@/lib/prisma";
import { getHoursForDate, lastBookingTime, formatTime } from "@/lib/hours";

export const CAPACITY = 30; // seats available at the same time
const DURATION_MIN = 90; // how long a booking holds its seats

type Failure = { ok: false; error: string };
type Slot = { date: string; time: string; guests: number };

export function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function normalizeKenyanPhone(raw: string): string | null {
  let p = raw.replace(/[\s-]/g, "");

  if (p.startsWith("+254")) p = p.slice(4);
  else if (p.startsWith("254")) p = p.slice(3);
  else if (p.startsWith("0")) p = p.slice(1);

  return /^[17]\d{8}$/.test(p) ? `+254${p}` : null;
}

export async function checkSlot({ date, time, guests }: Slot): Promise<{ ok: true } | Failure> {
  const isRealDate =
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    new Date(`${date}T12:00:00Z`).toISOString().slice(0, 10) === date;
  if (!isRealDate) return { ok: false, error: "Please choose a valid date." };

  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Nairobi" });
  if (date < today) return { ok: false, error: "Please choose today or a future date." };

  const hours = getHoursForDate(date);
  if (!hours) return { ok: false, error: "Please choose a valid date." };

  const last = lastBookingTime(hours.close);
  if (!/^\d{2}:\d{2}$/.test(time) || time < hours.open || time > last) {
    return {
      ok: false,
      error: `Bookings on that day are between ${formatTime(hours.open)} and ${formatTime(last)}.`,
    };
  }

  if (!Number.isInteger(guests) || guests < 1 || guests > 20) {
    return { ok: false, error: "Guests must be between 1 and 20." };
  }

  const sameDay = await prisma.reservation.findMany({
    where: { date, status: { not: "cancelled" } },
  });
  const start = toMinutes(time);
  const taken = sameDay
    .filter((r) => Math.abs(toMinutes(r.time) - start) < DURATION_MIN)
    .reduce((sum, r) => sum + r.guests, 0);

  if (taken + guests > CAPACITY) {
    return { ok: false, error: "Sorry, we are fully booked around that time. Please try another time." };
  }

  return { ok: true };
}

export async function createBooking(input: {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
}): Promise<{ ok: true; id: number } | Failure> {
  const name = input.name.trim();
  if (name.length < 2 || name.length > 80) {
    return { ok: false, error: "Please enter your name." };
  }

  const phone = normalizeKenyanPhone(input.phone);
  if (!phone) {
    return { ok: false, error: "Enter a valid Kenyan number: 9 digits starting with 7 or 1." };
  }

  const slot = await checkSlot(input);
  if (!slot.ok) return slot;

const today = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Nairobi" });
const upcoming = await prisma.reservation.count({
  where: { phone, status: { not: "cancelled" }, date: { gte: today } },
});
if (upcoming >= 3) {
  return {
    ok: false,
    error: "This number already has several upcoming bookings. Please contact the café to make changes.",
  };
}
  
  const r = await prisma.reservation.create({
    data: { name, phone, date: input.date, time: input.time, guests: input.guests },
  });
  return { ok: true, id: r.id };
}