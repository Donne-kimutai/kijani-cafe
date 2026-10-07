import Reveal from "./Reveal";
import MenuList from "./MenuList";
import { prisma } from "@/lib/prisma";

export default async function Menu() {
  const items = await prisma.menuItem.findMany({ orderBy: { id: "asc" } });

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

        <MenuList items={items} />
      </div>
    </section>
  );
}