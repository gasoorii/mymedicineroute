'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    router.push(profile?.role === 'mentor' ? '/dashboard/mentor' : '/dashboard/student');
    setLoading(false);
  };

  return (
    <main style={{ minHeight: '100vh', background: '#0d0d0d', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .login-title { font-size: 52px; }
        .login-card { padding: 40px; }
        @media (max-width: 768px) {
          .login-title { font-size: 36px !important; letter-spacing: -1px !important; }
          .login-card { padding: 24px !important; }
        }
      `}</style>

      {/* Blobs — identical to join page */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '-15%',
          width: '60vw', height: '60vw', maxWidth: '700px', maxHeight: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(120,0,25,0.55) 0%, transparent 65%)',
          animation: 'blobMove1 8s ease-in-out infinite alternate',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', right: '-10%',
          width: '55vw', height: '55vw', maxWidth: '600px', maxHeight: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(90,0,18,0.45) 0%, transparent 65%)',
          animation: 'blobMove2 11s ease-in-out infinite alternate',
          filter: 'blur(50px)',
        }} />
        <div style={{
          position: 'absolute', top: '35%', right: '15%',
          width: '40vw', height: '40vw', maxWidth: '400px', maxHeight: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(160,0,35,0.3) 0%, transparent 65%)',
          animation: 'blobMove3 7s ease-in-out infinite alternate',
          filter: 'blur(60px)',
        }} />
      </div>

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '48px 20px 0' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '32px' }}>
          <div style={{ width: '8px', height: '20px', background: '#E11D48', borderRadius: '2px' }} />
          <span style={{ fontWeight: 800, fontSize: '16px', color: '#fff' }}>My Medicine Route</span>
        </a>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(225,29,72,0.15)', border: '1px solid rgba(225,29,72,0.3)',
            color: '#f87171', fontSize: '12px', fontWeight: 700,
            padding: '6px 16px', borderRadius: '999px',
          }}>
            <span style={{ width: '6px', height: '6px', background: '#E11D48', borderRadius: '50%', display: 'inline-block' }} />
            Enrollment is open
          </div>
        </div>

        <h1 className="login-title" style={{ fontWeight: 800, color: '#fff', letterSpacing: '-2px', marginBottom: '12px' }}>
          Welcome back
        </h1>
        <p style={{ fontSize: '17px', color: '#94a3b8', maxWidth: '400px', margin: '0 auto' }}>
          Log in to access your dashboard and continue your research journey.
        </p>
      </div>

      {/* Card */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '480px', margin: '32px auto 80px', padding: '0 20px' }}>
        <div className="login-card" style={{
          background: 'rgba(20,20,22,0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        }}>
          <form onSubmit={submit}>
            <div style={{ display: 'grid', gap: '18px', marginBottom: '8px' }}>
              <div>
                <label style={labelStyle}>Email address</label>
                <input name="email" type="email" required value={form.email}
                  onChange={handle} style={inp} placeholder="your@email.com" />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input name="password" type="password" required value={form.password}
                  onChange={handle} style={inp} placeholder="Your password" />
              </div>
            </div>

            {error && <p style={errStyle}>{error}</p>}

            <button type="submit" disabled={loading} style={{
              width: '100%', marginTop: '24px',
              background: loading ? 'rgba(255,255,255,0.06)' : '#E11D48',
              color: loading ? '#475569' : '#fff',
              border: 'none', borderRadius: '999px',
              padding: '16px', fontSize: '16px', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(225,29,72,0.3)',
              transition: 'all 0.2s',
            }}>
              {loading ? 'Logging in...' : 'Log in →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#475569', marginTop: '24px' }}>
            Don't have an account?{' '}
            <a href="/join" style={{ color: '#E11D48', fontWeight: 700, textDecoration: 'none' }}>
              Join the network
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '11px', fontWeight: 700,
  color: '#64748b', marginBottom: '8px',
  letterSpacing: '0.08em', textTransform: 'uppercase',
};

const inp: React.CSSProperties = {
  width: '100%', padding: '13px 16px',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px', fontSize: '15px',
  color: '#e2e8f0', background: 'rgba(255,255,255,0.05)',
  outline: 'none', fontFamily: "'Inter', sans-serif",
  boxSizing: 'border-box',
};

const errStyle: React.CSSProperties = {
  color: '#f87171', fontSize: '13px', fontWeight: 600,
  marginTop: '12px', textAlign: 'center',
};
