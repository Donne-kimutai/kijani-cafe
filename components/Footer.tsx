export default function Footer() {
  return (
    <footer className="bg-green-900 px-6 py-10 text-green-100">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-xl font-bold">Kijani Café</p>
        <p className="text-sm text-green-300">
          &copy; {new Date().getFullYear()} Kijani Café. All rights reserved.
        </p>
      </div>
    </footer>
  );
}