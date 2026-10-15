"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";

import { GALLERY as photos } from "@/lib/photos";

export default function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const count = photos.length;

  const show = useCallback(
    (step: number) => {
      setSelected((cur) => (cur === null ? cur : (cur + step + count) % count));
    },
    [count]
  );

  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowRight") show(1);
      if (e.key === "ArrowLeft") show(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, show]);

  return (
    <section id="gallery" className="scroll-mt-20 bg-white px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-green-600">
            Gallery
          </p>
          <h2 className="mt-2 text-4xl font-bold text-green-900">
            A taste of Kijani
          </h2>
        </Reveal>

        {/* Flex + justify-center keeps a short last row centred */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {photos.map((photo, i) => (
            <div
              key={photo.src}
              className="w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)]"
            >
              <Reveal delay={(i % 3) * 120}>
                <button
                  onClick={() => setSelected(i)}
                  aria-label={`Enlarge photo: ${photo.alt}`}
                  className="group relative block aspect-square w-full overflow-hidden rounded-2xl"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                </button>
              </Reveal>
            </div>
          ))}
        </div>
      </div>

      {selected !== null && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative h-[80vh] w-full max-w-4xl"
          >
            <Image
              src={photos[selected].src}
              alt={photos[selected].alt}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              show(-1);
            }}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-4 py-2 text-3xl text-white hover:bg-black/70"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              show(1);
            }}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-4 py-2 text-3xl text-white hover:bg-black/70"
          >
            ›
          </button>

          <button
            onClick={() => setSelected(null)}
            aria-label="Close photo"
            className="absolute right-6 top-6 text-4xl text-white hover:text-green-200"
          >
            ✕
          </button>
          <p className="absolute bottom-6 text-sm text-white/80">
            {selected + 1} / {count}
          </p>
        </div>
      )}
    </section>
  );
}   