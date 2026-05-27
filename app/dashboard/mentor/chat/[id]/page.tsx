'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';

type Message = {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read: boolean;
};

type Conversation = {
  id: string;
  ai_summary: string;
  status: string;
  student_id: string;
  mentor_id: string;
};

export default function MentorChat() {
  const router = useRouter();
  const params = useParams();
  const convId = params.id as string;

  const [userId, setUserId] = useState<string>('');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let msgSub: any;

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUserId(user.id);

      const [{ data: conv }, { data: msgs }] = await Promise.all([
        supabase.from('conversations').select('*').eq('id', convId).single(),
        supabase.from('messages').select('*').eq('conversation_id', convId).order('created_at', { ascending: true }),
      ]);

      if (!conv || (conv.student_id !== user.id && conv.mentor_id !== user.id)) {
        router.push('/dashboard/mentor');
        return;
      }

      setConversation(conv);
      setMessages(msgs || []);
      setLoading(false);

      // Mark messages as read
      await supabase.from('messages')
        .update({ read: true })
        .eq('conversation_id', convId)
        .neq('sender_id', user.id);

      // Realtime
      msgSub = supabase
        .channel(`mentor-chat-${convId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${convId}`,
        }, (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
          if (payload.new.sender_id !== user.id) {
            supabase.from('messages').update({ read: true }).eq('id', payload.new.id);
          }
        })
        .subscribe();
    };

    init();
    return () => { if (msgSub) supabase.removeChannel(msgSub); };
  }, [convId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);

    await supabase.from('messages').insert({
      conversation_id: convId,
      sender_id: userId,
      content: input.trim(),
    });

    setInput('');
    setSending(false);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0d0d' }}>
      <div style={{ color: '#E11D48', fontSize: '24px' }}>◈</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0d0d0d', fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '16px', background: '#111213', flexShrink: 0 }}>
        <button onClick={() => router.push('/dashboard/mentor')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '20px', padding: '4px', lineHeight: 1 }}>←</button>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontWeight: 800, fontSize: '14px' }}>S</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '15px', color: '#f1f5f9' }}>Student Chat</div>
          {conversation?.ai_summary && (
            <div style={{ fontSize: '12px', color: '#64748b' }}>Topic: {conversation.ai_summary}</div>
          )}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: conversation?.status === 'active' ? '#22c55e' : '#475569', display: 'inline-block' }} />
          <span style={{ fontSize: '12px', color: '#64748b' }}>{conversation?.status === 'active' ? 'Active' : 'Closed'}</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#475569' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>◻</div>
            <p style={{ fontSize: '14px' }}>No messages yet. Start the conversation.</p>
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.sender_id === userId;
          return (
            <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '70%', padding: '12px 16px',
                borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: isMe ? '#E11D48' : 'rgba(255,255,255,0.06)',
                color: isMe ? '#fff' : '#e2e8f0',
                fontSize: '15px', lineHeight: 1.5,
              }}>
                {msg.content}
                <div style={{ fontSize: '11px', color: isMe ? 'rgba(255,255,255,0.6)' : '#475569', marginTop: '4px', textAlign: 'right' }}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {conversation?.status === 'active' ? (
        <form onSubmit={sendMessage} style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '12px', background: '#111213', flexShrink: 0 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{ flex: 1, padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0', fontSize: '15px', outline: 'none', fontFamily: "'Inter', sans-serif" }}
          />
          <button type="submit" disabled={sending || !input.trim()} style={{ background: '#E11D48', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 20px', fontSize: '15px', fontWeight: 700, cursor: sending || !input.trim() ? 'not-allowed' : 'pointer', opacity: sending || !input.trim() ? 0.5 : 1 }}>
            Send
          </button>
        </form>
      ) : (
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', color: '#475569', fontSize: '14px', background: '#111213' }}>
          This conversation is closed.
        </div>
      )}
    </div>
  );
}
