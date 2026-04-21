'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// 1. NEW: Minimalistic Research Flask (for Guided Projects)
const ProjectIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.3 3l-3.3 0" />
    <path d="M9 3l6 0" />
    <path d="M10 3v5.6a3 3 0 0 1-.8 2.1l-4.2 4.6a5 5 0 0 0 0 6.7h14a5 5 0 0 0 0-6.7l-4.2-4.6a3 3 0 0 1-.8-2.1V3" />
    <path d="M7 15h10" />
  </svg>
);

// 2. NEW: Minimalistic Stethoscope (for Expert Matching)
const ExpertIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.8 2.8C3.5 3.3 3 4.5 3 6c0 4 3 7 7 7h1c4 0 7-3 7-7 0-1.5-.5-2.7-1.8-3.2" />
    <path d="M8 3v1" />
    <path d="M16 3v1" />
    <path d="M11 13v6a2 2 0 0 0 2 2h3.5" />
    <circle cx="20" cy="21" r="1.5" />
  </svg>
);

// 3. KEPT: Minimalistic Archive/Box (The one you liked)
const ArchiveIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="21 8 21 21 3 21 3 8" />
    <rect x="1" y="3" width="22" height="5" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
);

function DottedSurface() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const SEPARATION = 120;
    const AMOUNTX = 35;
    const AMOUNTY = 45;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.offsetWidth / containerRef.current.offsetHeight,
      1,
      10000,
    );
    camera.position.set(0, 200, 800);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
    renderer.setClearColor(0x000000, 0);

    containerRef.current.appendChild(renderer.domElement);

    const positions: number[] = [];
    const colors: number[] = [];
    const geometry = new THREE.BufferGeometry();

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions.push(
          ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
          0,
          iy * SEPARATION - (AMOUNTY * SEPARATION) / 2,
        );
        colors.push(220 / 255, 10 / 255, 10 / 255);
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 7,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;
    let animationId: number;

    let isVisible = true;
    const visibilityObserver = new IntersectionObserver(
      entries => { isVisible = entries[0].isIntersecting; },
      { threshold: 0.1 }
    );
    visibilityObserver.observe(containerRef.current);

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const positionAttribute = geometry.attributes.position;
      const pos = positionAttribute.array as Float32Array;

      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          pos[i * 3 + 1] =
            Math.sin((ix + count) * 0.3) * 60 +
            Math.sin((iy + count) * 0.5) * 60;
          i++;
        }
      }

      positionAttribute.needsUpdate = true;
      renderer.render(scene, camera);
      count += 0.04;
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.offsetWidth / containerRef.current.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      visibilityObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

export default function WhatWeDo() {
  const items = [
    { icon: <ProjectIcon />, title: 'Guided Projects', desc: 'Work on real survey-based studies and observational data. Move beyond textbooks into real science.', delay: 'sr-delay-1' },
    { icon: <ExpertIcon />, title: 'Expert Matching', desc: 'Paired with medical professionals who review your methods and guide your data analysis journey.', delay: 'sr-delay-2' },
    { icon: <ArchiveIcon />, title: 'Public Archive', desc: 'Your work is documented and published in our research archive, creating a professional portfolio.', delay: 'sr-delay-3' },
  ];

  return (
    <section style={{
      background: '#18191b',
      padding: '100px 64px',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <DottedSurface />
      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <p className="sr" style={{ fontSize: '14px', fontWeight: 700, color: '#E11D48', letterSpacing: '2px', textTransform: 'uppercase', textAlign: 'center', marginBottom: '16px' }}>The Platform</p>
        <h2 className="sr sr-delay-1" style={{ fontSize: '42px', fontWeight: 800, textAlign: 'center', marginBottom: '64px', letterSpacing: '-1.5px', color: '#f1f5f9' }}>
          Real research experience.<br />Before university.
        </h2>
        <div className="mobile-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {items.map(item => (
            <div key={item.title} className={`sr ${item.delay} glass-card`} style={{ borderRadius: '20px', padding: '32px' }}>
              <div style={{ 
                marginBottom: '24px', 
                background: 'rgba(148, 163, 184, 0.1)', 
                border: '1px solid rgba(148, 163, 184, 0.2)', 
                color: '#cbd5e1', 
                width: '64px', height: '64px', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', 
                borderRadius: '16px' 
              }}>
                {item.icon}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: '#f1f5f9' }}>{item.title}</div>
              <div style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.7 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}