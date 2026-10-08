"use client";

import { useActionState, useEffect, useRef, useState} from "react";
import Reveal from "./Reveal";
import { createReservation } from "@/app/reservation/actions";

export default function Reservation() {
  const [state, action, pending] = useActionState(createReservation, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const [phone, setPhone] = useState("");

  useEffect(() => {
  if (state?.success) {
    formRef.current?.reset();
    setPhone("");
  }
}, [state]);

  const inputClass =
    "mt-1 w-full rounded-lg border border-green-200 bg-white px-4 py-2 outline-none focus:border-green-600";
  const labelClass = "text-sm font-medium text-green-900";

  return (
    <section id="reserve" className="scroll-mt-20 bg-green-50 px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-green-600">
            Reservations
          </p>
          <h2 className="mt-2 text-4xl font-bold text-green-900">
            Book a table
          </h2>
          <p className="mt-3 text-green-800">
            Tell us when you are coming and we will save you a seat.
          </p>
        </Reveal>

        <form
          ref={formRef}
          action={action}
          className="mt-8 grid gap-4 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-2"
        >
          <label className={labelClass}>
            Name
            <input name="name" required className={inputClass} />
          </label>

          <label className={labelClass}>
            Phone
        <div className="mt-1 flex rounded-lg border border-green-200 bg-white focus-within:border-green-600">
            <span className="flex items-center rounded-l-lg bg-green-100 px-3 text-green-800">
             +254
            </span>
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) =>
              setPhone(
              e.target.value
              .replace(/\D/g, "")      // digits only
              .replace(/^0+/, "")      // drop a leading 0
              .slice(0, 9)             // max 9 digits
               )
              }
              pattern="[17][0-9]{8}"
              title="Exactly 9 digits starting with 7 or 1, for example 712345678"
              placeholder="712345678"
              required
              className="w-full rounded-r-lg bg-white px-4 py-2 outline-none"
             />
        </div>
          </label>

          <label className={labelClass}>
            Date
            <input name="date" type="date" required className={inputClass} />
          </label>

          <label className={labelClass}>
            Time
            <input
              name="time"
              type="time"
              min="07:00"
              max="19:00"
              required
              className={inputClass}
            />
          </label>

          <label className={`${labelClass} md:col-span-2`}>
            Number of guests
            <input
              name="guests"
              type="number"
              min="1"
              max="20"
              defaultValue={2}
              required
              className={inputClass}
            />
          </label>

          {state?.error && (
            <p className="text-sm font-medium text-red-600 md:col-span-2">
              {state.error}
            </p>
          )}
          {state?.success && (
            <p className="rounded-lg bg-green-100 p-3 text-sm font-medium text-green-800 md:col-span-2">
              Thank you! Your reservation request has been received. We will
              confirm it shortly.
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-green-700 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-60 md:col-span-2"
          >
            {pending ? "Booking..." : "Request reservation"}
          </button>
        </form>
      </div>
    </section>
  );
}