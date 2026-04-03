'use client';

export default function Navbar() {
  const links = ['About', 'Mentors', 'Projects', 'Contact'];

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 64px',
      height: '80px',
      position: 'sticky',
      top: 0,
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(15px)',
      zIndex: 100,
      borderBottom: '1px solid rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '10px', height: '24px', background: '#E11D48', borderRadius: '2px' }} />
        <span style={{ fontWeight: 800, fontSize: '20px', color: '#000', letterSpacing: '-0.5px' }}>
          My Medicine Route
        </span>
      </div>

      <div style={{ display: 'flex', gap: '40px', fontSize: '14px' }}>
        {links.map(link => (
          <a
            key={link}
            href={'/' + link.toLowerCase()}
            className="nav-item"
          >
            {link}
          </a>
        ))}
      </div>

      <a href="/join" className="btn-red" style={{ fontSize: '14px' }}>
        Join Now →
      </a>
    </nav>
  );
}
