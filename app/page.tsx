'use client';
import dynamic from 'next/dynamic';
import useScrollReveal from './components/useScrollReveal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

// Lazy load everything below the fold — reduces initial JS bundle
const ECGSection = dynamic(() => import('./components/ECGSection'), { ssr: false });
const OurGoal = dynamic(() => import('./components/OurGoal'));
const WhyItMatters = dynamic(() => import('./components/WhyItMatters'), { ssr: false });
const Safety = dynamic(() => import('./components/Safety'));
const WhatWeDo = dynamic(() => import('./components/WhatWeDo'), { ssr: false });
const CTA = dynamic(() => import('./components/CTA'));
const Footer = dynamic(() => import('./components/Footer'));

export default function Home() {
  useScrollReveal();
  return (
    <main>
      <Navbar />
      <Hero />
      <ECGSection />
      <OurGoal />
      <WhyItMatters />
      <Safety />
      <WhatWeDo />
      <CTA />
      <Footer />
    </main>
  );
}
