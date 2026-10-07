"use client";

import { useState } from "react";

type Item = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
};

export default function MenuList({ items }: { items: Item[] }) {
  const [active, setActive] = useState("All");

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category)))];

  const visibleItems =
    active === "All" ? items : items.filter((i) => i.category === active);

  return (
    <>
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

      {visibleItems.length === 0 ? (
        <p className="mt-10 text-green-800">No items yet. Check back soon.</p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-start justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                item.available ? "" : "opacity-50"
              }`}
            >
              <div>
                <h3 className="text-xl font-semibold text-green-900">{item.name}</h3>
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
      )}
    </>
  );
}