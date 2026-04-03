export default function WhoItsFor() {
  const items = [
    { img: '/graduation_hat_mono_transparent.png', title: 'High school students', desc: 'If you are interested in medicine and want real research experience before university — this is built for you. No prior experience required.' },
    { img: '/first_aid_kit_mono_transparent.png', title: 'Medical students & doctors', desc: 'If you want to give back, build mentoring experience, and guide the next generation of researchers — join as a mentor.' },
  ];

  return (
    <section style={{ background: '#fafaf8', borderTop: '1px solid #f1f5f9', padding: '100px 64px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <p style={{ fontSize: '14px', fontWeight: 700, color: '#E11D48', letterSpacing: '2px', textTransform: 'uppercase', textAlign: 'center', marginBottom: '16px' }}>Who it's for</p>
        <h2 style={{ fontSize: '42px', fontWeight: 800, textAlign: 'center', marginBottom: '64px', letterSpacing: '-1.5px' }}>
          Built for students. Powered by mentors.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {items.map(item => (
            <div key={item.title} className="glass-card">
              <div style={{
                marginBottom: '20px', background: '#FFF1F2',
                width: '64px', height: '64px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                borderRadius: '16px', overflow: 'hidden',
              }}>
                <img src={item.img} alt={item.title} className="mono-icon" />
              </div>
              <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '14px', color: '#0d0d0d' }}>{item.title}</div>
              <div style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.7 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
