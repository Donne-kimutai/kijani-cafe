import Image from "next/image";
import Reveal from "./Reveal";
import { PHOTOS } from "@/lib/photos";

export default function PhotoBand() {
  return (
    <section className="relative flex min-h-[26rem] items-center justify-center overflow-hidden">
      <Image
        src={PHOTOS.band.src}
        alt={PHOTOS.band.alt}
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-green-950/60" />

      <div className="relative z-10 max-w-2xl px-6 text-center text-white">
        <Reveal>
          <h2 className="text-4xl font-bold md:text-5xl">Come hungry, leave happy</h2>
          <p className="mt-4 text-lg text-green-100">
            Brunch, coffee and fresh juices in the heart of Kitisuru.
          </p>
          <a
            href="/#reserve"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-semibold text-green-800 transition hover:scale-105 hover:bg-green-100"
          >
            Book a table
          </a>
        </Reveal>
      </div>
    </section>
  );
}