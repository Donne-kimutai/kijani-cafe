"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";

export async function login(
  _prev: { error?: string } | undefined,
  formData: FormData
) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const admin = await prisma.admin.findUnique({ where: { email } });

  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    return { error: "Invalid email or password." };
  }

  await createSession(admin.id);
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}