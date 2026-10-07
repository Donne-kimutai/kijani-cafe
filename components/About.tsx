import Reveal from "./Reveal";

const highlights = [
  {
    title: "Earth-to-Table Freshness",
    text: "We partner directly with local farmers to ensure every plate is vibrant, seasonal, and bursting with flavor.",
  },
  {
    title: "Artisanal Small-Batch",
    text: "Roasted in small, careful batches, every single cup tells a rich, aromatic story from bean to brew.",
  },
  {
    title: "A Sanctuary for Your Day",
    text: "Step away from the noise. Whether for work or quiet time, find your favorite neighborhood escape.",
  },
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-20 bg-white px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-green-600">
            Our Story
          </p>
          <h2 className="mt-2 text-4xl font-bold text-green-900">
            More than just a café
          </h2>
          <p className="mt-5 max-w-3xl text-lg text-green-800 leading-relaxed">
            At <strong>Kijani</strong>, we believe a café should be an exhale.
            Named after the Swahili word for &quot;green,&quot; our name reflects
            fresh food, honest ingredients, and a space that feels like home.
            Whether you are catching up with a friend, locking in for work, or
            carving out a quiet corner for yourself, you belong here.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {highlights.map((item, i) => (
            <Reveal key={item.title} delay={i * 150}>
              <div className="flex h-full flex-col justify-between rounded-2xl bg-green-50 p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <div>
                  <h3 className="text-xl font-semibold text-green-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-green-800 text-sm leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={450}>
          <div className="mt-12 text-center">
            <p className="italic text-green-700 font-medium">
              Every cup is brewed with intention. Every plate is crafted with
              care. Come find your space at Kijani.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}