'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

type Profile = {
  full_name: string;
  email: string;
};

type StudentProfile = {
  school: string;
  grade: string;
  interest: string;
};

type Conversation = {
  id: string;
  ai_summary: string;
  status: string;
  created_at: string;
  mentor_id: string;
};

type MatchRequest = {
  id: string;
  student_query: string;
  ai_summary: string;
  status: string;
  created_at: string;
};

export default function StudentDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [matchRequests, setMatchRequests] = useState<MatchRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'home' | 'match' | 'messages'>('home');

  // Match form state
  const [query, setQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [matchError, setMatchError] = useState('');
  const [matchSuccess, setMatchSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    const [{ data: prof }, { data: stuProf }, { data: convs }, { data: reqs }] = await Promise.all([
      supabase.from('profiles').select('full_name, email').eq('id', user.id).single(),
      supabase.from('student_profiles').select('school, grade, interest').eq('id', user.id).single(),
      supabase.from('conversations').select('*').eq('student_id', user.id).order('created_at', { ascending: false }),
      supabase.from('match_requests').select('*').eq('student_id', user.id).order('created_at', { ascending: false }),
    ]);

    setProfile(prof);
    setStudentProfile(stuProf);
    setConversations(convs || []);
    setMatchRequests(reqs || []);
    setLoading(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Replace the submitMatchRequest function in app/dashboard/student/page.tsx

const submitMatchRequest = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!query.trim()) return;
  setSubmitting(true);
  setMatchError('');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // 1. Insert the match request
  const { data: matchReq, error: insertError } = await supabase
    .from('match_requests')
    .insert({ student_id: user.id, student_query: query, status: 'pending' })
    .select()
    .single();

  if (insertError || !matchReq) {
    setMatchError('Failed to submit. Please try again.');
    setSubmitting(false);
    return;
  }

  // 2. Call the AI matching edge function
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/match-student`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ match_request_id: matchReq.id }),
    }
  );

  const result = await res.json();

  if (result.status === 'no_mentors_available') {
    // No mentors yet — request is saved, will be matched later
    setMatchSuccess(true);
  } else if (result.error) {
    setMatchError('Matching failed. Your request is saved and will be reviewed manually.');
    setMatchSuccess(true); // Still show success — request is saved
  } else {
    // Successfully matched
    setMatchSuccess(true);
  }

  setQuery('');
  loadData();
  setSubmitting(false);
};

  if (loading) return <LoadingScreen />;

  const firstName = profile?.full_name?.split(' ')[0] || 'Student';
  const pendingRequests = matchRequests.filter(r => r.status === 'pending');
  const activeConversations = conversations.filter(c => c.status === 'active');

  return (
    <div style={s.root}>
      {/* SIDEBAR */}
      <aside style={s.sidebar}>
        <div style={s.sidebarTop}>
          <a href="/" style={s.logoLink}>
            <div style={s.logoBar} />
            <span style={s.logoText}>MMR</span>
          </a>
          <nav style={s.nav}>
            {([
              { key: 'home', label: 'Overview', icon: '◈' },
              { key: 'match', label: 'Find a Mentor', icon: '⟡' },
              { key: 'messages', label: 'Messages', icon: '◻' },
            ] as const).map(item => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                style={{ ...s.navItem, ...(tab === item.key ? s.navItemActive : {}) }}
              >
                <span style={s.navIcon}>{item.icon}</span>
                {item.label}
                {item.key === 'messages' && activeConversations.length > 0 && (
                  <span style={s.badge}>{activeConversations.length}</span>
                )}
              </button>
            ))}
          </nav>
        </div>
        <div style={s.sidebarBottom}>
          <div style={s.profileChip}>
            <div style={s.avatar}>{firstName[0]}</div>
            <div>
              <div style={s.chipName}>{profile?.full_name}</div>
              <div style={s.chipRole}>Student · Grade {studentProfile?.grade}</div>
            </div>
          </div>
          <button onClick={signOut} style={s.signOutBtn}>Sign out</button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={s.main}>

        {/* ── HOME TAB ── */}
        {tab === 'home' && (
          <div style={s.content}>
            <div style={s.pageHeader}>
              <h1 style={s.greeting}>Good to see you, {firstName}</h1>
              <p style={s.greetingSub}>Here's where you stand with your research journey.</p>
            </div>

            <div style={s.statRow}>
              {[
                { label: 'Match Requests', value: matchRequests.length, sub: `${pendingRequests.length} pending` },
                { label: 'Active Chats', value: activeConversations.length, sub: 'with mentors' },
                { label: 'Interest Area', value: studentProfile?.interest || '—', sub: 'your focus', small: true },
              ].map(stat => (
                <div key={stat.label} style={s.statCard}>
                  <div style={{ ...s.statValue, ...(stat.small ? s.statValueSmall : {}) }}>
                    {stat.value}
                  </div>
                  <div style={s.statLabel}>{stat.label}</div>
                  <div style={s.statSub}>{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Recent match requests */}
            <div style={s.section}>
              <div style={s.sectionHeader}>
                <h2 style={s.sectionTitle}>Recent Match Requests</h2>
                <button onClick={() => setTab('match')} style={s.sectionAction}>
                  + New request
                </button>
              </div>
              {matchRequests.length === 0 ? (
                <EmptyState
                  icon="⟡"
                  title="No requests yet"
                  desc="Submit a question or research challenge to get matched with a mentor."
                  action="Find a Mentor"
                  onAction={() => setTab('match')}
                />
              ) : (
                <div style={s.list}>
                  {matchRequests.slice(0, 3).map(req => (
                    <div key={req.id} style={s.listItem}>
                      <div style={s.listItemLeft}>
                        <span style={{
                          ...s.statusDot,
                          background: req.status === 'matched' ? '#22c55e'
                            : req.status === 'pending' ? '#f59e0b' : '#94a3b8',
                        }} />
                        <div>
                          <div style={s.listItemTitle}>
                            {req.student_query.slice(0, 80)}{req.student_query.length > 80 ? '...' : ''}
                          </div>
                          <div style={s.listItemMeta}>
                            {req.status.charAt(0).toUpperCase() + req.status.slice(1)} ·{' '}
                            {new Date(req.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── MATCH TAB ── */}
        {tab === 'match' && (
          <div style={s.content}>
            <div style={s.pageHeader}>
              <h1 style={s.pageTitle}>Find a Mentor</h1>
              <p style={s.pageSub}>
                Describe your research question or what you're struggling with.
                Our AI will summarize your needs and match you with the right mentor.
              </p>
            </div>

            {matchSuccess ? (
              <div style={s.successCard}>
                <div style={s.successIcon}>✓</div>
                <h3 style={s.successTitle}>Request submitted</h3>
                <p style={s.successText}>
                  Our AI is reviewing your question and finding the best mentor match.
                  You'll be notified when a mentor is connected.
                </p>
                <button onClick={() => setMatchSuccess(false)} style={s.btnRed}>
                  Submit another request
                </button>
              </div>
            ) : (
              <div style={s.matchCard}>
                <div style={s.matchCardHeader}>
                  <span style={s.aiTag}>AI-Powered Matching</span>
                  <h2 style={s.matchCardTitle}>What do you need help with?</h2>
                  <p style={s.matchCardSub}>
                    Be specific. The more detail you give, the better the match.
                    You can describe a research topic, a methodology question, or a challenge you're facing.
                  </p>
                </div>

                <form onSubmit={submitMatchRequest}>
                  <textarea
                    value={query}
                    onChange={e => { setQuery(e.target.value); setMatchError(''); }}
                    rows={6}
                    style={s.textarea}
                    placeholder="e.g. I want to study the correlation between social media use and sleep quality in Bahraini high school students. I don't know how to design a survey that avoids bias, and I'm not sure how to analyse the results statistically..."
                  />
                  <div style={s.charCount}>{query.length} / 1000 characters</div>

                  {matchError && <p style={s.errorText}>{matchError}</p>}

                  <button
                    type="submit"
                    disabled={submitting || query.trim().length < 20}
                    style={{
                      ...s.btnRed,
                      width: '100%',
                      opacity: submitting || query.trim().length < 20 ? 0.5 : 1,
                      cursor: submitting || query.trim().length < 20 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {submitting ? 'Submitting...' : 'Submit for Matching →'}
                  </button>
                </form>

                <div style={s.howItWorks}>
                  <p style={s.howTitle}>How it works</p>
                  <div style={s.howSteps}>
                    {[
                      { n: '1', text: 'You describe your question or challenge' },
                      { n: '2', text: 'AI summarizes your needs and finds the best mentor match' },
                      { n: '3', text: 'An anonymous chat opens between you and your mentor' },
                    ].map(step => (
                      <div key={step.n} style={s.howStep}>
                        <div style={s.howNum}>{step.n}</div>
                        <div style={s.howText}>{step.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Past requests */}
            {matchRequests.length > 0 && (
              <div style={s.section}>
                <h2 style={s.sectionTitle}>Your Past Requests</h2>
                <div style={s.list}>
                  {matchRequests.map(req => (
                    <div key={req.id} style={s.listItem}>
                      <div style={s.listItemLeft}>
                        <span style={{
                          ...s.statusDot,
                          background: req.status === 'matched' ? '#22c55e'
                            : req.status === 'pending' ? '#f59e0b' : '#94a3b8',
                        }} />
                        <div>
                          <div style={s.listItemTitle}>
                            {req.student_query.slice(0, 100)}{req.student_query.length > 100 ? '...' : ''}
                          </div>
                          {req.ai_summary && (
                            <div style={s.aiSummaryChip}>AI summary: {req.ai_summary}</div>
                          )}
                          <div style={s.listItemMeta}>
                            {req.status.charAt(0).toUpperCase() + req.status.slice(1)} ·{' '}
                            {new Date(req.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── MESSAGES TAB ── */}
        {tab === 'messages' && (
          <div style={s.content}>
            <div style={s.pageHeader}>
              <h1 style={s.pageTitle}>Messages</h1>
              <p style={s.pageSub}>Your anonymous chats with mentors.</p>
            </div>

            {conversations.length === 0 ? (
              <EmptyState
                icon="◻"
                title="No conversations yet"
                desc="Once a mentor accepts your match request, an anonymous chat will open here."
                action="Find a Mentor"
                onAction={() => setTab('match')}
              />
            ) : (
              <div style={s.list}>
                {conversations.map(conv => (
                  <div key={conv.id} style={{ ...s.listItem, cursor: 'pointer' }}>
                    <div style={s.listItemLeft}>
                      <div style={s.convAvatar}>M</div>
                      <div>
                        <div style={s.listItemTitle}>Mentor Chat</div>
                        {conv.ai_summary && (
                          <div style={s.listItemMeta}>Topic: {conv.ai_summary}</div>
                        )}
                        <div style={s.listItemMeta}>
                          {conv.status === 'active' ? '🟢 Active' : '⚫ Closed'} ·{' '}
                          {new Date(conv.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div style={s.chevron}>›</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyState({ icon, title, desc, action, onAction }: {
  icon: string; title: string; desc: string; action: string; onAction: () => void;
}) {
  return (
    <div style={s.emptyState}>
      <div style={s.emptyIcon}>{icon}</div>
      <h3 style={s.emptyTitle}>{title}</h3>
      <p style={s.emptyDesc}>{desc}</p>
      <button onClick={onAction} style={s.btnRed}>{action}</button>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0d0d' }}>
      <div style={{ color: '#E11D48', fontSize: '24px' }}>◈</div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: { display: 'flex', minHeight: '100vh', background: '#0d0d0d', fontFamily: "'Inter', sans-serif" },

  // Sidebar
  sidebar: {
    width: '240px', flexShrink: 0,
    background: '#111213', borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    padding: '28px 16px', position: 'sticky', top: 0, height: '100vh',
  },
  sidebarTop: { display: 'flex', flexDirection: 'column', gap: '32px' },
  logoLink: { display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', padding: '0 8px' },
  logoBar: { width: '6px', height: '18px', background: '#E11D48', borderRadius: '2px' },
  logoText: { fontWeight: 800, fontSize: '15px', color: '#f1f5f9' },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px' },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 12px', borderRadius: '10px', border: 'none',
    background: 'transparent', color: '#64748b', fontSize: '14px', fontWeight: 600,
    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
  },
  navItemActive: { background: 'rgba(225,29,72,0.1)', color: '#f1f5f9' },
  navIcon: { fontSize: '16px', width: '20px', textAlign: 'center' },
  badge: {
    marginLeft: 'auto', background: '#E11D48', color: '#fff',
    fontSize: '11px', fontWeight: 700, padding: '2px 7px', borderRadius: '999px',
  },
  sidebarBottom: { display: 'flex', flexDirection: 'column', gap: '12px' },
  profileChip: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  avatar: {
    width: '32px', height: '32px', borderRadius: '50%',
    background: '#E11D48', color: '#fff', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px',
    flexShrink: 0,
  },
  chipName: { fontSize: '13px', fontWeight: 700, color: '#f1f5f9' },
  chipRole: { fontSize: '11px', color: '#64748b' },
  signOutBtn: {
    background: 'none', border: 'none', color: '#64748b',
    fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: '8px 12px',
    textAlign: 'left', borderRadius: '8px', transition: 'color 0.15s',
  },

  // Main
  main: { flex: 1, overflowY: 'auto' },
  content: { maxWidth: '800px', margin: '0 auto', padding: '48px 40px' },
  pageHeader: { marginBottom: '40px' },
  greeting: { fontSize: '32px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-1px', marginBottom: '8px' },
  greetingSub: { fontSize: '15px', color: '#64748b' },
  pageTitle: { fontSize: '28px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px', marginBottom: '8px' },
  pageSub: { fontSize: '15px', color: '#64748b', lineHeight: 1.6, maxWidth: '540px' },

  // Stats
  statRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' },
  statCard: {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px', padding: '24px',
  },
  statValue: { fontSize: '36px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-1px', marginBottom: '4px' },
  statValueSmall: { fontSize: '18px', letterSpacing: '-0.5px', marginTop: '6px' },
  statLabel: { fontSize: '13px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' },
  statSub: { fontSize: '12px', color: '#475569' },

  // Sections
  section: { marginTop: '40px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  sectionTitle: { fontSize: '16px', fontWeight: 700, color: '#f1f5f9' },
  sectionAction: {
    background: 'none', border: '1px solid rgba(225,29,72,0.3)', color: '#E11D48',
    fontSize: '13px', fontWeight: 600, padding: '6px 14px', borderRadius: '999px', cursor: 'pointer',
  },

  // List
  list: { display: 'flex', flexDirection: 'column', gap: '8px' },
  listItem: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 20px', borderRadius: '12px',
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
  },
  listItemLeft: { display: 'flex', alignItems: 'flex-start', gap: '12px' },
  listItemTitle: { fontSize: '14px', fontWeight: 600, color: '#e2e8f0', marginBottom: '4px' },
  listItemMeta: { fontSize: '12px', color: '#475569' },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, marginTop: '5px' },
  aiSummaryChip: {
    fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', marginBottom: '4px',
    padding: '3px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px',
    display: 'inline-block', marginTop: '2px',
  },
  convAvatar: {
    width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
    color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: '14px', flexShrink: 0,
  },
  chevron: { color: '#475569', fontSize: '20px' },

  // Match form
  matchCard: {
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px', padding: '32px', marginBottom: '32px',
  },
  matchCardHeader: { marginBottom: '24px' },
  aiTag: {
    display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '2px',
    textTransform: 'uppercase', color: '#E11D48', background: 'rgba(225,29,72,0.1)',
    border: '1px solid rgba(225,29,72,0.2)', padding: '4px 10px', borderRadius: '999px',
    marginBottom: '16px',
  },
  matchCardTitle: { fontSize: '20px', fontWeight: 800, color: '#f1f5f9', marginBottom: '8px', letterSpacing: '-0.5px' },
  matchCardSub: { fontSize: '14px', color: '#64748b', lineHeight: 1.6 },
  textarea: {
    width: '100%', padding: '16px', border: '1.5px solid rgba(255,255,255,0.1)',
    borderRadius: '14px', fontSize: '15px', color: '#e2e8f0',
    background: 'rgba(255,255,255,0.04)', outline: 'none', resize: 'vertical',
    fontFamily: "'Inter', sans-serif", lineHeight: 1.6, boxSizing: 'border-box',
  },
  charCount: { fontSize: '12px', color: '#475569', textAlign: 'right', marginTop: '6px', marginBottom: '16px' },
  errorText: { color: '#E11D48', fontSize: '13px', fontWeight: 600, marginBottom: '12px' },
  howItWorks: {
    marginTop: '28px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  howTitle: { fontSize: '12px', fontWeight: 700, color: '#475569', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' },
  howSteps: { display: 'flex', flexDirection: 'column', gap: '12px' },
  howStep: { display: 'flex', alignItems: 'flex-start', gap: '12px' },
  howNum: {
    width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(225,29,72,0.15)',
    color: '#E11D48', fontSize: '11px', fontWeight: 800,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  howText: { fontSize: '13px', color: '#64748b', lineHeight: 1.5, paddingTop: '3px' },

  // Success
  successCard: {
    background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)',
    borderRadius: '20px', padding: '48px 32px', textAlign: 'center', marginBottom: '32px',
  },
  successIcon: {
    width: '48px', height: '48px', borderRadius: '50%',
    background: 'rgba(34,197,94,0.15)', color: '#22c55e',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '20px', fontWeight: 800, margin: '0 auto 20px',
  },
  successTitle: { fontSize: '20px', fontWeight: 800, color: '#f1f5f9', marginBottom: '8px' },
  successText: { fontSize: '14px', color: '#64748b', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto 24px' },

  // Empty state
  emptyState: {
    textAlign: 'center', padding: '64px 32px',
    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '20px',
  },
  emptyIcon: { fontSize: '32px', marginBottom: '16px', color: '#334155' },
  emptyTitle: { fontSize: '18px', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' },
  emptyDesc: { fontSize: '14px', color: '#475569', maxWidth: '320px', margin: '0 auto 24px', lineHeight: 1.6 },

  // Shared
  btnRed: {
    background: '#E11D48', color: '#fff', border: 'none',
    borderRadius: '999px', padding: '14px 28px', fontSize: '15px', fontWeight: 700,
    cursor: 'pointer', boxShadow: '0 4px 15px rgba(225,29,72,0.25)', display: 'inline-block',
  },
};
