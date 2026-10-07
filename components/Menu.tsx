"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { menuItems } from "@/lib/menu";

const categories = ["All", "Coffee", "Food", "Desserts"] as const;

export default function Menu() {
  const [active, setActive] = useState<string>("All");

  const visibleItems =
    active === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === active);

  return (
    <section id="menu" className="scroll-mt-20 bg-green-50 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-green-600">
            Our Menu
          </p>
          <h2 className="mt-2 text-4xl font-bold text-green-900">
            Made fresh, every day
          </h2>
        </Reveal>

        {/* Category tabs */}
        <div className="mt-8 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                active === cat
                  ? "bg-green-700 text-white"
                  : "bg-white text-green-800 hover:bg-green-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-start justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                item.available ? "" : "opacity-50"
              }`}
            >
              <div>
                <h3 className="text-xl font-semibold text-green-900">
                  {item.name}
                </h3>
                <p className="mt-1 text-green-800">{item.description}</p>
                {!item.available && (
                  <span className="mt-2 inline-block text-sm font-semibold text-red-600">
                    Sold out
                  </span>
                )}
              </div>
              <p className="whitespace-nowrap text-lg font-bold text-green-700">
                KSh {item.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}