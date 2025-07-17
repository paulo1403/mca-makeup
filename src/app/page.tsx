import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import PortfolioSection from '@/components/PortfolioSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import SectionTransition from '@/components/SectionTransition';

export default function Home() {
  return (
    <main className='min-h-screen'>
      <HeroSection />
      
      {/* Transición más compacta entre Hero y Servicios */}
      <SectionTransition type="animated" spacing="sm" showParticles />
      
      <ServicesSection />
      
      {/* Transición decorada más compacta */}
      <SectionTransition type="decorated" spacing="md" />
      
      <PortfolioSection />
      
      {/* Transición con brillo compacta */}
      <SectionTransition type="glow" spacing="sm" showParticles />
      
      <TestimonialsSection />
      
      {/* Transición múltiple mediana */}
      <SectionTransition type="multi" spacing="lg" />
      
      <AboutSection />
      
      {/* Transición animada compacta */}
      <SectionTransition type="animated" spacing="sm" />
      
      <ContactSection />
      
      {/* Transición final compacta */}
      <SectionTransition type="glow" spacing="md" />
      
      <Footer />
    </main>
  );
}
