"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/dashboard");
}

export async function addMenuItem(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const price = Number(formData.get("price"));

  if (!name || !description || !category) return;
  if (!Number.isInteger(price) || price <= 0) return;

  await prisma.menuItem.create({
    data: { name, description, category, price },
  });
  refresh();
}

export async function toggleAvailable(id: number, available: boolean) {
  await requireAdmin();
  await prisma.menuItem.update({ where: { id }, data: { available } });
  refresh();
}

export async function deleteMenuItem(id: number) {
  await requireAdmin();
  await prisma.menuItem.delete({ where: { id } });
  refresh();
}