import { createFileRoute } from "@tanstack/react-router";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Mission } from "@/components/Mission";
import { Projects } from "@/components/Projects";
import { Impact } from "@/components/Impact";
import { News } from "@/components/News";
import { CallToAction } from "@/components/CallToAction";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

const title = "Fundación Calidad | Conservación ambiental y desarrollo sostenible";
const description =
  "Fundación Calidad trabaja por la preservación del entorno ecológico, la protección de los recursos naturales y el bienestar de las comunidades.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Mission />
        <Projects />
        <Impact />
        <News />
        <CallToAction />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
