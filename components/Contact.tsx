import Reveal from "./Reveal";

const hours = [
  { days: "Monday - Friday", time: "7:00 AM - 8:00 PM" },
  { days: "Saturday", time: "8:00 AM - 9:00 PM" },
  { days: "Sunday", time: "8:00 AM - 8:00 PM" },
];

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 bg-white px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-green-600">
            Visit Us
          </p>
          <h2 className="mt-2 text-4xl font-bold text-green-900">
            Come say hello
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Reveal>
            <div className="h-full rounded-2xl bg-green-50 p-6">
              <h3 className="text-xl font-semibold text-green-900">Location</h3>
              <p className="mt-2 text-green-800">
                Kijani Café
                <br />
                123 Garden Road
                <br />
                Nairobi, Kenya
              </p>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="h-full rounded-2xl bg-green-50 p-6">
              <h3 className="text-xl font-semibold text-green-900">Hours</h3>
              <ul className="mt-2 space-y-1 text-green-800">
                {hours.map((h) => (
                  <li key={h.days}>
                    <span className="font-medium">{h.days}:</span> {h.time}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <div className="h-full rounded-2xl bg-green-50 p-6">
              <h3 className="text-xl font-semibold text-green-900">Get in touch</h3>
              <p className="mt-2 text-green-800">
                Phone: +254 700 000 000
                <br />
                Email: hello@kijanicafe.com
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}