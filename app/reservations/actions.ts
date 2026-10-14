"use server";

import { headers } from "next/headers";
import { createBooking } from "@/lib/reservations";
import { rateLimit } from "@/lib/rate-limit";

export type ReservationState = { error?: string; success?: boolean } | undefined;

export async function createReservation(
  _prev: ReservationState,
  formData: FormData
): Promise<ReservationState> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const limited = rateLimit(`book:${ip}`, 5, 60 * 60 * 1000);
  if (!limited.ok) {
    return { error: "Too many booking attempts. Please try again later." };
  }

  const result = await createBooking({
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    date: String(formData.get("date") ?? ""),
    time: String(formData.get("time") ?? ""),
    guests: Number(formData.get("guests")),
  });

  if (!result.ok) return { error: result.error };
  return { success: true };
}