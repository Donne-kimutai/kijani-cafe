import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { logout } from "../login/actions";
import { addMenuItem, toggleAvailable, deleteMenuItem } from "./actions";
import DeleteButton from "./DeleteButton";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const admin = await prisma.admin.findUnique({ where: { id: session.adminId } });
  if (!admin) redirect("/login");

  const items = await prisma.menuItem.findMany({ orderBy: { id: "asc" } });
  const categories = Array.from(new Set(items.map((i) => i.category)));

  const inputClass =
    "w-full rounded-lg border border-green-200 px-4 py-2 outline-none focus:border-green-600";

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-900">Dashboard</h1>
          <p className="mt-1 text-green-800">Signed in as {admin.email}</p>
        </div>
        <form action={logout}>
          <button className="rounded-full border-2 border-green-700 px-5 py-2 font-semibold text-green-700 hover:bg-green-100">
            Log out
          </button>
        </form>
      </div>

      <nav className="mt-6 flex gap-3">
  <span className="rounded-full bg-green-700 px-5 py-2 text-sm font-semibold text-white">
    Menu
  </span>
  <Link
    href="/dashboard/reservations"
    className="rounded-full border-2 border-green-700 px-5 py-2 text-sm font-semibold text-green-700 hover:bg-green-100"
  >
    Reservations
  </Link>
</nav>

      {/* Add item */}
      <section className="mt-10 rounded-2xl bg-green-50 p-6">
        <h2 className="text-xl font-semibold text-green-900">Add menu item</h2>
        <form action={addMenuItem} className="mt-4 grid gap-4 md:grid-cols-2">
          <input name="name" placeholder="Name" required className={inputClass} />
          <input
            name="price"
            type="number"
            min="1"
            step="1"
            placeholder="Price (KSh)"
            required
            className={inputClass}
          />
          <input
            name="category"
            list="categories"
            placeholder="Category (e.g. Coffee)"
            required
            className={inputClass}
          />
          <datalist id="categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <input
            name="description"
            placeholder="Description"
            required
            className={inputClass}
          />
          <button className="rounded-full bg-green-700 py-3 font-semibold text-white hover:bg-green-800 md:col-span-2">
            Add item
          </button>
        </form>
      </section>

      {/* Item list */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-green-900">
          Menu items ({items.length})
        </h2>
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              <div className={item.available ? "" : "opacity-50"}>
                <p className="font-semibold text-green-900">
                  {item.name}{" "}
                  <span className="text-sm font-normal text-green-700">
                    · {item.category} · KSh {item.price}
                  </span>
                </p>
                <p className="text-sm text-green-800">{item.description}</p>
              </div>
<Link
  href={`/dashboard/edit/${item.id}`}
  className="rounded-full border border-green-600 px-4 py-1 text-sm font-semibold text-green-700 hover:bg-green-50"
>
  Edit
</Link>
              <div className="flex gap-2">
                <form action={toggleAvailable.bind(null, item.id, !item.available)}>
                  <button className="rounded-full border border-green-600 px-4 py-1 text-sm font-semibold text-green-700 hover:bg-green-50">
                    {item.available ? "Mark sold out" : "Mark available"}
                  </button>
                </form>
                <form action={deleteMenuItem.bind(null, item.id)}>
                  <DeleteButton />
                </form>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}