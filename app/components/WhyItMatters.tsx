'use client';

import React, { useState, Suspense, lazy, useRef, useEffect } from 'react';

// Minimalistic Silver Icon Components
const DoorIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 3l14 0c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2h-14c-1.1 0-2-.9-2-2v-14c0-1.1.9-2 2-2z" />
    <path d="M15 12l0 .01" strokeWidth="3" />
  </svg>
);

const LinkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const FolderIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const CompassIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const Dithering = lazy(() =>
  import('@paper-design/shaders-react').then((mod) => ({ default: mod.Dithering }))
);

export default function WhyItMatters() {
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { setIsInView(entries[0].isIntersecting); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const problems = [
    { icon: <DoorIcon />, title: 'No entry point', desc: "Medical research is locked behind university doors. High schoolers with genuine passion have nowhere to start — no labs, no mentors, no structure.", delay: 'sr-delay-1' },
    { icon: <LinkIcon />, title: 'No connections', desc: "Getting into research depends on who you know. Students without the right family connections or school resources are left completely behind.", delay: 'sr-delay-2' },
    { icon: <FolderIcon />, title: 'No portfolio', desc: "When applying to medical school, students need proof of commitment. Without research experience, that proof simply doesn't exist.", delay: 'sr-delay-3' },
    { icon: <CompassIcon />, title: 'No guidance', desc: "Even motivated students don't know where to start. The path into medicine feels opaque, overwhelming, and unfair.", delay: 'sr-delay-4' },
  ];

  return (
    <section
      id="why"
      ref={sectionRef}
      style={{
        background: '#18191b',
        padding: '100px 64px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Suspense fallback={null}>
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.18,
          mixBlendMode: 'screen',
        }}>
          <Dithering
            colorBack="#00000000"
            colorFront="#CC0020"
            shape="warp"
            type="4x4"
            speed={!isInView ? 0 : isHovered ? 0.5 : 0.15}
            style={{ width: '100%', height: '100%' }}
            minPixelRatio={1}
          />
        </div>
      </Suspense>

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
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)',
            }}>
              {/* Silver Styled Icon Container */}
              <div style={{ 
                width: '52px', 
                height: '52px', 
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#cbd5e1', // Light Silver
                marginBottom: '20px' 
              }}>
                {item.icon}
              </div>
              
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9', marginBottom: '12px' }}>{item.title}</div>
              <div style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.8 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <div className="sr sr-delay-2" style={{
          background: 'rgba(0,0,0,0.4)',
          borderRadius: '32px',
          padding: '56px',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(10px)',
          backgroundImage: 'radial-gradient(circle at top right, #E11D4815 0%, transparent 60%)',
          position: 'relative',
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