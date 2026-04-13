'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const OptimizedHolographicCard = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const mouseCoords = useRef({ x: 0, y: 0, active: false });

  const updateStyles = () => {
    if (!cardRef.current || !mouseCoords.current.active) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const { x, y } = mouseCoords.current;

    const localX = x - rect.left;
    const localY = y - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (localY - centerY) / 20;
    const rotateY = (centerX - localX) / 20;

    card.style.setProperty('--x', `${localX}px`);
    card.style.setProperty('--y', `${localY}px`);
    card.style.setProperty('--bg-x', `${(localX / rect.width) * 100}%`);
    card.style.setProperty('--bg-y', `${(localY / rect.height) * 100}%`);
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;

    requestRef.current = requestAnimationFrame(updateStyles);
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseCoords.current = { x: e.clientX, y: e.clientY, active: true };
    if (!requestRef.current) {
      requestRef.current = requestAnimationFrame(updateStyles);
    }
  };

  const handleMouseLeave = () => {
    mouseCoords.current.active = false;
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }

    if (cardRef.current) {
      const card = cardRef.current;
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      card.style.setProperty('--bg-x', '50%');
      card.style.setProperty('--bg-y', '50%');
    }
  };

  return (
    <>
      <style>{`
        .holo-container {
          position: relative;
          background: rgba(255, 255, 255, 0.015);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 40px;
          padding: 80px 40px;
          overflow: hidden;
          will-change: transform;
          transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          cursor: pointer;
          backdrop-filter: blur(10px);
        }
        .holo-container::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at var(--bg-x, 50%) var(--bg-y, 50%),
            rgba(225, 29, 72, 0.15) 0%,
            transparent 60%
          );
          z-index: 0;
          pointer-events: none;
        }
        .holo-shine {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: radial-gradient(
            circle at var(--x, 50%) var(--y, 50%),
            rgba(255, 255, 255, 0.05) 0%,
            transparent 40%
          );
        }
        .cta-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        }
      `}</style>

      <div
        className="holo-container"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="holo-shine" />
        
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <p style={{ fontSize: '13px', fontWeight: 800, color: '#E11D48', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '24px' }}>
            Enrollment is open
          </p>
          <h2 style={{ fontSize: '48px', fontWeight: 800, color: '#fff', letterSpacing: '-2px', marginBottom: '24px', lineHeight: 1.1 }}>
            What are you waiting for?
          </h2>
          <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '520px', margin: '0 auto 48px', lineHeight: 1.6 }}>
            Access real projects, expert mentors, and a community built for the next generation of doctors.
          </p>
          
          <Link href="/join" style={{ textDecoration: 'none' }}>
            <button className="cta-btn" style={{
              background: '#fff',
              color: '#000',
              padding: '18px 36px',
              borderRadius: '999px',
              fontSize: '16px',
              fontWeight: 700,
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
            }}>
              Get Started
              <div style={{ background: 'rgba(0,0,0,0.06)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowIcon />
              </div>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default function CTASection() {
  return (
    <section id="cta" style={{ 
      background: '#121315', // Premium Matte Grey
      padding: '140px 64px', 
      position: 'relative', 
      overflow: 'hidden' 
    }}>
      
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '900px', height: '900px', 
        background: 'radial-gradient(circle, rgba(225, 29, 72, 0.06) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute', top: '0%', right: '10%',
        width: '600px', height: '600px', 
        background: 'radial-gradient(circle, rgba(225, 29, 72, 0.03) 0%, transparent 60%)',
        zIndex: 0, pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <OptimizedHolographicCard />
      </div>
    </section>
  );
}