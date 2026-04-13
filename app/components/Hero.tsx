'use client';
import { Waves } from './Waves';

export default function Hero() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <Waves strokeColor="rgba(225,29,72,0.2)" backgroundColor="transparent" />
      <section style={{
        textAlign: 'center',
        padding: '120px 24px 100px',
        maxWidth: '900px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        <div className="animate-reveal">
          <div className="badge-red" style={{ marginBottom: '32px' }}>
            <span className="pulse-dot" />
            Student-Founded · Bahrain
          </div>
          <h1 style={{
            fontSize: '76px', fontWeight: 800, lineHeight: 1,
            letterSpacing: '-4px', marginBottom: '32px', color: '#f1f5f9',
          }}>
            Your route into{' '}
            <span style={{ color: '#E11D48' }}>medical research</span>
            {' '}starts here
          </h1>
          <p style={{
            fontSize: '21px', color: '#94a3b8', lineHeight: 1.6,
            maxWidth: '620px', margin: '0 auto 48px', fontWeight: 400,
          }}>
            Connect with expert mentors to conduct real, guided research projects — designed for high school students, built for the future.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <a href="/join" className="btn-red" style={{ padding: '18px 40px', fontSize: '16px' }}>Join as Student</a>
            <a href="/join" className="btn-ghost" style={{ padding: '18px 40px', fontSize: '16px' }}>Become a Mentor</a>
          </div>
        </div>
      </section>
    </div>
  );
}