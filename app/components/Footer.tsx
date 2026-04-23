export default function Footer() {
  return (
    <footer style={{
      padding: '48px 64px', display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)',
      fontSize: '14px', color: '#94a3b8',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '8px', height: '16px', background: '#E11D48', borderRadius: '2px' }} />
        <span style={{ fontWeight: 800, color: '#f1f5f9' }}>My Medicine Route</span>
      </div>
      <span>Founded by Gasser Mohamed & Co-Founder Hussain KR · Bahrain · 2026</span>
      <a href="mailto:mymedicineroute@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>
        mymedicineroute@gmail.com
      </a>
    </footer>
  );
}