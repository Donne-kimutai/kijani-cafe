"use server";

import { prisma } from "@/lib/prisma";

export type ReservationState = { error?: string; success?: boolean } | undefined;

function normalizeKenyanPhone(raw: string): string | null {
  let p = raw.replace(/[\s-]/g, "");

  if (p.startsWith("+254")) p = p.slice(4);
  else if (p.startsWith("254")) p = p.slice(3);
  else if (p.startsWith("0")) p = p.slice(1);

  return /^[17]\d{8}$/.test(p) ? `+254${p}` : null;
}

export async function createReservation(
  _prev: ReservationState,
  formData: FormData
): Promise<ReservationState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = normalizeKenyanPhone(String(formData.get("phone") ?? ""));
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const guests = Number(formData.get("guests"));

  if (name.length < 2 || name.length > 80) {
    return { error: "Please enter your name." };
  }

  if (!phone) {
  return {
    error: "Enter a valid Kenyan number: 9 digits starting with 7 or 1.",
  };
  }
  
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { error: "Please choose a date." };
  }

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Africa/Nairobi",
  });
  if (date < today) {
    return { error: "Please choose today or a future date." };
  }

  if (!/^\d{2}:\d{2}$/.test(time) || time < "07:00" || time > "19:00") {
    return { error: "Please choose a time between 7:00 AM and 7:00 PM." };
  }
  if (!Number.isInteger(guests) || guests < 1 || guests > 20) {
    return { error: "Guests must be between 1 and 20." };
  }

  await prisma.reservation.create({
    data: { name, phone, date, time, guests },
  });

  return { success: true };
}