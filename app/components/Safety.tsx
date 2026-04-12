export default function Safety() {
  const allowed = [
    'Survey-based studies',
    'Literature reviews',
    'Observational studies',
    'Data analysis projects',
  ];

  const notAllowed = [
    'No lab experiments',
    'No clinical interventions',
    'No medical advice given',
    'Anonymous data only',
  ];

  const rules = [
    { icon: '🔒', title: 'Anonymous data only', desc: 'All student research uses fully anonymized data. No personal information is ever collected or published.' },
    { icon: '✅', title: 'Mentor approval required', desc: 'Every project must be reviewed and approved by a qualified medical mentor before any data is collected.' },
    { icon: '📋', title: 'Consent required', desc: 'All study participants provide informed consent before being included in any research project.' },
    { icon: '🚫', title: 'No experiments on people', desc: 'We do not conduct any clinical trials, physical experiments, or interventions of any kind.' },
  ];

  return (
    <section id="safety" style={{
      background: '#fff',
      padding: '100px 64px',
      borderTop: '1px solid #f1f5f9',
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <p style={{ fontSize: '14px', fontWeight: 700, color: '#E11D48', letterSpacing: '2px', textTransform: 'uppercase', textAlign: 'center', marginBottom: '16px' }}>Safety first</p>
        <h2 style={{ fontSize: '42px', fontWeight: 800, textAlign: 'center', letterSpacing: '-1.5px', marginBottom: '16px', color: '#0d0d0d' }}>
          Safe by design. Not an afterthought.
        </h2>
        <p style={{ fontSize: '18px', color: '#64748b', textAlign: 'center', maxWidth: '580px', margin: '0 auto 64px', lineHeight: 1.7 }}>
          Every project on My Medicine Route operates within a strict, medically supervised scope. Here's exactly what that means.
        </p>

        {/* Pills */}
        <div style={{ background: '#fafaf8', borderRadius: '20px', padding: '36px', marginBottom: '32px', border: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#0d0d0d', marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Project types — safe scope only</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
            {allowed.map(item => (
              <span key={item} style={{
                background: '#E1F5EE', color: '#0F6E56',
                padding: '8px 16px', borderRadius: '999px',
                fontSize: '13px', fontWeight: 600,
                border: '1px solid #9FE1CB',
              }}>{item}</span>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {notAllowed.map(item => (
              <span key={item} style={{
                background: '#FFF1F2', color: '#BE123C',
                padding: '8px 16px', borderRadius: '999px',
                fontSize: '13px', fontWeight: 600,
                border: '1px solid #fecdd3',
              }}>{item}</span>
            ))}
          </div>
        </div>

        {/* Rules grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {rules.map(item => (
            <div key={item.title} className="glass-card" style={{ borderRadius: '16px', padding: '28px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '24px', marginTop: '2px' }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#0d0d0d', marginBottom: '8px' }}>{item.title}</div>
                <div style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
