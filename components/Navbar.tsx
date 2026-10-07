"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#menu", label: "Menu" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-green-800">
          Kijani Café
        </Link>

        {/* Desktop links */}
        <ul className="hidden gap-6 text-green-900 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-green-600">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger button (mobile only) */}
        <button
          onClick={() => setOpen(!open)}
          className="text-3xl text-green-800 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <ul className="flex flex-col gap-4 border-t px-6 py-4 text-green-900 md:hidden">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block hover:text-green-600"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}