import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { updateMenuItem } from "../../actions";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const itemId = Number(id);
  if (!Number.isInteger(itemId)) notFound();

  const item = await prisma.menuItem.findUnique({ where: { id: itemId } });
  if (!item) notFound();

  const inputClass =
    "w-full rounded-lg border border-green-200 px-4 py-2 outline-none focus:border-green-600";

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/dashboard" className="text-green-700 hover:underline">
        ← Back to dashboard
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-green-900">Edit item</h1>

      <form
        action={updateMenuItem.bind(null, item.id)}
        className="mt-6 grid gap-4 rounded-2xl bg-green-50 p-6"
      >
        <label className="text-sm font-medium text-green-900">
          Name
          <input name="name" defaultValue={item.name} required className={`${inputClass} mt-1`} />
        </label>

        <label className="text-sm font-medium text-green-900">
          Price (KSh)
          <input
            name="price"
            type="number"
            min="1"
            step="1"
            defaultValue={item.price}
            required
            className={`${inputClass} mt-1`}
          />
        </label>

        <label className="text-sm font-medium text-green-900">
          Category
          <input name="category" defaultValue={item.category} required className={`${inputClass} mt-1`} />
        </label>

        <label className="text-sm font-medium text-green-900">
          Description
          <input name="description" defaultValue={item.description} required className={`${inputClass} mt-1`} />
        </label>

        <button className="rounded-full bg-green-700 py-3 font-semibold text-white hover:bg-green-800">
          Save changes
        </button>
      </form>
    </main>
  );
}