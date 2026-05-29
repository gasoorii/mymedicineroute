'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

type MentorProfile = {
  id: string;
  bio: string;
  expertise_tags: string[];
  institution: string;
  role_title: string;
  available: boolean;
  profiles: { full_name: string };
};

// ── ContainerScroll ────────────────────────────────────────────────────────
function ContainerScroll({
  titleComponent,
  children,
}: {
  titleComponent: React.ReactNode;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const rotate = useTransform(scrollYProgress, [0, 1], [18, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [0.75, 0.95] : [1.04, 1]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <div
      ref={containerRef}
      style={{
        height: isMobile ? '56rem' : '72rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', padding: isMobile ? '8px' : '80px',
      }}
    >
      <div style={{ width: '100%', position: 'relative', perspective: '1000px', paddingTop: isMobile ? '40px' : '160px' }}>
        {/* Title */}
        <motion.div className="div" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', translateY: translate }}>
          {titleComponent}
        </motion.div>

        {/* Card */}
        <motion.div
          style={{
            rotateX: rotate,
            scale,
            boxShadow: '0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a',
            maxWidth: '1000px',
            margin: '-48px auto 0',
            width: '100%',
            height: isMobile ? '28rem' : '38rem',
            border: '3px solid #2a2a2e',
            padding: isMobile ? '8px' : '20px',
            background: '#1a1a1e',
            borderRadius: '28px',
          }}
        >
          <div style={{
            height: '100%', width: '100%', overflow: 'auto',
            borderRadius: '16px', background: '#111213',
            padding: '24px',
          }}>
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ── Mentor card ────────────────────────────────────────────────────────────
function MentorCard({ mentor }: { mentor: MentorProfile }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #E11D48, #9f1239)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: '18px', color: '#fff',
        }}>
          {mentor.profiles?.full_name?.[0] || 'M'}
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9' }}>
            {mentor.profiles?.full_name || 'Mentor'}
          </div>
          <div style={{ fontSize: '13px', color: '#64748b' }}>
            {mentor.role_title}{mentor.institution ? ` · ${mentor.institution}` : ''}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Available</span>
        </div>
      </div>

      {mentor.bio && (
        <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
          {mentor.bio.slice(0, 110)}{mentor.bio.length > 110 ? '...' : ''}
        </p>
      )}

      {mentor.expertise_tags?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {mentor.expertise_tags.slice(0, 3).map(tag => (
            <span key={tag} style={{
              padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
              background: 'rgba(225,29,72,0.08)', color: '#E11D48',
              border: '1px solid rgba(225,29,72,0.2)',
            }}>{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Coming soon placeholder ────────────────────────────────────────────────
function ComingSoonGrid() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
      {/* Placeholder cards */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        {[0.4, 0.8, 0.4].map((opacity, i) => (
          <div key={i} style={{
            width: '120px', padding: '20px 14px',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
            opacity,
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'rgba(225,29,72,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 800, color: '#E11D48',
            }}>
              {['Dr', 'MD', 'MS'][i]}
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.07)', borderRadius: '999px' }} />
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '999px', width: '65%' }} />
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ height: '16px', width: '48px', background: 'rgba(225,29,72,0.08)', borderRadius: '999px' }} />
              <div style={{ height: '16px', width: '36px', background: 'rgba(225,29,72,0.05)', borderRadius: '999px' }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '7px',
          background: 'rgba(225,29,72,0.1)', border: '1px solid rgba(225,29,72,0.2)',
          color: '#E11D48', fontSize: '11px', fontWeight: 700,
          padding: '5px 14px', borderRadius: '999px', marginBottom: '16px',
          letterSpacing: '2px', textTransform: 'uppercase' as const,
        }}>
          <span style={{ width: '6px', height: '6px', background: '#E11D48', borderRadius: '50%', display: 'inline-block', animation: 'pulse-red 2s infinite' }} />
          Confirming mentors
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#f1f5f9', marginBottom: '8px', letterSpacing: '-0.5px' }}>
          First cohort being onboarded
        </h3>
        <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '340px', margin: '0 auto', lineHeight: 1.7 }}>
          Medical students and doctors are being confirmed. Sign up now and get matched the moment they're ready.
        </p>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function MentorsPage() {
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('mentor_profiles')
        .select('id, bio, expertise_tags, institution, role_title, available, profiles(full_name)')
        .eq('available', true);

      // Supabase returns related rows (profiles) as an array. Convert to the
      // MentorProfile type which expects a single profiles object with full_name.
      const normalized: MentorProfile[] = (data || []).map((d: any) => ({
        id: d.id,
        bio: d.bio,
        expertise_tags: d.expertise_tags || [],
        institution: d.institution || '',
        role_title: d.role_title || '',
        available: !!d.available,
        profiles: Array.isArray(d.profiles) ? (d.profiles[0] || { full_name: '' }) : (d.profiles || { full_name: '' }),
      }));

      setMentors(normalized);
      setCount(normalized.length);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <main style={{ minHeight: '100vh', background: '#18191b', overflowX: 'hidden' }}>
      <Navbar />

      <ContainerScroll
        titleComponent={
          <div style={{ padding: '0 24px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#E11D48', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px' }}>
              The Network
            </p>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-2px', marginBottom: '20px', lineHeight: 1.05 }}>
              {count > 0
                ? `${count} mentor${count > 1 ? 's' : ''} ready to guide your research`
                : 'Meet the mentors behind the research'}
            </h1>
            <p style={{ fontSize: '17px', color: '#94a3b8', maxWidth: '520px', margin: '0 auto 32px', lineHeight: 1.7 }}>
              Medical students and doctors who volunteer their time to guide Bahraini high school researchers — for free.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/join" className="btn-red" style={{ padding: '14px 32px', fontSize: '15px' }}>Join as Student</a>
              <a href="/join" className="btn-ghost" style={{ padding: '14px 32px', fontSize: '15px' }}>Become a Mentor</a>
            </div>
          </div>
        }
      >
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ color: '#E11D48', fontSize: '24px' }}>◈</div>
          </div>
        ) : mentors.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '16px',
          }}>
            {mentors.map(mentor => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        ) : (
          <ComingSoonGrid />
        )}
      </ContainerScroll>

      {/* Stats strip */}
      <section style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '48px 64px', background: 'rgba(255,255,255,0.01)',
      }}>
        <div className="mobile-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          {[
            { value: '100%', label: 'Volunteer mentors', sub: 'No fees, ever' },
            { value: 'Safe', label: 'Supervised research', sub: 'Ethically reviewed' },
            { value: 'Bahrain', label: 'Based locally', sub: 'Est. 2025' },
          ].map(stat => (
            <div key={stat.label}>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-1px', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8', marginBottom: '2px' }}>{stat.label}</div>
              <div style={{ fontSize: '12px', color: '#475569' }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 64px', textAlign: 'center' }}>
        <div style={{ maxWidth: '580px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#E11D48', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px' }}>
            Are you a medical professional?
          </p>
          <h2 style={{ fontSize: '40px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-1.5px', marginBottom: '20px' }}>
            Guide the next generation of researchers
          </h2>
          <p style={{ fontSize: '17px', color: '#64748b', lineHeight: 1.7, marginBottom: '40px' }}>
            As little as 1 hour a week. Review student proposals, guide their methodology, and help them publish real work.
          </p>
          <a href="/join" className="btn-red" style={{ padding: '18px 40px', fontSize: '16px' }}>
            Apply as Mentor →
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
