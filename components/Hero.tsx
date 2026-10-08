"use client";

import { useRef } from "react";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  function handleMove(e: React.MouseEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--x", `${x}px`);
    el.style.setProperty("--y", `${y}px`);
    el.style.setProperty("--px", `${(x / rect.width - 0.5) * 2}`);
    el.style.setProperty("--py", `${(y / rect.height - 0.5) * 2}`);
  }

  return (
    <section
      ref={ref}
      onMouseMove={handleMove}
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-gradient-to-b from-green-100 to-green-50 px-6"
    >
      {/* Glow that follows the cursor */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(500px circle at var(--x, 50%) var(--y, 40%), rgba(34,197,94,0.25), transparent 60%)",
        }}
      />

      {/* Floating shapes that drift with the mouse */}
      <div
        className="pointer-events-none absolute left-[10%] top-[15%] h-40 w-40 rounded-full bg-green-300/40 blur-2xl transition-transform duration-300 ease-out"
        style={{
          transform:
            "translate(calc(var(--px, 0) * 40px), calc(var(--py, 0) * 40px))",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-[10%] right-[10%] h-56 w-56 rounded-full bg-emerald-300/40 blur-2xl transition-transform duration-300 ease-out"
        style={{
          transform:
            "translate(calc(var(--px, 0) * -60px), calc(var(--py, 0) * -60px))",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-2xl text-center">
        <p
          className="fade-up mb-3 text-sm font-semibold uppercase tracking-widest text-green-600"
          style={{ animationDelay: "0.1s" }}
        >
          Welcome to
        </p>
        <h1
          className="fade-up text-5xl font-bold text-green-900 md:text-8xl"
          style={{ animationDelay: "0.3s" }}
        >
          Kijani Café
        </h1>
        <p
          className="fade-up mt-5 text-4xl text-green-800"
          style={{ animationDelay: "0.5s" }}
        >
          Freshly brewed coffee, Delicious bites & Good vibes.
        </p>
        <div
          className="fade-up mt-8 flex flex-col justify-center gap-4 sm:flex-row"
          style={{ animationDelay: "0.7s" }}
        >
          <a
            href="/#menu"
            className="rounded-full bg-green-700 px-8 py-3 font-semibold text-white transition hover:scale-105 hover:bg-green-800"
          >
            View Menu
          </a>
          <a
            href="/#reserve"
            className="rounded-full border-2 border-green-700 px-8 py-3 font-semibold text-green-700 transition hover:scale-105 hover:bg-green-100"
          >
            Book a Table
          </a>
        </div>
      </div>
    </section>
  );
}