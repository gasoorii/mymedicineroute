'use client';
import useScrollReveal from './components/useScrollReveal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ECGSection from './components/ECGSection';
import WhatWeDo from './components/WhatWeDo';
import WhoItsFor from './components/WhoItsFor';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function Home() {
  useScrollReveal();
  return (
    <main>
      <Navbar />
      <Hero />
      <ECGSection />
      <WhatWeDo />
      <WhoItsFor />
      <CTA />
      <Footer />
    </main>
  );
}