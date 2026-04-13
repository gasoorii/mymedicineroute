'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

function DottedSurface() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const SEPARATION = 100;
    const AMOUNTX = 50;
    const AMOUNTY = 70;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.offsetWidth / containerRef.current.offsetHeight,
      1,
      10000,
    );
    camera.position.set(0, 200, 800);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
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
        // Red tinted dots to match brand
        colors.push(225 / 255, 29 / 255, 72 / 255);
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
  size: 10,
  vertexColors: true,
  transparent: true,
  opacity: 0.6,
  sizeAttenuation: true,
});

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const positionAttribute = geometry.attributes.position;
      const pos = positionAttribute.array as Float32Array;

      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          pos[i * 3 + 1] =
  Math.sin((ix + count) * 0.3) * 80 +
  Math.sin((iy + count) * 0.5) * 80;
          i++;
        }
      }

      positionAttribute.needsUpdate = true;
      renderer.render(scene, camera);
      count += 0.08;
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
    { img: '/microscope_mono_transparent.png', title: 'Guided Projects', desc: 'Work on real survey-based studies and observational data. Move beyond textbooks into real science.', delay: 'sr-delay-1' },
    { img: '/handshake_mono_transparent.png', title: 'Expert Matching', desc: 'Paired with medical professionals who review your methods and guide your data analysis journey.', delay: 'sr-delay-2' },
    { img: '/folder_mono_transparent.png', title: 'Public Archive', desc: 'Your work is documented and published in our research archive, creating a professional portfolio.', delay: 'sr-delay-3' },
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
        <h2 className="sr sr-delay-1" style={{ fontSize: '42px', fontWeight: 800, textAlign: 'center', marginBottom: '64px', letterSpacing: '-1.5px' }}>
          Real research experience.<br />Before university.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {items.map(item => (
            <div key={item.title} className={`sr ${item.delay} glass-card`} style={{ borderRadius: '20px', padding: '32px' }}>
              <div style={{ marginBottom: '24px', background: 'rgba(225,29,72,0.12)', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', overflow: 'hidden' }}>
                <img src={item.img} alt={item.title} className="mono-icon" />
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