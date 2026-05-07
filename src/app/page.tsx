import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { Marquee } from "@/components/site/marquee";
import { Projects } from "@/components/site/projects";
import { About } from "@/components/site/about";
import { Contact } from "@/components/site/contact";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Marquee />
      <Projects />
      <About />
      <Contact />
    </main>
  );
}
