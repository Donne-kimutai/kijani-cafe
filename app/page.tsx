import Hero from "@/components/Hero";
import About from "@/components/About";
import Menu from "@/components/Menu";
import Gallery from "@/components/Gallery";
import PhotoBand from "@/components/PhotoBand";
import Reservation from "@/components/Reservation";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Menu />
      <Gallery />
      <PhotoBand />
      <Reservation />
      <Contact />
      <Footer />
      <ChatWidget />
    </main>
  );
}