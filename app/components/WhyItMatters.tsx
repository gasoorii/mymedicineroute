export default function WhyItMatters() {
  const problems = [
    {
      icon: '🚪',
      title: 'No entry point',
      desc: 'Medical research is locked behind university doors. High schoolers with genuine passion have nowhere to start — no labs, no mentors, no structure.'
    },
    {
      icon: '🔗',
      title: 'No connections',
      desc: 'Getting into research depends on who you know. Students without the right family connections or school resources are left completely behind.'
    },
    {
      icon: '📂',
      title: 'No portfolio',
      desc: 'When applying to medical school, students need proof of commitment. Without research experience, that proof simply doesn\'t exist.'
    },
    {
      icon: '🧭',
      title: 'No guidance',
      desc: 'Even motivated students don\'t know where to start. The path into medicine feels opaque, overwhelming, and unfair.'
    },
  ];

  return (
    <section id="why" style={{
      background: '#fafaf8',
      padding: '100px 64px',
      borderTop: '1px solid #f1f5f9',
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <p style={{ fontSize: '14px', fontWeight: 700, color: '#E11D48', letterSpacing: '2px', textTransform: 'uppercase', textAlign: 'center', marginBottom: '16px' }}>Why it matters</p>
        <h2 style={{ fontSize: '42px', fontWeight: 800, textAlign: 'center', letterSpacing: '-1.5px', marginBottom: '16px', color: '#0d0d0d' }}>
          The system wasn't built for students like you
        </h2>
        <p style={{ fontSize: '18px', color: '#64748b', textAlign: 'center', maxWidth: '580px', margin: '0 auto 64px', lineHeight: 1.7 }}>
          Every year, thousands of Bahraini students passionate about medicine hit the same invisible wall. My Medicine Route tears it down.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '60px' }}>
          {problems.map(item => (
            <div key={item.title} className="glass-card" style={{ borderRadius: '20px', padding: '32px' }}>
              <div style={{ fontSize: '28px', marginBottom: '14px' }}>{item.icon}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#0d0d0d', marginBottom: '10px' }}>{item.title}</div>
              <div style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* How MMR fixes it */}
        <div style={{
          background: '#0d0d0d',
          borderRadius: '24px',
          padding: '48px',
          backgroundImage: 'radial-gradient(circle at top right, #E11D4822 0%, transparent 50%)',
        }}>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#E11D48', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>How we fix it</p>
          <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: '24px' }}>
            My Medicine Route gives you the entry point you were never given
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            {[
              { label: 'Real projects', desc: 'Not textbook exercises. Real studies with real data.' },
              { label: 'Real mentors', desc: 'Medical students and doctors guiding you every step.' },
              { label: 'Real proof', desc: 'Published work you can show colleges and universities.' },
            ].map(item => (
              <div key={item.label} style={{ borderTop: '2px solid #E11D48', paddingTop: '16px' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{item.label}</div>
                <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
