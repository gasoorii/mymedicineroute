'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const vertexSource = `attribute vec4 a_position; void main() { gl_Position = a_position; }`;
const fragmentSource = `
precision mediump float;
uniform vec2 iResolution; uniform float iTime; uniform vec2 iMouse; uniform vec3 u_color;
void mainImage(out vec4 fragColor, in vec2 fragCoord){
  vec2 centeredUV = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);
  float time = iTime * 0.5;
  vec2 mouse = iMouse / iResolution;
  vec2 rippleCenter = 2.0 * mouse - 1.0;
  vec2 distortion = centeredUV;
  for (float i = 1.0; i < 6.0; i++) {
    distortion.x += 0.5 / i * cos(i * 2.0 * distortion.y + time + rippleCenter.x * 3.1415);
    distortion.y += 0.5 / i * cos(i * 2.0 * distortion.x + time + rippleCenter.y * 3.1415);
  }
  float wave = abs(sin(distortion.x + distortion.y + time));
  float glow = smoothstep(0.9, 0.2, wave);
  fragColor = vec4(u_color * glow, 1.0);
}
void main() { mainImage(gl_FragColor, gl_FragCoord.xy); }
`;

function SmokeyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: false, powerPreference: 'low-power' });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const iRes   = gl.getUniformLocation(prog, 'iResolution');
    const iTime  = gl.getUniformLocation(prog, 'iTime');
    const iMouse = gl.getUniformLocation(prog, 'iMouse');
    const uColor = gl.getUniformLocation(prog, 'u_color');
    gl.uniform3f(uColor, 0.882, 0.114, 0.282);

    const mouse = { x: 0, y: 0, active: false };
    const size  = { w: 0, h: 0 };
    const start = Date.now();
    let raf     = 0;
    let visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      const w = Math.floor(canvas.clientWidth  * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (w === size.w && h === size.h) return;
      canvas.width = w; canvas.height = h;
      size.w = w; size.h = h;
      gl.viewport(0, 0, w, h);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) schedule();
    }, { threshold: 0.1 });
    io.observe(canvas);

    const draw = () => {
      raf = 0;
      if (!visible) return;
      gl.uniform2f(iRes, size.w, size.h);
      gl.uniform1f(iTime, (Date.now() - start) / 1000);
      gl.uniform2f(iMouse,
        mouse.active ? mouse.x * (size.w / canvas.clientWidth)  : size.w  / 2,
        mouse.active ? size.h - mouse.y * (size.h / canvas.clientHeight) : size.h / 2
      );
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      schedule();
    };

    const schedule = () => { if (raf) return; raf = requestAnimationFrame(draw); };
    schedule();

    const onMove  = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true; };
    const onLeave = () => { mouse.active = false; };
    canvas.addEventListener('mousemove', onMove, { passive: true });
    canvas.addEventListener('mouseleave', onLeave, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      gl.deleteProgram(prog);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />;
}

function FloatingInput({ label, name, type = 'text', required = true, onChange, placeholder = ' ' }: {
  label: string; name: string; type?: string; required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string;
}) {
  const onFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = 'rgba(225,29,72,0.6)'; }, []);
  const onBlur  = useCallback((e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }, []);
  return (
    <div style={{ position: 'relative', paddingTop: '20px' }}>
      <input name={name} type={type} required={required} placeholder={placeholder}
        onChange={onChange} onFocus={onFocus} onBlur={onBlur}
        style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '14px 16px', fontSize: '15px', color: '#f1f5f9', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }}
      />
      <label style={{ position: 'absolute', top: '4px', left: '0', fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</label>
    </div>
  );
}

