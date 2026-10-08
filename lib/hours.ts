export const SCHEDULE = [
  { label: "Monday - Friday", days: [1, 2, 3, 4, 5], open: "07:00", close: "20:00" },
  { label: "Saturday", days: [6], open: "08:00", close: "21:00" },
  { label: "Sunday", days: [0], open: "08:00", close: "20:00" },
];

// Last booking is this many minutes before closing
const LAST_BOOKING_BEFORE_CLOSE_MIN = 60;

export function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export function lastBookingTime(close: string) {
  const [h, m] = close.split(":").map(Number);
  const total = h * 60 + m - LAST_BOOKING_BEFORE_CLOSE_MIN;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

// date is "YYYY-MM-DD"; returns null if it isn't a real date
export function getHoursForDate(date: string) {
  const d = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return null;
  const day = d.getUTCDay();
  return SCHEDULE.find((s) => s.days.includes(day)) ?? null;
}