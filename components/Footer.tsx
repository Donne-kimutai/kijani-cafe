const MAP_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d68135.57848575171!2d36.75158760027984!3d-1.2184876896176977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f17e27fc4fde3%3A0x1464d3dd2e44a14e!2sKitisuru%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1791370165290!5m2!1sen!2ske";

export default function Footer() {
  return (
    <footer className="bg-green-900 text-green-100">
      <div className="mx-auto grid max-w-5xl items-center gap-8 px-6 py-12 md:grid-cols-2">
        {/* Café info */}
        <div>
          <p className="text-2xl font-bold">Kijani Café</p>
          <p className="mt-3 text-green-300">
            Fresh coffee, local ingredients and a calm place to meet.
          </p>
          <p className="mt-4 text-green-200">Kitisuru, Nairobi</p>
        </div>

        {/* Small framed map */}
        <div className="h-56 overflow-hidden rounded-2xl border-4 border-green-700 shadow-lg">
          <iframe
            src={MAP_URL}
            title="Kijani Café location"
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-green-800 px-6 py-6 text-center text-sm text-green-300">
        &copy; {new Date().getFullYear()} Kijani Café. All rights reserved.
      </div>
    </footer>
  );
}