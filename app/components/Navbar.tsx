'use client';
import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: 'Our Goal', href: '#our-goal' },
    { label: 'Why it matters', href: '#why' },
    { label: 'Safety', href: '#safety' },
  ];

  return (
    <>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 64px',
        height: '80px',
        position: 'sticky',
        top: 0,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(15px)',
        zIndex: 100,
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}>

        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '10px', height: '24px', background: '#E11D48', borderRadius: '2px' }} />
          <span style={{ fontWeight: 800, fontSize: '20px', color: '#000', letterSpacing: '-0.5px' }}>
            My Medicine Route
          </span>
        </a>

        <div className="nav-desktop" style={{ display: 'flex', gap: '36px', fontSize: '14px', alignItems: 'center' }}>
          {links.map(link => (
            <a key={link.label} href={link.href} className="nav-item">{link.label}</a>
          ))}
        </div>

        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a
            href="https://instagram.com/mymedicineroute"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#4b5563', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#E11D48')}
            onMouseLeave={e => (e.currentTarget.style.color = '#4b5563')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a href="/join" className="btn-red" style={{ fontSize: '14px', padding: '10px 20px' }}>
            Join Now →
          </a>
        </div>

        <button
          className="nav-mobile"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', flexDirection: 'column', gap: '5px', padding: '4px' }}
        >
          <span style={{ width: '24px', height: '2px', background: '#0d0d0d', borderRadius: '2px', display: 'block', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ width: '24px', height: '2px', background: '#0d0d0d', borderRadius: '2px', display: 'block', opacity: menuOpen ? 0 : 1, transition: 'all 0.3s' }} />
          <span style={{ width: '24px', height: '2px', background: '#0d0d0d', borderRadius: '2px', display: 'block', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>

      </nav>

      {menuOpen && (
        <div style={{
          position: 'fixed', top: '80px', left: 0, right: 0,
          background: '#fff', zIndex: 99, padding: '32px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex', flexDirection: 'column', gap: '24px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        }}>
          {links.map(link => (
            <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}
              style={{ textDecoration: 'none', color: '#0d0d0d', fontWeight: 600, fontSize: '18px' }}>
              {link.label}
            </a>
          ))}
          <a href="https://instagram.com/mymedicineroute" target="_blank" rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: '#0d0d0d', fontWeight: 600, fontSize: '18px' }}>
            Instagram
          </a>
          <a href="/join" className="btn-red" style={{ textAlign: 'center', padding: '16px', fontSize: '16px' }}>
            Join Now →
          </a>
        </div>
      )}
    </>
  );
}