function FloatingSelect({ label, name, options, onChange }: {
  label: string; name: string; options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  const onFocus = useCallback((e: React.FocusEvent<HTMLSelectElement>) => { e.currentTarget.style.borderColor = 'rgba(225,29,72,0.6)'; }, []);
  const onBlur  = useCallback((e: React.FocusEvent<HTMLSelectElement>) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }, []);
  return (
    <div style={{ position: 'relative', paddingTop: '20px' }}>
      <select name={name} required onChange={onChange} defaultValue="" onFocus={onFocus} onBlur={onBlur}
        style={{ width: '100%', background: 'rgba(30,30,32,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '14px 16px', fontSize: '15px', color: '#f1f5f9', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit', appearance: 'none' }}
      >
        <option value="" disabled style={{ background: '#18191b' }}>Select...</option>
        {options.map(o => <option key={o} value={o} style={{ background: '#18191b' }}>{o}</option>)}
      </select>
      <label style={{ position: 'absolute', top: '4px', left: '0', fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</label>
      <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(4px)', pointerEvents: 'none', color: '#94a3b8' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </div>
  );
}

function FloatingTextarea({ label, name, rows = 4, onChange, placeholder }: {
  label: string; name: string; rows?: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string;
}) {
  const onFocus = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = 'rgba(225,29,72,0.6)'; }, []);
  const onBlur  = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }, []);
  return (
    <div style={{ position: 'relative', paddingTop: '20px' }}>
      <textarea name={name} required rows={rows} placeholder={placeholder}
        onChange={onChange} onFocus={onFocus} onBlur={onBlur}
        style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '14px 16px', fontSize: '15px', color: '#f1f5f9', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit', resize: 'none' }}
      />
      <label style={{ position: 'absolute', top: '4px', left: '0', fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</label>
    </div>
  );
}

export default function JoinPage() {
  const [role, setRole]           = useState<'student' | 'mentor'>('student');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [form, setForm]           = useState({
    fullName: '', email: '', school: '', grade: '',
    interest: '', roleTitle: '', institution: '', hours: '', why: '',
  });

  const handle = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (role === 'student') {
        await supabase.from('students').insert({
          full_name: form.fullName, email: form.email,
          school: form.school, grade: form.grade,
          interest: form.interest, why: form.why,
        });
      } else {
        await supabase.from('mentors').insert({
          full_name: form.fullName, email: form.email,
          role: form.roleTitle, institution: form.institution,
          hours: form.hours,
        });
      }
      setSubmitted(true);
    } catch { alert('Something went wrong. Please try again.'); }
    setLoading(false);
  };

  const btnHover   = useCallback((e: React.MouseEvent<HTMLButtonElement>) => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }, [loading]);
  const btnUnhover = useCallback((e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.transform = 'translateY(0)'; }, []);

  if (submitted) {
    return (
      <main style={{ minHeight: '100vh', background: '#0d0d0f', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <SmokeyBackground />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,12,0.75)', zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '60px 40px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '480px' }}>
          <div style={{ fontSize: '56px', marginBottom: '24px' }}>🎉</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(225,29,72,0.12)', color: '#E11D48', fontSize: '12px', fontWeight: 700, padding: '6px 16px', borderRadius: '999px', border: '1px solid rgba(225,29,72,0.2)', marginBottom: '24px' }}>
            <span style={{ width: '6px', height: '6px', background: '#E11D48', borderRadius: '50%' }} />
            Application received
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#f1f5f9', marginBottom: '16px', letterSpacing: '-1px' }}>You're in the queue.</h1>
          <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '40px' }}>
            We'll reach out to <strong style={{ color: '#f1f5f9' }}>{form.email}</strong> within a few days.
          </p>
          <a href="/" style={{ display: 'inline-block', background: '#E11D48', color: 'white', padding: '14px 32px', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '15px', boxShadow: '0 4px 20px rgba(225,29,72,0.3)' }}>
            Back to home
          </a>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0d0d0f', position: 'relative', overflow: 'hidden' }}>
      <SmokeyBackground />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,12,0.75)', zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 2, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>

        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '48px' }}>
          <div style={{ width: '10px', height: '24px', background: '#E11D48', borderRadius: '2px' }} />
          <span style={{ fontWeight: 800, fontSize: '18px', color: '#f1f5f9', letterSpacing: '-0.5px' }}>My Medicine Route</span>
        </a>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(225,29,72,0.12)', color: '#E11D48', fontSize: '12px', fontWeight: 700, padding: '6px 16px', borderRadius: '999px', border: '1px solid rgba(225,29,72,0.2)', marginBottom: '20px' }}>
            <span style={{ width: '6px', height: '6px', background: '#E11D48', borderRadius: '50%', animation: 'pulse-red 2s infinite' }} />
            Enrollment is open
          </div>
          <h1 style={{ fontSize: '52px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-2.5px', lineHeight: 1, marginBottom: '16px' }}>
            Join the network
          </h1>
          <p style={{ fontSize: '17px', color: '#94a3b8', maxWidth: '440px' }}>
            Student ready to research, or a mentor ready to guide — there's a place for you.
          </p>
        </div>

        <div style={{ width: '100%', maxWidth: '560px', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)', borderRadius: '28px', padding: '48px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 32px 64px rgba(0,0,0,0.4)' }}>

          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '4px', marginBottom: '40px', border: '1px solid rgba(255,255,255,0.08)' }}>
            {(['student', 'mentor'] as const).map(r => (
              <button key={r} onClick={() => setRole(r)} style={{
                flex: 1, padding: '12px', border: 'none', cursor: 'pointer', borderRadius: '11px',
                fontWeight: 700, fontSize: '14px', transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                background: role === r ? '#E11D48' : 'transparent',
                color: role === r ? '#fff' : '#64748b',
                boxShadow: role === r ? '0 4px 15px rgba(225,29,72,0.3)' : 'none',
                fontFamily: 'inherit',
              }}>
                {r === 'student' ? 'I am a Student' : 'I am a Mentor'}
              </button>
            ))}
          </div>

          <form onSubmit={submit}>
            <div style={{ display: 'grid', gap: '24px' }}>
              <FloatingInput label="Full name"     name="fullName" onChange={handle} />
              <FloatingInput label="Email address" name="email"    type="email" onChange={handle} />

              {role === 'student' && (<>
                <FloatingInput label="School" name="school" onChange={handle} />
                <FloatingSelect label="Grade" name="grade" onChange={handle}
                  options={['Grade 10', 'Grade 11', 'Grade 12']} />
                <FloatingSelect label="Area of interest" name="interest" onChange={handle}
                  options={['General medicine', 'Surgery', 'Neurology', 'Cardiology', 'Oncology', 'Pediatrics', 'Public health', 'Research & data', 'Other']} />
                <FloatingTextarea label="Why do you want to join?" name="why" onChange={handle}
                  placeholder="What drives your interest in medical research..." />
              </>)}

              {role === 'mentor' && (<>
                <FloatingInput label="Current role" name="roleTitle" onChange={handle} placeholder="e.g. Medical student, Doctor, Researcher" />
                <FloatingInput label="Institution"  name="institution" onChange={handle} />
                <FloatingSelect label="Hours available per week" name="hours" onChange={handle}
                  options={['Less than 1 hour', '1–2 hours', '2–4 hours', '4+ hours']} />
              </>)}

              <button
                type="submit" disabled={loading}
                onMouseEnter={btnHover} onMouseLeave={btnUnhover}
                style={{
                  background: loading ? 'rgba(255,255,255,0.06)' : '#E11D48',
                  color: loading ? '#64748b' : '#fff', border: 'none', borderRadius: '999px',
                  padding: '18px', fontSize: '16px', fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', marginTop: '8px',
                  boxShadow: loading ? 'none' : '0 4px 20px rgba(225,29,72,0.3)',
                  fontFamily: 'inherit',
                }}
              >
                {loading ? 'Submitting...' : role === 'student' ? 'Apply as Student →' : 'Apply as Mentor →'}
              </button>
            </div>
          </form>
        </div>

        <p style={{ marginTop: '32px', fontSize: '13px', color: '#475569', textAlign: 'center' }}>
          Questions? <a href="mailto:mymedicineroute@gmail.com" style={{ color: '#94a3b8', textDecoration: 'none' }}>mymedicineroute@gmail.com</a>
        </p>
      </div>
    </main>
  );
}
