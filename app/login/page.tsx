import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  if (await getSession()) redirect("/dashboard");

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-green-50 px-6">
      <LoginForm />
    </main>
  );
}