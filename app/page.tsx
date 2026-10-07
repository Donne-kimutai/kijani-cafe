export const dynamic = "force-dynamic";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Menu from "@/components/Menu";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Menu/>
      <Contact />
      <Footer />
    </main>
  );
}