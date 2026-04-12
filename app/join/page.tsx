'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function JoinPage() {
  const [role, setRole] = useState<'student' | 'mentor'>('student');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    school: '',
    grade: '',
    interest: '',
    roleTitle: '',
    institution: '',
    hours: '',
    why: '',
  });

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (role === 'student') {
        await supabase.from('students').insert({
          full_name: form.fullName,
          email: form.email,
          school: form.school,
          grade: form.grade,
          interest: form.interest,
          why: form.why,
        });
      } else {
        await supabase.from('mentors').insert({
          full_name: form.fullName,
          email: form.email,
          role: form.roleTitle,
          institution: form.institution,
          hours: form.hours,
          why: form.why,
        });
      }
      setSubmitted(true);
    } catch (err) {
      alert('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafaf8' }}>
        <div style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '24px' }}>🎉</div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0d0d0d', marginBottom: '16px', letterSpacing: '-1px' }}>
            You're in!
          </h1>
          <p style={{ fontSize: '17px', color: '#64748b', maxWidth: '400px', lineHeight: 1.6 }}>
            Thanks for applying to My Medicine Route. We'll be in touch at <strong>{form.email}</strong> within a few days.
          </p>
          <a href="/" style={{
            display: 'inline-block', marginTop: '40px',
            background: '#E11D48', color: 'white', padding: '14px 32px',
            borderRadius: '999px', textDecoration: 'none', fontWeight: 600, fontSize: '15px',
          }}>
            Back to home
          </a>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#fafaf8' }}>

      <div style={{
        background: 'radial-gradient(circle at 30% 50%, #2a0810 0%, #0d0d0d 70%)',
        padding: '60px 24px 80px',
        textAlign: 'center'
      }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '40px' }}>
          <div style={{ width: '8px', height: '20px', background: '#E11D48', borderRadius: '2px' }} />
          <span style={{ fontWeight: 800, fontSize: '16px', color: '#fff' }}>My Medicine Route</span>
        </a>
        <h1 style={{ fontSize: '48px', fontWeight: 800, color: '#fff', letterSpacing: '-2px', marginBottom: '16px' }}>
          Join the network
        </h1>
        <p style={{ fontSize: '17px', color: '#94a3b8', maxWidth: '480px', margin: '0 auto' }}>
          Whether you're a student ready to research or a mentor ready to guide — there's a place for you here.
        </p>
      </div>

      <div style={{ maxWidth: '600px', margin: '-40px auto 80px', padding: '0 24px' }}>
        <div style={{ background: '#fff', borderRadius: '24px', padding: '48px', border: '1px solid #f1f5f9', boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}>

          <div style={{ display: 'flex', background: '#f8f8f6', borderRadius: '12px', padding: '4px', marginBottom: '40px' }}>
            {(['student', 'mentor'] as const).map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                style={{
                  flex: 1, padding: '12px', border: 'none', cursor: 'pointer',
                  borderRadius: '10px', fontWeight: 700, fontSize: '14px',
                  transition: 'all 0.2s',
                  background: role === r ? '#E11D48' : 'transparent',
                  color: role === r ? '#fff' : '#64748b',
                }}
              >
                {r === 'student' ? 'I am a Student' : 'I am a Mentor'}
              </button>
            ))}
          </div>

          <form onSubmit={submit}>
            <div style={{ display: 'grid', gap: '20px' }}>

              <div>
                <label style={labelStyle}>Full name</label>
                <input name="fullName" required onChange={handle} style={inputStyle} placeholder="Your full name" />
              </div>

              <div>
                <label style={labelStyle}>Email address</label>
                <input name="email" type="email" required onChange={handle} style={inputStyle} placeholder="your@email.com" />
              </div>

              {role === 'student' && (
                <>
                  <div>
                    <label style={labelStyle}>School</label>
                    <input name="school" required onChange={handle} style={inputStyle} placeholder="Your school name" />
                  </div>
                  <div>
                    <label style={labelStyle}>Grade</label>
                    <select name="grade" required onChange={handle} style={inputStyle}>
                      <option value="">Select your grade</option>
                      {['9', '10', '11', '12'].map(g => (
                        <option key={g} value={g}>Grade {g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Area of interest in medicine</label>
                    <select name="interest" required onChange={handle} style={inputStyle}>
                      <option value="">Select an area</option>
                      {['General medicine', 'Surgery', 'Neurology', 'Cardiology', 'Oncology', 'Pediatrics', 'Public health', 'Research & data', 'Other'].map(i => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Why do you want to join?</label>
                    <textarea name="why" required onChange={handle} rows={4} style={{ ...inputStyle, resize: 'none' }} placeholder="Tell us what drives your interest in medical research..." />
                  </div>
                </>
              )}

              {role === 'mentor' && (
                <>
                  <div>
                    <label style={labelStyle}>Current role</label>
                    <input name="roleTitle" required onChange={handle} style={inputStyle} placeholder="e.g. Medical student, Doctor, Researcher" />
                  </div>
                  <div>
                    <label style={labelStyle}>Institution</label>
                    <input name="institution" required onChange={handle} style={inputStyle} placeholder="e.g. University, Hospital, Clinic..." />
                  </div>
                  <div>
                    <label style={labelStyle}>Hours available per week</label>
                    <select name="hours" required onChange={handle} style={inputStyle}>
                      <option value="">Select availability</option>
                      {['Less than 1 hour', '1–2 hours', '2–4 hours', '4+ hours'].map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Why do you want to mentor?</label>
                    <textarea name="why" required onChange={handle} rows={4} style={{ ...inputStyle, resize: 'none' }} placeholder="Tell us what motivates you to guide the next generation..." />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? '#f1f5f9' : '#E11D48',
                  color: loading ? '#94a3b8' : '#fff',
                  border: 'none', borderRadius: '999px',
                  padding: '18px', fontSize: '16px', fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s', marginTop: '8px',
                  boxShadow: loading ? 'none' : '0 4px 15px rgba(225,29,72,0.25)',
                }}
              >
                {loading ? 'Submitting...' : role === 'student' ? 'Apply as Student →' : 'Apply as Mentor →'}
              </button>

            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 700,
  color: '#0d0d0d',
  marginBottom: '8px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  border: '1.5px solid #e8e6df',
  borderRadius: '12px',
  fontSize: '15px',
  color: '#0d0d0d',
  background: '#fafaf8',
  outline: 'none',
  fontFamily: "'Inter', sans-serif",
};
