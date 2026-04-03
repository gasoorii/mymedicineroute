export default function WhatWeDo() {
  const items = [
    { img: '/microscope_mono_transparent.png', title: 'Guided Projects', desc: 'Work on real survey-based studies and observational data. Move beyond textbooks into real science.' },
    { img: '/handshake_mono_transparent.png', title: 'Expert Matching', desc: 'Paired with medical professionals who review your methods and guide your data analysis journey.' },
    { img: '/folder_mono_transparent.png', title: 'Public Archive', desc: 'Your work is documented and published in our research archive, creating a professional portfolio.' },
  ];

  return (
    <section style={{ background: '#fff', padding: '100px 64px', borderTop: '1px solid #f1f5f9' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <p style={{ fontSize: '14px', fontWeight: 700, color: '#E11D48', letterSpacing: '2px', textTransform: 'uppercase', textAlign: 'center', marginBottom: '16px' }}>The Platform</p>
        <h2 style={{ fontSize: '42px', fontWeight: 800, textAlign: 'center', marginBottom: '64px', letterSpacing: '-1.5px' }}>
          Real research experience.<br />Before university.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {items.map((item) => (
            <div key={item.title} className="glass-card">
              <div style={{
                marginBottom: '24px', background: '#FFF1F2',
                width: '64px', height: '64px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                borderRadius: '16px', overflow: 'hidden',
              }}>
                <img src={item.img} alt={item.title} className="mono-icon" />
              </div>
              <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: '#0d0d0d' }}>{item.title}</div>
              <div style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.7 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
