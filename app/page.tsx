import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import WebProjects from '@/components/WebProjects';
import Contact from '@/components/Contact';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <WebProjects />
      <Contact />
      <Footer />
    </main>
  );
}
