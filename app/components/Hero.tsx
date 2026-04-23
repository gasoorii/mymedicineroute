'use client';
import { useState, useEffect } from 'react';
import { Waves } from './Waves';

const WORDS = ['here', 'now', 'today', 'free'];

function MorphingWord() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState(WORDS[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const nextIndex = (prev + 1) % WORDS.length;
        const currentWord = WORDS[prev];
        const nextWord = WORDS[nextIndex];
        const morphDuration = 600;
        const steps = 16;
        let step = 0;

        const morph = setInterval(() => {
          step++;
          const progress = step / steps;
          if (progress < 0.5) {
            const charCount = Math.floor(currentWord.length * (1 - progress * 2));
            setDisplayText(currentWord.slice(0, charCount) || '\u00A0');
          } else {
            const charCount = Math.floor(nextWord.length * ((progress - 0.5) * 2));
            setDisplayText(nextWord.slice(0, charCount) || '\u00A0');
          }
          if (step >= steps) {
            clearInterval(morph);
            setDisplayText(nextWord);
          }
        }, morphDuration / steps);

        return nextIndex;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <span style={{
      color: '#E11D48',
      display: 'inline-block',
      minWidth: '120px',
      position: 'relative',
    }}>
      {displayText}
      <span style={{
        display: 'inline-block',
        width: '3px',
        height: '0.85em',
        background: '#E11D48',
        marginLeft: '3px',
        verticalAlign: 'middle',
        borderRadius: '2px',
        animation: 'blink-caret 1s step-end infinite',
      }} />
      <style>{`
        @keyframes blink-caret {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}

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
            {' '}starts <MorphingWord />
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
