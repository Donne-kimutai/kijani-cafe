"use client";

export default function DeleteButton() {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm("Delete this item?")) e.preventDefault();
      }}
      className="rounded-full border border-red-300 px-4 py-1 text-sm font-semibold text-red-600 hover:bg-red-50"
    >
      Delete
    </button>
  );
}