import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { setReservationStatus } from "../actions";

type Reservation = Awaited<ReturnType<typeof prisma.reservation.findMany>>[number];

function fmtTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function fmtDate(d: string) {
  return new Date(`${d}T12:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}
function whatsappLink(r: Reservation) {
  const when = `${fmtDate(r.date)} at ${fmtTime(r.time)}`;
  const guests = `${r.guests} ${r.guests === 1 ? "guest" : "guests"}`;

  const text =
    r.status === "confirmed"
      ? `Hello ${r.name}, this is Kijani Café. Your table for ${guests} on ${when} is confirmed. We look forward to seeing you!`
      : r.status === "cancelled"
      ? `Hello ${r.name}, this is Kijani Café. Unfortunately we had to cancel your booking for ${when}. Please reach out and we will gladly find another time.`
      : `Hello ${r.name}, this is Kijani Café. We received your request for ${guests} on ${when}. Reply here if you need to change anything.`;

  return `https://wa.me/${r.phone.replace("+", "")}?text=${encodeURIComponent(text)}`;
}

const badge: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "b,-red-100 text-red-700",
};

function Row({ r }: { r: Reservation }) {
  return (
    <li className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className={r.status === "cancelled" ? "opacity-50" : ""}>
        <p className="font-semibold text-green-900">
          {fmtTime(r.time)} · {r.name} · {r.guests} {r.guests === 1 ? "guest" : "guests"}
        </p>
        <p className="text-sm text-green-800">
          {fmtDate(r.date)} ·{" "}
          <a href={`tel:${r.phone}`} className="underline">
            {r.phone}
          </a>{" "}
          ·{" "}
          <a
           href={whatsappLink(r)}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            WhatsApp
          </a>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge[r.status] ?? ""}`}>
          {r.status}
        </span>
        {r.status !== "confirmed" && (
          <form action={setReservationStatus.bind(null, r.id, "confirmed")}>
            <button className="rounded-full bg-green-700 px-4 py-1 text-sm font-semibold text-white hover:bg-green-800">
              Confirm
            </button>
          </form>
        )}
        {r.status !== "cancelled" && (
          <form action={setReservationStatus.bind(null, r.id, "cancelled")}>
            <button className="rounded-full border border-red-300 px-4 py-1 text-sm font-semibold text-red-600 hover:bg-red-50">
              Cancel
            </button>
          </form>
        )}
      </div>
    </li>
  );
}

function Section({
  title,
  items,
  empty,
}: {
  title: string;
  items: Reservation[];
  empty: string;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-green-900">
        {title} ({items.length})
      </h2>
      {items.length === 0 ? (
        <p className="mt-3 text-green-800">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((r) => (
            <Row key={r.id} r={r} />
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function ReservationsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Africa/Nairobi",
  });

  const all = await prisma.reservation.findMany({
    orderBy: [{ date: "asc" }, { time: "asc" }],
  });

  const todays = all.filter((r) => r.date === today);
  const upcoming = all.filter((r) => r.date > today);
  const past = all.filter((r) => r.date < today).reverse().slice(0, 20);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/dashboard" className="text-green-700 hover:underline">
        ← Back to dashboard
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-green-900">Reservations</h1>

      <Section title="Today" items={todays} empty="No reservations today." />
      <Section title="Upcoming" items={upcoming} empty="Nothing booked yet." />
      <Section title="Past (latest 20)" items={past} empty="No past reservations." />
    </main>
  );
}