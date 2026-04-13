'use client';
import { FallingPattern } from './FallingPattern';

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M8 12l3 3 5-5"/>
  </svg>
);

const ClipboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
    <rect x="9" y="3" width="6" height="4" rx="1"/>
  </svg>
);

const BanIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
  </svg>
);

export default function Safety() {
  const allowed = ['Survey-based studies', 'Literature reviews', 'Observational studies', 'Data analysis projects'];
  const notAllowed = ['No lab experiments', 'No clinical interventions', 'No medical advice given', 'Anonymous data only'];
  const rules = [
    { icon: <LockIcon />, title: 'Anonymous data only', desc: 'All student research uses fully anonymized data. No personal information is ever collected or published.', delay: 'sr-delay-1' },
    { icon: <CheckIcon />, title: 'Mentor approval required', desc: 'Every project must be reviewed and approved by a qualified medical mentor before any data is collected.', delay: 'sr-delay-2' },
    { icon: <ClipboardIcon />, title: 'Consent required', desc: 'All study participants provide informed consent before being included in any research project.', delay: 'sr-delay-3' },
    { icon: <BanIcon />, title: 'No experiments on people', desc: 'We do not conduct any clinical trials, physical experiments, or interventions of any kind.', delay: 'sr-delay-4' },
  ];

  return (
    <section id="safety" style={{
      background: '#1c1d1f',
      padding: '100px 64px',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <FallingPattern
        color="rgba(225,29,72,0.85)"
        blurIntensity="0.3em"
        duration={600}
      />
      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <p className="sr" style={{ fontSize: '14px', fontWeight: 700, color: '#E11D48', letterSpacing: '2px', textTransform: 'uppercase', textAlign: 'center', marginBottom: '16px' }}>Safety first</p>
        <h2 className="sr sr-delay-1" style={{ fontSize: '42px', fontWeight: 800, textAlign: 'center', letterSpacing: '-1.5px', marginBottom: '16px', color: '#f1f5f9' }}>
          Safe by design. Not an afterthought.
        </h2>
        <p className="sr sr-delay-2" style={{ fontSize: '18px', color: '#94a3b8', textAlign: 'center', maxWidth: '580px', margin: '0 auto 64px', lineHeight: 1.7 }}>
          Every project on My Medicine Route operates within a strict, medically supervised scope. Here's exactly what that means.
        </p>
        <div className="sr sr-delay-1" style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '20px', padding: '36px', marginBottom: '32px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Project types — safe scope only</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
            {allowed.map(item => (
              <span key={item} style={{ background: 'rgba(15,110,86,0.2)', color: '#4ade80', padding: '8px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 600, border: '1px solid rgba(74,222,128,0.2)' }}>{item}</span>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {notAllowed.map(item => (
              <span key={item} style={{ background: 'rgba(225,29,72,0.1)', color: '#f87171', padding: '8px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 600, border: '1px solid rgba(248,113,113,0.2)' }}>{item}</span>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {rules.map(item => (
            <div key={item.title} className={`sr ${item.delay} glass-card`} style={{ borderRadius: '16px', padding: '28px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.05)', // Subtle white/silver bg
                border: '1px solid rgba(255,255,255,0.1)', // Subtle silver border
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#cbd5e1', // Light silver color for the icon stroke
                flexShrink: 0,
              }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>{item.title}</div>
                <div style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}