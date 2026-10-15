import Image from "next/image";
import Reveal from "./Reveal";
import { PHOTOS } from "@/lib/photos";

const highlights = [
  { title: "Locally Sourced", text: "Ingredients from farms near us." },
  { title: "Freshly Roasted", text: "Coffee roasted in small batches." },
  { title: "Welcoming Space", text: "Perfect for friends, work or quiet time." },
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-20 bg-white px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src={PHOTOS.about.src}
                alt={PHOTOS.about.alt}
                fill
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-cover transition duration-700 hover:scale-105"
              />
            </div>
          </Reveal>

          <Reveal delay={150}>
            <p className="text-sm font-semibold uppercase tracking-widest text-green-600">
              Our Story
            </p>
            <h2 className="mt-2 text-4xl font-bold text-green-900">
              More than just a café
            </h2>
            <p className="mt-5 text-lg text-green-800">
              Kijani means &quot;green&quot; in Swahili, and that is what we are
              about: fresh food, honest ingredients and a space that feels like
              home. Every cup and every plate is made with care.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {highlights.map((item, i) => (
            <Reveal key={item.title} delay={i * 150}>
              <div className="rounded-2xl bg-green-50 p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <h3 className="text-xl font-semibold text-green-900">{item.title}</h3>
                <p className="mt-2 text-green-800">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}