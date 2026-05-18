'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

type Role = 'student' | 'mentor';
type Step = 'details' | 'account' | 'done';

export default function JoinPage() {
  const [role, setRole] = useState<Role>('student');
  const [step, setStep] = useState<Step>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: '', email: '', password: '',
    school: '', grade: '', interest: '', why: '',
    roleTitle: '', institution: '', hours: '', bio: '',
    expertiseTags: [] as string[],
  });

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleTag = (tag: string) => {
    setForm(prev => ({
      ...prev,
      expertiseTags: prev.expertiseTags.includes(tag)
        ? prev.expertiseTags.filter(t => t !== tag)
        : [...prev.expertiseTags, tag],
    }));
  };

  const submitAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.fullName, role } },
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error('Signup failed');
      const uid = authData.user.id;
      if (role === 'student') {
        const { error: pe } = await supabase.from('student_profiles').insert({
          id: uid, school: form.school, grade: form.grade, interest: form.interest, why: form.why,
        });
        if (pe) throw pe;
      } else {
        const { error: pe } = await supabase.from('mentor_profiles').insert({
          id: uid, bio: form.bio, expertise_tags: form.expertiseTags,
          institution: form.institution, role_title: form.roleTitle, hours_per_week: form.hours,
        });
        if (pe) throw pe;
      }
      setStep('done');
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    }
    setLoading(false);
  };

  const expertiseOptions = [
    'General medicine', 'Surgery', 'Neurology', 'Cardiology',
    'Oncology', 'Pediatrics', 'Public health', 'Research & data', 'Psychiatry',
  ];

  if (step === 'done') {
    return (
      <main style={{ minHeight: '100vh', background: '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <Blobs />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '24px' }}>🎉</div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '16px', letterSpacing: '-1px' }}>You're in!</h1>
          <p style={{ fontSize: '17px', color: '#94a3b8', maxWidth: '400px', lineHeight: 1.6, marginBottom: '32px' }}>
            Check <strong style={{ color: '#f1f5f9' }}>{form.email}</strong> to confirm your address, then log in.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/login" style={btnRed}>Go to Login</a>
            <a href="/" style={btnGhost}>Back to Home</a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0d0d0d', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .join-title { font-size: 52px; }
        .join-card { padding: 40px; }
        .join-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 768px) {
          .join-title { font-size: 36px !important; letter-spacing: -1px !important; }
          .join-card { padding: 24px !important; }
          .join-grid-2 { grid-template-columns: 1fr !important; gap: 18px !important; }
        }
      `}</style>

      <Blobs />

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

        <h1 className="join-title" style={{ fontWeight: 800, color: '#fff', letterSpacing: '-2px', marginBottom: '12px' }}>
          Join the network
        </h1>
        <p style={{ fontSize: '17px', color: '#94a3b8', maxWidth: '480px', margin: '0 auto' }}>
          {step === 'details'
            ? "Student ready to research, or a mentor ready to guide — there's a place for you."
            : 'One last step — create your account to access your dashboard.'}
        </p>
      </div>

      {/* Card */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '32px auto 80px', padding: '0 20px' }}>
        <div className="join-card" style={{
          background: 'rgba(20,20,22,0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        }}>

          {/* STEP: DETAILS */}
          {step === 'details' && (
            <>
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px', marginBottom: '32px' }}>
                {(['student', 'mentor'] as Role[]).map(r => (
                  <button key={r} onClick={() => { setRole(r); setError(''); }} style={{
                    flex: 1, padding: '12px', border: 'none', cursor: 'pointer',
                    borderRadius: '10px', fontWeight: 700, fontSize: '14px', transition: 'all 0.2s',
                    background: role === r ? '#E11D48' : 'transparent',
                    color: role === r ? '#fff' : '#64748b',
                  }}>
                    {r === 'student' ? 'I am a Student' : 'I am a Mentor'}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gap: '18px' }}>
                <Field label="Full name">
                  <input name="fullName" required value={form.fullName} onChange={handle} style={inp} placeholder="Your full name" />
                </Field>

                {role === 'student' && (<>
                  <Field label="School">
                    <input name="school" required value={form.school} onChange={handle} style={inp} placeholder="Your school name" />
                  </Field>
                  <div className="join-grid-2">
                    <Field label="Grade">
                      <select name="grade" required value={form.grade} onChange={handle} style={inp}>
                        <option value="">Select...</option>
                        {['9', '10', '11', '12'].map(g => <option key={g} value={g}>Grade {g}</option>)}
                      </select>
                    </Field>
                    <Field label="Area of interest">
                      <select name="interest" required value={form.interest} onChange={handle} style={inp}>
                        <option value="">Select...</option>
                        {expertiseOptions.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </Field>
                  </div>
                  <Field label="Why do you want to join?">
                    <textarea name="why" required value={form.why} onChange={handle}
                      rows={4} style={{ ...inp, resize: 'none' }}
                      placeholder="What drives your interest in medical research..." />
                  </Field>
                </>)}

                {role === 'mentor' && (<>
                  <div className="join-grid-2">
                    <Field label="Current role">
                      <input name="roleTitle" required value={form.roleTitle} onChange={handle} style={inp} placeholder="e.g. Medical student" />
                    </Field>
                    <Field label="Institution">
                      <input name="institution" required value={form.institution} onChange={handle} style={inp} placeholder="e.g. RCSI Bahrain" />
                    </Field>
                  </div>
                  <Field label="Hours available per week">
                    <select name="hours" required value={form.hours} onChange={handle} style={inp}>
                      <option value="">Select availability</option>
                      {['Less than 1 hour', '1–2 hours', '2–4 hours', '4+ hours'].map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </Field>
                  <Field label="Expertise areas">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                      {expertiseOptions.map(tag => (
                        <button key={tag} type="button" onClick={() => toggleTag(tag)} style={{
                          padding: '7px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 600,
                          cursor: 'pointer', transition: 'all 0.15s',
                          background: form.expertiseTags.includes(tag) ? 'rgba(225,29,72,0.15)' : 'rgba(255,255,255,0.06)',
                          color: form.expertiseTags.includes(tag) ? '#f87171' : '#64748b',
                          border: form.expertiseTags.includes(tag) ? '1px solid rgba(225,29,72,0.4)' : '1px solid rgba(255,255,255,0.1)',
                        }}>{tag}</button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Bio">
                    <textarea name="bio" value={form.bio} onChange={handle}
                      rows={4} style={{ ...inp, resize: 'none' }}
                      placeholder="Tell students about your background..." />
                  </Field>
                </>)}
              </div>

              {error && <p style={errStyle}>{error}</p>}

              <button onClick={() => {
                if (!form.fullName) { setError('Full name is required'); return; }
                if (role === 'student' && (!form.school || !form.grade || !form.interest || !form.why)) { setError('Please fill in all fields'); return; }
                if (role === 'mentor' && (!form.roleTitle || !form.institution || !form.hours)) { setError('Please fill in all fields'); return; }
                setError(''); setStep('account');
              }} style={{ ...submitBtn, marginTop: '24px' }}>
                {role === 'student' ? 'Apply as Student →' : 'Apply as Mentor →'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '14px', color: '#475569', marginTop: '20px' }}>
                Already have an account?{' '}
                <a href="/login" style={{ color: '#E11D48', fontWeight: 700, textDecoration: 'none' }}>Log in</a>
              </p>
            </>
          )}

          {/* STEP: ACCOUNT */}
          {step === 'account' && (
            <>
              <button onClick={() => setStep('details')} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#64748b', fontSize: '14px', fontWeight: 600,
                padding: 0, marginBottom: '28px', display: 'block',
              }}>← Back</button>

              <div style={{
                display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em',
                color: '#f87171', background: 'rgba(225,29,72,0.12)',
                border: '1px solid rgba(225,29,72,0.25)', padding: '5px 14px',
                borderRadius: '999px', marginBottom: '28px',
              }}>
                {role === 'student' ? '🎓 Student Account' : '🩺 Mentor Account'}
              </div>

              <form onSubmit={submitAccount}>
                <div style={{ display: 'grid', gap: '18px' }}>
                  <Field label="Email address">
                    <input name="email" type="email" required value={form.email} onChange={handle} style={inp} placeholder="your@email.com" />
                  </Field>
                  <Field label="Password">
                    <input name="password" type="password" required value={form.password} onChange={handle} style={inp} placeholder="At least 8 characters" minLength={8} />
                  </Field>
                </div>
                <p style={{ fontSize: '12px', color: '#475569', marginTop: '16px', lineHeight: 1.6 }}>
                  By creating an account you agree to use My Medicine Route for educational research only under mentor supervision.
                </p>
                {error && <p style={errStyle}>{error}</p>}
                <button type="submit" disabled={loading} style={{
                  ...submitBtn, marginTop: '24px',
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  background: loading ? 'rgba(255,255,255,0.08)' : '#E11D48',
                  color: loading ? '#475569' : '#fff',
                  boxShadow: loading ? 'none' : '0 4px 15px rgba(225,29,72,0.3)',
                }}>
                  {loading ? 'Submitting...' : `Apply as ${role === 'student' ? 'Student' : 'Mentor'} →`}
                </button>
              </form>

              <p style={{ textAlign: 'center', fontSize: '14px', color: '#475569', marginTop: '20px' }}>
                Already have an account?{' '}
                <a href="/login" style={{ color: '#E11D48', fontWeight: 700, textDecoration: 'none' }}>Log in</a>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function Blobs() {
  return (
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
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: '11px', fontWeight: 700,
        color: '#64748b', marginBottom: '8px',
        letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inp: React.CSSProperties = {
  width: '100%', padding: '13px 16px',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px', fontSize: '15px',
  color: '#e2e8f0', background: 'rgba(255,255,255,0.05)',
  outline: 'none', fontFamily: "'Inter', sans-serif",
  boxSizing: 'border-box',
};

const submitBtn: React.CSSProperties = {
  width: '100%', background: '#E11D48', color: '#fff', border: 'none',
  borderRadius: '999px', padding: '16px', fontSize: '16px', fontWeight: 700,
  cursor: 'pointer', transition: 'all 0.2s',
  boxShadow: '0 4px 15px rgba(225,29,72,0.3)',
};

const errStyle: React.CSSProperties = {
  color: '#f87171', fontSize: '13px', fontWeight: 600,
  marginTop: '12px', textAlign: 'center',
};

const btnRed: React.CSSProperties = {
  background: '#E11D48', color: 'white', padding: '14px 32px',
  borderRadius: '999px', textDecoration: 'none', fontWeight: 600,
  fontSize: '15px', display: 'inline-block',
};

const btnGhost: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)', color: '#e2e8f0', padding: '14px 32px',
  borderRadius: '999px', textDecoration: 'none', fontWeight: 600,
  fontSize: '15px', border: '1px solid rgba(255,255,255,0.1)', display: 'inline-block',
};
