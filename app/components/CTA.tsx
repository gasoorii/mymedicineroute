export default function CTA() {
  return (
    <section style={{ padding: '40px 64px 100px' }}>
      <div style={{
        background: '#0d0d0d', borderRadius: '40px', padding: '100px 64px',
        textAlign: 'center',
        backgroundImage: 'radial-gradient(circle at top right, #E11D4833 0%, transparent 40%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-30px', left: '-30px',
          width: '280px', height: '280px', opacity: 0.12,
          transform: 'rotate(-30deg)', pointerEvents: 'none',
        }}>
          <img src="/stethoscope_transparent.png" alt=""
            style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'screen' }} />
        </div>
        <div style={{
          position: 'absolute', bottom: '-30px', right: '-30px',
          width: '280px', height: '280px', opacity: 0.12,
          transform: 'rotate(150deg) scaleX(-1)', pointerEvents: 'none',
        }}>
          <img src="/stethoscope_transparent.png" alt=""
            style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'screen' }} />
        </div>
        <h2 style={{ fontSize: '48px', fontWeight: 800, color: '#fff', letterSpacing: '-2px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
          Ready to start your journey?
        </h2>
        <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '500px', margin: '0 auto 48px', position: 'relative', zIndex: 1 }}>
          Join students across Bahrain gaining real medical research experience.
        </p>
        <a href="/join" style={{
          background: '#E11D48', color: 'white', padding: '20px 50px',
          borderRadius: '999px', textDecoration: 'none', fontSize: '18px',
          fontWeight: 600, position: 'relative', zIndex: 1,
          boxShadow: '0 4px 15px rgba(225,29,72,0.25)', display: 'inline-block',
        }}>
          Apply Now →
        </a>
      </div>
    </section>
  );
}