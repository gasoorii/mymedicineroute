'use client';

export default function Hero() {
  return (
    <section style={{
      textAlign: 'center',
      padding: '120px 24px 100px',
      maxWidth: '900px',
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '520px', height: '520px',
        opacity: 0.06, zIndex: 0, pointerEvents: 'none',
      }}>
        <img
          src="/heart_transparent.gif"
          alt=""
          className="heart-bg"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }} className="animate-reveal">
        <div className="badge-red" style={{ marginBottom: '32px' }}>
          <span className="pulse-dot" />
          Student-Founded · Bahrain
        </div>

        <h1 style={{
          fontSize: '76px',
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: '-4px',
          marginBottom: '32px',
          color: '#0d0d0d',
        }}>
          Your route into{' '}
          <span style={{ color: '#E11D48' }}>medical research</span>
          {' '}starts here
        </h1>

        <p style={{
          fontSize: '21px',
          color: '#64748b',
          lineHeight: 1.6,
          maxWidth: '620px',
          margin: '0 auto 48px',
          fontWeight: 400,
        }}>
          Connect with expert mentors to conduct real, guided research projects — designed for high school students, built for the future.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <a href="/join" className="btn-red" style={{ padding: '18px 40px', fontSize: '16px' }}>
            Join as Student
          </a>
          <a href="/join" className="btn-ghost" style={{ padding: '18px 40px', fontSize: '16px' }}>
            Become a Mentor
          </a>
        </div>
      </div>
    </section>
  );
}
