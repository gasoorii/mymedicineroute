'use client';

import React, { useRef, useId, useEffect, useState } from 'react';

function mapRange(value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number): number {
  if (fromLow === fromHigh) return toLow;
  return toLow + ((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow);
}

function EtherealShadow() {
  const rawId = useId();
  const id = `shadow-${rawId.replace(/:/g, "")}`;
  const feTurbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const [mounted, setMounted] = useState(false);

  const scale = 50; // Slightly higher scale for more dramatic "silk" folds
  const displacementScale = mapRange(scale, 1, 100, 20, 100);

  useEffect(() => {
    setMounted(true);
    let frame: number;
    let startTime = Date.now();

    const update = () => {
      if (feTurbulenceRef.current) {
        const elapsed = (Date.now() - startTime) / 1000;
        // Slow, luxurious movement
        const freqX = 0.002 + Math.sin(elapsed * 0.2) * 0.0008;
        const freqY = 0.005 + Math.cos(elapsed * 0.2) * 0.0008;
        feTurbulenceRef.current.setAttribute('baseFrequency', `${freqX} ${freqY}`);
      }
      frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {/* 1. THE SVG FILTER DEFINITION */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence
            ref={feTurbulenceRef}
            type="fractalNoise"
            baseFrequency="0.002 0.005"
            numOctaves="1"
            seed="3"
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2 -0.5" // Sharpens the liquid edges
            result="highContrastNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="highContrastNoise"
            scale={displacementScale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* 2. THE RED GLOW LAYER (That specific deep red) */}
      <div style={{ 
        position: 'absolute', 
        inset: -200, 
        filter: `url(#${id}) blur(30px)`, // Deep blur for the "Elegant" glow
        opacity: 0.25 
      }}>
        <div style={{
          // This gradient creates the "Beam" look mixed with deep shadows
          background: 'linear-gradient(135deg, #000 0%, #E11D48 40%, #E11D48 60%, #000 100%)',
          maskImage: `url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')`,
          maskSize: 'cover',
          maskPosition: 'center',
          width: '100%',
          height: '100%',
        }} />
      </div>

      {/* 3. FILM GRAIN OVERLAY */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png")`,
        backgroundSize: '180px',
        opacity: 0.12,
        mixBlendMode: 'screen', // Makes the grain "sparkle" slightly against the red
      }} />
    </div>
  );
}

export default function WhyItMatters() {
  const problems = [
    { icon: '🚪', title: 'No entry point', desc: "Medical research is locked behind university doors. High schoolers with genuine passion have nowhere to start — no labs, no mentors, no structure.", delay: 'sr-delay-1' },
    { icon: '🔗', title: 'No connections', desc: "Getting into research depends on who you know. Students without the right family connections or school resources are left completely behind.", delay: 'sr-delay-2' },
    { icon: '📂', title: 'No portfolio', desc: "When applying to medical school, students need proof of commitment. Without research experience, that proof simply doesn't exist.", delay: 'sr-delay-3' },
    { icon: '🧭', title: 'No guidance', desc: "Even motivated students don't know where to start. The path into medicine feels opaque, overwhelming, and unfair.", delay: 'sr-delay-4' },
  ];

  return (
    <section id="why" style={{
      background: '#121316', // Slightly darker grey to let the red "pop"
      padding: '120px 64px',
      borderTop: '1px solid rgba(255,255,255,0.03)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <EtherealShadow />
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <p className="sr" style={{ fontSize: '13px', fontWeight: 700, color: '#E11D48', letterSpacing: '3px', textTransform: 'uppercase', textAlign: 'center', marginBottom: '20px' }}>Why it matters</p>
        <h2 className="sr sr-delay-1" style={{ fontSize: '48px', fontWeight: 800, textAlign: 'center', letterSpacing: '-1.5px', marginBottom: '20px', color: '#f1f5f9' }}>
          The system wasn't built for students like you
        </h2>
        <p className="sr sr-delay-2" style={{ fontSize: '19px', color: '#94a3b8', textAlign: 'center', maxWidth: '600px', margin: '0 auto 80px', lineHeight: 1.7 }}>
          Every year, thousands of Bahraini students passionate about medicine hit the same invisible wall. My Medicine Route tears it down.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '80px' }}>
          {problems.map(item => (
            <div key={item.title} className={`sr ${item.delay} glass-card`} style={{
              borderRadius: '24px', padding: '40px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '20px' }}>{item.icon}</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9', marginBottom: '12px' }}>{item.title}</div>
              <div style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.8 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <div className="sr sr-delay-2" style={{
          background: 'rgba(0,0,0,0.3)', 
          borderRadius: '32px', 
          padding: '56px',
          border: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          backgroundImage: 'radial-gradient(circle at top right, #E11D4815 0%, transparent 60%)',
        }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#E11D48', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px' }}>How we fix it</p>
          <h3 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: '32px' }}>
            My Medicine Route gives you the entry point you were never given
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>
            {[
              { label: 'Real projects', desc: 'Not textbook exercises. Real studies with real data.' },
              { label: 'Real mentors', desc: 'Medical students and doctors guiding you every step.' },
              { label: 'Real proof', desc: 'Published work you can show colleges and universities.' },
            ].map(item => (
              <div key={item.label} style={{ borderTop: '1px solid rgba(225,29,72,0.3)', paddingTop: '20px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>{item.label}</div>
                <div style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}