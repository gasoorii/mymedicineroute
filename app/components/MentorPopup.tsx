'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

export default function MentorPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Fetch available mentor count
    const fetchCount = async () => {
      const { count: c } = await supabase
        .from('mentor_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('available', true);
      setCount(c || 0);
    };
    fetchCount();

    // Show popup after 2.5s
    const timer = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const cardVariants: any = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { type: 'spring', stiffness: 380, damping: 24, staggerChildren: 0.08 },
    },
    exit: { opacity: 0, y: 20, scale: 0.97, transition: { duration: 0.2 } },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            zIndex: 200,
            width: '300px',
            background: 'rgba(17,18,19,0.92)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(225,29,72,0.1)',
          }}
        >
          {/* Dismiss button */}
          <motion.button
            variants={itemVariants}
            onClick={() => setDismissed(true)}
            style={{
              position: 'absolute', top: '12px', right: '12px',
              background: 'rgba(255,255,255,0.06)', border: 'none',
              width: '28px', height: '28px', borderRadius: '50%',
              cursor: 'pointer', color: '#64748b', fontSize: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </motion.button>

          {/* Icon */}
          <motion.div
            variants={itemVariants}
            style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'rgba(225,29,72,0.12)', border: '1px solid rgba(225,29,72,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px', marginBottom: '14px',
            }}
          >
            🩺
          </motion.div>

          {/* Live indicator + count */}
          <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <span style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: count > 0 ? '#22c55e' : '#E11D48',
              display: 'inline-block', animation: 'pulse-red 2s infinite',
            }} />
            <span style={{ fontSize: '11px', fontWeight: 700, color: count > 0 ? '#22c55e' : '#E11D48', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              {count > 0 ? 'Mentors available' : 'Confirming mentors'}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h3
            variants={itemVariants}
            style={{ fontSize: '17px', fontWeight: 800, color: '#f1f5f9', marginBottom: '6px', letterSpacing: '-0.3px', lineHeight: 1.3 }}
          >
            {count > 0
              ? `${count} mentor${count > 1 ? 's' : ''} ready to guide you`
              : 'First mentors being confirmed'}
          </motion.h3>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, marginBottom: '16px' }}
          >
            {count > 0
              ? 'Medical students and doctors volunteering their time to guide your research — for free.'
              : 'Sign up now and get matched the moment our first mentors are confirmed.'}
          </motion.p>

          {/* Mentor avatars or placeholder */}
          <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ display: 'flex' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: `rgba(225,29,72,${0.15 + i * 0.08})`,
                  border: '2px solid #111213',
                  marginLeft: i === 0 ? 0 : '-8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 800, color: '#E11D48',
                }}>
                  {['Dr', 'M', 'S'][i]}
                </div>
              ))}
            </div>
            <span style={{ fontSize: '12px', color: '#475569' }}>
              {count > 0 ? `${count} available now` : 'Coming soon'}
            </span>
          </motion.div>

          {/* CTA button */}
          <motion.a
            variants={itemVariants}
            href="/mentors"
            style={{
              display: 'block', textAlign: 'center',
              background: '#E11D48', color: '#fff',
              padding: '11px', borderRadius: '12px',
              fontSize: '14px', fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(225,29,72,0.25)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Meet the mentors →
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
