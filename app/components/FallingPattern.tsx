'use client';

type FallingPatternProps = {
  color?: string;
  backgroundColor?: string;
  duration?: number;
  blurIntensity?: string;
  density?: number;
  style?: React.CSSProperties;
};

export function FallingPattern({
  color = 'rgba(225,29,72,0.9)',
  style,
}: FallingPatternProps) {
  const lines = [
    { left: '5%', delay: '0s', height: '120px', duration: '8s' },
    { left: '12%', delay: '1.2s', height: '80px', duration: '10s' },
    { left: '20%', delay: '0.4s', height: '140px', duration: '7s' },
    { left: '28%', delay: '2s', height: '100px', duration: '9s' },
    { left: '36%', delay: '0.8s', height: '60px', duration: '11s' },
    { left: '44%', delay: '1.6s', height: '130px', duration: '8s' },
    { left: '52%', delay: '0.2s', height: '90px', duration: '10s' },
    { left: '60%', delay: '2.4s', height: '110px', duration: '7s' },
    { left: '68%', delay: '1s', height: '75px', duration: '9s' },
    { left: '76%', delay: '0.6s', height: '145px', duration: '8s' },
    { left: '84%', delay: '1.8s', height: '85px', duration: '11s' },
    { left: '92%', delay: '0.3s', height: '120px', duration: '9s' },
  ];

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      ...style,
    }}>
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-200px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.6; }
          100% { transform: translateY(110%); opacity: 0; }
        }
      `}</style>
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: line.left,
            top: 0,
            width: '1.5px',
            height: line.height,
            background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
            animation: `fall ${line.duration} linear ${line.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}
