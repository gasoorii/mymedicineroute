'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

type Profile = { full_name: string; email: string };
type MentorProfile = { bio: string; expertise_tags: string[]; institution: string; role_title: string; hours_per_week: string; available: boolean };
type MatchRequest = { id: string; student_query: string; ai_summary: string; status: string; created_at: string; student_id: string };
type Conversation = { id: string; ai_summary: string; status: string; created_at: string };

export default function MentorDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(null);
  const [matchRequests, setMatchRequests] = useState<MatchRequest[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'home' | 'requests' | 'messages' | 'profile'>('home');
  const [userId, setUserId] = useState<string>('');
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ bio: '', hours_per_week: '', available: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let matchSub: any;
    let convSub: any;

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUserId(user.id);
      await loadData(user.id);

      matchSub = supabase
        .channel('mentor-match-requests')
        .on('postgres_changes', {
          event: '*', schema: 'public', table: 'match_requests',
          filter: `matched_mentor_id=eq.${user.id}`,
        }, () => loadData(user.id))
        .subscribe();

      convSub = supabase
        .channel('mentor-conversations')
        .on('postgres_changes', {
          event: '*', schema: 'public', table: 'conversations',
          filter: `mentor_id=eq.${user.id}`,
        }, () => loadData(user.id))
        .subscribe();
    };

    init();
    return () => {
      if (matchSub) supabase.removeChannel(matchSub);
      if (convSub) supabase.removeChannel(convSub);
    };
  }, []);

  const loadData = async (uid: string) => {
    const [{ data: prof }, { data: mentProf }, { data: reqs }, { data: convs }] = await Promise.all([
      supabase.from('profiles').select('full_name, email').eq('id', uid).single(),
      supabase.from('mentor_profiles').select('*').eq('id', uid).single(),
      supabase.from('match_requests').select('*').eq('matched_mentor_id', uid).order('created_at', { ascending: false }),
      supabase.from('conversations').select('*').eq('mentor_id', uid).order('created_at', { ascending: false }),
    ]);
    setProfile(prof);
    setMentorProfile(mentProf);
    setMatchRequests(reqs || []);
    setConversations(convs || []);
    setEditForm({ bio: mentProf?.bio || '', hours_per_week: mentProf?.hours_per_week || '', available: mentProf?.available ?? true });
    setLoading(false);
  };

  const acceptMatch = async (requestId: string, studentId: string) => {
    const { data: conv, error } = await supabase.from('conversations').insert({
      student_id: studentId, mentor_id: userId, status: 'active',
    }).select().single();
    if (error || !conv) return;
    await supabase.from('match_requests').update({ status: 'matched' }).eq('id', requestId);
    loadData(userId);
    setTab('messages');
  };

  const declineMatch = async (requestId: string) => {
    await supabase.from('match_requests').update({ status: 'rejected' }).eq('id', requestId);
    loadData(userId);
  };

  const saveProfile = async () => {
    setSaving(true);
    await supabase.from('mentor_profiles').update({
      bio: editForm.bio, hours_per_week: editForm.hours_per_week,
      available: editForm.available, updated_at: new Date().toISOString(),
    }).eq('id', userId);
    await loadData(userId);
    setEditMode(false);
    setSaving(false);
  };

  const signOut = async () => { await supabase.auth.signOut(); router.push('/'); };

  if (loading) return <LoadingScreen />;

  const firstName = profile?.full_name?.split(' ')[0] || 'Mentor';
  const pendingRequests = matchRequests.filter(r => r.status === 'pending');
  const activeConversations = conversations.filter(c => c.status === 'active');

  const expertiseOptions = [
    'General medicine', 'Surgery', 'Neurology', 'Cardiology',
    'Oncology', 'Pediatrics', 'Public health', 'Research & data', 'Psychiatry',
  ];

  return (
    <div style={s.root}>
      <aside style={s.sidebar}>
        <div style={s.sidebarTop}>
          <a href="/" style={s.logoLink}>
            <div style={s.logoBar} />
            <span style={s.logoText}>MMR</span>
          </a>
          <nav style={s.nav}>
            {([
              { key: 'home', label: 'Overview', icon: '◈' },
              { key: 'requests', label: 'Match Requests', icon: '⟡', count: pendingRequests.length },
              { key: 'messages', label: 'Messages', icon: '◻', count: activeConversations.length },
              { key: 'profile', label: 'My Profile', icon: '○' },
            ] as const).map(item => (
              <button key={item.key} onClick={() => setTab(item.key)}
                style={{ ...s.navItem, ...(tab === item.key ? s.navItemActive : {}) }}>
                <span style={s.navIcon}>{item.icon}</span>
                {item.label}
                {'count' in item && item.count > 0 && <span style={s.badge}>{item.count}</span>}
              </button>
            ))}
          </nav>
        </div>
        <div style={s.sidebarBottom}>
          <div style={s.profileChip}>
            <div style={s.avatar}>{firstName[0]}</div>
            <div>
              <div style={s.chipName}>{profile?.full_name}</div>
              <div style={s.chipRole}>{mentorProfile?.available ? '🟢 Available' : '⚫ Unavailable'}</div>
            </div>
          </div>
          <button onClick={signOut} style={s.signOutBtn}>Sign out</button>
        </div>
      </aside>

      <main style={s.main}>

        {/* HOME */}
        {tab === 'home' && (
          <div style={s.content}>
            <div style={s.pageHeader}>
              <h1 style={s.greeting}>Welcome, {firstName}</h1>
              <p style={s.greetingSub}>Here's a summary of your mentoring activity.</p>
            </div>
            <div style={s.statRow}>
              {[
                { label: 'Pending Requests', value: pendingRequests.length, sub: 'awaiting your response' },
                { label: 'Active Chats', value: activeConversations.length, sub: 'ongoing sessions' },
                { label: 'Total Mentored', value: matchRequests.filter(r => r.status === 'matched').length, sub: 'students matched' },
              ].map(stat => (
                <div key={stat.label} style={s.statCard}>
                  <div style={s.statValue}>{stat.value}</div>
                  <div style={s.statLabel}>{stat.label}</div>
                  <div style={s.statSub}>{stat.sub}</div>
                </div>
              ))}
            </div>

            {mentorProfile?.expertise_tags?.length > 0 && (
              <div style={s.section}>
                <h2 style={s.sectionTitle}>Your Expertise</h2>
                <div style={s.tagRow}>
                  {mentorProfile.expertise_tags.map(tag => <span key={tag} style={s.tagChip}>{tag}</span>)}
                </div>
              </div>
            )}

            {pendingRequests.length > 0 ? (
              <div style={s.section}>
                <div style={s.sectionHeader}>
                  <h2 style={s.sectionTitle}>Pending Requests</h2>
                  <button onClick={() => setTab('requests')} style={s.sectionAction}>View all</button>
                </div>
                <div style={s.list}>
                  {pendingRequests.slice(0, 2).map(req => (
                    <RequestCard key={req.id} req={req} onAccept={acceptMatch} onDecline={declineMatch} />
                  ))}
                </div>
              </div>
            ) : (
              <div style={s.section}>
                <div style={s.emptyState}>
                  <div style={s.emptyIcon}>⟡</div>
                  <h3 style={s.emptyTitle}>No pending requests</h3>
                  <p style={s.emptyDesc}>When a student's needs match your expertise, a request will appear here. Make sure your profile is complete and you're set to available.</p>
                  <button onClick={() => setTab('profile')} style={s.btnRed}>Update Profile</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* REQUESTS */}
        {tab === 'requests' && (
          <div style={s.content}>
            <div style={s.pageHeader}>
              <h1 style={s.pageTitle}>Match Requests</h1>
              <p style={s.pageSub}>Students whose needs match your expertise. Review and accept or decline.</p>
            </div>
            {matchRequests.length === 0 ? (
              <div style={s.emptyState}>
                <div style={s.emptyIcon}>⟡</div>
                <h3 style={s.emptyTitle}>No requests yet</h3>
                <p style={s.emptyDesc}>Requests will appear here when the AI matches a student to your expertise profile.</p>
              </div>
            ) : (
              <>
                {pendingRequests.length > 0 && (
                  <div style={s.section}>
                    <h2 style={{ ...s.sectionTitle, marginBottom: '16px' }}>Pending — {pendingRequests.length}</h2>
                    <div style={s.list}>
                      {pendingRequests.map(req => <RequestCard key={req.id} req={req} onAccept={acceptMatch} onDecline={declineMatch} />)}
                    </div>
                  </div>
                )}
                {matchRequests.filter(r => r.status !== 'pending').length > 0 && (
                  <div style={s.section}>
                    <h2 style={{ ...s.sectionTitle, marginBottom: '16px' }}>Past Requests</h2>
                    <div style={s.list}>
                      {matchRequests.filter(r => r.status !== 'pending').map(req => (
                        <div key={req.id} style={s.listItem}>
                          <div style={s.listItemLeft}>
                            <span style={{ ...s.statusDot, background: req.status === 'matched' ? '#22c55e' : '#475569' }} />
                            <div>
                              <div style={s.listItemTitle}>{req.student_query.slice(0, 100)}{req.student_query.length > 100 ? '...' : ''}</div>
                              <div style={s.listItemMeta}>{req.status.charAt(0).toUpperCase() + req.status.slice(1)} · {new Date(req.created_at).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* MESSAGES */}
        {tab === 'messages' && (
          <div style={s.content}>
            <div style={s.pageHeader}>
              <h1 style={s.pageTitle}>Messages</h1>
              <p style={s.pageSub}>Your anonymous student chats.</p>
            </div>
            {conversations.length === 0 ? (
              <div style={s.emptyState}>
                <div style={s.emptyIcon}>◻</div>
                <h3 style={s.emptyTitle}>No conversations yet</h3>
                <p style={s.emptyDesc}>Accept a match request to open an anonymous chat with a student.</p>
                <button onClick={() => setTab('requests')} style={s.btnRed}>View Requests</button>
              </div>
            ) : (
              <div style={s.list}>
                {conversations.map(conv => (
                  <div key={conv.id} style={{ ...s.listItem, cursor: 'pointer' }}
                    onClick={() => router.push(`/dashboard/mentor/chat/${conv.id}`)}>
                    <div style={s.listItemLeft}>
                      <div style={s.convAvatar}>S</div>
                      <div>
                        <div style={s.listItemTitle}>Student Chat</div>
                        {conv.ai_summary && <div style={s.aiSummaryChip}>Topic: {conv.ai_summary}</div>}
                        <div style={s.listItemMeta}>{conv.status === 'active' ? '🟢 Active' : '⚫ Closed'} · {new Date(conv.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div style={s.chevron}>›</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE */}
        {tab === 'profile' && (
          <div style={s.content}>
            <div style={s.pageHeader}>
              <h1 style={s.pageTitle}>My Profile</h1>
              <p style={s.pageSub}>This is what the AI uses to match you with students.</p>
            </div>
            <div style={s.profileCard}>
              <div style={s.profileCardHeader}>
                <div>
                  <div style={s.profileName}>{profile?.full_name}</div>
                  <div style={s.profileMeta}>{mentorProfile?.role_title} · {mentorProfile?.institution}</div>
                </div>
                <button onClick={() => setEditMode(!editMode)} style={s.editBtn}>{editMode ? 'Cancel' : 'Edit'}</button>
              </div>

              {editMode ? (
                <div style={{ display: 'grid', gap: '20px', marginTop: '24px' }}>
                  <div>
                    <label style={s.label}>Bio</label>
                    <textarea value={editForm.bio} onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={4} style={s.textarea} placeholder="Tell students about your background..." />
                  </div>
                  <div>
                    <label style={s.label}>Hours available per week</label>
                    <select value={editForm.hours_per_week} onChange={e => setEditForm({ ...editForm, hours_per_week: e.target.value })} style={s.input}>
                      {['Less than 1 hour', '1–2 hours', '2–4 hours', '4+ hours'].map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label style={s.label}>Available for new students</label>
                    <button onClick={() => setEditForm({ ...editForm, available: !editForm.available })}
                      style={{ ...s.toggleBtn, background: editForm.available ? '#22c55e' : '#334155' }}>
                      {editForm.available ? 'Yes' : 'No'}
                    </button>
                  </div>
                  <div>
                    <label style={s.label}>Expertise areas</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                      {expertiseOptions.map(tag => {
                        const active = mentorProfile?.expertise_tags?.includes(tag);
                        return (
                          <span key={tag} style={{
                            padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 600,
                            background: active ? 'rgba(225,29,72,0.08)' : 'rgba(255,255,255,0.04)',
                            color: active ? '#E11D48' : '#64748b',
                            border: active ? '1px solid rgba(225,29,72,0.2)' : '1px solid rgba(255,255,255,0.08)',
                          }}>{tag}</span>
                        );
                      })}
                    </div>
                    <p style={{ fontSize: '12px', color: '#475569', marginTop: '8px' }}>To update expertise tags, contact support.</p>
                  </div>
                  <button onClick={saveProfile} disabled={saving} style={s.btnRed}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              ) : (
                <div style={{ marginTop: '24px', display: 'grid', gap: '20px' }}>
                  <div>
                    <div style={s.fieldLabel}>Bio</div>
                    <div style={s.fieldValue}>{mentorProfile?.bio || 'No bio added yet.'}</div>
                  </div>
                  <div>
                    <div style={s.fieldLabel}>Availability</div>
                    <div style={s.fieldValue}>{mentorProfile?.hours_per_week || '—'} per week</div>
                  </div>
                  <div>
                    <div style={s.fieldLabel}>Status</div>
                    <div style={{ ...s.fieldValue, color: mentorProfile?.available ? '#22c55e' : '#94a3b8' }}>
                      {mentorProfile?.available ? 'Available for new students' : 'Not available'}
                    </div>
                  </div>
                  <div>
                    <div style={s.fieldLabel}>Expertise Areas</div>
                    <div style={s.tagRow}>
                      {mentorProfile?.expertise_tags?.length > 0
                        ? mentorProfile.expertise_tags.map(tag => <span key={tag} style={s.tagChip}>{tag}</span>)
                        : <span style={{ color: '#475569', fontSize: '14px' }}>None added yet.</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function RequestCard({ req, onAccept, onDecline }: { req: MatchRequest; onAccept: (id: string, studentId: string) => void; onDecline: (id: string) => void }) {
  return (
    <div style={s.requestCard}>
      <div style={s.requestHeader}>
        <span style={s.requestTag}>AI-Matched</span>
        <span style={s.requestDate}>{new Date(req.created_at).toLocaleDateString()}</span>
      </div>
      <div style={s.requestQuery}>{req.student_query}</div>
      {req.ai_summary && (
        <div style={s.requestSummary}>
          <span style={s.requestSummaryLabel}>AI Summary:</span> {req.ai_summary}
        </div>
      )}
      <div style={s.requestActions}>
        <button onClick={() => onAccept(req.id, req.student_id)} style={s.acceptBtn}>Accept & Connect</button>
        <button onClick={() => onDecline(req.id)} style={s.declineBtn}>Decline</button>
      </div>
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
  sidebar: { width: '240px', flexShrink: 0, background: '#111213', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '28px 16px', position: 'sticky', top: 0, height: '100vh' },
  sidebarTop: { display: 'flex', flexDirection: 'column', gap: '32px' },
  logoLink: { display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', padding: '0 8px' },
  logoBar: { width: '6px', height: '18px', background: '#E11D48', borderRadius: '2px' },
  logoText: { fontWeight: 800, fontSize: '15px', color: '#f1f5f9' },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', border: 'none', background: 'transparent', color: '#64748b', fontSize: '14px', fontWeight: 600, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' },
  navItemActive: { background: 'rgba(225,29,72,0.1)', color: '#f1f5f9' },
  navIcon: { fontSize: '16px', width: '20px', textAlign: 'center' },
  badge: { marginLeft: 'auto', background: '#E11D48', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 7px', borderRadius: '999px' },
  sidebarBottom: { display: 'flex', flexDirection: 'column', gap: '12px' },
  profileChip: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', background: '#E11D48', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', flexShrink: 0 },
  chipName: { fontSize: '13px', fontWeight: 700, color: '#f1f5f9' },
  chipRole: { fontSize: '11px', color: '#64748b' },
  signOutBtn: { background: 'none', border: 'none', color: '#64748b', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: '8px 12px', textAlign: 'left', borderRadius: '8px' },
  main: { flex: 1, overflowY: 'auto' },
  content: { maxWidth: '800px', margin: '0 auto', padding: '48px 40px' },
  pageHeader: { marginBottom: '40px' },
  greeting: { fontSize: '32px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-1px', marginBottom: '8px' },
  greetingSub: { fontSize: '15px', color: '#64748b' },
  pageTitle: { fontSize: '28px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px', marginBottom: '8px' },
  pageSub: { fontSize: '15px', color: '#64748b', lineHeight: 1.6, maxWidth: '540px' },
  statRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' },
  statCard: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' },
  statValue: { fontSize: '36px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-1px', marginBottom: '4px' },
  statLabel: { fontSize: '13px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' },
  statSub: { fontSize: '12px', color: '#475569' },
  section: { marginTop: '40px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  sectionTitle: { fontSize: '16px', fontWeight: 700, color: '#f1f5f9' },
  sectionAction: { background: 'none', border: '1px solid rgba(225,29,72,0.3)', color: '#E11D48', fontSize: '13px', fontWeight: 600, padding: '6px 14px', borderRadius: '999px', cursor: 'pointer' },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' },
  tagChip: { padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 600, background: 'rgba(225,29,72,0.08)', color: '#E11D48', border: '1px solid rgba(225,29,72,0.2)' },
  list: { display: 'flex', flexDirection: 'column', gap: '8px' },
  listItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' },
  listItemLeft: { display: 'flex', alignItems: 'flex-start', gap: '12px' },
  listItemTitle: { fontSize: '14px', fontWeight: 600, color: '#e2e8f0', marginBottom: '4px' },
  listItemMeta: { fontSize: '12px', color: '#475569' },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, marginTop: '5px' },
  aiSummaryChip: { fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', marginBottom: '4px', padding: '3px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', display: 'inline-block', marginTop: '2px' },
  convAvatar: { width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', flexShrink: 0 },
  chevron: { color: '#475569', fontSize: '20px' },
  requestCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' },
  requestHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  requestTag: { fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#E11D48', background: 'rgba(225,29,72,0.1)', border: '1px solid rgba(225,29,72,0.2)', padding: '3px 10px', borderRadius: '999px' },
  requestDate: { fontSize: '12px', color: '#475569' },
  requestQuery: { fontSize: '15px', color: '#e2e8f0', lineHeight: 1.6 },
  requestSummary: { fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', lineHeight: 1.5, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' },
  requestSummaryLabel: { fontStyle: 'normal', fontWeight: 700, color: '#64748b' },
  requestActions: { display: 'flex', gap: '12px' },
  acceptBtn: { background: '#E11D48', color: '#fff', border: 'none', borderRadius: '999px', padding: '10px 20px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(225,29,72,0.25)' },
  declineBtn: { background: 'none', color: '#64748b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  profileCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px' },
  profileCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  profileName: { fontSize: '20px', fontWeight: 800, color: '#f1f5f9', marginBottom: '4px' },
  profileMeta: { fontSize: '14px', color: '#64748b' },
  editBtn: { background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '999px', padding: '8px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' },
  fieldLabel: { fontSize: '12px', fontWeight: 700, color: '#475569', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '6px' },
  fieldValue: { fontSize: '15px', color: '#e2e8f0', lineHeight: 1.6 },
  label: { display: 'block', fontSize: '13px', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' },
  input: { width: '100%', padding: '12px 16px', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '15px', color: '#e2e8f0', background: 'rgba(255,255,255,0.04)', outline: 'none', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '14px 16px', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '15px', color: '#e2e8f0', background: 'rgba(255,255,255,0.04)', outline: 'none', resize: 'vertical', fontFamily: "'Inter', sans-serif", lineHeight: 1.6, boxSizing: 'border-box' },
  toggleBtn: { border: 'none', borderRadius: '999px', padding: '6px 16px', fontSize: '13px', fontWeight: 700, color: '#fff', cursor: 'pointer' },
  emptyState: { textAlign: 'center', padding: '64px 32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px' },
  emptyIcon: { fontSize: '32px', marginBottom: '16px', color: '#334155' },
  emptyTitle: { fontSize: '18px', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' },
  emptyDesc: { fontSize: '14px', color: '#475569', maxWidth: '320px', margin: '0 auto 24px', lineHeight: 1.6 },
  btnRed: { background: '#E11D48', color: '#fff', border: 'none', borderRadius: '999px', padding: '14px 28px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 15px rgba(225,29,72,0.25)', display: 'inline-block' },
};
