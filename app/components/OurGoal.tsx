'use client';
import { FallingPattern } from './FallingPattern';

export default function OurGoal() {
  return (
    <section id="our-goal" style={{
      background: '#1c1d1f',
      padding: '100px 64px',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <FallingPattern
        color="rgba(225,29,72,0.85)"
        blurIntensity="0.3em"
        duration={300}
      />
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <p className="sr" style={{ fontSize: '14px', fontWeight: 700, color: '#E11D48', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>Our Goal</p>
        <h2 className="sr sr-delay-1" style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '20px', color: '#f1f5f9' }}>
          Building the first student medical<br />research network in Bahrain
        </h2>
        <p className="sr sr-delay-2" style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.7, maxWidth: '620px', margin: '0 auto 64px' }}>
          My Medicine Route is a student-founded nonprofit with one mission — give every high schooler in Bahrain a real shot at medical research before university. No connections needed. No experience required.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { num: '50+', label: 'Students involved', desc: 'High schoolers across Bahrain gaining real research experience', delay: 'sr-delay-2' },
            { num: '5+', label: 'Projects completed', desc: 'Real studies published and documented in our archive', delay: 'sr-delay-3' },
            { num: '3+', label: 'Schools reached', desc: 'Expanding across schools in Bahrain in our first year', delay: 'sr-delay-4' },
          ].map(item => (
            <div key={item.label} className={`sr ${item.delay}`} style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(8px)',
              borderRadius: '20px',
              padding: '36px 28px',
              border: '1px solid rgba(255,255,255,0.08)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '48px', fontWeight: 800, color: '#E11D48', letterSpacing: '-2px', marginBottom: '8px' }}>{item.num}</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>{item.label}</div>
              <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}